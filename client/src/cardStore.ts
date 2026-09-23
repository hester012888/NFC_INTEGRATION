// IndexedDB 数据库名（v2 表示版本，改版本可触发升级）
const DB_NAME = 'longbo_souvenirs_v2';
import imgE03_2 from "./assets/exhibits/E03-2.png"

/**
 * 打开（或创建）IndexedDB 数据库
 * - 首次打开会触发 onupgradeneeded，创建对象仓库 'cards'
 * - 成功返回 db 实例，失败 reject
 */
function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    // 首次创建或版本升级时调用，建一个 key-value 存储
    request.onupgradeneeded = () => request.result.createObjectStore('cards');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * 保存卡片 dataURL
 * @param data 图片 dataURL
 * @param key  存储键，默认 'E03'（对应蚕织图展品）
 */
export async function saveCard(data: string, key = 'E03') {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('cards', 'readwrite');
      tx.objectStore('cards').put(data, key);   // put：存在则覆盖，不存在则新增
      tx.oncomplete = () => resolve();          // 事务完成才算成功
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();                                 // 无论成功失败都关闭连接
  }
}

/**
 * 读取卡片 dataURL
 * @param key 存储键，默认 'E03'
 * @returns 找到返回 dataURL，否则 undefined
 */
export async function loadCard(key = 'E03'): Promise<string | undefined> {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction('cards').objectStore('cards').get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

/**
 * 清空所有卡片（重置演示数据时用）
 */
export async function clearCard() {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('cards', 'readwrite');
      tx.objectStore('cards').clear();          // clear：清空整个对象仓库
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

/**
 * 用 Canvas 生成纪念卡图片
 * @param name  署名
 * @param motif 纹样：'桑叶' | '丝线' | '织锦'
 * @returns PNG 的 dataURL
 */
export async function generateCard(name: string, motif: string): Promise<string> {
  // 等待自定义字体加载完成，否则 canvas 里画出来是默认字体
  await document.fonts.load('500 38px LongboHeiti');
  await document.fonts.ready;

  // 建画布：1080 × 1440（3:4 竖版）
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const c = canvas.getContext('2d');
  if (!c) throw new Error('无法创建画布');

  // ① 背景：米白填充
  c.fillStyle = '#f6f0e5';
  c.fillRect(0, 0, 1080, 1440);

  // ② 双层描边（外框 + 内框），营造"卡片"感
  c.strokeStyle = '#af8c55';
  c.lineWidth = 3;
  c.strokeRect(42, 42, 996, 1356);    // 外框
  c.strokeRect(58, 58, 964, 1324);    // 内框

  // ③ 深色装饰块（将要放纹样/插画的区域）
  c.fillStyle = '#493323';
  c.fillRect(90, 200, 900, 570);

  // ④ 裁剪到装饰块范围，在里面画纹样，超出部分自动裁掉
  c.save();
  c.beginPath();
  c.rect(90, 200, 900, 570);
  c.clip();

  c.strokeStyle = '#af8c55';
  c.lineWidth = 2;
  // 画 28 条纹样，根据 motif 画不同图案
  for (let i = 0; i < 28; i++) {
    c.beginPath();
    if (motif === '丝线') {
      // 丝线：贝塞尔曲线（波浪线）
      c.moveTo(90, 230 + i * 20);
      c.bezierCurveTo(350, 100 + i * 25, 700, 850 - i * 10, 990, 230 + i * 20);
    } else if (motif === '织锦') {
      // 织锦：横竖交叉的网格
      c.moveTo(90 + i * 40, 200); c.lineTo(90 + i * 40, 770);
      c.moveTo(90, 200 + i * 24); c.lineTo(990, 200 + i * 24);
    } else {
      // 桑叶（默认）：斜向椭圆叶形
      const x = 180 + (i % 7) * 120;
      const y = 290 + Math.floor(i / 7) * 125;
      c.ellipse(x, y, 24, 48, Math.PI / 4, 0, Math.PI * 2);
    }
    c.stroke();
  }
  c.restore();   // 恢复裁剪

  try {
    const motifSrc = motif === '丝线' ? '/assets/visual/motif-silk.png'
                   : motif === '织锦' ? '/assets/visual/motif-brocade.png'
                   : '/assets/visual/motif-leaf.png';
    const motifImg = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = motifSrc;
    });
    c.drawImage(motifImg, 90, 200, 900, 570);
  } catch { /* 图片缺失时保留纯色块 */ }

  //⑤ 叠加展品插画（从雪碧图 exhibit-atlas.png 里裁一块）
  // try {
  //   const art = await new Promise<HTMLImageElement>((resolve, reject) => {
  //     const image = new Image();
  //     image.onload = () => resolve(image);
  //     image.onerror = reject;
  //     // image.src = '/assets/visual/exhibit-atlas.png';
  //     image.src =imgE03_2
  //   });
  //   // 参数：源图区域(右 1/3 宽 × 上 1/2 高) → 目标位置(285,220) 尺寸 510×510
  //   c.drawImage(
  //     art,
  //     art.width * 2 / 3, 0, art.width / 3, art.height / 2,
  //     285, 220, 510, 510,
  //   );
  // } catch {
  //   /* 离线或素材缺失时，保留上面已画的纹样 */
  // }

    // ⑤ 叠加插画（整张图，cover 方式铺满深色块）
    try {
      const art = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = imgE03_2;
      });
  
      // 深色装饰块区域：x=90, y=200, w=900, h=570
      const bx = 90, by = 200, bw = 900, bh = 570;
  
      // 保持比例铺满（cover），多余部分裁掉
      const scale = Math.max(bw / art.width, bh / art.height);
      const dw = art.width * scale;
      const dh = art.height * scale;
  
      c.save();
      c.beginPath();
      c.rect(bx, by, bw, bh);
      c.clip();
      c.drawImage(art, bx + (bw - dw) / 2, by + (bh - dh) / 2, dw, dh);
      c.restore();
    } catch {
      /* 图片缺失时保留深色块 */
    }
  
  

  // 字体辅助函数：统一设置 canvas 的 font
  const font = (size: number, weight = 500) => {
    c.font = `${weight} ${size}px LongboHeiti, SimHei, "Microsoft YaHei", sans-serif`;
  };

  // ⑥ 文字层
  c.textAlign = 'center';

  c.fillStyle = '#493323';
  font(32);
  c.fillText('黑龙江省博物馆 · 探馆纪念', 540, 140);   // 顶部小标题

  font(66, 700);
  c.fillText('把时光，织成纪念', 540, 885);           // 主标题

  font(38);
  c.fillText('南宋《蚕织图》卷轴', 540, 965);          // 副标题

  // 纹样印记（红底白字小块）
  c.fillStyle = '#983f2b';
  c.fillRect(460, 1020, 160, 66);
  c.fillStyle = '#fff';
  font(30, 700);
  c.fillText(motif + '印记', 540, 1064);

  // 署名（最多 12 字）
  c.fillStyle = '#493323';
  font(44, 700);
  c.fillText(Array.from(name.trim() || '探馆旅人').slice(0, 12).join(''), 540, 1170);

  // 日期
  font(28);
  c.fillText(new Date().toLocaleDateString('zh-CN'), 540, 1230);

  // 底部小字
  c.fillStyle = '#806b52';
  font(24);
  c.fillText('由你亲手选择的纹样，收藏今天的相遇', 540, 1320);

  // ⑦ 输出 PNG dataURL
  return canvas.toDataURL('image/png');
}