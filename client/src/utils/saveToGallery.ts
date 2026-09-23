export async function saveToGallery(
    dataUrl: string,
    filename: string,
  ): Promise<"saved" | "shared" | "failed"> {
    try {
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        const file = new File([blob], filename, { type: blob.type })
    
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: filename })
          return "shared"
        }
    
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
        if (isIOS) {
          const win = window.open()
          if (win) {
            win.document.body.innerHTML = `
              <p style="padding:16px;font-size:16px;color:#493323;text-align:center;">
                请长按下方图片 → 选择「存储到照片」
              </p>
              <img src="${dataUrl}" style="width:100%;display:block;" />
            `
            win.document.title = "保存图片"
            return "saved"
          }
        }
    
        const a = document.createElement("a")
        a.href = dataUrl
        a.download = filename
        a.click()
        return "saved"
      } catch {
        return "failed"
      }
  }