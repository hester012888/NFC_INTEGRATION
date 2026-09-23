import { useState } from 'react';
import './mini-home.css';
const photos = { product: '/assets/visual/product-master.png', understand: '/assets/visual/scene-understand.png', demonstration: '/assets/visual/scene-demonstration.png', touch: '/assets/visual/scene-touch.png' };
export default function MiniHome({ enter, count }: { enter: () => void; count: number }) {
    const [panel, setPanel] = useState('');
    const [slide, setSlide] = useState(0);
    const products = ['铜坐龙互动卡', '铜坐龙徽章', '铜坐龙挂件'];
    return <div className="mini-shell"><main className="mini-home">
        <section className={'mini-hero slide-' + slide} style={{ backgroundImage: `linear-gradient(90deg,#291a12c9,#291a1220),url('${slide ? photos.understand : photos.product}')` }}>
            <header><strong>博物馆探馆</strong><span>XXX省博物馆</span></header><p className="mini-tag">馆藏探索计划</p><h1>{slide ? '把今天的发现' : '与镇馆珍宝'}<br />{slide ? '收藏起来' : '相遇'}</h1><p>一条路线，六次发现</p><button className="mini-start" onClick={enter}>{count ? '继续探馆路线' : '开启探馆路线'} <span>→</span></button><div className="mini-dots">{[0, 1].map(n => <button key={n} aria-label={`切换主视觉${n + 1}`} aria-pressed={n === slide} onClick={() => setSlide(n)} />)}</div>
        </section>
        <div className="mini-content"><div className="mini-section-title"><h2>精选路线</h2><button onClick={() => setPanel('路线')}>全部路线 ›</button></div>
            <div className="mini-routes"><button onClick={enter} style={{ backgroundImage: `linear-gradient(0deg,#20170be8,transparent),url('${photos.demonstration}')` }}><span className="mini-tag">经典路线</span><strong>镇馆珍宝探索线</strong><small>6件馆藏 · 六种互动</small><i>›</i></button><button onClick={() => setPanel('亲子路线')} style={{ backgroundImage: `linear-gradient(0deg,#20170be8,transparent),url('${photos.understand}')` }}><span className="mini-tag">亲子路线 · 待开放</span><strong>亲子发现之旅</strong><small>边看边玩 · 共享发现</small><i>›</i></button></div>
            <button className="mini-equipment" onClick={() => setPanel('探索装备')}><img src={photos.touch} alt="铜坐龙文创与感应装置" /><span><strong>我的探索装备</strong><span>让文创陪你探馆</span><small>了解感应互动玩法</small></span><b>›</b></button>
            <div className="mini-section-title" id="mini-products"><h2>更多互动文创</h2><button onClick={() => setPanel('互动文创')}>查看更多 ›</button></div><div className="mini-products">{products.map((name, i) => <button key={name} onClick={() => setPanel(name)}><div className={'mini-product-image item-' + i}><span>互动</span></div><strong>{name}</strong><small>了解互动内容</small></button>)}</div>
        </div><nav className="mini-nav" aria-label="首页导航">{['首页', '路线', '藏章', '文创', '我的'].map((name, i) => <button key={name} aria-current={i === 0 ? 'page' : undefined} onClick={() => i === 0 ? window.scrollTo({ top: 0, behavior: 'smooth' }) : i === 3 ? document.getElementById('mini-products')?.scrollIntoView({ behavior: 'smooth' }) : setPanel(name)}><span aria-hidden="true">{['⌂', '◇', '▥', '▢', '♙'][i]}</span>{name}</button>)}</nav>
        {panel && <div className="mini-backdrop" onClick={() => setPanel('')}><section className="mini-dialog" role="dialog" aria-modal="true" aria-label={panel} onClick={e => e.stopPropagation()}><button autoFocus className="mini-close" aria-label="关闭" onClick={() => setPanel('')}>×</button><h2>{panel}</h2><p>{panel === '亲子路线' ? '亲子主题路线筹备中。现在可以体验镇馆珍宝探索线，与家人一起完成六站互动。' : panel === '藏章' || panel === '我的' ? `你已收集 ${count} / 6 枚印章。进入探馆路线后，可在印章册查看成就和纪念卡。` : panel === '探索装备' ? '现场如已配置感应设备，可使用文创参与互动。当前页面支持直接进入六站体验；设备绑定及实时感应需由场馆系统接入。' : panel === '路线' ? '镇馆珍宝探索线包含寻迹观察、纹饰配对、纪念创作、印章对位、化石拂尘和文句排序。' : '铜坐龙主题互动文创设计展示。互动卡、徽章与挂件的实物信息及购买方式以场馆公告为准。'}</p><button className="mini-start" onClick={enter}>进入探馆路线 →</button></section></div>}
    </main></div>
}

