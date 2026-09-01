type SocialButtonProps = {
  label: string;
  provider: "google" | "facebook";
};

export function SocialButton({ label, provider }: SocialButtonProps) {
  const icon =
    provider === "google" ? (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.9h5.4c-.2 1.4-1.7 4.1-5.4 4.1-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.6C16.9 3.4 14.7 2.5 12 2.5A9.5 9.5 0 0 0 2.5 12a9.5 9.5 0 0 0 9.5 9.5c5.5 0 9.1-3.9 9.1-9.3 0-.6-.1-1.1-.2-1.6H12Z"
        />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="#1877F2"
          d="M13.5 21v-8.5h2.8l.4-3.2h-3.2V7.2c0-.9.3-1.6 1.7-1.6H17V2.6c-.4-.1-1.7-.2-3.2-.2-3.2 0-5.4 1.9-5.4 5.5v2.1H6.6v3.2h1.8V21h5.1Z"
        />
      </svg>
    );

  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
    >
      {icon}
      {label}
    </button>
  );
}
