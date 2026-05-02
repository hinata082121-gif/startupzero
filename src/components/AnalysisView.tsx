import {
  analyzeActionHistory,
  analyzeTrends,
  detectRisks,
  determinePlayStyle,
  getScoreBreakdown,
} from "../analytics/gameAnalytics";
import type { GameRisk } from "../analytics/types";
import type { GameState } from "../gameState";
import { useI18n } from "../i18n";

type AnalysisViewProps = {
  state: GameState;
};

const scoreKeys = [
  ["overallScore", "analysis.overallScore"],
  ["financialHealth", "analysis.financialHealth"],
  ["growthScore", "analysis.growthScore"],
  ["productScore", "analysis.productScore"],
  ["teamScore", "analysis.teamScore"],
  ["marketScore", "analysis.marketScore"],
] as const;

const severityClass: Record<GameRisk["severity"], string> = {
  low: "bg-slate-100 text-slate-700 border-slate-200",
  medium: "bg-amber-50 text-amber-800 border-amber-200",
  high: "bg-orange-50 text-orange-800 border-orange-200",
  critical: "bg-rose-50 text-rose-800 border-rose-200",
};

export default function AnalysisView({ state }: AnalysisViewProps) {
  const { t } = useI18n();
  const scores = getScoreBreakdown(state);
  const trends = analyzeTrends(state);
  const risks = detectRisks(state);
  const actionPattern = analyzeActionHistory(state);
  const playStyle = determinePlayStyle(state);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          {t("navigation.analysis")}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">{t("analysis.title")}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{t("analysis.subtitle")}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {scoreKeys.map(([key, labelKey]) => (
          <ScoreCard key={key} label={t(labelKey)} score={scores[key]} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">{t("analysis.trends")}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {trends.map((trend) => (
              <div key={trend.id} className="rounded-lg bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-950">{t(trend.labelKey)}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {t(`analysis.trend.${trend.direction}`)} / {trend.value > 0 ? "+" : ""}
                  {trend.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950">{t("analysis.playStyle")}</h3>
          <p className="mt-3 rounded-lg bg-purple-50 px-3 py-2 text-sm font-bold text-purple-950">
            {t(`analysis.playStyles.${playStyle}`)}
          </p>
          <h4 className="mt-4 text-sm font-bold text-slate-950">{t("analysis.actionPattern")}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {t(actionPattern.messageKey, actionPattern.params)}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950">{t("analysis.risks")}</h3>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {risks.length ? (
            risks.map((risk) => (
              <div key={risk.id} className={`rounded-lg border p-3 ${severityClass[risk.severity]}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">{t(risk.titleKey)}</p>
                  <span className="rounded-full bg-white/70 px-2 py-1 text-xs font-bold">
                    {t(`analysis.risk.${risk.severity}`)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6">{t(risk.descriptionKey)}</p>
                <p className="mt-2 text-sm font-semibold">{t(risk.mitigationKey)}</p>
              </div>
            ))
          ) : (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
              {t("analysis.noRisks")}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

const ScoreCard = ({ label, score }: { label: string; score: number }) => {
  const barColor =
    score >= 75 ? "bg-emerald-500" : score >= 50 ? "bg-blue-500" : score >= 30 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-700">{label}</p>
        <p className="text-2xl font-black text-slate-950">{score}</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};
