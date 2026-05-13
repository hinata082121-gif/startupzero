import type { GameState } from "../gameState";
import { formatCurrency } from "../formatters";
import { useI18n } from "../i18n";
import CompactMetric from "./CompactMetric";
import GraphPanel from "./GraphPanel";
import MonthlyReportPanel from "./MonthlyReportPanel";

type ReportViewProps = {
  state: GameState;
};

export default function ReportView({ state }: ReportViewProps) {
  const { t, currentLanguage } = useI18n();
  const isCraftNovaLayout = __CRAFTNOVA_BUILD__;

  return (
    <div className={isCraftNovaLayout ? "space-y-2" : "space-y-4"}>
      {!isCraftNovaLayout && <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{t("navigation.report")}</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">{state.companyName}</h2>
        <p className="mt-1 text-sm text-slate-600">{t("home.ceoLine", { name: state.founderName })}</p>
      </section>}
      <section className={isCraftNovaLayout ? "grid grid-cols-3 gap-2 xl:grid-cols-6" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-6"}>
        <CompactMetric label={t("dashboard.cash")} value={formatCurrency(state.cash, currentLanguage)} accent="green" />
        <CompactMetric label={t("dashboard.revenue")} value={formatCurrency(state.revenue, currentLanguage)} accent="blue" />
        <CompactMetric label={t("dashboard.marketFit")} value={`${state.marketFit}%`} accent="purple" />
        <CompactMetric label={t("dashboard.morale")} value={`${state.teamMorale}%`} accent="orange" />
        <CompactMetric label={t("dashboard.reputation")} value={`${state.reputation}%`} accent="blue" />
        <CompactMetric label={t("dashboard.fundingStage")} value={state.fundingStage.toLocaleString()} accent="green" />
      </section>
      <div className={isCraftNovaLayout ? "grid gap-2 xl:grid-cols-[minmax(0,1fr)_360px]" : "grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]"}>
        <GraphPanel state={state} />
        <MonthlyReportPanel reports={state.monthlyReports} />
      </div>
    </div>
  );
}
