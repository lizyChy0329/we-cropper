import { ref, computed } from 'vue'
import { createI18n } from 'vue-i18n'
import type { LocaleCode, LocaleConfig, LocaleMessages } from '../types/locale'
import messages from '../locales'

const defaultLocale: LocaleCode = 'en'

export function useLocale(config: LocaleConfig = {}) {
  const { locale = defaultLocale, fallbackLocale = 'en', customLocale = {} } = config
  
  // 合并自定义语言包
  const mergedMessages = {
    ...messages,
    ...customLocale
  }
  
  const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale,
    messages: mergedMessages
  })
  
  const currentLocale = ref<LocaleCode>(locale)
  
  const setLocale = (newLocale: LocaleCode) => {
    currentLocale.value = newLocale
    i18n.global.locale.value = newLocale
  }
  
  const t = (key: string) => {
    return i18n.global.t(key)
  }
  
  const mergeCustomLocale = (customMessages: Partial<Record<LocaleCode, Partial<LocaleMessages>>>) => {
    Object.keys(customMessages).forEach((localeKey) => {
      const localeCode = localeKey as LocaleCode
      if (mergedMessages[localeCode]) {
        mergedMessages[localeCode] = {
          ...mergedMessages[localeCode],
          ...customMessages[localeCode]
        }
      } else {
        mergedMessages[localeCode] = customMessages[localeCode] as LocaleMessages
      }
    })
    
    // 更新i18n实例的消息
    i18n.global.setLocaleMessage(locale, mergedMessages[locale])
  }
  
  return {
    currentLocale: computed(() => currentLocale.value),
    setLocale,
    t,
    mergeCustomLocale,
    i18n
  }
}