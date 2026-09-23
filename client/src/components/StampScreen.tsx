import { useEffect, useRef, useState } from "react"
import type React from "react"
import type { Exhibit, StampRecord } from "../types"
import { saveToGallery } from "../utils/saveToGallery"

export default function StampScreen({
    exhibit,
    record,
    totalStamps,
    totalExhibits,
    isNew,
    photo,
    onPhoto,
    onNext,
    onDetail,
    onCollection,
    onNotice,
}: {
    exhibit: Exhibit
    record: StampRecord
    totalStamps: number
    totalExhibits: number
    isNew: boolean
    photo?: string
    onPhoto: (dataUrl: string) => void
    onNext: () => void
    onDetail: () => void
    onCollection: () => void
    onNotice: (msg: string) => void
}) {
    const [inkDrop, setInkDrop] = useState(isNew)
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "done" | "failed">("idle")
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isNew) {
            const t = setTimeout(() => setInkDrop(false), 1200)
            return () => clearTimeout(t)
        }
    }, [isNew])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string
            onPhoto(dataUrl)
        }
        reader.readAsDataURL(file)
        e.target.value = ""
    }

    const handleSave = async () => {
        if (!photo) return
        setSaveStatus("saving")

        const isMobile = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent)
            || (navigator.maxTouchPoints > 1 && /Mac/i.test(navigator.userAgent))
        if (isMobile) {
            onNotice("请在弹出菜单中选择“存储图像”或“保存到相册”")
        }

        const result = await saveToGallery(
            photo,
            `博物馆打卡-${exhibit.name}-${record.time.replace(":", "")}.jpg`,
        )

        if (result === "shared" || result === "saved") {
            setSaveStatus("done")
        } else {
            setSaveStatus("failed")
        }
        setTimeout(() => setSaveStatus("idle"), 2500)
    }

    return (
        <div className="stamp-screen flex-1 flex flex-col items-center gap-6 px-8 pt-10 pb-8 overflow-y-auto">
            <div className="flex flex-col items-center gap-4 text-center w-full">
                <div className="relative">
                    <div
                        className="flex items-center justify-center rounded-full overflow-hidden transition-all duration-500"
                        style={{
                            width: 110,
                            height: 110,
                            background: `${exhibit.stampColor}18`,
                            border: `3px solid ${exhibit.stampColor}`,
                            boxShadow: `0 0 40px ${exhibit.stampColor}50, inset 0 0 20px ${exhibit.stampColor}10`,
                            transform: inkDrop ? "scale(1.15)" : "scale(1)",
                            animation: inkDrop ? "stampIn 0.5s cubic-bezier(0.22,1,0.36,1)" : "none",
                        }}
                    >
                        {photo ? (
                            <img src={photo} alt="打卡照片" className="w-full h-full object-cover" />
                        ) : (
                            <span
                                className="text-5xl font-bold"
                                style={{ color: exhibit.stampColor, fontFamily: "var(--font-display)" }}
                            >
                                {exhibit.stampSymbol}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
                        style={{
                            width: 34,
                            height: 34,
                            background: photo ? exhibit.stampColor : "#d5bd94",
                            border: `2px solid ${photo ? "#f6f0e5" : "rgba(155,113,58,0.3)"}`,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                        }}
                        title="拍照打卡"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke={photo ? "#f6f0e5" : "#88602f"} strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    {isNew ? (
                        <div className="text-base font-medium mb-1" style={{ color: "#88602f", fontFamily: "var(--font-display)" }}>
                            印章获得！
                        </div>
                    ) : (
                        <div className="text-base font-medium mb-1" style={{ color: "#745d42", fontFamily: "var(--font-display)" }}>
                            已打卡
                        </div>
                    )}
                    <h3 className="text-xl" style={{ fontFamily: "var(--font-display)", color: "#493323" }}>
                        {exhibit.name}
                    </h3>
                    <div className="text-xs mt-1" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
                        {exhibit.hall} · {record.time}
                    </div>
                </div>

                <div
                    className="w-full rounded-xl px-4 py-3 text-left"
                    style={{
                        background: record.answeredCorrect ? "rgba(80,160,80,0.1)" : "rgba(160,80,80,0.1)",
                        border: `1px solid ${record.answeredCorrect ? "rgba(80,160,80,0.25)" : "rgba(160,80,80,0.25)"}`,
                    }}
                >
                    <div
                        className="text-xs mb-1"
                        style={{
                            color: record.answeredCorrect ? "#4e7143" : "#a04731",
                            fontFamily: "var(--font-mono)",
                        }}
                    >
                        {record.answeredCorrect ? "✓ 任务完成" : "↻ 尚未完成，欢迎重新挑战"}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "#745d42" }}>
                        {exhibit.funFact}
                    </p>
                </div>

                <div className="flex gap-2 flex-wrap justify-center">
                    {Array.from({ length: totalExhibits }, (_, i) => (
                        <div
                            key={i}
                            className="rounded-full transition-all duration-500"
                            style={{
                                width: i < totalStamps ? 10 : 8,
                                height: i < totalStamps ? 10 : 8,
                                background: i < totalStamps ? exhibit.stampColor : "rgba(107,77,39,0.08)",
                                boxShadow: i < totalStamps ? `0 0 6px ${exhibit.stampColor}80` : "none",
                            }}
                        />
                    ))}
                </div>
                <div className="text-xs" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
                    {totalStamps} / {totalExhibits} 已集章
                </div>
            </div>

            <div className="flex flex-col gap-2.5 w-full">
                <button
                    onClick={onDetail}
                    className="w-full py-3.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90"
                    style={{
                        background: `linear-gradient(135deg, ${exhibit.stampColor}44, ${exhibit.stampColor}22)`,
                        border: `1px solid ${exhibit.stampColor}70`,
                        color: exhibit.stampColor,
                        fontFamily: "var(--font-mono)",
                        letterSpacing: "0.06em",
                    }}
                >
                    📖 查看文物详情 &amp; 语音讲解
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 hover:opacity-80"
                        style={{
                            background: photo ? "rgba(155,113,58,0.1)" : "#f0e5d2",
                            border: `1px solid ${photo ? "rgba(155,113,58,0.3)" : "rgba(107,77,39,0.07)"}`,
                            color: photo ? "#88602f" : "#755c40",
                            fontFamily: "var(--font-mono)",
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                        {photo ? "重新拍照" : "📸 拍照打卡"}
                    </button>

                    {photo && (
                        <button
                            onClick={handleSave}
                            disabled={saveStatus === "saving"}
                            className="flex-1 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-200 hover:opacity-80"
                            style={{
                                background: saveStatus === "done" ? "rgba(80,160,80,0.12)" : "#f0e5d2",
                                border: `1px solid ${saveStatus === "done" ? "rgba(80,160,80,0.3)" : "rgba(107,77,39,0.07)"}`,
                                color: saveStatus === "done" ? "#4e7143"
                                    : saveStatus === "failed" ? "#a04731"
                                        : "#755c40",
                                fontFamily: "var(--font-mono)",
                            }}
                        >
                            {saveStatus === "saving" ? "保存中…"
                                : saveStatus === "done" ? "✓ 已保存"
                                    : saveStatus === "failed" ? "✗ 失败"
                                        : "⬇ 保存相册"}
                        </button>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={onCollection}
                        className="flex-1 py-2.5 rounded-xl text-xs transition-opacity hover:opacity-70"
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(155,113,58,0.15)",
                            color: "#786143",
                            fontFamily: "var(--font-mono)",
                        }}
                    >
                        印章册
                    </button>
                    <button
                        onClick={onNext}
                        className="flex-1 py-2.5 rounded-xl text-xs transition-opacity hover:opacity-70"
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
            </div>

            <style>{`
          @keyframes stampIn { 
            0%{transform:scale(0.3);opacity:0} 
            60%{transform:scale(1.2)} 
            100%{transform:scale(1);opacity:1} }`}</style>
        </div>
    )
}