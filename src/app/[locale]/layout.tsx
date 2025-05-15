import { appConfig } from "@/lib/appConfig";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import './globals.css'
import { ClerkProvider } from "@clerk/nextjs";
import { enUS, zhCN, frFR, jaJP } from '@clerk/localizations'
import { shadesOfPurple, dark } from '@clerk/themes'
export const dynamic = 'force-dynamic'

// 网站元数据
export async function generateMetadata({
  params: paramsPromise
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await paramsPromise;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    title: t('title'),
    metadataBase: new URL(appConfig.baseUrl),
    icons: [
      { rel: "icon", type: 'image/png', sizes: "16x16", url: "/favicon-16x16.png" },
      { rel: "icon", type: 'image/png', sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", type: 'image/ico', url: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon-180x180.png" },
      { rel: "android-chrome", sizes: "512x512", url: "/favicon-512x512.png" },
    ]
  }
}

const clerkIntl = {
  en: enUS,
  zh: zhCN,
  fr: frFR,
  ja: jaJP,
}


export default async function RootLayout({
  children,
  params: paramsPromise  // 重命名参数
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await paramsPromise;  // 使用新名称
  setRequestLocale(locale);
  const messages = await getMessages();
  const signInUrlWithLocale = `/${locale}/sign-in`;
  const signUpUrlWithLocale = `/${locale}/sign-up`;
  const signInFallbackRedirectUrlWithLocale = `/${locale}`;
  const signUpFallbackRedirectUrlWithLocale = `/${locale}`;
  const currentLocalization = clerkIntl[locale as keyof typeof clerkIntl];

  console.log(`ClerkProviderClient - signInUrl for ClerkProvider: ${signInUrlWithLocale}`);
  console.log(`ClerkProviderClient - signUpUrl for ClerkProvider: ${signUpUrlWithLocale}`);
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
    >
      <html lang={locale} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <body>
            {children}
          </body>
        </NextIntlClientProvider>
      </html>
    </ClerkProvider>

  )
}
