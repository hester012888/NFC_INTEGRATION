// export default function Footer() {
//     return <footer className="mt-5 text-center text-xs leading-relaxed"
//         style={{ color: '#826e54' }}>黑龙江省博物馆 · 探馆集章
//         <br />
//         <span style={{ fontSize: 12 }}>互动演示 · 文物资料以馆方审核为准</span>
//     </footer>
// }

import React from "react";

/* ── Footer 页脚 ────────────────────────────────────────────────────
 * 同色系
 * 放在 Shell 外框最底部，NavBar 下方
 * ─────────────────────────────────────────────────────────────────── */

export default function Footer() {
  return (
    <div
      style={{
        flexShrink: 0,
        borderTop: "1px solid rgba(201,169,110,0.08)",
        padding: "14px 24px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        
      }}
    >
      {/* 主行：博物馆名 */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 11,
          color: "#8a7a60",
          letterSpacing: "0.12em",
        }}
      >
      hester · NFC 探馆集章
      </div>

      {/* 副行：版权 + 演示说明 */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "#826e54",
          letterSpacing: "0.08em",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>© 2026 探馆集章</span>
        <span style={{ color: "#826e54" }}>·</span>
        <span>演示版本</span>
      </div>
    </div>
  );
}
