export interface LocaleMessages {
  loading: string
  reset: string
  confirm: string
  cancel: string
  rotate: string
  error: {
    loadImage: string
    cropImage: string
  }
  tooltip?: {
    rotate: string
    reset: string
  }
}

export type LocaleCode = 'en' | 'zh-CN' | 'zh-TW' | 'ja' | 'ko' | 'fr' | 'de' | 'es'

export interface LocaleConfig {
  locale?: LocaleCode
  fallbackLocale?: LocaleCode
  customLocale?: Partial<Record<LocaleCode, Partial<LocaleMessages>>>
}