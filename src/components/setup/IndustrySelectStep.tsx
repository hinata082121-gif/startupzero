import type { IndustryType, MetaProgression } from "../../gameState";
import { industryConfig } from "../../gameState";
import { useI18n } from "../../i18n";
import SetupOptionCard from "./SetupOptionCard";

type IndustrySelectStepProps = {
  meta: MetaProgression;
  selectedIndustry: IndustryType | null;
  onSelect: (industry: IndustryType) => void;
};

const industries: IndustryType[] = ["Local Business Tech", "SaaS", "Game", "AI", "Marketplace"];

export default function IndustrySelectStep({
  meta,
  selectedIndustry,
  onSelect,
}: IndustrySelectStepProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {industries.map((industry) => {
        const config = industryConfig[industry];
        const unlocked = meta.unlockedIndustries.includes(industry);
        return (
          <SetupOptionCard
            key={industry}
            disabled={!unlocked}
            selected={selectedIndustry === industry}
            onSelect={() => onSelect(industry)}
            title={`${t(`entities.industries.${industry}.title`)}${unlocked ? "" : ` ${t("common.locked")}`}`}
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
