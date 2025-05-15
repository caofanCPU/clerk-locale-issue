'use client'

import { Zap } from "lucide-react"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useTranslations } from 'next-intl'
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from "next/link"
export function Header() {
  const t = useTranslations('home');

  return (
    <header className="container mx-auto py-2 px-2 flex justify-between items-center border border-purple-200 rounded-full mt-4">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-purple-500" />
          <span className="text-xl font-bold">{t('title')}</span>
        </div>
      </Link>

      <div className="ms-1.5 flex justify-end items-center gap-2 h-10 me-3 divide-x divide-border">
        <ClerkLoading>
          <div className="w-24 h-9 px-2 border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 rounded-full animate-pulse"></div>
          <div className="w-24 h-9 px-2 border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 rounded-full animate-pulse"></div>
        </ClerkLoading>
        <ClerkLoaded>
          <SignedOut>
            <SignInButton>
              <button className="w-24 h-9 px-2 border border-gray-300 rounded-full hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 text-center text-sm">
                {t('signIn')}
              </button>
            </SignInButton>

            <SignUpButton>
              <button className="w-24 h-9 px-2 border border-gray-300 rounded-full hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 text-center text-sm">
                {t('signUp')}
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8 border",
                }
              }}
            >
            </UserButton>
          </SignedIn>
        </ClerkLoaded>
        <LanguageSwitcher />
      </div>
    </header>
  )
}

