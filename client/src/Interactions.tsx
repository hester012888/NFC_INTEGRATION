import { useRef, useState } from 'react';
import imgE02 from "./assets/exhibits/E02.jpg"
import video from "./assets/videos/E01.mp4"


export const INTERACTIONS: Record<string, { name: string; action: string; hint: string; index: number }> = {
    E01: { name: '视频观察', action: '观看视频后回答问题', hint: '先观看视频，再选出正确答案', index: 0 },
    E02: { name: '纹饰配对', action: '为服饰线索配成一对', hint: '观察材料、纹样与剪裁，连接对应描述', index: 1 },
    E03: { name: '纪念创作', action: '织一张专属纪念卡', hint: '选择纹样、留下署名，生成可保存的图片', index: 2 },
    E04: { name: '印章对位', action: '转正古印，落下一印', hint: '旋转印面，让上沿与定位标记对齐', index: 3 },
    E05: { name: '化石拂尘', action: '拂去尘土，发现骨架', hint: '用手指擦拭覆盖层，逐步揭开化石', index: 4 },
    E06: { name: '文句排序', action: '重排兰亭中的四句', hint: '依次放入句签，还原文句的先后顺序', index: 5 },
};
export function ExhibitArtwork({ id, className = '' }: { id: string; className?: string }) {
    const i = INTERACTIONS[id]?.index ?? 0;
    return <span role="img" aria-label={INTERACTIONS[id]?.name + '主题插画'} className={'exhibit-art art-' + id + ' ' + className} style={{ backgroundPosition: `${i % 3 * 50}% ${Math.floor(i / 3) * 100}%` }} />;
}
const FEATURES = [{ title: '龙的主体', text: '以龙为主体，昂首蹲坐。', x: 37, y: 22 }, { title: '麒麟元素', text: '原页面资料将麒麟列为造型融合来源之一。', x: 57, y: 32 }, { title: '狮的神态', text: '从威猛的面部神态，寻找狮的造型联想。', x: 27, y: 47 }, { title: '犬的姿态', text: '观察蹲坐姿态，认识复合动物造型。', x: 65, y: 69 }];
export default function InteractionScreen({ id, title, onComplete, onBack }: { id: string; title: string; onComplete: (correct: boolean) => void; onBack: () => void }) {
    const config = INTERACTIONS[id]; const [seen, setSeen] = useState<number[]>([]); const [active, setActive] = useState<number | null>(null);
    const [selected, setSelected] = useState<number | null>(null); const [pairs, setPairs] = useState<Record<number, number>>({});
    const [angle, setAngle] = useState(270); const [cleared, setCleared] = useState<number[]>([]); const dragging = useRef(false);
    const [order, setOrder] = useState<number[]>([]); const [submitted, setSubmitted] = useState(false);
    const matchLabels = ['材料', '纹样', '剪裁']; const matchAnswers = ['圆领与对襟', '蚕丝', '团花与宝相花']; const words = ['俯察品类之盛', '惠风和畅', '天朗气清', '仰观宇宙之大'];
    const progress = id === 'E01' ? seen.length / 4 : id === 'E02' ? Object.keys(pairs).length / 3 : id === 'E04' ? (angle === 0 ? 1 : .25) : id === 'E05' ? Math.min(cleared.length / 18, 1) : order.length / 4;
    function finish(correct: boolean) { if (submitted) return; setSubmitted(true); onComplete(correct) }
    function brush(event: React.PointerEvent<HTMLDivElement>) { const rect = event.currentTarget.getBoundingClientRect(); const x = Math.floor((event.clientX - rect.left) / rect.width * 6), y = Math.floor((event.clientY - rect.top) / rect.height * 4); if (x < 0 || x > 5 || y < 0 || y > 3) return; const cell = y * 6 + x; setCleared(prev => prev.includes(cell) ? prev : [...prev, cell]); }
    return <div className="interaction-screen flex-1 overflow-y-auto px-6 pt-8 pb-8" data-interaction={id}>
        <button onClick={onBack} className="task-back">← 返回探馆</button>
        <div className="task-kicker"><span>0{config.index + 1} / 馆藏任务</span><b>{config.name}</b></div>
        <h2>{title}</h2><p className="task-subtitle">{config.action}</p>
        <div className="task-progress"><span style={{ width: progress * 100 + '%' }} /></div>
        <p className="task-guide">{config.hint}</p>
        {/* {id === 'E01' && <>
            <div className="discovery-stage">
                <ExhibitArtwork id={id} />
            <span className="art-caption">造型寻迹示意</span>{FEATURES.map((f, i) => <button key={f.title} className={'discovery-dot ' + (seen.includes(i) ? 'found' : '')} style={{ left: f.x + '%', top: f.y + '%' }} aria-label={'观察线索' + (i + 1)} aria-pressed={seen.includes(i)} onClick={() => { setActive(i); setSeen(prev => prev.includes(i) ? prev : [...prev, i]) }}>{seen.includes(i) ? '✓' : i + 1}</button>)}</div>
            <section className="task-note" aria-live="polite"><strong>{active === null ? '从四处线索，读懂一条龙' : FEATURES[active].title}</strong><p>{active === null ? '轻触图上的编号，逐一查看造型线索。' : FEATURES[active].text}</p></section>
            <div className="found-trail">{FEATURES.map((f, i) => <span key={f.title} className={seen.includes(i) ? 'found' : ''}>{seen.includes(i) ? '✓ ' : '○ '}{f.title}</span>)}</div>
            <button className="museum-primary w-full mt-5" disabled={seen.length < 4 || submitted} onClick={() => finish(true)}>完成观察 · {seen.length}/4</button>
        </>} */}
        {id === 'E01' && <>
    {/* ===== 视频区域 ===== */}
    <div className="task-video">
        <video
            src={video}
            controls
            playsInline
            preload="metadata"
            poster="/assets/exhibits/E01.jpg"
        />
    </div>

    {/* ===== 答题区域 ===== */}
    <section className="task-note" aria-live="polite">
        <strong>从视频中，读懂一条龙</strong>
        <p>金代铜坐龙的造型融合了哪些动物的特征？</p>
    </section>

    <div className="e01-options">
        {['龙、麒麟、狮、犬', '龙、凤、虎、龟', '龙、马、牛、羊', '龙、蛇、鹰、鹿'].map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = i === 0;              // 正确答案是第 1 项
            let cls = 'e01-option';
            if (submitted && isCorrect) cls += ' correct';
            else if (submitted && isSelected && !isCorrect) cls += ' wrong';
            else if (isSelected) cls += ' selected';
            return (
                <button
                    key={i}
                    className={cls}
                    disabled={submitted}
                    aria-pressed={isSelected}
                    onClick={() => {
                        if (submitted) return;
                        setSelected(i);
                    }}
                >
                    <span className="e01-option-mark">{String.fromCharCode(65 + i)}</span>
                    <span className="e01-option-text">{opt}</span>
                    {submitted && isCorrect && <span className="e01-option-icon">✓</span>}
                    {submitted && isSelected && !isCorrect && <span className="e01-option-icon">✗</span>}
                </button>
            );
        })}
    </div>

    <button
        className="museum-primary w-full mt-5"
        disabled={selected === null || submitted}
        onClick={() => finish(selected === 0)}
    >
        确认答案
    </button>
