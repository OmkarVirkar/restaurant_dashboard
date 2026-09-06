"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import { dashboardTranslations } from "@/assets/dashboard-content";
import { clearAuthSession, getCurrentUser, logout } from "@/lib/auth-client";
import type { AuthenticatedUser } from "@/types/auth";
import type { DashboardContent, DashboardView } from "@/types/dashboard";
import type { Locale } from "@/types/login";

import { BrandMark } from "./brand-mark";
import { LanguageSwitcher } from "./language-switcher";

type DashboardShellProps = { initialLocale: Locale };

const views: Array<{ id: DashboardView; icon: string }> = [
  { id: "overview", icon: "grid" },
  { id: "reservations", icon: "calendar" },
  { id: "menu", icon: "book" },
  { id: "sales", icon: "chart" },
];

export function DashboardShell({ initialLocale }: DashboardShellProps) {
  const router = useRouter();
  const locale = useSyncExternalStore(
    () => () => undefined,
    () => {
      const storedLocale = localStorage.getItem("restaurant.locale");
      return storedLocale === "hi" ? "hi" : "en";
    },
    () => initialLocale,
  );
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [view, setView] = useState<DashboardView>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const content = dashboardTranslations[locale];

  useEffect(() => {
    const storedLocale = localStorage.getItem("restaurant.locale");

    getCurrentUser()
      .then(setUser)
      .catch(() => {
        clearAuthSession();
        router.replace(`/login?locale=${storedLocale === "hi" ? "hi" : initialLocale}`);
      })
      .finally(() => setIsLoading(false));
  }, [initialLocale, router]);

  function confirmLogout() {
    logout();
    router.replace(`/login?locale=${locale}`);
  }

  if (isLoading) return <main className="flex min-h-screen items-center justify-center bg-[#fffaf5] text-sm text-stone-500">{content.loading}</main>;
  if (!user) return null;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_#fff7ed_0%,_#fffaf5_42%,_#f5f5f4_100%)] text-stone-900">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-72 shrink-0 flex-col border-r border-amber-200/70 bg-[#1b120a] p-7 text-white lg:flex">
          <BrandMark inverse label={content.restaurantName} />
          <nav className="mt-16 space-y-2" aria-label={content.dashboard}>
            {views.map((item) => (
              <button key={item.id} type="button" onClick={() => setView(item.id)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${view === item.id ? "bg-amber-400 text-stone-950 shadow-lg shadow-orange-900/30" : "text-stone-300 hover:bg-white/10 hover:text-white"}`}>
                <NavIcon name={item.icon} />
                {content[item.id]}
              </button>
            ))}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-stone-300">
            <p className="font-medium text-white">{content.serviceSnapshot}</p>
            <p className="mt-2 text-xs leading-5">{content.today} · 86 {content.covers}</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-12">
          <header className="flex items-center justify-between gap-4 border-b border-amber-700/70 pb-6">
            <div><p className="text-xs font-medium uppercase tracking-[0.25em] text-amber-700">{content.dashboard}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">{content[view]}</h1></div>
            <div className="flex items-center gap-2">
              <button type="button" aria-label={content.notifications} onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:border-amber-300 hover:text-amber-700"><BellIcon /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" /></button>
              <button type="button" aria-label={content.settings} onClick={() => setIsSettingsOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:border-amber-300 hover:text-amber-700"><GearIcon /></button>
              <button type="button" onClick={() => setIsLogoutOpen(true)} className="hidden items-center gap-3 rounded-full border border-stone-200 bg-white py-1.5 pl-1.5 pr-4 text-left shadow-sm sm:flex"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-xs font-bold text-white">{user.email[0].toUpperCase()}</span><span className="max-w-32 truncate text-xs font-semibold text-stone-700">{user.email}</span></button>
            </div>
          </header>

          <nav className="mt-5 grid grid-cols-4 gap-2 lg:hidden" aria-label={content.dashboard}>
            {views.map((item) => (
              <button key={item.id} type="button" onClick={() => setView(item.id)} className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold ${view === item.id ? "bg-amber-500 text-white shadow-lg shadow-orange-500/20" : "border border-stone-200 bg-white text-stone-500"}`}>
                <NavIcon name={item.icon} />
                {content[item.id]}
              </button>
            ))}
          </nav>

          {isNotificationsOpen ? <Popover title={content.notifications}><p className="text-sm text-stone-600">{content.noNotifications}</p></Popover> : null}
          {isSettingsOpen ? <Modal title={content.settings} onClose={() => setIsSettingsOpen(false)}><p className="text-sm text-stone-600">{content.profile}: {user.email}</p><p className="mt-2 text-sm text-stone-600">{content.accountPreferences}</p><div className="mt-5 flex items-center justify-between rounded-xl bg-stone-50 p-3"><span className="text-sm font-medium">{content.language}</span><LanguageSwitcher locale={locale} basePath="/dashboard" /></div></Modal> : null}
          {isLogoutOpen ? <Modal title={content.signedOut} onClose={() => setIsLogoutOpen(false)}><p className="text-sm leading-6 text-stone-600">{content.signOutDescription}</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setIsLogoutOpen(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100">{content.cancel}</button><button type="button" onClick={confirmLogout} className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800">{content.confirmSignOut}</button></div></Modal> : null}

          {view === "overview" ? <Overview content={content} /> : <EmptyView content={content} view={view} />}
        </section>
      </div>
    </main>
  );
}

