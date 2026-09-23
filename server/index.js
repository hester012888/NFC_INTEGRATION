import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import Database from "better-sqlite3"
import cors from "cors"

/* ── 数据库 ───────────────────────────────── */
const db = new Database("museum.db")
db.exec(`
  CREATE TABLE IF NOT EXISTS checkins (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     TEXT NOT NULL,
    point_id    TEXT NOT NULL,
    kiosk_id    TEXT,
    created_at  TEXT DEFAULT (datetime('now','localtime')),
    UNIQUE(user_id, point_id)

  );
  CREATE INDEX IF NOT EXISTS idx_user ON checkins(user_id);
  CREATE INDEX IF NOT EXISTS idx_point ON checkins(point_id);
`)

// 用户卡号 → 用户 ID（或者直接用卡号当 user_id，看你需要）
const CARD_MAP = {
  // "8010191BB0791D": "user001",
  // "第二张卡号": "user002",
  // ...
}


// 读卡器 dn → 点位 ID
const KIOSK_MAP = {
  "82305414A7FDCA4A": "E01",   // 读卡器 1 的 dn
  // "第二台读卡器dn": "E02",  // 读卡器 2 的 dn
  // ...
}


/* ── HTTP 服务 ────────────────────────────── */
const app = express()
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log("🌐 收到请求:", req.method, req.url, "Body:", req.body)
  next()
})

// GET 版打卡（给 NFC 贴片直接打开 URL 用）
app.get("/api/checkin", (req, res) => {
  const { point_id, device_id, source } = req.query
  if (!point_id) return res.status(400).send("point_id required")

  // 用 device_id 当 user_id，和读卡器版统一
  const user_id = device_id || "anonymous"

  const exists = db.prepare(
    "SELECT id FROM checkins WHERE user_id = ? AND point_id = ?"
  ).get(user_id, point_id)
  if (exists) return res.send(successHTML(point_id, true))

  const info = db.prepare(
    "INSERT INTO checkins (user_id, point_id, kiosk_id) VALUES (?, ?, ?)"
  ).run(user_id, point_id, "")   // kiosk_id 留空，因为是 NFC 不是读卡器

  const record = {
    id: info.lastInsertRowid,
    user_id,
    point_id,
    kiosk_id: "",
    created_at: new Date().toLocaleString("zh-CN", { hour12: false }),
  }
  io.emit("checkin", record)
  res.send(successHTML(point_id, false))
})


app.post("/IC-14WStest/IC-14h.asp", (req, res) => {
  console.log("📥 读卡器上报:", req.body)
  const { card, dn, jihao } = req.body || {}
  if (!card) return res.status(400).json({ error: "card required" })
  if (!dn)   return res.status(400).json({ error: "dn required" })

  const user_card = String(card).toUpperCase()

  // ① 查用户（没有 CARD_MAP 就直接用卡号）
  const user_id = CARD_MAP[user_card] || user_card

  // ② 查读卡器对应的点位
  const point_id = KIOSK_MAP[dn]
  if (!point_id) {
    console.log(`⚠️ 未注册的读卡器 dn=${dn}`)
    return res.status(404).json({ error: `unknown kiosk: ${dn}` })
  }

  // ③ 幂等：同一个 user + 同一个 point 只记一次
  const exists = db.prepare(
    "SELECT id FROM checkins WHERE user_id = ? AND point_id = ?"
  ).get(user_id, point_id)
  if (exists) {
    console.log(`ℹ️ 已打卡: ${user_id} @ ${point_id}`)
    return res.json({ ok: true, duplicated: true })
  }

  // ④ 写库
  const info = db.prepare(
    "INSERT INTO checkins (user_id, point_id, kiosk_id) VALUES (?, ?, ?)"
  ).run(user_id, point_id, dn)

  const record = {
    id: info.lastInsertRowid,
    user_id,
    point_id,
    kiosk_id: dn,
    created_at: new Date().toLocaleString("zh-CN", { hour12: false }),
  }

  console.log(`✅ 打卡成功: ${user_id} @ ${point_id}`)
  io.emit("checkin", record)
  io.emit("open_challenge", { user_id, point_id, ts: Date.now() })   // ← 新增
  res.json({ ok: true, record })
})

// 查某个用户的打卡记录
app.get("/api/user/:userId/progress", (req, res) => {
  const rows = db.prepare(
    "SELECT * FROM checkins WHERE user_id = ? ORDER BY id"
  ).all(req.params.userId)
  res.json(rows)
})

// 打卡成功页面（自动关闭）
function successHTML(pointId, duplicated) {
  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>打卡成功</title>
      </head>
      <body style="margin:0;background:#f6f0e5;font-family:-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;">
        <div style="font-size:72px;color:#88602f;line-height:1;">✓</div>
        <div style="color:#493323;font-size:22px;margin-top:20px;font-weight:600;">
          ${duplicated ? "已打卡" : "打卡成功"}
        </div>
        <div style="color:#7c684f;font-size:15px;margin-top:10px;">
          ${pointId}
        </div>
        <script>
          setTimeout(() => { window.close(); }, 1500);
        </script>
      </body>
    </html>
  `
}

// 拉取全部进度
app.get("/api/progress", (req, res) => {
  const rows = db.prepare("SELECT * FROM checkins ORDER BY id").all()
  res.json(rows)
})

// 清空（演示用）
app.post("/api/reset", (req, res) => {
  db.prepare("DELETE FROM checkins").run()
  io.emit("reset")
  res.json({ ok: true })
})



/* ── WebSocket ────────────────────────────── */
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
})


io.on("connection", (socket) => {
  console.log("client connected:", socket.id)

  // 客户端可以带 device_id 来订阅自己的进度
  socket.on("subscribe", (deviceId) => {
    socket.join(`device:${deviceId}`)
  })

  socket.on("disconnect", () => {
    console.log("client left:", socket.id)
  })
})

/* ── 启动 ─────────────────────────────────── */
const PORT = process.env.PORT || 9976
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ backend running on http://localhost:${PORT}`)
})
