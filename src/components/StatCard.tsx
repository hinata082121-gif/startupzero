type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  delta?: string;
  deltaTone?: "up" | "down" | "flat";
  tone: "cash" | "revenue" | "users" | "runway" | "morale" | "danger";
};

const toneClasses: Record<StatCardProps["tone"], string> = {
  cash: "border-emerald-200 bg-emerald-50 text-emerald-950",
  revenue: "border-sky-200 bg-sky-50 text-sky-950",
  users: "border-violet-200 bg-violet-50 text-violet-950",
  runway: "border-teal-200 bg-teal-50 text-teal-950",
  morale: "border-orange-200 bg-orange-50 text-orange-950",
  danger: "border-red-200 bg-red-50 text-red-950",
};

const deltaClasses = {
  up: "text-emerald-700",
  down: "text-rose-700",
  flat: "opacity-70",
};

export default function StatCard({ label, value, detail, delta, deltaTone = "flat", tone }: StatCardProps) {
  const isCraftNovaLayout = __CRAFTNOVA_BUILD__;

  return (
    <div className={`rounded-lg border shadow-sm ${isCraftNovaLayout ? "p-2" : "p-4"} ${toneClasses[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className={isCraftNovaLayout ? "mt-0.5 truncate text-base font-bold leading-tight" : "mt-1 text-2xl font-bold leading-tight"}>{value}</p>
      {detail && !isCraftNovaLayout && <p className="mt-2 text-xs font-medium opacity-75">{detail}</p>}
      {delta && <p className={`${isCraftNovaLayout ? "mt-1 truncate" : "mt-2"} text-xs font-black ${deltaClasses[deltaTone]}`}>{delta}</p>}
    </div>
  );
}
