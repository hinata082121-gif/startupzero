import type { FounderType, GameMode, IndustryType, ScenarioType } from "../../gameState";
import { founderConfig, industryConfig, scenarioConfig } from "../../gameState";
import { useI18n } from "../../i18n";

type SetupConfirmStepProps = {
  selectedMode: GameMode;
  selectedScenario: ScenarioType;
  selectedIndustry: IndustryType;
  selectedFounder: FounderType;
  founderName: string;
  companyName: string;
  onEdit: (step: "mode" | "scenario" | "industry" | "founder" | "identity") => void;
};

const difficultyRank = {
  Easy: 1,
  Normal: 2,
  Hard: 3,
  Expert: 4,
} as const;

export const getOverallDifficulty = (
  scenario: ScenarioType,
  industry: IndustryType,
  founder: FounderType,
) => {
  const difficulties = [
    scenarioConfig[scenario].difficulty,
    industryConfig[industry].difficulty,
    founderConfig[founder].difficulty,
  ];
  return difficulties.sort((a, b) => difficultyRank[b] - difficultyRank[a])[0];
};

export default function SetupConfirmStep({
  selectedMode,
  selectedScenario,
  selectedIndustry,
  selectedFounder,
  founderName,
  companyName,
  onEdit,
}: SetupConfirmStepProps) {
  const { t } = useI18n();
  const difficulty = getOverallDifficulty(selectedScenario, selectedIndustry, selectedFounder);
  const industry = industryConfig[selectedIndustry];
  const founder = founderConfig[selectedFounder];
  const scenario = scenarioConfig[selectedScenario];

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-teal-50 p-4">
        <h3 className="text-lg font-black text-slate-950">{t("setup.confirmTitle")}</h3>
        <p className="mt-1 text-sm leading-6 text-teal-950">{t("setup.confirmDescription")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label={t("setup.selectedMode")}
          value={t(`modes.${selectedMode}.title`)}
          onEdit={() => onEdit("mode")}
        />
        <SummaryCard
          label={t("setup.selectedScenario")}
          value={t(`entities.scenarios.${selectedScenario}.title`)}
          onEdit={() => onEdit("scenario")}
        />
        <SummaryCard
          label={t("setup.selectedIndustry")}
          value={t(`entities.industries.${selectedIndustry}.title`)}
          onEdit={() => onEdit("industry")}
        />
        <SummaryCard
          label={t("setup.selectedFounder")}
          value={t(`entities.founders.${selectedFounder}.title`)}
          onEdit={() => onEdit("founder")}
        />
        <SummaryCard
          label={t("setup.companyName")}
          value={companyName}
          onEdit={() => onEdit("identity")}
        />
        <SummaryCard
          label={t("setup.founderName")}
          value={founderName}
          onEdit={() => onEdit("identity")}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {t("setup.overallDifficulty")}
          </p>
          <p className="mt-1 text-lg font-black text-slate-950">
            {t(`setup.difficulty.${difficulty}`)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            {t("setup.playStyle")}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            {t(`setup.playStyles.${selectedIndustry}`)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          {t("setup.initialModifiers")}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {[
            t("setup.scenarioCash", { value: `${Math.round(scenario.cashMultiplier * 100)}%` }),
            ...industry.initialBonus.map((key) => t(key)),
            ...founder.initialBonus.map((key) => t(key)),
          ].join(" / ")}
        </p>
      </div>
    </div>
  );
}

const SummaryCard = ({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) => {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 min-h-10 text-sm font-black leading-5 text-slate-950">{value}</p>
      <button
        type="button"
        onClick={onEdit}
        className="mt-2 rounded-md border border-slate-300 px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50"
      >
        {t("setup.edit")}
      </button>
    </div>
  );
};
