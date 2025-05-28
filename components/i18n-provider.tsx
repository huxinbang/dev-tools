"use client"

import type { ReactNode } from "react"
import { I18nContext, type Language, translations } from "@/lib/i18n"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useLocalStorage<Language>("dev-tools-language", "en")

  const value = {
    language,
    setLanguage,
    t: translations[language],
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
