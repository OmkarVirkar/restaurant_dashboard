import { DashboardShell } from "@/components/dashboard-shell";
import type { Locale } from "@/types/login";

type DashboardPageProps = {
  searchParams?: Promise<{ locale?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = (await searchParams) ?? {};
  const locale: Locale = params.locale === "hi" ? "hi" : "en";

  return <DashboardShell initialLocale={locale} />;
}
