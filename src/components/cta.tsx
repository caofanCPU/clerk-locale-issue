'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useTranslations } from 'next-intl'

export function CTA() {
  const t = useTranslations('cta');
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t('title')} <span className="text-purple-400">{t('eyesOn')}</span>?
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          {t('description1')}
          <br />
          {t('description2')}
        </p>
        <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
          <Link href="https://preview.reve.art/" target="_blank" rel="noopener noreferrer">
            {t('button')} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

