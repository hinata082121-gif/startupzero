import type { AppView } from "../ads/adPolicy";
import { canShowAds } from "../ads/adPolicy";
import AdSlot from "@ads/AdSlot";
import type { GameState } from "../gameState";
import { useI18n } from "../i18n";

type AdBannerProps = {
  view: AppView;
  state: GameState;
};

export default function AdBanner({ view, state }: AdBannerProps) {
  const { t } = useI18n();
  const label = t("ads.advertisement");

  if (!canShowAds(view, state)) {
    return null;
  }

  return <AdSlot label={label} />;
}
