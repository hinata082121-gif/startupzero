import type { GameState } from "../gameState";
import { useI18n } from "../i18n";
import AdBanner from "./AdBanner";
import CompactMetric from "./CompactMetric";
import GraphPanel from "./GraphPanel";
import MonthlyReportPanel from "./MonthlyReportPanel";

type ReportViewProps = {
  state: GameState;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function ReportView({ state }: ReportViewProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <CompactMetric label={t("dashboard.cash")} value={money(state.cash)} accent="green" />
        <CompactMetric label={t("dashboard.revenue")} value={money(state.revenue)} accent="blue" />
        <CompactMetric label={t("dashboard.marketFit")} value={`${state.marketFit}%`} accent="purple" />
        <CompactMetric label={t("dashboard.morale")} value={`${state.teamMorale}%`} accent="orange" />
        <CompactMetric label={t("dashboard.reputation")} value={`${state.reputation}%`} accent="blue" />
        <CompactMetric label={t("dashboard.fundingStage")} value={state.fundingStage.toLocaleString()} accent="green" />
      </section>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <GraphPanel state={state} />
        <MonthlyReportPanel reports={state.monthlyReports} />
      </div>
      <AdBanner />
    </div>
  );
}
