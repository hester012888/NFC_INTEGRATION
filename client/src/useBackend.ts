import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001"

export interface Checkin {
  id: number
  user_id: string
  point_id: string
  device_id: string
  source: string
  created_at: string
}

/** 生成或读取本机唯一 ID（用于区分“谁碰的”） */
export function getDeviceId(): string {
  let id = localStorage.getItem("museum_device_id")
  if (!id) {
    id = "dev-" + Math.random().toString(36).slice(2, 10)
    localStorage.setItem("museum_device_id", id)
  }
  return id
}

/** 订阅全站打卡记录（实时） */
export function useRealtimeCheckins() {
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // 首次全量拉取
    fetch(`${BACKEND}/api/progress`)
      .then(r => r.json())
      .then(setCheckins)
      .catch(() => { })

    const socket: Socket = io(BACKEND)

    socket.on("connect", () => setConnected(true))
    socket.on("disconnect", () => setConnected(false))

    socket.on("checkin", (record: Checkin) => {
      setCheckins(prev => {
        if (prev.some(c => c.id === record.id)) return prev
        return [...prev, record]
      })
    })

    // 新增：监听 open_challenge，派发到 window
    socket.on("open_challenge", (data: { user_id: string; point_id: string }) => {
      window.dispatchEvent(new CustomEvent("nfc-challenge", { detail: data }))
    })

    socket.on("reset", () => setCheckins([]))


    return () => { socket.disconnect() }
  }, [])

  return { checkins, connected }
}

/** 上报一次打卡 */
export async function reportCheckin(pointId: string, source = "mobile") {
  await fetch(`${BACKEND}/api/checkin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      point_id: pointId,
      device_id: getDeviceId(),
      source,
    }),
  })
}

/** 清空后端全部打卡记录 */
export async function resetBackend() {
  const res = await fetch(`${BACKEND}/api/reset`, { method: "POST" })
  if (!res.ok) throw new Error("reset failed")
  return res.json()
}