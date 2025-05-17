"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { enUS, zhCN, frFR, jaJP } from '@clerk/localizations';
import { shadesOfPurple, dark } from '@clerk/themes';
import React, { useEffect } from "react";

const clerkIntl = {
  en: enUS,
  zh: zhCN,
  fr: frFR,
  ja: jaJP,
};

export default function ClerkProviderClient({ locale, children }: { locale: string; children: React.ReactNode }) {
  const signInUrlWithLocale = `/${locale}/sign-in`;
  const signUpUrlWithLocale = `/${locale}/sign-up`;
  const signInFallbackRedirectUrlWithLocale = `/${locale}`;
  const signUpFallbackRedirectUrlWithLocale = `/${locale}`;
  const currentLocalization = clerkIntl[locale as keyof typeof clerkIntl];

  // 日志方便调试
  console.log("[ClerkProviderClient] locale props value:", locale);
  console.log("[ClerkProviderClient] signInUrl prop value:", signInUrlWithLocale);
  console.log("[ClerkProviderClient] signUpUrl prop value:", signUpUrlWithLocale);

  useEffect(() => {
    console.log(`[ClerkProviderClient] locale changed to: ${locale}, component re-rendered!`);
  }, [locale]);

  return (
    <ClerkProvider
      signInUrl={signInUrlWithLocale}
      signUpUrl={signUpUrlWithLocale}
      signInFallbackRedirectUrl={signInFallbackRedirectUrlWithLocale}
      signUpFallbackRedirectUrl={signUpFallbackRedirectUrlWithLocale}
      localization={currentLocalization}
      appearance={{
        signIn: { baseTheme: shadesOfPurple },
        signUp: { baseTheme: dark },
      }}
      key={locale}
    >
      {children}
    </ClerkProvider>
  );
} 