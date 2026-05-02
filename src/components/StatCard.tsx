type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
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

export default function StatCard({ label, value, detail, tone }: StatCardProps) {
  return (
    <div className={`rounded-lg border p-4 shadow-sm ${toneClasses[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-2xl font-bold leading-tight">{value}</p>
      {detail && <p className="mt-2 text-xs font-medium opacity-75">{detail}</p>}
    </div>
  );
}
