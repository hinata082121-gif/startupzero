import type { MonthlyReport } from "../gameState";
import { useI18n } from "../i18n";

type MonthlyReportPanelProps = {
  reports: MonthlyReport[];
};

const signedMoney = (value: number) => `${value >= 0 ? "+" : "-"}$${Math.abs(value).toLocaleString()}`;
const signedNumber = (value: number) => `${value >= 0 ? "+" : ""}${value.toLocaleString()}`;

export default function MonthlyReportPanel({ reports }: MonthlyReportPanelProps) {
  const { t } = useI18n();
  const latest = reports[0];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("reports.title")}</p>
        <h2 className="text-2xl font-bold text-slate-950">
          {latest ? t("common.month", { month: latest.month }) : t("reports.noReport")}
        </h2>
      </div>

      {latest ? (
        <div>
          <p className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
            {latest.summaryKey ? t(latest.summaryKey, latest.summaryParams) : latest.summary}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <ReportMetric label={t("reports.cash")} value={signedMoney(latest.cashDelta)} />
            <ReportMetric label={t("reports.revenue")} value={signedMoney(latest.revenueDelta)} />
            <ReportMetric label={t("reports.users")} value={signedNumber(latest.usersDelta)} />
            <ReportMetric label={t("reports.morale")} value={signedNumber(latest.moraleDelta)} />
            <ReportMetric label={t("reports.runway")} value={`${latest.runway.toFixed(1)} ${t("common.monthsShort")}`} />
          </div>
        </div>
      ) : (
        <p className="text-sm leading-6 text-slate-600">
          {t("reports.noReportBody")}
        </p>
      )}
    </section>
  );
}

const ReportMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md bg-slate-50 p-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-bold text-slate-950">{value}</p>
  </div>
);
