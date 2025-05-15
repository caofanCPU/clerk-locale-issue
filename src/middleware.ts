import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { appConfig } from "@/lib/appConfig";
import { clerkMiddleware, ClerkMiddlewareAuth, createRouteMatcher } from '@clerk/nextjs/server';

const intlMiddleware = createMiddleware({
  // 多语言配置
  locales: appConfig.i18n.locales,

  // 默认语言配置
  defaultLocale: appConfig.i18n.defaultLocale,
  localePrefix: "always", // 改为 always，确保始终使用语言前缀
  localeDetection: false  // 添加此配置以禁用自动语言检测
});


const allowPassWhitelist = createRouteMatcher(['/(.*)'])

export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
  if (!allowPassWhitelist(req)) {
    const { userId, redirectToSignIn } = await auth()
    if (!userId) {
      return redirectToSignIn()
    }
    console.log('User is authorized:', userId)
  }
  if (req.nextUrl.pathname === '/') {
    const defaultLocale = appConfig.i18n.defaultLocale;
    return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url), 301);
  }

  // 处理尾部斜杠的重定向
  if (req.nextUrl.pathname.length > 1 && req.nextUrl.pathname.endsWith('/')) {
    const newUrl = new URL(req.nextUrl.pathname.slice(0, -1), req.url);
    return NextResponse.redirect(newUrl, 301);
  }

  return intlMiddleware(req);
}, { debug: appConfig.clerk.debug })

export const config = {
  matcher: [
    // 修改 matcher 配置以确保正确匹配所有路由
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};