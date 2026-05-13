import type { ReactNode } from "react";
import type { GameState } from "../gameState";
import { formatCurrency } from "../formatters";
import { useI18n } from "../i18n";

type StatusPanelProps = {
  state: GameState;
};

export default function StatusPanel({ state }: StatusPanelProps) {
  const { t, currentLanguage } = useI18n();
  const monthlyNet = state.revenue - state.burnRate;
  const runwayFill = monthlyNet >= 0 ? 100 : Math.min(100, Math.max(4, (state.runway / 18) * 100));
  const moraleFill = Math.max(0, Math.min(100, state.teamMorale));

  return (
    <aside className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 rounded-lg bg-slate-950 p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">{t("dashboard.monthLabel")}</p>
            <h2 className="mt-1 text-4xl font-bold">{state.month}</h2>
          </div>
          <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold capitalize">
            {t(`common.status.${state.status}`)}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {t(`entities.scenarios.${state.scenario}.title`)} / {t(`entities.industries.${state.industry}.title`)} / {t(`entities.founders.${state.founder}.title`)} / {t(`entities.traits.${state.trait}`)}
        </p>
        {state.ending && (
          <p className="mt-2 rounded-md bg-white/10 px-2 py-1 text-sm font-semibold text-white">
            {t("dashboard.ending")}: {t(`entities.endings.${state.ending}`)}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <StatusGroup title={t("dashboard.finance")}>
          <HighlightStat label={t("dashboard.cash")} value={formatCurrency(state.cash, currentLanguage)} tone={state.cash < state.burnRate ? "danger" : "good"} />
          <StatRow label={t("dashboard.revenue")} value={`${formatCurrency(state.revenue, currentLanguage)} ${t("common.perMonth")}`} />
          <StatRow label={t("dashboard.burn")} value={`${formatCurrency(state.burnRate, currentLanguage)} ${t("common.perMonth")}`} />
          <div className="pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">{t("dashboard.runway")}</span>
              <span className="font-bold text-slate-950">
                {monthlyNet >= 0 ? t("common.stable") : `${state.runway.toFixed(1)} ${t("common.monthsShort")}`}
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${state.runway < 3 && monthlyNet < 0 ? "bg-red-500" : "bg-teal-600"}`}
                style={{ width: `${runwayFill}%` }}
              />
            </div>
          </div>
        </StatusGroup>

        <StatusGroup title={t("dashboard.growth")}>
          <HighlightStat label={t("dashboard.users")} value={state.users.toLocaleString()} tone="neutral" />
          <StatRow label={t("dashboard.marketFit")} value={`${state.marketFit}%`} />
          <StatRow label={t("dashboard.productProgress")} value={`${state.productProgress}%`} />
        </StatusGroup>

        <StatusGroup title={t("dashboard.organization")}>
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">{t("dashboard.morale")}</span>
              <span className="font-bold text-slate-950">{state.teamMorale}%</span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${state.teamMorale < 30 ? "bg-red-500" : "bg-emerald-500"}`}
                style={{ width: `${moraleFill}%` }}
              />
            </div>
          </div>
          <StatRow label={t("dashboard.team")} value={t(`entities.founders.${state.founder}.title`)} />
        </StatusGroup>
      </div>
    </aside>
  );
}

const StatusGroup = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-lg border border-slate-200 bg-slate-50 p-3">
    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
    <div className="space-y-2">{children}</div>
  </section>
);

const HighlightStat = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "danger" | "neutral";
}) => {
  const toneClass =
    tone === "good"
      ? "border-teal-200 bg-teal-50 text-teal-900"
      : tone === "danger"
        ? "border-red-200 bg-red-50 text-red-900"
        : "border-slate-200 bg-white text-slate-950";

  return (
    <div className={`rounded-md border px-3 py-2 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
};

const StatRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 text-sm">
    <span className="text-slate-600">{label}</span>
    <span className="font-semibold text-slate-950">{value}</span>
  </div>
);
