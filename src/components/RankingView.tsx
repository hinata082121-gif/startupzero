import { useMemo, useState } from "react";
import { formatCurrency } from "../formatters";
import { loadFounderLeagueRankings, type FounderLeagueRankingEntry } from "../league/rankings";
import { useI18n } from "../i18n";

type RankingTab = "overall" | "byIndustry" | "byFounderType";

export default function RankingView() {
  const { t, currentLanguage } = useI18n();
  const [tab, setTab] = useState<RankingTab>("overall");
  const [selected, setSelected] = useState<FounderLeagueRankingEntry | null>(null);
  const rankings = useMemo(() => loadFounderLeagueRankings(), []);
  const industryLabel = (industry: string) =>
    t(`entities.industries.${industry}.title`);
  const founderLabel = (founderType: string) =>
    t(`entities.founders.${founderType}.title`);
  const visible = useMemo(() => {
    const sorted = [...rankings].sort((a, b) => b.score - a.score);
    if (tab === "overall") return sorted;
    const seen = new Set<string>();
    return sorted.filter((entry) => {
      const key = tab === "byIndustry" ? entry.industry : entry.founderType;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [rankings, tab]);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{t("navigation.ranking")}</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">{t("ranking.title")}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{t("ranking.localNotice")}</p>
      </section>

      <div className="flex flex-wrap gap-2">
        {(["overall", "byIndustry", "byFounderType"] as RankingTab[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`min-h-10 rounded-md px-4 py-2 text-sm font-bold ${tab === item ? "bg-teal-600 text-white" : "border border-slate-300 bg-white text-slate-700"}`}
          >
            {t(`ranking.${item}`)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600 shadow-sm">
          {t("ranking.empty")}
        </section>
      ) : (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-[60px_minmax(0,1.3fr)_minmax(0,1fr)_120px] gap-2 bg-slate-50 px-3 py-2 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid-cols-[60px_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_120px_130px]">
            <span>{t("ranking.rank")}</span>
            <span>{t("setup.companyName")}</span>
            <span>{t("setup.founderName")}</span>
            <span className="hidden md:block">{t("setup.selectedIndustry")}</span>
            <span>{t("ranking.score")}</span>
            <span className="hidden md:block">{t("ranking.valuation")}</span>
          </div>
          {visible.map((entry, index) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setSelected(entry)}
              className="grid w-full grid-cols-[60px_minmax(0,1.3fr)_minmax(0,1fr)_120px] gap-2 border-t border-slate-100 px-3 py-3 text-left text-sm hover:bg-teal-50 md:grid-cols-[60px_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_120px_130px]"
            >
              <span className="font-black text-slate-950">#{index + 1}</span>
              <span className="font-bold text-slate-950">{entry.companyName}</span>
              <span className="text-slate-600">{entry.playerName}</span>
              <span className="hidden text-slate-600 md:block">{industryLabel(entry.industry)}</span>
              <span className="font-black text-teal-700">{entry.score.toLocaleString()}</span>
              <span className="hidden text-slate-600 md:block">{formatCurrency(entry.companyValuation, currentLanguage)}</span>
            </button>
          ))}
        </section>
      )}

      {selected && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-950">{selected.companyName}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {selected.playerName} / {industryLabel(selected.industry)} / {founderLabel(selected.founderType)}
              </p>
            </div>
            <button type="button" onClick={() => setSelected(null)} className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600">
              {t("setup.cancel")}
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label={t("ranking.score")} value={selected.score.toLocaleString()} />
            <Detail label={t("league.companyValuation")} value={formatCurrency(selected.companyValuation, currentLanguage)} />
            <Detail label={t("league.totalAssets")} value={formatCurrency(selected.totalAssets, currentLanguage)} />
            <Detail label={t("dashboard.revenue")} value={formatCurrency(selected.revenue, currentLanguage)} />
            <Detail label={t("dashboard.users")} value={selected.users.toLocaleString()} />
            <Detail label={t("dashboard.marketFit")} value={`${selected.marketFit}%`} />
            <Detail label={t("dashboard.reputation")} value={`${selected.reputation}%`} />
            <Detail label={t("ranking.recordedAt")} value={new Date(selected.createdAt).toLocaleString()} />
          </div>
        </section>
      )}
    </div>
  );
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-slate-50 p-3">
    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
  </div>
);
