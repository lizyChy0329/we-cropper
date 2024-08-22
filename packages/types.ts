export interface WeCropperOptions {
  /**
   * A base64string created from File
   *
   * @remarks Can use utils/fileToBase64 methods to transform
   */
  src: string

  /**
   * Like teleport API in Vue3
   *
   * @default document.body
   */
  el?: HTMLElement | string

  /**
   * Cropper box aspect-ratio controll
   *
   * @default 1 / 1
   */
  aspectRatio?: number
}

export type UseCropperOptions = Omit<WeCropperOptions, 'src'>
