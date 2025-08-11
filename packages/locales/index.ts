import en from './en'
import zhCN from './zh-CN'
import zhTW from './zh-TW'
import ja from './ja'
import ko from './ko'
import fr from './fr'
import de from './de'
import es from './es'

import type { LocaleMessages, LocaleCode } from '../types/locale'

export const messages: Record<LocaleCode, LocaleMessages> = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  ja,
  ko,
  fr,
  de,
  es
}

export default messages