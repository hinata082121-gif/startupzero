import { useState } from "react";
import type { FounderType, GameMode, IndustryType, MetaProgression, ScenarioType } from "../../gameState";
import { useI18n } from "../../i18n";
import CompanyInfoStep from "./CompanyInfoStep";
import FounderSelectStep from "./FounderSelectStep";
import IndustrySelectStep from "./IndustrySelectStep";
import ModeSelectStep from "./ModeSelectStep";
import ScenarioSelectStep from "./ScenarioSelectStep";
import SetupConfirmStep from "./SetupConfirmStep";
import SetupStepIndicator from "./SetupStepIndicator";

type SetupStep = "mode" | "scenario" | "industry" | "founder" | "identity" | "confirm";

type NewGameSetupModalProps = {
  meta: MetaProgression;
  initialScenario: ScenarioType;
  initialIndustry: IndustryType;
  initialFounder: FounderType;
  initialMode: GameMode;
  defaultFounderName: string;
  defaultCompanyName: string;
  canCancel: boolean;
  onCancel: () => void;
  onStart: (setup: {
    mode: GameMode;
    scenario: ScenarioType;
    industry: IndustryType;
    founder: FounderType;
    founderName: string;
    companyName: string;
  }) => void;
};

const steps: SetupStep[] = ["mode", "scenario", "industry", "founder", "identity", "confirm"];

export default function NewGameSetupModal({
  meta,
  initialScenario,
  initialIndustry,
  initialFounder,
  initialMode,
  defaultFounderName,
  defaultCompanyName,
  canCancel,
  onCancel,
  onStart,
}: NewGameSetupModalProps) {
  const { t } = useI18n();
  const founderLeagueUnlocked =
    meta.founderLeagueUnlocked || (meta.normalModeClears ?? 0) >= 2;
  const [currentStep, setCurrentStep] = useState<SetupStep>("mode");
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(
    initialMode === "founderLeague" && !founderLeagueUnlocked ? "normal" : initialMode,
  );
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(initialScenario);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(initialIndustry);
  const [selectedFounder, setSelectedFounder] = useState<FounderType | null>(initialFounder);
  const [founderName, setFounderName] = useState(defaultFounderName);
  const [companyName, setCompanyName] = useState(defaultCompanyName);

  const currentIndex = steps.indexOf(currentStep);
  const canGoNext =
    (currentStep === "mode" && selectedMode) ||
    (currentStep === "scenario" && selectedScenario) ||
    (currentStep === "industry" && selectedIndustry) ||
    (currentStep === "founder" && selectedFounder) ||
    (currentStep === "identity" && founderName.trim() && companyName.trim()) ||
    currentStep === "confirm";

  const goNext = () => {
    if (!canGoNext) return;
    setCurrentStep(steps[Math.min(currentIndex + 1, steps.length - 1)]);
  };

  const goBack = () => {
    setCurrentStep(steps[Math.max(currentIndex - 1, 0)]);
  };

  const startGame = () => {
    if (!selectedMode || !selectedScenario || !selectedIndustry || !selectedFounder) return;
    onStart({
      mode: selectedMode,
      scenario: selectedScenario,
      industry: selectedIndustry,
      founder: selectedFounder,
      founderName: founderName.trim() || defaultFounderName,
      companyName: companyName.trim() || defaultCompanyName,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-3 py-4">
      <section className="flex max-h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="border-b border-slate-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                {t("setup.title")}
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                {t(`setup.step.${currentStep}`)}
              </h2>
            </div>
            <button
              type="button"
              disabled={!canCancel}
              onClick={onCancel}
              className="rounded-md border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t("setup.cancel")}
            </button>
          </div>
          <div className="mt-4">
            <SetupStepIndicator currentStep={currentStep} />
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {currentStep === "mode" && (
            <ModeSelectStep meta={meta} selectedMode={selectedMode} onSelect={setSelectedMode} />
          )}
          {currentStep === "scenario" && (
            <ScenarioSelectStep selectedScenario={selectedScenario} onSelect={setSelectedScenario} />
          )}
          {currentStep === "industry" && (
            <IndustrySelectStep
              meta={meta}
              selectedIndustry={selectedIndustry}
              onSelect={setSelectedIndustry}
            />
          )}
          {currentStep === "founder" && (
            <FounderSelectStep
              meta={meta}
              selectedFounder={selectedFounder}
              onSelect={setSelectedFounder}
            />
          )}
          {currentStep === "identity" && (
            <CompanyInfoStep
              founderName={founderName}
              companyName={companyName}
              onFounderNameChange={setFounderName}
              onCompanyNameChange={setCompanyName}
            />
          )}
          {currentStep === "confirm" && selectedMode && selectedScenario && selectedIndustry && selectedFounder && (
            <SetupConfirmStep
              selectedMode={selectedMode}
              selectedScenario={selectedScenario}
              selectedIndustry={selectedIndustry}
              selectedFounder={selectedFounder}
              founderName={founderName.trim() || defaultFounderName}
              companyName={companyName.trim() || defaultCompanyName}
              onEdit={setCurrentStep}
            />
          )}
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-slate-200 p-4 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={currentIndex === 0}
            className="min-h-11 rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("setup.back")}
          </button>
          <div className="flex flex-col gap-2 sm:flex-row">
            {currentStep === "confirm" ? (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentStep("mode")}
                  className="min-h-11 rounded-md border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800"
                >
                  {t("setup.edit")}
                </button>
                <button
                  type="button"
                  onClick={startGame}
                  className="min-h-11 rounded-md bg-teal-600 px-5 py-2 text-sm font-black text-white hover:bg-teal-700"
                >
                  {t("setup.startGame")}
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={!canGoNext}
                onClick={goNext}
                className="min-h-11 rounded-md bg-teal-600 px-5 py-2 text-sm font-black text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("setup.next")}
              </button>
            )}
          </div>
        </footer>
      </section>
    </div>
  );
}
