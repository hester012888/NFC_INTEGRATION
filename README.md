黑龙江省博物馆 · 探馆集章互动体验

一个面向黑龙江省博物馆的移动端互动探馆应用。观众通过 NFC 打卡点触发互动，完成每件文物专属的任务，收集印章与打卡照片，解锁成就，并生成电子纪念卡。支持实时后端同步（WebSocket + REST），多人可同时打卡并实时看到进度。

✨ 功能特色

NFC 打卡触发：手机碰触 NFC 标签（或点击展品）即可进入互动流程；也支持 URL 参数 ?point=E01 与 ?user=xxx 触发。
实时同步：通过 useBackend 的 WebSocket 连接后端，多用户打卡数据实时推送；页面顶部显示连接状态（● 已连接 / ○ 离线）。
读卡器上报事件：监听 nfc-challenge 自定义事件，收到硬件上报后自动进入对应展品的过渡页并进入互动。
六件馆藏 · 六种互动：每件展品配有独立互动玩法（寻迹、配对、创作、对位、拂尘、排序等），完成后获得专属印章。
拍照打卡与相册保存：可为每件展品拍摄/上传照片，支持保存到相册（含 iOS 兜底方案）。
语音讲解：内置音频播放器，支持普通话 / 粤语 / English / 日本語（按展品可用语言显示），可拖动进度、快进/快退 15 秒。
文物详情：材质、尺寸、展厅、详细介绍与趣味小知识。
印章册与成就系统：集章进度可视化，解锁「初探珍宝」「半程探索者」「文物学者」「馆藏通」等成就。
电子纪念卡：完成《蚕织图》互动后可生成并下载专属纪念卡。
本地持久化：答题记录存于 localStorage（按用户区分），打卡照片存于 IndexedDB，刷新不丢失。
🏛️ 展品列表

编号	名称	展厅	年代	类别
E01	金代铜坐龙	黑龙江历史文物馆	金·大定	铜器
E02	金代齐国王墓丝织品服饰	黑龙江历史文物馆	金·大定	丝织品
E03	南宋《蚕织图》卷轴	书画艺术馆	南宋	书画
E04	唐代渤海天门军之印	黑龙江历史文物馆	唐·渤海国	印章
E05	披毛犀化石骨架	古生物馆	更新世	化石
E06	南宋《兰亭序》图卷	书画艺术馆	南宋	书画
E03 为特殊的「纪念卡」互动，不计入答题正确数，但仍计入总打卡进度（按 /6 计算）。
🗺️ 页面流程

text
mini（首页入口）
  └─ home（探馆主页 / 展品列表 / 实时进度）
       ├─ tap（NFC 点亮动画）
       │    ├─ challenge（互动任务）→ stamp（印章页）→ detail（详情页）
       │    └─ souvenir（纪念卡生成，E03 专属）
       ├─ tapping（硬件上报过渡页）
       └─ collection（我的藏章 / 成就 / 重置）
🛠️ 技术栈

React + TypeScript
状态管理：React Hooks（useState / useEffect / useRef / useMemo / useCallback）
样式：CSS + 内联样式，适配移动端安全区（env(safe-area-inset-bottom)）
存储：

localStorage — 答题状态（按 userId 区分：museum_answered_${userStorageKey}）
IndexedDB — 打卡照片（photoStore）
卡片存储（cardStore）
后端能力：

WebSocket — 通过 useRealtimeCheckins() 实时推送打卡记录
REST — reportCheckin() 上报打卡、resetBackend() 重置
设备能力：

Web Share API — 移动端分享/保存图片
NFC URL 唤醒 — 通过 ?point=Exx&user=xxx 参数
硬件读卡器事件 — window.addEventListener("nfc-challenge", ...)
音频：HTML5 <audio> 原生播放
📁 目录结构（模块化后）

