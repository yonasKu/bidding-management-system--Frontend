"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const [locale, setLocale] = useState<'en' | 'am'>('en')

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'am' : 'en'
    setLocale(newLocale)
    // Store preference in localStorage
    localStorage.setItem('locale', newLocale)
    // Trigger page refresh or update context
    window.location.reload()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="ethiopic-text"
      title={locale === 'en' ? 'Switch to Amharic' : 'Switch to English'}
    >
      {locale === 'en' ? 'አማርኛ' : 'English'}
    </Button>
  )
}
