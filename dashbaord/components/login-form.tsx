"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { LoginContent } from "@/types/login";
import { login, saveAuthSession } from "@/lib/auth-client";

import { FormField } from "./ui/form-field";

type LoginFormProps = {
  content: LoginContent;
  locale: "en" | "hi";
};

export function LoginForm({ content, locale }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const response = await login(email, password);
      saveAuthSession(response);
      localStorage.setItem("restaurant.locale", locale);
      router.push(`/dashboard?locale=${locale}`);
    } catch {
      setError(content.loginError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField id="email" name="email" type="email" label={content.email} placeholder={content.placeholderEmail} icon="mail" required />
      <FormField id="password" name="password" type="password" label={content.password} placeholder={content.placeholderPassword} icon="lock" required />

      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="inline-flex items-center gap-2 text-stone-600">
          <input name="remember" type="checkbox" className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
          {content.remember}
        </label>
        <a href="#" className="font-medium text-amber-700 transition hover:text-amber-800">{content.forgot}</a>
      </div>

      {error ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-px hover:shadow-xl disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? content.signingIn : content.submit}
      </button>
    </form>
  );
}
