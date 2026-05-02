import type { GameState } from "../gameState";
import { generateHomeSummary } from "../analytics/gameAnalytics";
import { useI18n } from "../i18n";
import AdBanner from "./AdBanner";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";

type HomeViewProps = {
  state: GameState;
  onGoActions: () => void;
  onGoMentor: () => void;
};

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function HomeView({ state, onGoActions, onGoMentor }: HomeViewProps) {
  const { t } = useI18n();
  const monthlyNet = state.revenue - state.burnRate;
  const summary = generateHomeSummary(state);
  const warnings = [
    state.cash < state.burnRate ? t("home.cashWarning") : null,
    state.teamMorale < 30 ? t("home.moraleWarning") : null,
    state.runway < 3 && monthlyNet < 0 ? t("home.runwayWarning") : null,
  ].filter(Boolean);

  const recentLogs = state.logs.slice(0, 2);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {t("navigation.home")}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {t("home.companySnapshot")}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {t("common.month", { month: state.month })} / {t(`entities.industries.${state.industry}.title`)}
            </p>
          </div>
          <StatusBadge status={state.status} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label={t("dashboard.cash")} value={money(state.cash)} tone={state.cash < state.burnRate ? "danger" : "cash"} />
        <StatCard label={t("dashboard.revenue")} value={money(state.revenue)} detail={t("common.mrr")} tone="revenue" />
        <StatCard label={t("dashboard.users")} value={state.users.toLocaleString()} tone="users" />
        <StatCard
          label={t("dashboard.runway")}
          value={monthlyNet >= 0 ? t("common.stable") : `${state.runway.toFixed(1)} ${t("common.monthsShort")}`}
          tone={state.runway < 3 && monthlyNet < 0 ? "danger" : "runway"}
        />
        <StatCard label={t("dashboard.morale")} value={`${state.teamMorale}%`} tone={state.teamMorale < 30 ? "danger" : "morale"} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-950">{t("home.statusSummary")}</h3>
            <button
              type="button"
              onClick={onGoActions}
              className="rounded-md bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"
            >
              {t("home.chooseAction")}
            </button>
          </div>
          <div className="mt-3 rounded-lg bg-slate-50 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-950">{t(summary.statusKey)}</span>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                {t("home.riskLevel")}: {t(`analysis.risk.${summary.riskLevel}`)}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{t(summary.summaryKey)}</p>
            <button
              type="button"
              onClick={onGoMentor}
              className="mt-3 rounded-md border border-teal-200 px-3 py-2 text-sm font-bold text-teal-700 hover:bg-teal-50"
            >
              {t("home.viewMentorDetails")}
            </button>
          </div>
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("home.warningTitle")}
            </p>
            {warnings.length ? (
              warnings.map((warning) => (
                <p key={warning} className="rounded-md bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-900">
                  {warning}
                </p>
              ))
            ) : (
              <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
                {t("home.noWarnings")}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">{t("home.recentActivity")}</h3>
          <div className="mt-3 space-y-2">
            {recentLogs.length ? (
              recentLogs.map((log) => (
                <div key={log.id} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("common.month", { month: log.month })}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-slate-700">
                    {log.messageKey ? t(log.messageKey, log.params) : log.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600">{t("home.noRecentEvents")}</p>
            )}
          </div>
        </div>
      </section>

      <AdBanner />
    </div>
  );
}
