import { useEffect } from "react"
/* ── RedirectHome（render 期间需要切屏时的兜底）──────────────── */
export default function RedirectHome({ onDone }: { onDone: () => void }) {
  useEffect(() => { onDone() }, [onDone])
  return null
}