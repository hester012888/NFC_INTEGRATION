// 引入 React Hooks：useRef 用于“锁”，useState 用于表单状态
import { useRef, useState } from 'react';
// 引入卡片生成与保存函数
import { generateCard, saveCard } from './cardStore';

/**
 * 纪念卡互动页
 * - card：已生成的纪念卡 dataURL（由 App 传入，用于显示/下载/分享）
 * - ready：cardStore 是否已就绪（读取本地存储完成）
 * - onGenerated：生成成功后回调，把 dataURL 和“是否持久化成功”传回 App
 * - onBack：返回探馆首页
 * - onCollection：跳到印章册
 */
export default function SouvenirScreen({
  card,
  ready,
  onGenerated,
  onBack,
  onCollection
}: {
  card?: string;
  ready: boolean;
  onGenerated: (data: string, persisted: boolean) => void;
  onBack: () => void;
  onCollection: () => void;
}) {
  // 署名，默认“探馆旅人”
  const [name, setName] = useState('探馆旅人');
  // 选中的纹样，默认“桑叶”
  const [motif, setMotif] = useState('桑叶');
  // 是否正在生成（用于禁用按钮、显示 loading 文案）
  const [busy, setBusy] = useState(false);
  // 生成锁：防止连点重复生成
  const lock = useRef(false);
  // 页面提示信息（成功/失败/取消分享等）
  const [message, setMessage] = useState('');

  /**
   * 生成并保存纪念卡
   * 1. 防连点（lock）+ 就绪检查（ready）
   * 2. 调 generateCard 生成 dataURL
   * 3. 尝试 saveCard 持久化到本机
   * 4. 无论是否持久化成功，都把图传给 App（onGenerated）
   * 5. 根据结果给出提示
   */
  async function generate() {
    if (lock.current || !ready) return;
    lock.current = true;
    setBusy(true);
    setMessage('');
    try {
      const data = await generateCard(name, motif);  // 生成图片
      let saved = true;
      try {
        await saveCard(data);                        // 存到本机
      } catch {
        saved = false;                               // 存储失败
      }
      onGenerated(data, saved);                      // 传回 App
      setMessage(
        saved
          ? '纪念卡已保存在本机，可在印章册中再次查看。'
          : '图片已生成，本机存储失败，请立即下载保存。'
      );
    } catch {
      setMessage('生成失败，请重试。');
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  /**
   * 下载纪念卡为 PNG
   * 用临时 <a download> 触发浏览器下载
   */
  function download() {
    if (!card) return;
    const a = document.createElement('a');
    a.href = card;
    a.download = '龙博-蚕织图纪念卡.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setMessage('已发起下载；如果没有下载，可长按纪念卡保存图片。');
  }

  /**
   * 分享纪念卡（Web Share API）
   * 把 dataURL 转成 File，若浏览器支持文件分享则调用系统分享
   * 取消分享（AbortError）单独处理，不算失败
   */
  async function share() {
    if (!card) return;
    try {
      const blob = await (await fetch(card)).blob();
      const file = new File([blob], '龙博纪念卡.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: '龙博探馆纪念' });
        setMessage('分享操作已完成。');
      } else {
        setMessage('当前浏览器不支持图片分享，请先下载后分享。');
      }
    } catch (error) {
      setMessage(
        error instanceof DOMException && error.name === 'AbortError'
          ? '已取消分享。'
          : '分享未成功，请下载图片后分享。'
      );
    }
  }


  return (
    <div className="flex-1 overflow-y-auto px-6 pt-10 pb-8 souvenir-screen">
      {/* 返回首页 */}
      <button className="mb-5 text-sm" disabled={busy} onClick={onBack}>
        ← 返回探馆
      </button>

      {/* 页面标题区 */}
      <p className="text-xs mb-2" style={{ color: '#987442' }}>
        第三件展品 · 纪念互动
      </p>
      <h2 className="text-xl font-bold mb-2">南宋《蚕织图》卷轴</h2>
      <p className="text-sm mb-5">选一枚纹样，把今天的相遇织成纪念。</p>

      {/* 署名输入（最多 12 字） */}
      <label className="block text-sm mb-5">
        纪念卡署名
        <input
          className="w-full rounded-xl border mt-2 px-4 py-3"
          maxLength={12}
          value={name}
          disabled={busy}
          onChange={e => setName(e.target.value)}
        />
      </label>

      {/* 纹样选择：桑叶 / 丝线 / 织锦
      <fieldset disabled={busy}>
        <legend className="text-sm mb-2">选择纪念纹样</legend>
        <div className="flex gap-3 mb-5">
          {['桑叶', '丝线', '织锦'].map(m => (
            <button
              key={m}
              aria-pressed={motif === m}
              onClick={() => setMotif(m)}
              className="flex-1 rounded-xl border py-3 text-sm"
              style={{
                background: motif === m ? '#63472f' : '#fffaf0',
                color: motif === m ? '#fffaf0' : '#493323'
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </fieldset> */}

      {/* 静态预览框（样式在 styles.css 的 .souvenir-preview / .souvenir-visual） */}
      <div className="souvenir-preview">
        <div className="souvenir-visual" />
        <p>龙博探馆纪念</p>
        <h3>把时光，织成纪念</h3>
        <p>南宋《蚕织图》卷轴</p>
        <strong>{name.trim() || '探馆旅人'} · {motif}印记</strong>
        <small>编辑预览 · 生成后保存为图片</small>
      </div>

      {/* 生成按钮：busy 或未就绪时禁用 */}
      <button
        className="museum-primary w-full mt-5"
        disabled={busy || !ready}
        onClick={generate}
      >
        {busy
          ? '正在生成并保存…'
          : card
            ? '重新生成并保存纪念卡'
            : '生成并保存纪念卡'}
      </button>

      {/* 生成结果：显示图片 + 下载 + 分享 */}
      {card && (
        <section className="mt-6 saved-card">
          <h3 className="text-base mb-3">已生成的纪念卡</h3>
          <img
            src={card}
            alt="已生成的电子纪念卡，可长按保存"
            className="w-full rounded-xl"
          />
          <button className="museum-primary w-full mt-4" onClick={download}>
            下载 PNG 图片
          </button>
          <button className="museum-secondary w-full mt-3" onClick={share}>
            分享图片
          </button>
        </section>
      )}

      {/* 状态提示 */}
      {message && <p role="status" className="text-sm mt-4">{message}</p>}

      {/* 跳转印章册 */}
      <button
        className="museum-secondary w-full mt-4"
        disabled={busy}
        onClick={onCollection}
      >
        查看印章册
      </button>

      <button className="museum-secondary w-full mt-3" disabled={busy} onClick={onBack}>
        继续探馆
      </button>
    </div>
  );
}