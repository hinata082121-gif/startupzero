import { generateHomeSummary } from "../analytics/gameAnalytics";
import type { ActionType, GameState, MonthlyReport } from "../gameState";
import { formatSignedCurrency } from "../formatters";
import { useI18n } from "../i18n";

type MonthlyResultModalProps = {
  state: GameState;
  report: MonthlyReport;
  action: ActionType;
  onNextMonth: () => void;
};

const signedNumber = (value: number) => `${value > 0 ? "+" : ""}${value.toLocaleString()}`;

export default function MonthlyResultModal({ state, report, action, onNextMonth }: MonthlyResultModalProps) {
  const { t, currentLanguage } = useI18n();
  const summary = generateHomeSummary(state);
  const eventLabel = report.eventName ? t(report.eventName) : t("reports.noEventText");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-3 py-4">
      <section className="max-h-[92vh] w-full max-w-[760px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{t("turn.lastMonthResult")}</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">
          {t("turn.resultTitle", { month: report.month })}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {report.summaryKey ? t(report.summaryKey, report.summaryParams) : report.summary}
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <ResultMetric label={t("dashboard.cash")} value={formatSignedCurrency(report.cashDelta, currentLanguage)} />
          <ResultMetric label={t("dashboard.revenue")} value={formatSignedCurrency(report.revenueDelta, currentLanguage)} />
          <ResultMetric label={t("dashboard.users")} value={signedNumber(report.usersDelta)} />
          <ResultMetric label={t("dashboard.morale")} value={signedNumber(report.moraleDelta)} />
          <ResultMetric label={t("dashboard.productProgress")} value={signedNumber(report.productProgressDelta)} />
          <ResultMetric label={t("dashboard.marketFit")} value={signedNumber(report.marketFitDelta)} />
          <ResultMetric label={t("dashboard.reputation")} value={signedNumber(report.reputationDelta)} />
          <ResultMetric label={t("dashboard.burnRate")} value={formatSignedCurrency(report.burnRateDelta, currentLanguage)} />
          <ResultMetric
            label={t("dashboard.runway")}
            value={`${signedNumber(Number((state.lastMonthDelta?.runway ?? 0).toFixed(1)))} ${t("common.monthsShort")}`}
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{t("turn.executedAction")}</p>
            <p className="mt-1 text-sm font-black text-slate-950">{t(`actions.${action}.title`)}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{t("turn.eventOccurred")}</p>
            <p className="mt-1 text-sm font-black text-slate-950">{eventLabel}</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{t("turn.mentorBrief")}</p>
          <p className="mt-1 text-sm leading-6 text-teal-950">{t(summary.summaryKey)}</p>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onNextMonth}
            className="min-h-11 rounded-md bg-teal-600 px-5 py-2 text-sm font-black text-white hover:bg-teal-700"
          >
            {t("turn.nextMonth")}
          </button>
        </div>
      </section>
    </div>
  );
}

const ResultMetric = ({ label, value }: { label: string; value: string }) => {
  const tone =
    value.startsWith("+") ? "text-emerald-700 bg-emerald-50" : value.startsWith("-") ? "text-rose-700 bg-rose-50" : "text-slate-700 bg-slate-50";
  return (
    <div className={`rounded-lg p-3 ${tone}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-75">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
};
