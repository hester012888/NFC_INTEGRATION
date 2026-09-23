import { useEffect, useRef, useState } from "react"
import type { Exhibit, StampRecord } from "../types"

type DetailTab = "info" | "audio"

export default function DetailScreen({
    exhibit,
    record,
    onBack,
    onHome,
}: {
    exhibit: Exhibit
    record?: StampRecord
    onBack: () => void
    onHome: () => void
}) {
    const [tab, setTab] = useState<DetailTab>("info")
    const [expanded, setExpanded] = useState(false)
    const [audioLang, setAudioLang] = useState<"zh" | "yue" | "en" | "ja">("zh")
    const [playing, setPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const audioRef = useRef<HTMLAudioElement>(null)

    const audioSrc = exhibit.audioSrc[audioLang] || exhibit.audioSrc.zh

    useEffect(() => {
        const a = audioRef.current
        if (!a) return
        a.pause()
        a.currentTime = 0
        setPlaying(false)
        setProgress(0)
        setCurrentTime(0)
        setDuration(0)
        a.load()
    }, [audioSrc, exhibit.id])

    useEffect(() => {
        return () => {
            if (audioRef.current) audioRef.current.pause()
        }
    }, [])

    const togglePlay = () => {
        const a = audioRef.current
        if (!a) return
        if (playing) {
            a.pause()
            setPlaying(false)
        } else {
            a.play()
                .then(() => setPlaying(true))
                .catch(() => setPlaying(false))
        }
    }

    const seekTo = (pct: number) => {
        const a = audioRef.current
        if (!a || !duration) return
        a.currentTime = (pct / 100) * duration
        setProgress(pct)
    }

    const skip = (sec: number) => {
        const a = audioRef.current
        if (!a) return
        a.currentTime = Math.max(0, Math.min(duration || 0, a.currentTime + sec))
    }

    const fmt = (s: number) => {
        if (!isFinite(s)) return "0:00"
        return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
    }

    const langLabel: Record<"zh" | "yue" | "en" | "ja", string> = {
        zh: "普通话",
        yue: "粤语",
        en: "English",
        ja: "日本語",
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-none relative" style={{ height: 260 }}>
                <img
                    src={exhibit.imageUrl}
                    onError={(e) => {
                        if (!e.currentTarget.src.endsWith("placeholder.svg"))
                            e.currentTarget.src = "/assets/exhibits/placeholder.svg"
                    }}
                    alt={exhibit.name}
                    className="w-full h-full object-cover"
                    style={{ filter: "none", objectPosition: "center 30%" }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(246,240,229,0.15) 0%, rgba(246,240,229,0.98) 100%)",
                    }}
                />
                <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-12">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70"
                        style={{ color: "#88602f", fontFamily: "var(--font-mono)" }}
                    >
                        ← 返回
                    </button>
                    <div
                        className="flex items-center justify-center rounded-full text-sm font-bold"
                        style={{
                            width: 34,
                            height: 34,
                            background: `${exhibit.stampColor}22`,
                            border: `1.5px solid ${exhibit.stampColor}`,
                            color: exhibit.stampColor,
                            fontFamily: "var(--font-display)",
                        }}
                    >
                        {exhibit.stampSymbol}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                                background: "rgba(155,113,58,0.15)",
                                color: "#88602f",
                                fontFamily: "var(--font-mono)",
                                border: "1px solid rgba(155,113,58,0.25)",
                            }}
                        >
                            {exhibit.category}
                        </span>
                        <span className="text-xs" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
                            {exhibit.dynasty}
                        </span>
                    </div>
                    <h2 className="text-xl leading-tight" style={{ fontFamily: "var(--font-display)", color: "#493323" }}>
                        {exhibit.name}
                    </h2>
                    <div className="text-xs mt-0.5" style={{ color: "#786143" }}>
                        {exhibit.hall}
                    </div>
                </div>
            </div>

            <div className="flex-none flex" style={{ borderBottom: "1px solid rgba(155,113,58,0.1)" }}>
                {(["info", "audio"] as const).map((t) => {
                    const labels: Record<DetailTab, string> = { info: "文物信息", audio: "语音讲解" }
                    const active = tab === t
                    return (
                        <button
                            key={t}
                            onClick={() => {
                                setTab(t)
                                if (t === "info" && audioRef.current) {
                                    audioRef.current.pause()
                                    setPlaying(false)
                                }
                            }}
                            className="flex-1 py-3 text-xs relative transition-colors duration-200"
                            style={{
                                color: active ? "#88602f" : "#7c684f",
                                fontFamily: "var(--font-mono)",
                                letterSpacing: "0.05em",
                                background: "transparent",
                                border: "none",
                            }}
                        >
                            {labels[t]}
                            {active && (
                                <div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10"
                                    style={{ height: 1.5, background: "#88602f", borderRadius: 2 }}
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                {tab === "info" && (
                    <div className="px-6 py-5 flex flex-col gap-5">
                        <p className="text-sm leading-loose" style={{ color: "#a09080" }}>
                            {exhibit.description}
                        </p>

                        <div>
                            <div className="text-xs tracking-[0.12em] mb-2" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
                                详细介绍
                            </div>
                            <div
                                className="relative overflow-hidden transition-all duration-500"
                                style={{ maxHeight: expanded ? 600 : 90 }}
                            >
                                <p className="text-sm leading-loose" style={{ color: "#7a6a58" }}>
                                    {exhibit.detail}
                                </p>
                                {!expanded && (
                                    <div
                                        className="absolute bottom-0 left-0 right-0 h-8"
                                        style={{ background: "linear-gradient(transparent, #f6f0e5)" }}
                                    />
                                )}
                            </div>
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-xs mt-2 transition-opacity hover:opacity-70"
                                style={{ color: "#88602f", fontFamily: "var(--font-mono)" }}
                            >
                                {expanded ? "收起 ↑" : "展开全文 ↓"}
                            </button>
                        </div>

                        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(155,113,58,0.1)" }}>
                            {[
                                { label: "材质", value: exhibit.material },
                                { label: "尺寸", value: exhibit.dimensions },
                                { label: "展厅", value: exhibit.hall },
                            ]
                                .filter((r) => r.value)
                                .map(({ label, value }, i) => (
                                    <div
                                        key={label}
                                        className="flex gap-4 px-4 py-3"
                                        style={{ background: i % 2 === 0 ? "#fffbf3" : "#f0e5d2" }}
                                    >
                                        <span
                                            className="flex-none text-xs w-12 pt-0.5"
                                            style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}
                                        >
                                            {label}
                                        </span>
                                        <span className="text-xs" style={{ color: "#76512a" }}>{value}</span>
                                    </div>
                                ))}
                        </div>

                        {record && (
                            <div
                                className="rounded-xl px-4 py-3"
                                style={{
                                    background: record.answeredCorrect ? "rgba(80,160,80,0.08)" : "rgba(160,80,80,0.08)",
                                    border: `1px solid ${record.answeredCorrect ? "rgba(80,160,80,0.2)" : "rgba(160,80,80,0.2)"}`,
                                }}
                            >
                                <div
                                    className="text-xs mb-1"
                                    style={{
                                        color: record.answeredCorrect ? "#4e7143" : "#a04731",
                                        fontFamily: "var(--font-mono)",
                                    }}
                                >
                                    你的答题记录
                                </div>
                                <p className="text-xs" style={{ color: "#755c40" }}>{exhibit.funFact}</p>
                            </div>
                        )}

                        <button
                            onClick={onHome}
                            className="w-full py-3 rounded-xl text-xs transition-opacity hover:opacity-70 mt-2"
                            style={{
                                background: "transparent",
                                border: "1px solid rgba(155,113,58,0.12)",
                                color: "#7c684f",
                                fontFamily: "var(--font-mono)",
                            }}
                        >
                            继续探馆
                        </button>
                    </div>
                )}

                {tab === "audio" && (
                    <div className="px-6 py-5 flex flex-col gap-5">
                        <audio
                            ref={audioRef}
                            src={audioSrc}
                            preload="metadata"
                            onPlay={() => setPlaying(true)}
                            onPause={() => setPlaying(false)}
                            onTimeUpdate={(e) => {
                                const a = e.currentTarget
                                setCurrentTime(a.currentTime)
                                setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0)
                            }}
                            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                            onEnded={() => {
                                setPlaying(false)
                                setProgress(0)
                                setCurrentTime(0)
                            }}
                            onError={() => {
                                setPlaying(false)
                            }}
                        />

                        <div
                            className="rounded-xl p-5"
                            style={{ background: "#f0e5d2", border: "1px solid rgba(155,113,58,0.12)" }}
                        >
                            <div
                                className="flex items-center gap-0.5 mb-5 justify-center cursor-pointer"
                                style={{ height: 40 }}
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect()
                                    const pct = ((e.clientX - rect.left) / rect.width) * 100
                                    seekTo(Math.max(0, Math.min(100, pct)))
                                }}
                            >
                                {Array.from({ length: 52 }, (_, i) => {
                                    const filled = (i / 52) * 100 < progress
                                    const h = 5 + Math.abs(Math.sin(i * 0.65) * 14 + Math.sin(i * 0.28) * 9)
                                    return (
                                        <div
                                            key={i}
                                            className="rounded-full flex-none transition-colors duration-100"
                                            style={{
                                                width: 3,
                                                height: Math.max(3, h),
                                                background: filled ? exhibit.stampColor : "rgba(155,113,58,0.15)",
                                            }}
                                        />
                                    )
                                })}
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => skip(-15)}
                                    className="text-xs transition-opacity hover:opacity-70"
                                    style={{ color: "#806a50", fontFamily: "var(--font-mono)" }}
                                >
                                    ⏮ 15s
                                </button>
                                <button
                                    onClick={togglePlay}
                                    className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
                                    style={{
                                        width: 56,
                                        height: 56,
                                        background: exhibit.stampColor,
                                        boxShadow: playing ? `0 0 24px ${exhibit.stampColor}60` : "none",
                                    }}
                                >
                                    {playing ? (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="#f6f0e5">
                                            <rect x="3" y="2.5" width="3.5" height="11" rx="1" />
                                            <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" />
                                        </svg>
                                    ) : (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="#f6f0e5">
                                            <path d="M4.5 3L13 8 4.5 13V3Z" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={() => skip(15)}
                                    className="text-xs transition-opacity hover:opacity-70"
                                    style={{ color: "#806a50", fontFamily: "var(--font-mono)" }}
                                >
                                    15s ⏭
                                </button>
                            </div>

                            <div
                                className="w-full h-0.5 rounded-full overflow-hidden cursor-pointer relative"
                                style={{ background: "rgba(155,113,58,0.1)" }}
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect()
                                    const pct = ((e.clientX - rect.left) / rect.width) * 100
                                    seekTo(Math.max(0, Math.min(100, pct)))
                                }}
                            >
                                <div
                                    className="h-full rounded-full"
                                    style={{ width: `${progress}%`, background: exhibit.stampColor }}
                                />
                            </div>
                            <div className="flex justify-between mt-1.5">
                                <span className="text-xs" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
                                    {fmt(currentTime)}
                                </span>
                                <span className="text-xs" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
                                    {duration ? fmt(duration) : exhibit.audioLength}
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className="text-xs tracking-[0.12em] mb-3" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
                                讲解语言
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {(["zh", "yue", "en", "ja"] as const).map((code) => {
                                    const label = langLabel[code]
                                    const available = !!exhibit.audioSrc[code]
                                    const active = audioLang === code
                                    return (
                                        <button
                                            key={code}
                                            onClick={() => {
                                                if (!available) return
                                                setAudioLang(code)
                                            }}
                                            disabled={!available}
                                            className="py-2 text-xs rounded-lg transition-all duration-200"
                                            style={{
                                                background: active ? "rgba(155,113,58,0.12)" : "transparent",
                                                border: `1px solid ${active ? "rgba(155,113,58,0.35)" : "rgba(155,113,58,0.1)"}`,
                                                color: active ? "#88602f" : available ? "#7c684f" : "#c9b89c",
                                                fontFamily: "var(--font-mono)",
                                                opacity: available ? 1 : 0.5,
                                                cursor: available ? "pointer" : "not-allowed",
                                            }}
                                        >
                                            {label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs tracking-[0.12em] mb-3" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
                                讲解文字稿
                            </div>
                            <div
                                className="rounded-xl p-4"
                                style={{ background: "#fffbf3", border: "1px solid rgba(155,113,58,0.08)" }}
                            >
                                <p className="text-xs leading-loose" style={{ color: "#705c43" }}>
                                    {`这件${exhibit.name}是${exhibit.dynasty}时期最具代表性的${exhibit.category}之一。${exhibit.description}${exhibit.funFact}`}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onHome}
                            className="w-full py-3 rounded-xl text-xs transition-opacity hover:opacity-70 mt-2"
                            style={{
                                background: "transparent",
                                border: "1px solid rgba(155,113,58,0.12)",
                                color: "#7c684f",
                                fontFamily: "var(--font-mono)",
                            }}
                        >
                            继续探馆
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}