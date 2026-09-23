// export async function addWatermark(
//     photoDataUrl: string,
//     opts: { symbol: string; color: string; title: string; time?: string },
//   ): Promise<string> {
//     const img = await loadImage(photoDataUrl)
//     const canvas = document.createElement("canvas")
//     canvas.width = img.width
//     canvas.height = img.height
//     const ctx = canvas.getContext("2d")!
//     ctx.drawImage(img, 0, 0)
  
//     const pad = Math.round(canvas.width * 0.04)
//     const R = Math.round(canvas.width * 0.1)
//     const cx = canvas.width - pad - R
//     const cy = canvas.height - pad - R
  
//     // 圆形印章
//     ctx.beginPath()
//     ctx.arc(cx, cy, R, 0, Math.PI * 2)
//     ctx.fillStyle = hexToRgba(opts.color, 0.8)
//     ctx.fill()
//     ctx.lineWidth = Math.max(2, canvas.width * 0.006)
//     ctx.strokeStyle = opts.color
//     ctx.stroke()
  
//     ctx.fillStyle = "#fff"
//     ctx.font = `bold ${R}px "SimHei", "Microsoft YaHei", sans-serif`
//     ctx.textAlign = "center"
//     ctx.textBaseline = "middle"
//     ctx.fillText(opts.symbol, cx, cy)
  
//     // 左下角文字
//     ctx.font = `${Math.round(canvas.width * 0.035)}px "SimHei", sans-serif`
//     ctx.textAlign = "left"
//     ctx.textBaseline = "bottom"
//     ctx.fillStyle = "rgba(255,255,255,0.9)"
//     ctx.fillText(opts.title, pad, canvas.height - pad)
//     if (opts.time) ctx.fillText(opts.time, pad, canvas.height - pad * 2.2)
  
//     return canvas.toDataURL("image/jpeg", 0.92)
//   }
  


export async function addWatermark(
    photoDataUrl: string,
    opts: { symbol: string; color: string; title: string; time?: string },
  ): Promise<string> {
    const img = await loadImage(photoDataUrl)
    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(img, 0, 0)
  
    const pad = Math.round(canvas.width * 0.04)
    const S = Math.round(canvas.width * 0.22)        // 方形印章边长
    const x = canvas.width - pad - S                 // 右下角
    const y = canvas.height - pad - S
  
    // ① 方形印章底：深色底
    ctx.fillStyle = hexToRgba("#2b1a14", 0.9)        // 深棕黑底
    ctx.fillRect(x, y, S, S)
  
    // ② 印章边框：铜金色
    ctx.lineWidth = Math.max(3, canvas.width * 0.005)
    ctx.strokeStyle = "#a8683a"                      // 仿古铜色
    ctx.strokeRect(x, y, S, S)
  
    // ③ 内部细线框（双线感）
    const inset = Math.round(S * 0.08)
    ctx.lineWidth = Math.max(1, canvas.width * 0.002)
    ctx.strokeRect(x + inset, y + inset, S - inset * 2, S - inset * 2)
  
    // ④ 印章文字：竖排两字（如「印」单独居中，或多字竖排）
    const chars = Array.from(opts.symbol)
    ctx.fillStyle = "#e8a05a"                        // 铜金色字
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    const fontSize = chars.length > 1
      ? Math.round(S / (chars.length + 0.5))
      : Math.round(S * 0.6)
    ctx.font = `bold ${fontSize}px "SimHei", "Microsoft YaHei", sans-serif`
  
    if (chars.length === 1) {
      // 单字：正中
      ctx.fillText(chars[0], x + S / 2, y + S / 2)
    } else {
      // 多字：竖排
      const step = S / (chars.length + 1)
      chars.forEach((ch, i) => {
        ctx.fillText(ch, x + S / 2, y + step * (i + 1))
      })
    }
  
    // ⑤ 左下角文字
    ctx.font = `${Math.round(canvas.width * 0.035)}px "SimHei", sans-serif`
    ctx.textAlign = "left"
    ctx.textBaseline = "bottom"
    ctx.fillStyle = "rgba(255,255,255,0.9)"
    ctx.fillText(opts.title, pad, canvas.height - pad)
    if (opts.time) ctx.fillText(opts.time, pad, canvas.height - pad * 2.2)
  
    return canvas.toDataURL("image/jpeg", 0.92)
  }


    function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((res, rej) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => res(img)
      img.onerror = rej
      img.src = src
    })
  }
  
  function hexToRgba(hex: string, a: number) {
    const h = hex.replace("#", "")
    return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`
  }