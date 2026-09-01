type IconName = "mail" | "lock";

type FormFieldProps = {
  id: string;
  type: "email" | "password";
  label: string;
  placeholder: string;
  icon: IconName;
};

function Icon({ name }: { name: IconName }) {
  if (name === "mail") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-stone-400" aria-hidden="true">
        <path
          d="M4 6.75A2.75 2.75 0 0 1 6.75 4h10.5A2.75 2.75 0 0 1 20 6.75v10.5A2.75 2.75 0 0 1 17.25 20H6.75A2.75 2.75 0 0 1 4 17.25V6.75Zm2.1-.25 6.9 5.12 6.9-5.12"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-stone-400" aria-hidden="true">
      <path
        d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FormField({ id, type, label, placeholder, icon }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100">
        <Icon name={icon} />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400"
        />
      </div>
    </div>
  );
}
