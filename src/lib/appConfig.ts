export const appConfig = {
  // 基础配置
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',

  i18n: {
    locales: ["en", "zh", "ja", "fr"] as const,
    defaultLocale: "en" as const,
    localeLabels: {
      en: "English",
      zh: "简体中文",
      ja: "日本語",
      fr: "Français",
    },
    messageRoot: 'messages',
  },
  clerk: {
    debug: false,
  },
};

// 辅助函数：检查是否为支持的语言
function isSupportedLocale(locale: string): locale is typeof appConfig.i18n.locales[number] {
  return (appConfig.i18n.locales as readonly string[]).includes(locale);
}

// 辅助函数：获取有效的语言设置
// 如果当前语言不支持，则返回默认语言
export function getValidLocale(locale: string): typeof appConfig.i18n.locales[number] {
  return isSupportedLocale(locale) ? locale : appConfig.i18n.defaultLocale;
}