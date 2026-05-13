import type { GameState } from "../gameState";
import { generateHomeSummary } from "../analytics/gameAnalytics";
import { formatCurrency, formatSignedCurrency } from "../formatters";
import { useI18n } from "../i18n";
import StatCard from "./StatCard";
import StatusBadge from "./StatusBadge";

type HomeViewProps = {
  state: GameState;
  onGoActions: () => void;
  onGoMentor: () => void;
};

export default function HomeView({ state, onGoActions, onGoMentor }: HomeViewProps) {
  const { t, currentLanguage } = useI18n();
  const isCraftNovaLayout = __CRAFTNOVA_BUILD__;
  const monthlyNet = state.revenue - state.burnRate;
  const summary = generateHomeSummary(state);
  const warnings = [
    state.cash < state.burnRate ? t("home.cashWarning") : null,
    state.teamMorale < 30 ? t("home.moraleWarning") : null,
    state.runway < 3 && monthlyNet < 0 ? t("home.runwayWarning") : null,
  ].filter(Boolean);

  const recentLogs = state.logs.slice(0, isCraftNovaLayout ? 1 : 2);
  const deltaLabel = (value: number, formatter: (value: number) => string) => {
    const arrow = value > 0 ? "↑" : value < 0 ? "↓" : "→";
    return t("home.change", { value: `${formatter(value)} ${arrow}` });
  };
  const deltaTone = (value: number) => (value > 0 ? "up" : value < 0 ? "down" : "flat") as const;

  return (
    <div className={isCraftNovaLayout ? "space-y-2" : "space-y-4"}>
      <section className={isCraftNovaLayout ? "rounded-lg border border-slate-200 bg-white p-3 shadow-sm" : "rounded-xl border border-slate-200 bg-white p-4 shadow-sm"}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {t("navigation.home")}
            </p>
            <h2 className={isCraftNovaLayout ? "mt-0.5 text-xl font-bold leading-tight text-slate-950" : "mt-1 text-2xl font-bold text-slate-950"}>
              {state.companyName}
            </h2>
            <p className={isCraftNovaLayout ? "mt-0.5 text-xs text-slate-600" : "mt-1 text-sm text-slate-600"}>
              {t("home.ceoLine", { name: state.founderName })} / {t("common.month", { month: state.month })}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t(`entities.industries.${state.industry}.title`)} / {t(`modes.${state.mode}.title`)}
            </p>
          </div>
          <StatusBadge status={state.status} />
        </div>
      </section>

      <section className={isCraftNovaLayout ? "grid grid-cols-2 gap-2 sm:grid-cols-5" : "grid gap-3 sm:grid-cols-2 xl:grid-cols-5"}>
        <StatCard
          label={t("dashboard.cash")}
          value={formatCurrency(state.cash, currentLanguage)}
          delta={state.lastMonthDelta ? deltaLabel(state.lastMonthDelta.cash, (value) => formatSignedCurrency(value, currentLanguage)) : undefined}
          deltaTone={state.lastMonthDelta ? deltaTone(state.lastMonthDelta.cash) : "flat"}
          tone={state.cash < state.burnRate ? "danger" : "cash"}
        />
        <StatCard
          label={t("dashboard.revenue")}
          value={formatCurrency(state.revenue, currentLanguage)}
          detail={t("common.mrr")}
          delta={state.lastMonthDelta ? deltaLabel(state.lastMonthDelta.revenue, (value) => formatSignedCurrency(value, currentLanguage)) : undefined}
          deltaTone={state.lastMonthDelta ? deltaTone(state.lastMonthDelta.revenue) : "flat"}
          tone="revenue"
        />
        <StatCard
          label={t("dashboard.users")}
          value={state.users.toLocaleString()}
          delta={state.lastMonthDelta ? deltaLabel(state.lastMonthDelta.users, (value) => `${value > 0 ? "+" : ""}${value.toLocaleString()}`) : undefined}
          deltaTone={state.lastMonthDelta ? deltaTone(state.lastMonthDelta.users) : "flat"}
          tone="users"
        />
        <StatCard
          label={t("dashboard.runway")}
          value={monthlyNet >= 0 ? t("common.stable") : `${state.runway.toFixed(1)} ${t("common.monthsShort")}`}
          tone={state.runway < 3 && monthlyNet < 0 ? "danger" : "runway"}
        />
        <StatCard
          label={t("dashboard.morale")}
          value={`${state.teamMorale}%`}
          delta={state.lastMonthDelta ? deltaLabel(state.lastMonthDelta.teamMorale, (value) => `${value > 0 ? "+" : ""}${value}`) : undefined}
          deltaTone={state.lastMonthDelta ? deltaTone(state.lastMonthDelta.teamMorale) : "flat"}
          tone={state.teamMorale < 30 ? "danger" : "morale"}
        />
      </section>

      <section className={isCraftNovaLayout ? "grid gap-2 xl:grid-cols-[minmax(0,1fr)_300px]" : "grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]"}>
        <div className={isCraftNovaLayout ? "rounded-lg border border-slate-200 bg-white p-3 shadow-sm" : "rounded-xl border border-slate-200 bg-white p-4 shadow-sm"}>
          <div className="flex items-center justify-between gap-3">
            <h3 className={isCraftNovaLayout ? "text-base font-bold text-slate-950" : "text-lg font-bold text-slate-950"}>{t("home.statusSummary")}</h3>
            <button
              type="button"
              onClick={onGoActions}
              className={isCraftNovaLayout ? "rounded-md bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700" : "rounded-md bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700"}
            >
              {t("home.chooseAction")}
            </button>
          </div>
          <div className={isCraftNovaLayout ? "mt-2 rounded-lg bg-slate-50 p-2" : "mt-3 rounded-lg bg-slate-50 p-3"}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-slate-950">{t(summary.statusKey)}</span>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-bold text-amber-800">
                {t("home.riskLevel")}: {t(`analysis.risk.${summary.riskLevel}`)}
              </span>
            </div>
            <p className={isCraftNovaLayout ? "mt-1 line-clamp-2 text-xs leading-5 text-slate-700" : "mt-2 text-sm leading-6 text-slate-700"}>{t(summary.summaryKey)}</p>
            <button
              type="button"
              onClick={onGoMentor}
              className={isCraftNovaLayout ? "mt-2 rounded-md border border-teal-200 px-2 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-50" : "mt-3 rounded-md border border-teal-200 px-3 py-2 text-sm font-bold text-teal-700 hover:bg-teal-50"}
            >
              {t("home.viewMentorDetails")}
            </button>
          </div>
          <div className={isCraftNovaLayout ? "mt-2 space-y-1" : "mt-3 space-y-2"}>
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

        <div className={isCraftNovaLayout ? "space-y-2" : "space-y-4"}>
          <div className={isCraftNovaLayout ? "rounded-lg border border-slate-200 bg-white p-3 shadow-sm" : "rounded-xl border border-slate-200 bg-white p-4 shadow-sm"}>
            <h3 className={isCraftNovaLayout ? "text-base font-bold text-slate-950" : "text-lg font-bold text-slate-950"}>{t("competition.title")}</h3>
            <div className={isCraftNovaLayout ? "mt-2 rounded-lg bg-slate-50 p-2" : "mt-3 rounded-lg bg-slate-50 p-3"}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-slate-700">{t("competition.pressure")}</span>
                <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-black text-rose-800">
                  {state.competitionPressure} / 100
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                {t("competition.mainCompetitor")}: {state.mainCompetitorName}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {t("competition.levelLabel")}: {t(`competition.level.${state.competitionLevel}`)}
              </p>
              {!isCraftNovaLayout && <p className="mt-2 text-xs leading-5 text-slate-500">{t("competition.impact")}</p>}
            </div>
          </div>

          <div className={isCraftNovaLayout ? "rounded-lg border border-slate-200 bg-white p-3 shadow-sm" : "rounded-xl border border-slate-200 bg-white p-4 shadow-sm"}>
            <h3 className={isCraftNovaLayout ? "text-base font-bold text-slate-950" : "text-lg font-bold text-slate-950"}>{t("home.recentActivity")}</h3>
            <div className={isCraftNovaLayout ? "mt-2 space-y-1" : "mt-3 space-y-2"}>
              {recentLogs.length ? (
                recentLogs.map((log) => (
                  <div key={log.id} className={isCraftNovaLayout ? "rounded-lg bg-slate-50 p-2" : "rounded-lg bg-slate-50 p-3"}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t("common.month", { month: log.month })}
                    </p>
                    <p className={isCraftNovaLayout ? "mt-1 line-clamp-2 text-xs leading-5 text-slate-700" : "mt-1 text-sm leading-5 text-slate-700"}>
                      {log.messageKey ? t(log.messageKey, log.params) : log.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">{t("home.noRecentEvents")}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
