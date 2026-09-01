'use client';

import { useState } from 'react';

const translations = {
  en: {
    restaurant: 'Restaurant',
    welcome: 'Welcome',
    heroTitle: 'Welcome back, chef.',
    heroText: 'Run the floor, manage reservations, and keep your service moving smoothly.',
    dashboard: 'Dashboard',
    admin: 'Admin access',
    signIn: 'Sign in',
    manage: 'Manage your restaurant',
    email: 'Email address',
    password: 'Password',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    submit: 'Sign in to dashboard',
    divider: 'or continue with',
    invite: 'Need access?',
    inviteAction: 'Request admin invite',
    placeholderEmail: 'name@restaurant.com',
    placeholderPassword: 'Enter your password',
  },
  hi: {
    restaurant: 'रेस्टोरेंट',
    welcome: 'स्वागत',
    heroTitle: 'फिर से स्वागत है, शेफ।',
    heroText: 'फ्लोर संभालें, रिज़र्वेशन प्रबंधित करें और अपनी सेवा को सुचारू रखें।',
    dashboard: 'डैशबोर्ड',
    admin: 'एडमिन एक्सेस',
    signIn: 'साइन इन',
    manage: 'अपने रेस्टोरेंट का प्रबंधन करें',
    email: 'ईमेल पता',
    password: 'पासवर्ड',
    remember: 'मुझे याद रखें',
    forgot: 'पासवर्ड भूल गए?',
    submit: 'डैशबोर्ड में साइन इन करें',
    divider: 'या इसके साथ जारी रखें',
    invite: 'एक्सेस की जरूरत है?',
    inviteAction: 'एडमिन इनवाइट का अनुरोध करें',
    placeholderEmail: 'name@restaurant.com',
    placeholderPassword: 'अपना पासवर्ड लिखें',
  },
} as const;

type Language = keyof typeof translations;

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const t = translations[language];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fff7ed_0%,_#fffdf9_24%,_#fef3c7_52%,_#f5f5f4_100%)] px-4 py-8 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[32px] border border-amber-200/80 bg-white/80 shadow-[0_30px_80px_rgba(120,53,15,0.15)] backdrop-blur-xl md:grid-cols-[0.9fr_1.1fr]">
          <section className="relative hidden overflow-hidden bg-[#1b120a] p-10 text-white md:flex md:flex-col md:justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,146,60,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(253,224,71,0.12),_transparent_24%)]" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 font-bold text-stone-950 shadow-lg shadow-orange-500/20">
                  S
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-stone-300">
                    {t.restaurant}
                  </p>
                  <p className="text-lg font-medium text-white">Saffron & Ember</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-200/80">
                  {t.welcome}
                </p>
                <h1 className="text-4xl font-light leading-tight tracking-[-0.05em] text-white lg:text-5xl">
                  {t.heroTitle}
                </h1>
              </div>

              <div className="h-px w-20 bg-gradient-to-r from-amber-300 to-transparent" />

              <p className="max-w-sm text-sm leading-7 text-stone-300">
                {t.heroText}
              </p>
            </div>
          </section>

          <section className="bg-[#fffaf5] p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-base font-bold text-white shadow-lg shadow-orange-400/30">
                  S
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
                    {t.dashboard}
                  </p>
                  <p className="text-sm font-semibold text-stone-800">{t.admin}</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100/80 p-1 shadow-inner shadow-stone-200/60">
                {(['en', 'hi'] as Language[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setLanguage(option)}
                    className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
                      language === option
                        ? 'bg-white text-stone-900 shadow-sm ring-1 ring-stone-200'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {option === 'en' ? 'EN' : option === 'hi' ? 'हिं' : 'मराठी'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8 space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-700">
                {t.signIn}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
                {t.manage}
              </h2>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-stone-700">
                  {t.email}
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-stone-400" aria-hidden="true">
                    <path d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Zm2.1-.25 6.9 5.12 6.9-5.12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    placeholder={t.placeholderEmail}
                    className="w-full border-0 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-stone-700">
                  {t.password}
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-stone-400" aria-hidden="true">
                    <path d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    placeholder={t.placeholderPassword}
                    className="w-full border-0 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <label className="inline-flex items-center gap-2 text-stone-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                  {t.remember}
                </label>
                <a href="#" className="font-medium text-amber-700 transition hover:text-amber-800">
                  {t.forgot}
                </a>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:translate-y-[-1px] hover:shadow-xl hover:shadow-orange-500/30"
              >
                {t.submit}
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-stone-200" />
              <span className="text-xs uppercase tracking-[0.25em] text-stone-400">{t.divider}</span>
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.4-1.7 4.1-5.4 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.6C16.9 3.4 14.7 2.5 12 2.5A9.5 9.5 0 0 0 2.5 12a9.5 9.5 0 0 0 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12Z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="#1877F2" d="M13.5 21v-8.5h2.8l.4-3.2h-3.2V7.2c0-.9.3-1.6 1.7-1.6H17V2.6c-.4-.1-1.7-.2-3.2-.2-3.2 0-5.4 1.9-5.4 5.5v2.1H6.6v3.2h1.8V21h5.1Z"/>
                </svg>
                Facebook
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-stone-500">
              {t.invite}{' '}
              <a href="#" className="font-semibold text-amber-700 hover:text-amber-800">
                {t.inviteAction}
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
