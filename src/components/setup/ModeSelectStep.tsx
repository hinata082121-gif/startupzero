import type { GameMode, MetaProgression } from "../../gameState";
import { useI18n } from "../../i18n";
import SetupOptionCard from "./SetupOptionCard";

type ModeSelectStepProps = {
  meta: MetaProgression;
  selectedMode: GameMode | null;
  onSelect: (mode: GameMode) => void;
};

export default function ModeSelectStep({ meta, selectedMode, onSelect }: ModeSelectStepProps) {
  const { t } = useI18n();
  const clears = meta.normalModeClears ?? 0;
  const unlocked = meta.founderLeagueUnlocked || clears >= 2;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <SetupOptionCard
        selected={selectedMode === "normal"}
        onSelect={() => onSelect("normal")}
        title={t("modes.normal.title")}
        description={t("modes.normal.description")}
        difficulty={t("setup.difficulty.Normal")}
        recommendation={t("setup.recommendations.standard")}
        bonuses={[t("modes.normal.bonus")]}
      />
      <SetupOptionCard
        disabled={!unlocked}
        selected={selectedMode === "founderLeague"}
        onSelect={() => onSelect("founderLeague")}
        title={t("modes.founderLeague.title")}
        description={t("modes.founderLeague.description")}
        difficulty={t("setup.difficulty.Hard")}
        recommendation={unlocked ? t("modes.founderLeague.unlocked") : t("modes.founderLeague.locked")}
        disabledReason={
          unlocked
            ? undefined
            : `${t("modes.founderLeague.unlockCondition")} ${t("modes.founderLeague.progress", {
                current: Math.min(clears, 2),
                total: 2,
              })}`
        }
        bonuses={[t("modes.founderLeague.bonus")]}
      />
    </div>
  );
}