text
src/
├── App.tsx                     # 主应用（页面路由、状态、Hooks、渲染分发）
├── MiniHome.tsx                # 首页入口
├── Interactions.tsx            # 六种互动玩法 + ExhibitArtwork
├── SouvenirScreen.tsx          # 纪念卡生成页
├── footer.tsx                  # 页脚
├── logic.ts                    # getAchievements 等
├── cardStore.ts                # 纪念卡存储
├── useBackend.ts               # WebSocket + REST 后端通信
├── types.ts                    # Exhibit / StampRecord / Screen 类型
├── data/
│   ├── exhibits.ts             # EXHIBITS 展品数据
│   └── achievements.ts         # ACHIEVEMENTS 成就数据
├── utils/
│   ├── photoStore.ts           # 照片 IndexedDB 读写
│   └── saveToGallery.ts        # 保存到相册（含 iOS 兜底）
├── components/
│   ├── RedirectHome.tsx        # render 期间兜底跳转
│   ├── Shell.tsx               # 全局容器 + 成就弹窗挂载
│   ├── NavBar.tsx              # 底部导航（探馆 / 我的藏章）
│   ├── HomeScreen.tsx          # 探馆主页
│   ├── ExhibitRow.tsx          # 单个展品行
│   ├── TapScreen.tsx           # NFC 点亮动画页
│   ├── TappingScreen.tsx       # 硬件上报过渡页
│   ├── StampScreen.tsx         # 印章页
│   ├── DetailScreen.tsx        # 文物详情 + 语音讲解
│   ├── CollectionScreen.tsx    # 印章册 / 成就 / 重置
│   └── AchievementPopup.tsx    # 成就解锁弹窗
├── experience.css
├── styles.css
└── assets/
    ├── exhibits/               # E01–E06 展品图片
    └── audio/                  # E01–E06 语音（zh / en / yue / ja）
🚀 快速开始

安装依赖：

bash
npm install
本地开发：

bash
npm run dev
构建生产版本：

bash
npm run build
触发指定展品（开发/调试）

在 URL 后追加参数即可自动点亮对应展品：

text
https://your-app.com/?point=E01
带用户身份（多人同时打卡、按用户过滤进度）：

text
https://your-app.com/?point=E01&user=alice
支持 E01 ~ E06，触发后会自动清除地址栏参数。

NFC 硬件上报

前端监听 window 的 nfc-challenge 自定义事件，硬件/中间层上报后自动进入对应展品：

js
window.dispatchEvent(new CustomEvent("nfc-challenge", {
  detail: { user_id: "alice", point_id: "E01" }
}))
若 URL 未带 user 参数，则接收所有用户的事件；
若 URL 带了 user，只处理 user_id 匹配的事件。
📱 使用说明

进入 探馆 主页，浏览六件馆藏与实时同步状态。
点击展品（或现场用 NFC 文创碰触打卡点）进入 NFC 点亮 页面。
点亮完成后进入该展品的 专属互动任务，完成后获得印章。
在 印章页 可拍照打卡、保存到相册、查看文物详情与语音讲解。
在 我的藏章 查看集章进度、成就、电子纪念卡，或重置演示数据。
📝 备注

语音目前仅 普通话（zh） 完整覆盖，英语仅 E01 提供，粤语 / 日语为预留位（未提供则该按钮置灰）。
iOS 设备保存图片会走「新标签页长按保存」兜底流程。
「重置演示数据」会调用 resetBackend() 清空后端打卡记录，并清除本地印章、照片与答题状态。
部分 useEffect 中存在同步 setState，ESLint 规则 react-hooks/set-state-in-effect 已在 App.tsx 顶部用文件级注释禁用；拆分出的组件若也触发该规则，需要在对应文件顶部加同样的注释，或在 eslint.config.js 中全局关闭。
macOS 上曾出现 SouvenirScreen.tsx 大小写冲突（TS1261），通过「临时改名为中转名再改回」+ 重启 TS Server 解决。
📄 许可

本项目为博物馆互动体验演示用途。展品图片、音频等素材版权归黑龙江省博物馆及相关权利人所有。