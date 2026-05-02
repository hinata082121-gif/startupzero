import type { MonthlyReport } from "../gameState";
import { useI18n } from "../i18n";

type ChangeToastProps = {
  report: MonthlyReport | undefined;
  visible: boolean;
};

export default function ChangeToast({ report, visible }: ChangeToastProps) {
  const { t } = useI18n();
  if (!report || !visible) {
    return null;
  }

  return (
    <div className="fixed bottom-14 right-4 z-30 w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-slate-200 bg-white p-4 shadow-xl sm:bottom-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t("reports.changes", { month: report.month })}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <Delta label={t("reports.cash")} value={report.cashDelta} prefix="$" />
        <Delta label={t("reports.revenue")} value={report.revenueDelta} prefix="$" />
        <Delta label={t("reports.users")} value={report.usersDelta} />
        <Delta label={t("reports.morale")} value={report.moraleDelta} suffix="%" />
      </div>
    </div>
  );
}

const Delta = ({
  label,
  value,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}) => {
  const positive = value >= 0;
  return (
    <div className={`rounded-md px-3 py-2 ${positive ? "bg-teal-50 text-teal-800" : "bg-red-50 text-red-800"}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 font-bold">
        {positive ? "+" : "-"}
        {prefix}
        {Math.abs(value).toLocaleString()}
        {suffix}
      </p>
    </div>
  );
};
