/**
 * @description: blob to base64
 * @param file
 */
export function fileToBase64(file: File): Promise<string> {
  if (!file) {
    throw new Error('file is required')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
  })
}

/**
 * @description: base64 to blob
 * @param base64String
 */
export function base64ToBlob(base64String: string): Promise<Blob> {
  if (!base64String) {
    throw new Error('base64String is required')
  }

  return new Promise((resolve, reject) => {
    try {
      const arr = base64String.split(',')
      const typeItem = arr[0]
      const mime = typeItem.match(/:(.*?);/)![1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }

      resolve(new Blob([u8arr], { type: mime }))
    }
    catch (error) {
      reject(error)
    }
  })
}

/**
 * img url to base64
 * @param url
 */
type Nullable<T> = T | null

export function urlToBase64(url: string, mineType?: string): Promise<string> {
  if (!url) {
    throw new Error('url is required')
  }

  return new Promise((resolve, reject) => {
    let canvas = document.createElement('canvas') as Nullable<HTMLCanvasElement>
    const ctx = canvas!.getContext('2d')

    const img = new Image()
    img.crossOrigin = ''

    img.onerror = function () {
      return reject(new Error(`Loading image failure`))
    }

    img.onload = function () {
      if (!canvas || !ctx) {
        return reject(new Error('Canvas create failure'))
      }

      canvas.height = img.height
      canvas.width = img.width
      ctx.drawImage(img, 0, 0)
      const dataURL = canvas.toDataURL(mineType || 'image/png')
      canvas = null
      resolve(dataURL)
    }
    img.src = url
  })
}
