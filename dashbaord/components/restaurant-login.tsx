import { translations } from "@/assets/login-content";
import type { Locale } from "@/types/login";

import { BrandMark } from "./brand-mark";
import { LanguageSwitcher } from "./language-switcher";
import { RequestAccessModal } from "./request-access-modal";
import { LoginForm } from "./login-form";

export type RestaurantLoginProps = {
  locale?: Locale;
};

export function RestaurantLogin({ locale = "en" }: RestaurantLoginProps) {
  const t = translations[locale];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#fffdf9_24%,_#fef3c7_52%,_#f5f5f4_100%)] px-4 py-8 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-amber-200/80 bg-white/80 shadow-[0_30px_80px_rgba(120,53,15,0.15)] backdrop-blur-xl md:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden overflow-hidden bg-[#1b120a] p-10 text-white md:flex md:flex-col md:justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(253,224,71,0.12),_transparent_24%)]" />

            <div className="relative z-10 space-y-6">
              <BrandMark inverse label={t.restaurant} />

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/80">{t.welcome}</p>
                <h1 className="text-4xl font-light leading-tight tracking-[-0.05em] text-white lg:text-5xl">
                  {t.heroTitle}
                </h1>
              </div>

              <div className="h-px w-20 bg-gradient-to-r from-amber-300 to-transparent" />

              <p className="max-w-sm text-sm leading-7 text-stone-300">{t.heroText}</p>
            </div>
          </section>

          <section className="bg-[#fffaf5] p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-base font-bold text-white shadow-lg shadow-orange-400/30">
                  S
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-500">{t.dashboard}</p>
                  <p className="text-sm font-semibold text-stone-800">{t.admin}</p>
                </div>
              </div>

              <LanguageSwitcher locale={locale} />
            </div>

            <div className="mb-8 space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-700">{t.signIn}</p>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900">{t.manage}</h2>
            </div>

            <LoginForm content={t} locale={locale} />

            <RequestAccessModal content={t} />
          </section>
        </div>
      </div>
    </main>
  );
}
