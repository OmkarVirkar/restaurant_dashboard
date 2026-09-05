import Link from "next/link";

import type { Locale } from "@/assets/login-content";

const options: Locale[] = ["en", "hi"];

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-100/80 p-1 shadow-inner shadow-stone-200/60">
      {options.map((option) => {
        const href = option === "en" ? "/login" : "/login?locale=hi";
        const label = option === "en" ? "EN" : "हिं";

        return (
          <Link
            key={option}
            href={href}
            aria-pressed={locale === option}
            className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all duration-200 ${
              locale === option
                ? "bg-white text-stone-900 shadow-sm ring-1 ring-stone-200"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