function Overview({ content }: { content: DashboardContent }) {
  return <div className="space-y-8 py-8"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-semibold">{content.welcomeBack}</h2><p className="mt-1 text-sm text-stone-500">{content.serviceSnapshot}</p></div><p className="text-sm font-medium text-stone-500">{content.today}, Sep 5</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Metric label={content.reservationsToday} value="18" note="+12%"/><Metric label={content.revenue} value="$4,280" note="+8.4%"/><Metric label={content.activeTables} value="14" note={content.ofTotal}/><Metric label={content.covers} value="86" note="+6 today"/></div><section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]"><div className="rounded-[24px] border border-amber-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(120,53,15,0.08)]"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{content.upcomingReservations}</h2><button type="button" className="text-sm font-semibold text-amber-700">{content.viewAll}</button></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="border-b border-stone-200 text-xs uppercase tracking-wider text-stone-400"><tr><th className="pb-3 font-medium">{content.guest}</th><th className="pb-3 font-medium">{content.time}</th><th className="pb-3 font-medium">{content.table}</th><th className="pb-3 font-medium">{content.status}</th></tr></thead><tbody className="divide-y divide-stone-100"><Reservation guest="Maya Patel" time="7:00 PM" table="T-04" status={content.confirmed}/><Reservation guest="Lucas Martin" time="7:30 PM" table="T-12" status={content.confirmed}/><Reservation guest="Noah Williams" time="8:15 PM" table="T-08" status={content.pending}/></tbody></table></div></div><div className="rounded-[24px] bg-[#1b120a] p-6 text-white shadow-[0_20px_60px_rgba(120,53,15,0.2)]"><p className="text-xs uppercase tracking-[0.25em] text-amber-200">{content.today}</p><h2 className="mt-3 text-2xl font-light">{content.serviceSnapshot}</h2><div className="mt-8 h-2 rounded-full bg-white/10"><div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-amber-300 to-orange-500" /></div><p className="mt-3 text-sm text-stone-300">72% of the evening plan is ready.</p></div></section></div>;
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) { return <div className="rounded-[20px] border border-amber-200/70 bg-white/80 p-5 shadow-sm"><p className="text-sm text-stone-500">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p><p className="mt-2 text-xs font-semibold text-emerald-700">{note}</p></div>; }
function Reservation({ guest, time, table, status }: { guest: string; time: string; table: string; status: string }) { return <tr><td className="py-4 font-medium text-stone-800">{guest}</td><td className="py-4 text-stone-500">{time}</td><td className="py-4 text-stone-500">{table}</td><td className="py-4"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{status}</span></td></tr>; }
function EmptyView({ content, view }: { content: DashboardContent; view: DashboardView }) { return <div className="flex min-h-[60vh] items-center justify-center"><div className="max-w-md text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><GridIcon /></div><h2 className="mt-5 text-2xl font-semibold">{content[view]}</h2><p className="mt-2 text-sm text-stone-500">{content.serviceSnapshot}</p></div></div>; }
function Popover({ title, children }: { title: string; children: React.ReactNode }) { return <div className="absolute right-5 top-20 z-20 w-72 rounded-2xl border border-amber-200 bg-white p-5 shadow-xl sm:right-12"><h2 className="font-semibold">{title}</h2><div className="mt-3">{children}</div></div>; }
function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 px-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section role="dialog" aria-modal="true" className="w-full max-w-md rounded-3xl bg-[#fffaf5] p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{title}</h2><button type="button" onClick={onClose} className="h-9 w-9 rounded-full text-stone-500 hover:bg-amber-100" aria-label="Close">×</button></div><div className="mt-5">{children}</div></section></div>; }
function NavIcon({ name }: { name: string }) { return name === "calendar" ? <CalendarIcon /> : name === "book" ? <BookIcon /> : name === "chart" ? <ChartIcon /> : <GridIcon />; }
function GridIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" stroke="currentColor" strokeWidth="1.7" /></svg>; }
function CalendarIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M5 6h14v14H5V6Zm3-2v4m8-4v4M5 10h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>; }
function BookIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21V5.5Zm0 0V21" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>; }
function ChartIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M5 19V9m7 10V5m7 14v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>; }
function BellIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M6 17h12l-1.5-2v-4a4.5 4.5 0 0 0-9 0v4L6 17Zm4 3h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function GearIcon() { return <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0-5v2m0 13v2m-7.8-9.5h2m13.6 0h2M6.7 6.7l1.4 1.4m7.8 7.8 1.4 1.4m0-10.6-1.4 1.4m-7.8 7.8-1.4 1.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>; }
