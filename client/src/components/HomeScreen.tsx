import type { Exhibit, StampRecord } from "../types"
import Footer from "../footer"
import ExhibitRow from "./ExhibitRow"

export default function HomeScreen({
  exhibits,
  stamps,
  photos,
  connected,
  onSimulate,
}: {
  exhibits: Exhibit[]
  stamps: StampRecord[]
  photos: Record<string, string>
  connected: boolean
  onSimulate: (e: Exhibit) => void
}) {
    const done = stamps.length
    const pct = Math.round((done / exhibits.length) * 100)
    return (
      <div className="home-screen flex-1 flex flex-col overflow-hidden">
        <div className="home-header flex-none px-6 pt-14 pb-5">
          <div
            className="text-xs tracking-[0.2em] mb-3"
            style={{ color: "#88602f", fontFamily: "var(--font-mono)" }}
          >
            XXX省博物馆 · 探馆手记
          </div>
          <h1
            className="text-[30px] leading-snug mb-4 font-bold"
            style={{ fontFamily: "var(--font-display)", color: "#493323" }}
          >
            探馆集章，<em style={{ color: "#88602f" }}>解锁历史</em>
          </h1>
          <div
            className="home-progress rounded-xl p-4"
            style={{
              background: "#f0e5d2",
              border: "1px solid rgba(155,113,58,0.12)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: "#745d42", fontFamily: "var(--font-mono)" }}>
                打卡进度
              </span>
              <span className="text-xs font-medium" style={{ color: "#88602f", fontFamily: "var(--font-mono)" }}>
                <span style={{ color: connected ? "#4e7143" : "#a04731", marginRight: 4 }}>
                  {connected ? "●" : "○"}
                </span>
                {done} / {exhibits.length} 件
              </span>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: 5, background: "rgba(155,113,58,0.1)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, #b79556, #88602f)",
                }}
              />
            </div>
            <div className="text-xs mt-2" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
              {connected ? "实时同步中" : "离线（请检查后端）"} ·{" "}
              {pct === 0
                ? "寻迹 · 配对 · 创作 · 对位 · 拂尘 · 排序"
                : pct === 100
                  ? "🎉 全部集齐！"
                  : `还差 ${exhibits.length - done} 件即可集齐全套印章`}
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ scrollbarWidth: "none" }}>
          <div className="text-xs tracking-[0.12em] mb-3" style={{ color: "#7c684f", fontFamily: "var(--font-mono)" }}>
            六件馆藏 · 六种互动
          </div>
          <div className="flex flex-col gap-3">
            {exhibits.map((ex) => {
              const stamped = stamps.some((s) => s.exhibitId === ex.id)
              const rec = stamps.find((s) => s.exhibitId === ex.id)
              return (
                <ExhibitRow
                  key={ex.id}
                  exhibit={ex}
                  stamped={stamped}
                  correct={rec?.answeredCorrect}
                  time={rec?.time}
                  photo={photos[ex.id]}
                  onTap={() => onSimulate(ex)}
                />
              )
            })}
          </div>
          <Footer />
        </div>
      </div>
    )
}