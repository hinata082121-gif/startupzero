import { calculateCompanyValuation, calculateTotalAssets, buildScoreBreakdown } from "../scoring/founderScore";
import type { GameState } from "../gameState";
import { formatCurrency } from "../formatters";
import { getFounderLeagueResult } from "../league/rankings";
import { useI18n } from "../i18n";

type LeagueResultModalProps = {
  state: GameState;
  rank: number;
  onViewRanking: () => void;
  onTryAgain: () => void;
  onBackToNormal: () => void;
};

const scoreItems = ["assets", "valuation", "revenue", "users", "marketFit", "reputation", "product", "survival", "difficulty", "penalty"] as const;

export default function LeagueResultModal({
  state,
  rank,
  onViewRanking,
  onTryAgain,
  onBackToNormal,
}: LeagueResultModalProps) {
  const { t, currentLanguage } = useI18n();
  const breakdown = buildScoreBreakdown(state);
  const result = getFounderLeagueResult(state);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-3 py-4">
      <section className="max-h-[92vh] w-full max-w-[820px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <p className="text-xs font-black uppercase tracking-wide text-teal-700">{t("league.subtitle")}</p>
        <h2 className="mt-1 text-3xl font-black text-slate-950">{t("league.complete")}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {state.companyName} / {t("home.ceoLine", { name: state.founderName })} / {t(`league.result.${result}`)}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label={t("league.founderScore")} value={breakdown.total.toLocaleString()} highlight />
          <Metric label={t("league.companyValuation")} value={formatCurrency(calculateCompanyValuation(state), currentLanguage)} />
          <Metric label={t("league.totalAssets")} value={formatCurrency(calculateTotalAssets(state), currentLanguage)} />
          <Metric label={t("ranking.rank")} value={`#${rank}`} />
          <Metric label={t("dashboard.revenue")} value={formatCurrency(state.revenue, currentLanguage)} />
          <Metric label={t("dashboard.users")} value={state.users.toLocaleString()} />
          <Metric label={t("dashboard.marketFit")} value={`${state.marketFit}%`} />
          <Metric label={t("dashboard.reputation")} value={`${state.reputation}%`} />
        </div>

        <section className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-black text-slate-950">{t("score.breakdown.title")}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {scoreItems.map((item) => (
              <div key={item} className="rounded-lg bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{t(`score.breakdown.${item}`)}</p>
                <p className="mt-1 text-lg font-black text-slate-950">{breakdown[item].toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onBackToNormal} className="min-h-11 rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">
            {t("league.backToNormal")}
          </button>
          <button type="button" onClick={onTryAgain} className="min-h-11 rounded-md border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800">
            {t("league.tryAgain")}
          </button>
          <button type="button" onClick={onViewRanking} className="min-h-11 rounded-md bg-teal-600 px-5 py-2 text-sm font-black text-white">
            {t("league.viewRanking")}
          </button>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? "bg-teal-600 text-white" : "bg-slate-50 text-slate-950"}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-75">{label}</p>
      <p className="mt-1 text-xl font-black">{value}</p>
    </div>
  );
}