</>}
        {id === 'E02' && <>
            <div className="task-art-banner">
                <img
                    src={imgE02}
                    alt="金代齐国王墓丝织品服饰"
                    className="task-art-img"
                />
                <p>从一件衣裳<br /><b>读见三重细节</b></p>
            </div>
            <p className="task-note">观察提示：蚕丝织就衣料，团花与宝相花装饰纹样，剪裁可见圆领与对襟。</p>
            <div className="pair-board"><div>{matchLabels.map((label, i) => <button className={selected === i ? 'selected' : pairs[i] !== undefined ? 'paired' : ''} key={label} onClick={() => setSelected(i)} aria-pressed={selected === i}><span>{i + 1}</span>{label}{pairs[i] !== undefined && <small>已连接 {String.fromCharCode(65 + pairs[i])}</small>}</button>)}</div><span className="pair-link" aria-hidden="true">↔</span><div>{matchAnswers.map((label, i) => <button key={label} disabled={selected === null} onClick={() => { if (selected === null) return; setPairs(prev => { const next = { ...prev }; Object.keys(next).forEach(key => { if (next[Number(key)] === i) delete next[Number(key)] }); next[selected] = i; return next }); setSelected(null) }}><span>{String.fromCharCode(65 + i)}</span>{label}</button>)}</div></div>
            <p className="task-help" aria-live="polite">{selected === null ? '先点左侧线索，再点右侧描述。可重新连接。' : '正在连接：' + matchLabels[selected]}</p>
            <button className="museum-primary w-full mt-5" disabled={Object.keys(pairs).length < 3 || submitted} onClick={() => finish(pairs[0] === 1 && pairs[1] === 2 && pairs[2] === 0)}>确认配对</button>
        </>}
        {id === 'E04' && <>
            <div className="seal-stage"><div className="seal-target">▲ 上沿定位</div><div className="seal-face" style={{ transform: `rotate(${angle}deg)` }} aria-label={'印面角度 ' + angle + ' 度'}><span>天軍</span><span>門印</span><i>▲</i></div><span className="seal-caption">印面互动示意 · 非原印文摹本</span></div>
            <div className="seal-controls"><button className="museum-secondary" onClick={() => setAngle(a => (a + 270) % 360)}>↶ 左转 90°</button><button className="museum-secondary" onClick={() => setAngle(a => (a + 90) % 360)}>右转 90° ↷</button></div>
            <p className="task-help">将印面的小三角转到正上方，再按下盖印。</p><button className="museum-primary w-full mt-5" disabled={submitted} onClick={() => finish(angle === 0)}>按下盖印</button>
        </>}
        {id === 'E05' && <>
            <div className="excavation-stage"
                onPointerDown={e => {
                    dragging.current = true;
                    e.currentTarget.setPointerCapture(e.pointerId); brush(e)
                }}
                onPointerMove={e => { if (dragging.current) brush(e) }}
                onPointerUp={() => { dragging.current = false }}
                onPointerCancel={() => { dragging.current = false }}>
                <ExhibitArtwork id={id} />
                <div className="dust-grid">
                    {Array.from({ length: 24 }, (_, i) =>
                        <button key={i}
                            aria-label={'拂去区域' + (i + 1)}
                            className={cleared.includes(i) ? 'cleared' : ''}
                            onClick={() => setCleared(prev => prev.includes(i) ? prev : [...prev, i])}>
                            <span aria-hidden="true">·</span>
                        </button>)}</div>
            </div>
            <div className="excavation-meter"><strong>{Math.round(cleared.length / 24 * 100)}%</strong><span>已拂去覆盖层<br />揭开 75% 即可完成观察</span></div><p className="task-note">披毛犀属于大型植食性哺乳动物。慢慢拂去尘土，观察它的角、脊柱和四肢。图像为主题插画。</p>
            <button className="museum-primary w-full mt-5" disabled={cleared.length < 18 || submitted} onClick={() => finish(true)}>完成化石观察</button>
        </>}
        {id === 'E06' && <>
            <div className="verse-stage"><span className="verse-title">兰亭 · 文句手记</span>{Array.from({ length: 4 }, (_, i) => <div key={i} className={'verse-slot ' + (order[i] !== undefined ? 'filled' : '')}><span>0{i + 1}</span>{order[i] !== undefined ? words[order[i]] : '待放入句签'}</div>)}</div>
            <p className="task-help">从天气、和风，到仰观、俯察，依次放入四句。</p><div className="verse-pool">{words.map((word, i) => <button key={word} disabled={order.includes(i)} onClick={() => setOrder(prev => [...prev, i])}>{word}</button>)}</div><button className="task-back" disabled={order.length === 0} onClick={() => setOrder(prev => prev.slice(0, -1))}>↶ 撤回上一句</button>
            <button className="museum-primary w-full mt-3" disabled={order.length < 4 || submitted} onClick={() => finish(order.join(',') === '2,1,3,0')}>确认句序</button>
        </>}
        <p className="task-footer">再次进入可重新体验，最新结果覆盖上一次。</p>
    </div>
}


// export function ExhibitArtwork({ id, className = '' }: { id: string; className?: string }) {
//     const i = INTERACTIONS[id]?.index ?? 0;
//     console.log("🎨 ExhibitArtwork 被调用了:", id)
//     return <span
//         role="img"
//         className={'exhibit-art art-' + id + ' ' + className}
//         style={{
//             backgroundPosition: `${i % 3 * 50}% ${Math.floor(i / 3) * 100}%`,
//             display: 'inline-block',
//             width: 40,
//             height: 40,
//             background: 'red',
//         }}
//     />
// }