import { useState } from "react"
import type { Exhibit } from "../types"
import { INTERACTIONS, ExhibitArtwork } from "../Interactions"

export default function ExhibitRow({
    exhibit,
    stamped,
    correct,
    time,
    photo,
    onTap,
}: {
    exhibit: Exhibit
    stamped: boolean
    correct?: boolean
    time?: string
    photo?: string
    onTap: () => void
}) {
    const [hover, setHover] = useState(false)
    return (
        <button
            onClick={onTap}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="exhibit-row flex items-center gap-3 text-left w-full rounded-xl overflow-hidden transition-all duration-200"
            style={{
                background: hover ? "#f2e3c8" : "#fffbf3",
                border: `1px solid ${stamped
                    ? "rgba(155,113,58,0.2)"
                    : hover
                        ? "rgba(155,113,58,0.15)"
                        : "rgba(107,77,39,0.05)"
                    }`,
                padding: "16px 14px",
                transform: hover ? "translateY(-1px)" : "none",
            }}
        >
            <div
                className="point-thumbnail flex-none flex items-center justify-center rounded-full overflow-hidden text-base font-bold transition-all duration-300 flex-shrink-0"
                style={{
                    width: 52,
                    height: 52,
                    background: stamped ? `${exhibit.stampColor}22` : "#eadcc2",
                    border: `2px solid ${stamped ? exhibit.stampColor : "rgba(107,77,39,0.06)"}`,
                    color: stamped ? exhibit.stampColor : "#7d6b51",
                    fontFamily: "var(--font-display)",
                    boxShadow: stamped && photo
                        ? `0 0 12px ${exhibit.stampColor}60`
                        : stamped
                            ? `0 0 12px ${exhibit.stampColor}40`
                            : "none",
                }}
            >
                {photo ? (
                    <img src={photo} alt="打卡照片" className="w-full h-full object-cover" />
                ) : <ExhibitArtwork id={exhibit.id} />}
                <span className="point-sequence">{String(INTERACTIONS[exhibit.id].index + 1).padStart(2, "0")}</span>
            </div>
            <div className="point-copy flex-1 min-w-0">
                <span className="play-type">{INTERACTIONS[exhibit.id].name}</span>
                <div
                    className="text-sm leading-snug"
                    style={{
                        color: stamped ? "#493323" : "#614e36",
                        fontFamily: "var(--font-body)",
                    }}
                >
                    {exhibit.name}
                </div>
                <div className="flex flex-wrap items-center gap-1 mt-1">
                    <span className="text-xs" style={{ color: "#806a50", fontFamily: "var(--font-mono)" }}>
                        {exhibit.dynasty} · {exhibit.category}
                    </span>
                    {stamped && time && (
                        <span className="text-xs" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
                            · {time}
                        </span>
                    )}
                </div>
            </div>
            <div className="point-status flex-none flex items-center gap-1.5">
                {stamped && (
                    <div
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{
                            background: correct ? "rgba(80,160,80,0.15)" : "rgba(160,80,80,0.15)",
                            color: correct ? "#4e7143" : "#a04731",
                            fontFamily: "var(--font-mono)",
                            border: `1px solid ${correct ? "rgba(80,160,80,0.25)" : "rgba(160,80,80,0.25)"}`,
                            fontSize: 13,
                        }}
                    >
                        {exhibit.id === "E03" ? "已留念" : correct ? "已完成" : "再挑战"}
                    </div>
                )}
                <div style={{ color: stamped ? "#88602f" : "#7d6b51" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M4 2L8 6 4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </button>
    )
}