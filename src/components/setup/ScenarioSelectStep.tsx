import type { ScenarioType } from "../../gameState";
import { scenarioConfig } from "../../gameState";
import { useI18n } from "../../i18n";
import SetupOptionCard from "./SetupOptionCard";

type ScenarioSelectStepProps = {
  selectedScenario: ScenarioType | null;
  onSelect: (scenario: ScenarioType) => void;
};

const scenarios: ScenarioType[] = ["Standard Startup", "Bootstrapped", "VC Funded", "Crisis Mode"];

export default function ScenarioSelectStep({
  selectedScenario,
  onSelect,
}: ScenarioSelectStepProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {scenarios.map((scenario) => {
        const config = scenarioConfig[scenario];
        return (
          <SetupOptionCard
            key={scenario}
            selected={selectedScenario === scenario}
            onSelect={() => onSelect(scenario)}
            title={t(`entities.scenarios.${scenario}.title`)}
            description={t(config.description)}
            difficulty={t(`setup.difficulty.${config.difficulty}`)}
            recommendation={t(config.recommendationKey)}
            bonuses={[
              t("setup.scenarioCash", { value: `${Math.round(config.cashMultiplier * 100)}%` }),
              t("setup.scenarioBurn", { value: `${Math.round(config.burnMultiplier * 100)}%` }),
            ]}
          />
        );
      })}
    </div>
  );
}
