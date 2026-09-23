import type { Exhibit, StampRecord } from "../types"
import { ACHIEVEMENTS } from "../data/achievements"
import { clearAllPhotos } from "../utils/photoStore"
import { resetBackend } from "../useBackend"
import Footer from "../footer"

export default function CollectionScreen({
  exhibits,
  stamps,
  photos,
  achievements,
  card,
  onTap,
}: {
  exhibits: Exhibit[]
  stamps: StampRecord[]
  photos: Record<string, string>
  achievements: typeof ACHIEVEMENTS
  card?: string
  onTap: (e: Exhibit) => void
}) {
    const done = stamps.length
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-none px-6 pt-14 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs tracking-[0.15em] mb-1" style={{ color: "#88602f", fontFamily: "var(--font-mono)" }}>
                我的印章册
              </div>
              <h2 className="text-xl" style={{ fontFamily: "var(--font-display)", color: "#493323" }}>
                {done === 0 ? "尚未打卡" : done === exhibits.length ? "集章圆满！" : `已收集 ${done} 枚`}
              </h2>
            </div>
            <div
              className="text-3xl font-bold"
              style={{ color: "rgba(155,113,58,0.15)", fontFamily: "var(--font-display)" }}
            >
              {done}/{exhibits.length}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ scrollbarWidth: "none" }}>
          <div className="stamp-grid grid grid-cols-3 gap-3 mb-6">
            {exhibits.map((ex) => {
              const rec = stamps.find((s) => s.exhibitId === ex.id)
              const stamped = !!rec
              const photo = photos[ex.id]
              return (
                <button
                  key={ex.id}
                  onClick={() => onTap(ex)}
                  className="flex flex-col items-center gap-2 rounded-xl py-4 transition-all duration-200"
                  style={{
                    background: stamped ? `${ex.stampColor}12` : "#fffbf3",
                    border: `1px solid ${stamped ? ex.stampColor + "40" : "rgba(107,77,39,0.05)"}`,
                    boxShadow: stamped ? `0 0 16px ${ex.stampColor}20` : "none",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-full overflow-hidden text-lg font-bold relative"
                    style={{
                      width: 48,
                      height: 48,
                      background: stamped ? `${ex.stampColor}20` : "#eadcc2",
                      border: `2px solid ${stamped ? ex.stampColor : "rgba(107,77,39,0.06)"}`,
                      color: stamped ? ex.stampColor : "#82705a",
                      fontFamily: "var(--font-display)",
                      boxShadow: photo ? `0 0 10px ${ex.stampColor}60` : "none",
                    }}
                  >
                    {photo ? (
                      <img src={photo} alt="打卡照" className="w-full h-full object-cover" />
                    ) : stamped ? ex.stampSymbol : "?"}
                    {photo && (
                      <div
                        className="absolute bottom-0 right-0 w-3.5 h-3.5 flex items-center justify-center rounded-full"
                        style={{ background: ex.stampColor }}
                      >
                        <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#f6f0e5"
                          strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-center px-1">
                    <div
                      className="text-xs leading-snug"
                      style={{
                        color: stamped ? "#76512a" : "#7d6b51",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {stamped ? ex.name.slice(0, 5) + (ex.name.length > 5 ? "…" : "") : "未打卡"}
                    </div>
                    {stamped && rec && (
                      <div
                        className="text-xs mt-0.5"
                        style={{
                          color: rec.answeredCorrect ? "#4e7143" : "#a04731",
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                        }}
                      >
                        {ex.id === "E03" ? "纪念卡" : rec.answeredCorrect ? "✓" : "✗"} {rec.time}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
  
          <div className="text-xs tracking-[0.12em] mb-3" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
            成就
          </div>
          <div className="flex flex-col gap-2.5">
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = achievements.some((a) => a.id === ach.id)
              return (
                <div
                  key={ach.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300"
                  style={{
                    background: unlocked ? "rgba(155,113,58,0.08)" : "#fffbf3",
                    border: `1px solid ${unlocked ? "rgba(155,113,58,0.25)" : "rgba(107,77,39,0.04)"}`,
                  }}
                >
                  <div className="text-xl" style={{ filter: unlocked ? "none" : "grayscale(1) opacity(0.3)" }}>
                    {ach.icon}
                  </div>
                  <div>
                    <div className="text-sm" style={{ color: unlocked ? "#493323" : "#7d6b51", fontFamily: "var(--font-body)" }}>
                      {ach.name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: unlocked ? "#745d42" : "#82705a", fontFamily: "var(--font-mono)" }}>
                      {ach.desc}
                    </div>
                  </div>
                  {unlocked && (
                    <div
                      className="ml-auto text-xs px-2 py-0.5 rounded"
                      style={{
                        background: "rgba(155,113,58,0.15)",
                        color: "#88602f",
                        fontFamily: "var(--font-mono)",
                        border: "1px solid rgba(155,113,58,0.25)",
                      }}
                    >
                      已解锁
                    </div>
                  )}
                </div>
              )
            })}
          </div>
  
          {card && (
            <section className="saved-card mt-5">
              <h3 className="text-base mb-3">我的电子纪念卡</h3>
              <img src={card} alt="已保存的电子纪念卡" className="w-full rounded-xl" />
              <a
                className="museum-primary block text-center mt-3"
                href={card}
                download="龙博-蚕织图纪念卡.png"
              >
                下载 PNG 图片
              </a>
            </section>
          )}
  
          <button
            onClick={async () => {
              if (!confirm("确定要清空所有打卡记录吗？")) return
              try {
                await resetBackend()
                await clearAllPhotos()
                localStorage.removeItem("museum_stamps")
                Object.keys(localStorage)
                  .filter(k => k.startsWith("museum_answered_"))
                  .forEach(k => localStorage.removeItem(k))
              } catch {
                alert("清空失败，请检查浏览器存储权限后重试。")
                return
              }
              window.location.reload()
            }}
            className="w-full mt-6 py-3 rounded-xl text-xs transition-opacity hover:opacity-70"
            style={{
              background: "transparent",
              border: "1px solid rgba(155,113,58,0.12)",
              color: "#7c684f",
              fontFamily: "var(--font-mono)",
            }}
          >
            重置演示数据
          </button>
          <Footer />
        </div>
      </div>
    )
}