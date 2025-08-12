export type CropperShape = 'rectangle' | 'circle'

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

  /**
   * Cropper shape selection
   *
   * @default 'rectangle'
   */
  shape?: CropperShape

  /**
   * Locale configuration for internationalization
   *
   * @default 'en'
   */
  locale?: import('./types/locale').LocaleCode

  /**
   * Custom locale messages for internationalization
   */
  customLocale?: Partial<Record<import('./types/locale').LocaleCode, Partial<import('./types/locale').LocaleMessages>>>

  /**
   * loading text (deprecated, use locale instead)
   *
   * @default Loading...
   * @deprecated Use locale configuration instead
   */
  loadingText?: string

  /**
   * reset button text (deprecated, use locale instead)
   *
   * @default Reset
   * @deprecated Use locale configuration instead
   */
  resetText?: string

  /**
   * confirm button text (deprecated, use locale instead)
   *
   * @default Confirm
   * @deprecated Use locale configuration instead
   */
  confirmText?: string

  /**
   * cancel button text (deprecated, use locale instead)
   *
   * @default Cancel
   * @deprecated Use locale configuration instead
   */
  cancelText?: string
}

export type UseCropperOptions = Omit<WeCropperOptions, 'src'>
