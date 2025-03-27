'use client'

import { Zap } from "lucide-react"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useTranslations } from 'next-intl'

export function Header() {
  const t = useTranslations('home');

  return (
    <header className="container mx-auto py-6 px-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6 text-purple-500" />
        <span className="text-xl font-bold">{t('title')}</span>
      </div>
      <LanguageSwitcher />
    </header>
  )
}

