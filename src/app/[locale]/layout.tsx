import { appConfig } from "@/lib/appConfig";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale, getTranslations } from 'next-intl/server';
import './globals.css'
import { GoogleAnalyticsScript } from "@/components/script/GoogleAnalyticsScript";

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
    title: t('webTitle'),
    description: t('webDescription'),
    keywords: t('keywords'),
    metadataBase: new URL(appConfig.baseUrl),
    alternates: {
      canonical: `${appConfig.baseUrl}/${locale}`,
      languages: {
        "en": `${appConfig.baseUrl}/en`,
        "zh": `${appConfig.baseUrl}/zh`,
        "ja": `${appConfig.baseUrl}/ja`,
        "ko": `${appConfig.baseUrl}/ko`,
        "fr": `${appConfig.baseUrl}/fr`,
        "de": `${appConfig.baseUrl}/de`,
        "es": `${appConfig.baseUrl}/es`,
        "it": `${appConfig.baseUrl}/it`,
        "pt": `${appConfig.baseUrl}/pt`,
        "tr": `${appConfig.baseUrl}/tr`,
        "pl": `${appConfig.baseUrl}/pl`,
      }
    },
    icons: [
      { rel: "icon", type: 'image/png', sizes: "16x16", url: "/favicon-16x16.png" },
      { rel: "icon", type: 'image/png', sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", type: 'image/ico', url: "/favicon.ico" },
      { rel: "apple-touch-icon", sizes: "180x180", url: "/favicon-180x180.png" },
      { rel: "android-chrome", sizes: "512x512", url: "/favicon-512x512.png" },
    ]
  }
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
  return (
    <html lang={locale} suppressHydrationWarning>
      <NextIntlClientProvider messages={messages}>
        <body>{children}</body>
        <GoogleAnalyticsScript />
      </NextIntlClientProvider>
    </html>
  )
}
