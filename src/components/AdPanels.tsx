import type { GameStatus } from "../gameState";
import { useI18n } from "../i18n";

type RewardAdProps = {
  status: GameStatus;
  watched: boolean;
  onWatch: () => void;
};

export const BannerAd = () => {
  const { t } = useI18n();
  return (
    <div className="fixed inset-x-0 bottom-28 z-20 border-t border-slate-300 bg-white/95 px-4 py-2 shadow-lg backdrop-blur lg:bottom-0">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-xs text-slate-600">
        <span className="font-semibold uppercase tracking-wide text-slate-500">{t("ads.bannerLabel")}</span>
        <span>{t("ads.bannerText")}</span>
      </div>
    </div>
  );
};

export const SidebarAd = () => {
  const { t } = useI18n();
  return (
    <aside className="hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm xl:block">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("ads.sidebarLabel")}</p>
      <div className="mt-3 rounded-md bg-slate-100 p-4">
        <p className="text-sm font-bold text-slate-950">{t("ads.sidebarTitle")}</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{t("ads.sidebarText")}</p>
      </div>
    </aside>
  );
};

export const RewardAd = ({ status, watched, onWatch }: RewardAdProps) => {
  const { t } = useI18n();
  if (status !== "lost") {
    return null;
  }

  return (
    <section className="rounded-lg border border-amber-300 bg-amber-50 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">{t("ads.rewardLabel")}</p>
      <h3 className="mt-1 text-lg font-bold text-slate-950">{t("ads.rewardTitle")}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{t("ads.rewardText")}</p>
      <button
        type="button"
        disabled={watched}
        onClick={onWatch}
        className="mt-4 min-h-12 w-full rounded-md bg-amber-600 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {watched ? t("ads.claimed") : t("ads.watch")}
      </button>
    </section>
  );
};
