type CompactMetricProps = {
  label: string;
  value: string;
  accent?: "green" | "blue" | "purple" | "orange" | "red" | "slate";
};

const accents: Record<NonNullable<CompactMetricProps["accent"]>, string> = {
  green: "bg-emerald-500",
  blue: "bg-sky-500",
  purple: "bg-violet-500",
  orange: "bg-orange-500",
  red: "bg-red-500",
  slate: "bg-slate-500",
};

export default function CompactMetric({ label, value, accent = "slate" }: CompactMetricProps) {
  const isCraftNovaLayout = __CRAFTNOVA_BUILD__;

  return (
    <div className={isCraftNovaLayout ? "rounded-lg border border-slate-200 bg-white p-2 shadow-sm" : "rounded-lg border border-slate-200 bg-white p-3 shadow-sm"}>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${accents[accent]}`} />
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      </div>
      <p className={isCraftNovaLayout ? "mt-1 truncate text-sm font-bold text-slate-950" : "mt-2 text-lg font-bold text-slate-950"}>{value}</p>
    </div>
  );
}
