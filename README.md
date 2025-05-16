## Locale Switch Issue: `SignInButton` with `next-intl` (`localePrefix: "always"`)

### Description

When integrating `@clerk/nextjs` authentication and `next-intl` internationalization in a Next.js project (with `localePrefix: "always"` in `middleware.ts`), clicking the `<SignInButton />` to navigate to a custom sign-in page may result in the URL's locale prefix (e.g., `fr`) being incorrectly replaced by the default locale prefix (e.g., `en`).

### Steps to Reproduce

1. **Project Setup**
   - Initialize a Next.js (App Router) project.
   - Integrate `@clerk/nextjs` as per official documentation.
   - Configure `next-intl` with `middleware.ts` (`locales: ['en', 'zh', 'fr', 'jp']`, `defaultLocale: 'en'`, `localePrefix: "always"`).
   - Use `<SignInButton />` to navigate to a custom sign-in page (e.g., `app/[locale]/sign-in/[[...sign-in]]/page.tsx` rendering `<SignIn />`).
   - Configure sign-in related URLs (e.g., `signInUrl`) for `ClerkProvider` in `src/[locale]/layout.tsx`, managed via local environment variables (`.env.local`).
   - Add logging at `ClerkProvider` and `SignInButton` to observe locale handling.

2. **Switch to a Non-Default Locale**
   - Start the app; the homepage defaults to `en` (`http://localhost:3000/en`).
   - Switch the language (e.g., to `fr`); the URL updates to `http://localhost:3000/fr` and the page displays in French.

3. **Click the Sign-In Button**
   - Click `<SignInButton />`. The URL changes to `http://localhost:3000/en/sign-up?...&redirect_url=http://localhost:3000/fr`.
   - The sign-in page uses the wrong locale prefix (`/en/sign-up`), displaying the interface in English instead of French.

4. **Special Case**
   - If you **`manually refresh`** the page after switching the language, then click the sign-in button, the URL and interface use the correct locale (e.g., `http://localhost:3000/fr/sign-in?...`).
   - The Clerk sign-in card itself updates its language according to the locale, as long as the initial URL is correct.

5. **Conclusion**
   - The sign-in URLs configured in `ClerkProvider` correctly receive the current locale, but only after a page refresh.
   - The issue likely lies in `ClerkProvider` or `SignInButton` not updating promptly when the locale changes client-side, possibly due to caching or context synchronization issues.
   - Adding `key={locale}` to `ClerkProvider` and `SignInButton` to force re-rendering does not resolve the issue.

### Additional Findings

- Commenting out the sign-in/sign-up URL configuration does not resolve the issue.
- Logs show Clerk fetches configuration from the Dashboard. Testing reveals:
  - Code-level `signInUrl` in `ClerkProvider` has the highest priority,
  - Followed by the `NEXT_PUBLIC_CLERK_SIGN_IN_URL` environment variable,
  - Then the Clerk Dashboard configuration.

### Conclusion & Suggestions

- The root cause is that `ClerkProvider` parameters in `[locale]/layout.tsx` are not updated in time after switching locales, causing URLs to use the previous locale.
- Understanding how `ClerkProvider` manages these parameters (e.g., caching) may help locate and fix the issue.
- A current workaround: use `<SignInButton mode="modal">` for modal-based sign-in, which avoids the issue but may not be ideal.
