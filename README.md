**Incorrect Post Locale info in `SignInButton`  with `next-intl` (`localePrefix: "always"`)**

**Description:**
When using `@clerk/nextjs` for authentication in a Next.js application that is internationalized by `next-intl` (specifically configured with `localePrefix: "always"` in `middleware.ts`), When jumping to a custom login page by clicking the `SignInButton`, the right language prefix(such as `fr`) of the page is incorrectly changed to the default language prefix (`en`).

**Steps to reproduce:**

1.  **Setup Project:**
> Note: [The example code](https://github.com/caofanCPU/clerk-locale-issue) I provided can be run directly to help quickly reproduce and identify the issue. The following are key points about the code configuration:
*   Initialize a Next.js (App Router) project.
*   Integrate `@clerk/nextjs` for authentication as per Clerk's documentation.
*   Integrate `next-intl` for internationalization. Configure `next-intl`'s `middleware.ts` with 4 locales (`locales: ['en', 'zh', 'fr', 'jp']`), a `defaultLocale` (`'en'`), and importantly, `localePrefix: "always"`.
*   Implement a sign-in mechanism using Clerk's `<SignInButton />` component. This button might:
    *   Lead to a custom sign-in page (e.g., `app/[locale]/sign-in/[[...sign-in]]/page.tsx`) that renders Clerk's `<SignIn/>` component.
* In `src/[locale]/layout.tsx`, URL configurations related to login (e.g., `signInUrl`, `signUpUrl`, `afterSignInUrl`, `afterSignUpUrl`) have been made for `ClerkProvider`. Local environment variables for these have also been configured (e.g., in a `.env.local.txt` file in the project root, which should be renamed to `.env.local`).
* Logging has been added at the `ClerkProvider` and `SignInButton` locations to observe how the current `locale` is passed and handled.

1.  **Initiate Sign-In from a Non-Default Locale:**
    *   Start the application. Wait for the homepage to render. You will notice the default locale is `en` and the browser URL is `http://localhost:3000/en`.
    *   Then, **`switch the language`**, for example, change to 'fr'. You will see that the page text is translated to French, and the browser URL also changes to `http://localhost:3000/fr`.

2.  **Perform Sign-In:**
    *   Click the `<SignInButton />`.
    *   Observe the browser's address bar. The URL becomes something like: `http://localhost:3000/en/sign-up?sign_up_fallback_redirect_url=http://localhost:3000/en&sign_in_fallback_redirect_url=http://localhost:3000/en&`**`redirect_url=http://localhost:3000/fr`**.
    *   It's then observed that although the originating page's language prefix was 'fr', clicking the sign-in button redirects to an incorrect English interface (e.g., Clerk's sign-up or sign-in page shows up in English, based on the `/en/sign-up` path segment).

3.  If, in **Step 2**, we **manually force a page refresh after switching the language** (while the URL is, e.g., `http://localhost:3000/fr`), then in Step 3, clicking the `<SignInButton />` yields the correct result: navigating from an 'fr' page correctly leads to an 'fr' sign-in interface (e.g. `http://localhost:3000/fr/sign-in?...`).
4.  Furthermore, the sign-in/sign-up card on Clerk's UI correctly updates its text translations after a language switch (if the card itself is re-rendered in the correct locale context). For example, the sign-up button on an 'fr' sign-in card correctly points to an 'fr' sign-up URL, and vice-versa. This suggests Clerk's UI components themselves can be locale-aware if the initial navigation to them includes the correct locale prefix.
5.  **Conclusion:**
      * Based on observations and logs, the configured sign-in/sign-up URLs (e.g., `signInUrl="/sign-in"`) are correctly passed to `ClerkProvider`.
      * If the page is force-refreshed after switching the language but *before* clicking the `SignInButton`, the subsequent sign-in flow respects the current locale.
      * The issue seems to lie within the internal state or redirection handling of `ClerkProvider` or `SignInButton` when the locale changes dynamically on the client-side without a full page reload. It might be that an initial (potentially default) locale context is cached or latched onto, and not properly updated when `SignInButton` constructs its navigation URL for the sign-in/sign-up flow.
6.  I have tried adding a `key` prop (e.g., `key={locale}`) to `ClerkProvider` and `SignInButton` to force re-rendering when the locale changes, but these attempts were unsuccessful in resolving the issue.