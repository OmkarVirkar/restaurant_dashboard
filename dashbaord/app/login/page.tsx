import { RestaurantLogin } from "@/components/restaurant-login";

export type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const localeParam = typeof params.locale === "string" ? params.locale : "en";
  const locale = localeParam === "hi" ? "hi" : "en";

  return <RestaurantLogin locale={locale} />;
}
