import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from './ru.json'
import en from './en.json'

i18n
  .use(initReactI18next)
  .init({
    resources: { ru: { translation: ru }, en: { translation: en } },
    lng: 'ru',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

// Sync language with persisted GlobalSettings.Localization
;(async () => {
  try {
    // @ts-expect-error preload bridge
    const state = await window.api?.state?.get?.()
    if (state && typeof state.globalSettings?.Localization === 'number') {
      const lng = state.globalSettings.Localization === 0 ? 'ru' : 'en'
      i18n.changeLanguage(lng)
    }
  } catch {}
})()

export default i18n