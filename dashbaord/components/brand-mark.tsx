type BrandMarkProps = {
  compact?: boolean;
  inverse?: boolean;
  label?: string;
};

export function BrandMark({ compact = false, inverse = false, label = "Restaurant" }: BrandMarkProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 font-bold text-stone-950 shadow-lg shadow-orange-500/20 ${
          compact ? 'h-10 w-10 text-base' : 'h-11 w-11 text-lg'
        } ${inverse ? 'bg-gradient-to-br from-amber-300 to-orange-500' : ''}`}
      >
        S
      </div>
      <div>
        <p
          className={`uppercase tracking-[0.28em] ${
            inverse ? 'text-stone-300' : 'text-stone-500'
          } ${compact ? 'text-[10px]' : 'text-[10px]'}`}
        >
          {label}
        </p>
        <p className={`font-medium ${inverse ? 'text-white' : 'text-stone-800'} ${compact ? 'text-sm' : 'text-lg'}`}>
          Saffron & Ember
        </p>
      </div>
    </div>
  );
}
