## Locale 切换问题：`SignInButton` 与 `next-intl` (`localePrefix: "always"`)

### 问题描述

在 Next.js 项目中集成 `@clerk/nextjs` 认证和 `next-intl` 国际化（`middleware.ts` 配置 `localePrefix: "always"`）时，点击 `<SignInButton />` 跳转自定义登录页时，URL 的语言前缀（如 `fr`）会被错误地替换为默认语言前缀（如 `en`）。

### 复现步骤

1. **项目配置**
   - 初始化 Next.js（App Router）。
   - 按官方文档集成 `@clerk/nextjs`。
   - 配置 `next-intl`，`middleware.ts` 设置 `locales: ['en', 'zh', 'fr', 'jp']`，`defaultLocale: 'en'`，`localePrefix: "always"`。
   - 使用 `<SignInButton />` 跳转自定义登录页（如 `app/[locale]/sign-in/[[...sign-in]]/page.tsx`，渲染 `<SignIn />`）。
   - 在 `src/[locale]/layout.tsx` 中为 `ClerkProvider` 配置登录相关 URL（如 `signInUrl` 等），并通过本地环境变量（`.env.local`）管理。
   - 在 `ClerkProvider` 和 `SignInButton` 处添加日志，观察 locale 传递情况。

2. **切换非默认语言**
   - 启动应用，首页默认 `en`，URL 为 `http://localhost:3000/en`。
   - 切换语言（如切换到 `fr`），URL 变为 `http://localhost:3000/fr`，页面文本变为法语。

3. **点击登录按钮**
   - 点击 `<SignInButton />`，跳转 URL 变为 `http://localhost:3000/en/sign-up?...&redirect_url=http://localhost:3000/fr`。
   - 登录页语言前缀错误，界面显示为英文（`/en/sign-up`），而不是法语。

4. **特殊情况**
   - 如果切换语言后**手动刷新页面**，再点击登录按钮，跳转 URL 和界面语言均正确（如 `http://localhost:3000/fr/sign-in?...`）。
   - Clerk 登录卡片本身能根据 locale 正确切换语言，说明 UI 组件是 locale-aware 的，只要初始 URL 正确。

5. **结论**
   - `ClerkProvider` 配置的登录 URL 能正确获取当前 locale，但**仅在刷新页面后生效**。
   - 问题疑似出在 `ClerkProvider` 或 `SignInButton` 在客户端动态切换 locale 时未及时响应，可能存在缓存或上下文未同步的问题。
   - 尝试为 `ClerkProvider` 和 `SignInButton` 添加 `key={locale}` 强制重渲染，未能解决。

### 其他探索

- 注释掉登录/注册 URL 配置无效，问题依旧。
- 日志显示 Clerk 会拉取 Dashboard 配置，测试发现：  
  代码中 `ClerkProvider` 的 `signInUrl` 配置优先级 > 环境变量 `NEXT_PUBLIC_CLERK_SIGN_IN_URL` > Clerk Dashboard 配置。

### 结论与建议

- 问题本质在于 `[locale]/layout.tsx` 中 `ClerkProvider` 的参数在切换语言后未及时更新，导致 URL 仍使用上一次的 locale。
- 若能了解 `ClerkProvider` 如何管理这些参数（如是否有缓存机制），或许能定位并修复问题。
- 目前可行的变通方案：使用 `<SignInButton mode="modal">` 以弹窗方式登录，可绕过该问题，但不理想。

