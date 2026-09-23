/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react"
import type { Exhibit } from "../types"

export default function TapScreen({
    exhibit,
    nfcLit,
    alreadyStamped,
    onCancel,
    onLitComplete,
}: {
    exhibit: Exhibit
    nfcLit: boolean
    alreadyStamped: boolean
    onCancel: () => void
    onLitComplete: () => void
}) {
    const [progress, setProgress] = useState(0)
    const onLitCompleteRef = useRef(onLitComplete)
    useEffect(() => { onLitCompleteRef.current = onLitComplete })

    useEffect(() => {
        if (!nfcLit) {
            setProgress(0)
            return
        }
        let p = 0
        const iv = setInterval(() => {
            p += 4
            setProgress(p)
            if (p >= 100) {
                clearInterval(iv)
                setTimeout(() => onLitCompleteRef.current(), 400)
            }
        }, 60)
        return () => clearInterval(iv)
    }, [nfcLit])

    const tapping = nfcLit && progress > 0

    return (
        <div className="tap-screen flex-1 flex flex-col items-center px-8 py-10 overflow-y-auto">
            <div className="text-center">
                <div className="text-xs tracking-[0.2em] mb-2" style={{ color: "#88602f", fontFamily: "var(--font-mono)" }}>
                    {exhibit.hall}
                </div>
                <h2 className="text-xl" style={{ fontFamily: "var(--font-display)", color: "#493323" }}>
                    {exhibit.name}
                </h2>
                <div className="text-xs mt-1" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
                    {exhibit.dynasty} · {exhibit.category}
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
                <div className="relative" style={{ width: 180, height: 180 }}>
                    {!tapping &&
                        [1, 2].map((i) => (
                            <div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    width: 80 + i * 40,
                                    height: 80 + i * 40,
                                    top: "50%",
                                    left: "50%",
                                    marginTop: -(80 + i * 40) / 2,
                                    marginLeft: -(80 + i * 40) / 2,
                                    border: `1px solid rgba(155,113,58,${0.2 / i})`,
                                    animation: `pring ${1.5 + i * 0.4}s ease-out infinite`,
                                    animationDelay: `${i * 0.3}s`,
                                }}
                            />
                        ))}

                    {tapping && (
                        <svg
                            width="160"
                            height="160"
                            viewBox="0 0 160 160"
                            className="absolute"
                            style={{
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                pointerEvents: "none",
                            }}
                        >
                            <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(155,113,58,0.1)" strokeWidth="3" />
                            <circle
                                cx="80"
                                cy="80"
                                r="72"
                                fill="none"
                                stroke={exhibit.stampColor}
                                strokeWidth="3"
                                strokeDasharray={`${(progress / 100) * 452} 452`}
                                strokeLinecap="round"
                                style={{
                                    transform: "rotate(-90deg)",
                                    transformOrigin: "center",
                                    transition: "stroke-dasharray 0.06s linear",
                                }}
                            />
                        </svg>
                    )}

                    <div
                        className="absolute flex flex-col items-center justify-center rounded-full transition-all duration-300"
                        style={{
                            width: 110,
                            height: 110,
                            top: "50%",
                            left: "50%",
                            marginTop: -55,
                            marginLeft: -55,
                            background: tapping
                                ? `radial-gradient(circle, ${exhibit.stampColor}33 0%, #f0e5d2 70%)`
                                : "radial-gradient(circle, #ddc395 0%, #f7efdd 70%)",
                            border: `2px solid ${tapping ? exhibit.stampColor : "rgba(155,113,58,0.25)"}`,
                            boxShadow: tapping
                                ? `0 0 32px ${exhibit.stampColor}50`
                                : "0 0 16px rgba(155,113,58,0.08)",
                        }}
                    >
                        <div
                            className="text-3xl"
                            style={{
                                color: tapping ? exhibit.stampColor : "#795931",
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                            }}
                        >
                            {alreadyStamped ? exhibit.stampSymbol : "碰"}
                        </div>
                        <div
                            className="text-xs mt-1"
                            style={{
                                color: tapping ? "#88602f" : "#806a50",
                                fontFamily: "var(--font-mono)",
                            }}
                        >
                            {tapping ? `${progress}%` : "NFC"}
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm" style={{ color: "#705c43" }}>
                        {tapping
                            ? "🎉 NFC 已感应，正在进入打卡…"
                            : alreadyStamped
                                ? (exhibit.id === "E03" ? "已留念 · 再次碰触重新制作" : "请将互动文创靠近打卡点")
                                : "请将文创靠近打卡点"}
                    </p>
                    {!tapping && (
                        <p className="text-xs mt-1" style={{ color: "#806a50", fontFamily: "var(--font-mono)" }}>
                            找不到打卡点？请询问工作人员
                        </p>
                    )}
                </div>
            </div>

            {!tapping && (
                <button
                    onClick={onCancel}
                    className="mt-auto text-sm transition-opacity hover:opacity-60"
                    style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}
                >
                    取消
                </button>
            )}

            <style>{`@keyframes pring { 0%{opacity:.8;transform:scale(.85)} 100%{opacity:0;transform:scale(1.2)} }`}</style>
        </div>
    )
}