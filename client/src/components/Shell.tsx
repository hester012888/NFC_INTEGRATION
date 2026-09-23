import type React from "react"
import { ACHIEVEMENTS } from "../data/achievements"
import AchievementPopup from "./AchievementPopup"

export default function Shell({
  children,
  achievements = [],
  onDismiss,
  notice,
}: {
  children: React.ReactNode
  achievements?: typeof ACHIEVEMENTS
  onDismiss?: () => void
  notice?: string
}) {
    const blocked = achievements.length > 0
    return (
      <div className="museum-stage size-full flex items-center justify-center bg-[#e7dccb]">
        <div
          className="museum-frame relative overflow-hidden flex flex-col"
          style={{
            width: "min(460px, 100vw)",
            height: "min(960px, 100svh)",
            background: "#f6f0e5",
            borderRadius: "min(30px, 4vw)",
            boxShadow: "0 48px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(155,113,58,0.08)",
            paddingBottom: "env(safe-area-inset-bottom)",
            boxSizing: "border-box",
          }}
        >
          <div
            className="flex flex-col flex-1 min-h-0"
            style={{
              pointerEvents: blocked ? "none" : "auto",
              transition: "opacity 0.2s",
            }}
          >
            {children}
          </div>
          {notice && <div role="status" className="storage-notice">{notice}</div>}
          {achievements[0] && (
            <AchievementPopup
              achievement={achievements[0]}
              remaining={achievements.length}
              onClose={() => onDismiss?.()}
            />
          )}
        </div>
      </div>
    )
}