import type { GameState } from "../gameState";
import { useI18n } from "../i18n";

type RunwayMeterProps = {
  state: GameState;
};

export default function RunwayMeter({ state }: RunwayMeterProps) {
  const { t } = useI18n();
  const monthlyNet = state.revenue - state.burnRate;
  const pressure = monthlyNet >= 0 ? 100 : Math.min(100, Math.max(0, (state.runway / 18) * 100));
  const label =
    monthlyNet >= 0
      ? t("dashboard.cashFlowPositive")
      : t("dashboard.runwayAtBurn", { runway: state.runway.toFixed(1) });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t("dashboard.runwayVisualization")}
          </p>
          <h2 className="text-xl font-bold text-slate-950">{label}</h2>
        </div>
        <p className="text-sm font-semibold text-slate-600">
          {t("dashboard.net")} {monthlyNet >= 0 ? "+" : "-"}${Math.abs(monthlyNet).toLocaleString()} {t("common.perMonth")}
        </p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${state.runway < 3 && monthlyNet < 0 ? "bg-red-500" : "bg-teal-600"}`}
          style={{ width: `${pressure}%` }}
        />
      </div>
    </section>
  );
}
