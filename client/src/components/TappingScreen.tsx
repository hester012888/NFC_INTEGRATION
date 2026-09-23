import type { Exhibit } from "../types"

export default function TappingScreen({ exhibit }: { exhibit: Exhibit }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-10">
            <div className="relative" style={{ width: 90, height: 90 }}>
                <svg width="90" height="90" viewBox="0 0 90 90" className="absolute" style={{ animation: "spin 1.5s linear infinite" }}>
                    <circle cx="45" cy="45" r="40" fill="none" stroke={`${exhibit.stampColor}22`} strokeWidth="3" />
                    <circle cx="45" cy="45" r="40" fill="none" stroke={exhibit.stampColor} strokeWidth="3" strokeDasharray="48 204" strokeLinecap="round" />
                </svg>
                <div
                    className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
                    style={{ color: exhibit.stampColor, fontFamily: "var(--font-display)" }}
                >
                    {exhibit.stampSymbol}
                </div>
            </div>
            <div className="text-center">
                <div className="text-sm mb-1" style={{ color: "#493323", fontFamily: "var(--font-display)" }}>
                    {exhibit.name}
                </div>
                <div className="text-xs" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
                    点位已识别 · 即将进入专属互动…
                </div>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}