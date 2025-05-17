# Locale 切换问题：`SignInButton` 与 `next-intl` (`localePrefix: "always"`)

## 问题描述

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


## 源码排查分析
基于源码版本`@clerk/nextjs@6.19.4`, [Clerk官方发布](https://github.com/clerk/javascript/releases/tag/%40clerk%2Fnextjs%406.19.4)

### 1. 问题根因

通过对 `ClerkProvider`、`SignInButton` 及 Clerk SDK 源码的深入分析，并结合实际调试和日志输出，**最终确认问题根因在于 Clerk JS SDK（`window.Clerk`）在客户端为全局单例**：

- `ClerkProvider`（无论 props 如何变化）在客户端只会初始化一次 window.Clerk 实例。
- **`window.Clerk` 是全局单例**，只要页面未刷新，所有登录相关配置（如 signInUrl、signUpUrl、localization 等）都不会因 React context 或 props 变化而更新。
- 这导致即使 locale 变化，ClerkProvider 传递的新 URL 也不会生效，SignInButton 依然使用旧的 URL。
- 只有在页面强制刷新（F5 或 window.location.href 跳转）后，window.Clerk 才会重新初始化，新的 locale 和 URL 配置才会生效。

### 2. 关键源码链路

- React SDK（@clerk/clerk-react）通过 IsomorphicClerk 单例管理 clerk-js 实例。
- clerk-js（@clerk/clerk-js）在浏览器环境下会把实例挂载到 window.Clerk，并且只会挂载一次。
- 登录 URL、localization 等配置参数存储在 window.Clerk.__unstable__options 中。
- 在浏览器控制台通过 `window.Clerk.buildSignInUrl()` 查看当前的登录 URL 配置, 或者服务端通过`useClerk().buildSignInUrl()`记录日志: 

### 3. 实际测试验证

- 日志显示：切换 locale 后，ClerkProvider 的 props 已经是新值，并且确认组件重新渲染，但 `window.Clerk` 里的 URL 依然是旧的（如 `/ja/sign-in`）。
- 只有刷新页面后，`window.Clerk` 才会用新 locale 初始化，URL 才会变为 `/zh/sign-in`。
- 见下图测试截图，红框部分即为 window.Clerk 仍然持有旧 locale 的 URL。

![window.Clerk 单例副作用截图](./your-screenshot-path.png)

### 4. 调试与验证方法

- 留意控制台输出, 查看当前生效的登录 URL 和多语言配置
- 切换 locale 后不刷新页面，URL 不变；刷新后 URL 正确

### 5. 结论与建议

- **本质原因：`window.Clerk` 全局单例，props/context 变化不会触发 SDK 重新初始化**
- 短期方案：切换 locale 时强制刷新页面，或使用 modal 模式登录（mode="modal"），暂时绕过该问题
- 长期方案：等待Clerk官方确认处理
- 降级方案: 若能接受降低一点用户体验，直接跳转到**默认语言**登录页面，由用户手动切换语言
