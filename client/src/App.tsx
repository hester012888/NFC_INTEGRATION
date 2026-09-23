/* 
eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect 
*/
import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { getAchievements } from "./logic"
import { loadCard } from "./cardStore"
import SouvenirScreen from "./SouvenirScreen"
import InteractionScreen from "./Interactions"
import "./experience.css"
import "./styles.css"
import { savePhoto, loadAllPhotos } from "./utils/photoStore"
import MiniHome from "./MiniHome"
import { useRealtimeCheckins, reportCheckin } from "./useBackend"

import type { Exhibit, StampRecord, Screen } from "./types"
import { EXHIBITS } from "./data/exhibits"
import { ACHIEVEMENTS } from "./data/achievements"

import RedirectHome from "./components/RedirectHome"
import Shell from "./components/Shell"
import NavBar from "./components/NavBar"
import HomeScreen from "./components/HomeScreen"
import TapScreen from "./components/TapScreen"
import TappingScreen from "./components/TappingScreen"
import StampScreen from "./components/StampScreen"
import DetailScreen from "./components/DetailScreen"
import CollectionScreen from "./components/CollectionScreen"

/* ── App ──────────────────────────────────────────────────────────── */
export default function App() {
  /* ── URL 参数 & 用户 ─────────────────────── */
  const userId = useMemo(
    () => new URLSearchParams(location.search).get("user") || "",
    []
  )
  const userStorageKey = userId || "anonymous"

  /* ── 状态 ─────────────────────────────────── */
  const [screen, setScreen] = useState<Screen>("mini")
  const { checkins, connected } = useRealtimeCheckins()

  const [answeredIds, setAnsweredIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`museum_answered_${userStorageKey}`)
      return new Set(saved ? JSON.parse(saved) : [])
    } catch {
      return new Set()
    }
  })

  // 打卡记录（含 E03 纪念卡，进度按 /6 算）
  const stamps = useMemo<StampRecord[]>(() => {
    return [...checkins]
      .sort((a, b) => a.id - b.id)
      .filter(c => c.user_id === userId || userId === "")   // userId 空则看全部
      .map(c => ({
        exhibitId: c.point_id,
        time: c.created_at,
        answeredCorrect: answeredIds.has(c.point_id),
      }))
  }, [checkins, userId, answeredIds])

  // 用于渲染进度的稳定引用
  const stampsRef = useRef<StampRecord[]>(stamps)
  useEffect(() => { stampsRef.current = stamps }, [stamps])

  const [checkinsLoaded, setCheckinsLoaded] = useState(false)
  const [achievementQueue, setAchievementQueue] = useState<typeof ACHIEVEMENTS>([])
  const [notice, setNotice] = useState("")
  const [card, setCard] = useState<string>()
  const [cardReady, setCardReady] = useState(false)
  const [photos, setPhotos] = useState<Record<string, string>>({})
  const [current, setCurrent] = useState<Exhibit>(EXHIBITS[0])
  const [newStamp, setNewStamp] = useState(false)
  const [activeNav, setActiveNav] = useState<"home" | "collection">("home")
  const [nfcLit, setNfcLit] = useState(false)

  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const answerTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const committingRef = useRef(false)

  /* ── 照片 ─────────────────────────────────── */
  const handlePhoto = useCallback((exhibitId: string, dataUrl: string) => {
    setPhotos(prev => ({ ...prev, [exhibitId]: dataUrl }))
    savePhoto(exhibitId, dataUrl).catch(() =>
      setNotice("照片未能保存在本机，请及时下载。")
    )
  }, [])

  /* ── 判断是否已打卡 ─────────────────────── */
  const alreadyStamped = useCallback(
    (id: string) => stamps.some(s => s.exhibitId === id),
    [stamps]
  )

  /* ── 进入某个展品 ───────────────────────── */
  const handleSimulateTap = useCallback(
    (exhibit: Exhibit, fromNfc = false) => {
      setActiveNav("home")
      setNotice("")
      setCurrent(exhibit)

      // 已打卡 → 直接进入互动页
      const stamped = stampsRef.current.some(s => s.exhibitId === exhibit.id)
      if (stamped) {
        setNfcLit(false)
        setScreen(exhibit.id === "E03" ? "souvenir" : "challenge")
        return
      }

      if (!checkinsLoaded) {
        setNotice("正在同步打卡数据…")
        return
      }

      setScreen("tap")
      setNfcLit(fromNfc)
    },
    [checkinsLoaded]
  )

  // 让 effect 里能拿到最新的 handleSimulateTap
  const handleSimulateTapRef = useRef(handleSimulateTap)
  useEffect(() => { handleSimulateTapRef.current = handleSimulateTap })

  /* ── localStorage 同步（userId 变化）──────── */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`museum_answered_${userStorageKey}`)
      setAnsweredIds(new Set(saved ? JSON.parse(saved) : []))
    } catch {
      setAnsweredIds(new Set())
    }
  }, [userStorageKey])

  /* ── 启动时恢复照片 ─────────────────────── */
  useEffect(() => {
    loadAllPhotos().then(setPhotos).catch(() => { })
  }, [])

  /* ── 启动时恢复纪念卡 ───────────────────── */
  useEffect(() => {
    let active = true
    loadCard()
      .then(v => { if (active) setCard(v) })
      .catch(() => { if (active) setNotice("图片存储暂不可用，生成后请下载纪念卡。") })
      .finally(() => { if (active) setCardReady(true) })
    return () => {
      active = false
      if (answerTimer.current) clearTimeout(answerTimer.current)
      if (transitionTimer.current) clearTimeout(transitionTimer.current)
    }
  }, [])

  /* ── NFC 打开 URL：?point=E01 ────────────── */
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const point = params.get("point")
    if (!point) return

    const exhibit = EXHIBITS.find(e => e.id === point)
    const t = setTimeout(() => {
      if (exhibit) {
        handleSimulateTapRef.current(exhibit, true)
        reportCheckin(point, "nfc")
      } else {
        setNotice(`未识别的展品编号：${point}`)
      }
      window.history.replaceState({}, "", location.pathname)
    }, 0)
    return () => clearTimeout(t)
  }, [])

  /* ── WebSocket 连上后延迟解除 loading ────── */
  useEffect(() => {
    if (connected && !checkinsLoaded) {
      const t = setTimeout(() => setCheckinsLoaded(true), 300)
      return () => clearTimeout(t)
    }
  }, [connected, checkinsLoaded])

  /* ── 读卡器上报事件 ─────────────────────── */
  useEffect(() => {
    const handler = (e: Event) => {
      const { user_id, point_id } = (e as CustomEvent).detail as {
        user_id: string
        point_id: string
      }

      // userId 为空 → 不过滤；非空 → 只处理匹配的
      if (userId && user_id !== userId) return

      const exhibit = EXHIBITS.find(x => x.id === point_id)
      if (!exhibit) return

      setCurrent(exhibit)
      setActiveNav("home")
      setNotice("")
      setNfcLit(false)

      // 先显示过渡页
      setScreen("tapping")

      // 1.5s 后进入互动；期间如果用户切走了，不再覆盖
      if (transitionTimer.current) clearTimeout(transitionTimer.current)
      transitionTimer.current = setTimeout(() => {
        setScreen(prev => {
          if (prev !== "tapping") return prev
          return exhibit.id === "E03" ? "souvenir" : "challenge"
        })
        transitionTimer.current = null
      }, 1500)
    }

    window.addEventListener("nfc-challenge", handler)
    return () => window.removeEventListener("nfc-challenge", handler)
  }, [userId])

  /* ── answeredIds 变化时保存 ─────────────── */
  useEffect(() => {
    try {
      localStorage.setItem(
        `museum_answered_${userStorageKey}`,
        JSON.stringify([...answeredIds])
      )
    } catch { /* ignore */ }
  }, [answeredIds, userStorageKey])

  /* ── 提交一次打卡（带锁，防重复）────────── */
  const commitRecord = useCallback(async (record: StampRecord) => {
    if (committingRef.current) return
    committingRef.current = true
    try {
      // 用 record.answeredCorrect 覆盖当前题的状态
      const nextStamps: StampRecord[] = stampsRef.current.map(s =>
        s.exhibitId === record.exhibitId
          ? { ...s, answeredCorrect: record.answeredCorrect }
          : s
      )

      const previous = getAchievements(stampsRef.current).map(a => a.id)
      const newlyUnlocked = getAchievements(nextStamps).filter(a => !previous.includes(a.id))

      await reportCheckin(record.exhibitId, "mobile")

      if (newlyUnlocked.length > 0) {
        setAchievementQueue(queue => [
          ...queue,
          ...ACHIEVEMENTS.filter(a => newlyUnlocked.some(n => n.id === a.id)),
        ])
      }
    } finally {
      committingRef.current = false
    }
  }, [])

  /* ── 已解锁成就（memo）──────────────────── */
  const unlockedAchievements = useMemo(() => {
    const ids = new Set(
      getAchievements(stamps).map((a: { id: string }) => a.id)
    )
    return ACHIEVEMENTS.filter(a => ids.has(a.id))
  }, [stamps])

  /* ── 导航 ───────────────────────────────── */
  const goHome = useCallback(() => {
    setActiveNav("home")
    setScreen("home")
  }, [])

  const enterRoute = useCallback(() => {
    setActiveNav("home")
    setScreen("home")
  }, [])

  const goCollection = useCallback(() => {
    setActiveNav("collection")
    setScreen("collection")
  }, [])

  const navProps = useMemo(() => ({
    active: activeNav,
    onChange: (v: "home" | "collection") => {
      setActiveNav(v)
      setScreen(v === "home" ? "home" : "collection")
    },
  }), [activeNav])

  const visibleAchievements = (screen === "stamp" || screen === "souvenir")
    ? achievementQueue
    : []

  const dismissAchievement = useCallback(() => {
    setAchievementQueue(q => q.slice(1))
  }, [])

  /* ── 渲染 ───────────────────────────────── */
  if (screen === "collection") {
    return (
      <Shell achievements={visibleAchievements} onDismiss={dismissAchievement} notice={notice}>
        <CollectionScreen
          exhibits={EXHIBITS}
          stamps={stamps}
          photos={photos}
          achievements={unlockedAchievements}
          card={card}
          onTap={handleSimulateTap}
        />
        <NavBar {...navProps} />
      </Shell>
    )
  }

  if (screen === "home") {
    return (
      <Shell achievements={visibleAchievements} onDismiss={dismissAchievement} notice={notice}>
        <HomeScreen
          exhibits={EXHIBITS}
          stamps={stamps}
          photos={photos}
          connected={connected}
          onSimulate={handleSimulateTap}
        />
        <NavBar {...navProps} />
      </Shell>
    )
  }

  if (screen === "tap") {
    return (
      <Shell achievements={visibleAchievements} onDismiss={dismissAchievement} notice={notice}>
        <TapScreen
          exhibit={current}
          nfcLit={nfcLit}
          alreadyStamped={alreadyStamped(current.id)}
          onCancel={() => {
            if (transitionTimer.current) {
              clearTimeout(transitionTimer.current)
              transitionTimer.current = null
            }
            setNfcLit(false)
            setScreen("home")
          }}
          onLitComplete={() => {
            setNfcLit(false)
            setScreen(current.id === "E03" ? "souvenir" : "challenge")
          }}
        />
      </Shell>
    )
  }

  if (screen === "tapping") {
    return (
      <Shell achievements={visibleAchievements} onDismiss={dismissAchievement} notice={notice}>
        <TappingScreen exhibit={current} />
      </Shell>
    )
  }

  if (screen === "souvenir") {
    return (
      <Shell achievements={visibleAchievements} onDismiss={dismissAchievement} notice={notice}>
        <SouvenirScreen
          card={card}
          ready={cardReady}
          onBack={goHome}
          onCollection={goCollection}
          onGenerated={(data, persisted) => {
            setCard(data)
            commitRecord({
              exhibitId: "E03",
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
              answeredCorrect: false,
            })
            if (!persisted) setNotice("纪念卡生成成功，但本机存储失败，请下载图片。")
          }}
        />
      </Shell>
    )
  }

  if (screen === "challenge") {
    return (
      <Shell achievements={visibleAchievements} onDismiss={dismissAchievement} notice={notice}>
        <InteractionScreen
          key={current.id}
          id={current.id}
          title={current.name}
          onBack={goHome}
          onComplete={correct => {
            if (correct) {
              setAnsweredIds(prev => new Set([...prev, current.id]))
            }
            commitRecord({
              exhibitId: current.id,
              time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
              answeredCorrect: correct,
            })
            setNewStamp(true)
            setScreen("stamp")
          }}
        />
      </Shell>
    )
  }

  if (screen === "stamp") {
    const record = stamps.find(s => s.exhibitId === current.id)
    if (!record) {
      // 用 effect 切屏，避免 render 期间 setState
      return <RedirectHome onDone={goHome} />
    }
    return (
      <Shell achievements={visibleAchievements} onDismiss={dismissAchievement} notice={notice}>
        <StampScreen
          exhibit={current}
          record={record}
          totalStamps={stamps.length}
          totalExhibits={EXHIBITS.length}
          isNew={newStamp}
          photo={photos[current.id]}
          onPhoto={dataUrl => handlePhoto(current.id, dataUrl)}
          onNext={goHome}
          onDetail={() => setScreen("detail")}
          onCollection={goCollection}
          onNotice={setNotice}
        />
      </Shell>
    )
  }

  if (screen === "detail") {
    const record = stamps.find(s => s.exhibitId === current.id)
    return (
      <Shell achievements={visibleAchievements} onDismiss={dismissAchievement} notice={notice}>
        <DetailScreen
          exhibit={current}
          record={record}
          onBack={() => setScreen("stamp")}
          onHome={goHome}
        />
      </Shell>
    )
  }

  if (screen === "mini") {
    return (
      <Shell
        achievements={visibleAchievements}
        onDismiss={dismissAchievement}
        notice={notice}
      >
        <MiniHome enter={enterRoute} count={stamps.length} />
      </Shell>
    )
  }

  return null
}
