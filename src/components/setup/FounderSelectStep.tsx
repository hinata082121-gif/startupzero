import type { FounderType, MetaProgression } from "../../gameState";
import { founderConfig } from "../../gameState";
import { useI18n } from "../../i18n";
import SetupOptionCard from "./SetupOptionCard";

type FounderSelectStepProps = {
  meta: MetaProgression;
  selectedFounder: FounderType | null;
  onSelect: (founder: FounderType) => void;
};

const founders: FounderType[] = [
  "Product Founder",
  "Engineer Founder",
  "Sales Founder",
  "Growth Founder",
  "Bootstrap Founder",
];

export default function FounderSelectStep({
  meta,
  selectedFounder,
  onSelect,
}: FounderSelectStepProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {founders.map((founder) => {
        const config = founderConfig[founder];
        const unlocked = meta.unlockedFounders.includes(founder);
        return (
          <SetupOptionCard
            key={founder}
            disabled={!unlocked}
            selected={selectedFounder === founder}
            onSelect={() => onSelect(founder)}
            title={`${t(`entities.founders.${founder}.title`)}${unlocked ? "" : ` ${t("common.locked")}`}`}
            description={t(config.description)}
            difficulty={t(`setup.difficulty.${config.difficulty}`)}
            recommendation={t(config.recommendationKey)}
            strengths={config.strengths.map((key) => t(key))}
            weaknesses={config.weaknesses.map((key) => t(key))}
            bonuses={config.initialBonus.map((key) => t(key))}
          />
        );
      })}
    </div>
  );
}
