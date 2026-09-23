import { useEffect, useRef } from "react"
import { ACHIEVEMENTS } from "../data/achievements"

export default function AchievementPopup({
  achievement,
  remaining,
  onClose,
}: {
  achievement: (typeof ACHIEVEMENTS)[number]
  remaining: number
  onClose: () => void
}) {
    const ref = useRef<HTMLButtonElement>(null)
    useEffect(() => {
      const old = document.activeElement as HTMLElement
      ref.current?.focus()
      return () => old?.focus()
    }, [achievement.id])
  
    return (
      <div
        className="achievement-overlay"
        onKeyDown={e => {
          if (e.key === "Escape") { e.preventDefault(); onClose() }
          if (e.key === "Tab") { e.preventDefault(); ref.current?.focus() }
        }}
      >
        <section role="dialog" aria-modal="true" aria-labelledby="achievement-name" className="achievement-popup">
          <p className="text-xs tracking-widest">新的探索里程碑</p>
          <div className="bronze-medal">{achievement.icon}</div>
          <p style={{ color: "#983f2b" }}>成就解锁</p>
          <h2 id="achievement-name" className="text-xl font-bold my-3">{achievement.name}</h2>
          <p className="text-sm">{achievement.desc}</p>
          <button ref={ref} className="museum-primary w-full mt-6" onClick={onClose}>
            {remaining > 1 ? "查看下一项成就" : "继续探索"}
          </button>
        </section>
      </div>
    )
}