'use client'

import { useTranslations } from "next-intl";
import { Header } from "@/components/header"

export default function Home() {
  const t = useTranslations('home');
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <div className="flex-1 flex items-center justify-center mt-50 text-9xl text-purple-400">
        <span>{t('section')}</span>
      </div>
    </div>
  )
}

