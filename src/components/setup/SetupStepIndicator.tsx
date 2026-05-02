import { useI18n } from "../../i18n";

type SetupStep = "scenario" | "industry" | "founder" | "confirm";

type SetupStepIndicatorProps = {
  currentStep: SetupStep;
};

const steps: SetupStep[] = ["scenario", "industry", "founder", "confirm"];

export default function SetupStepIndicator({ currentStep }: SetupStepIndicatorProps) {
  const { t } = useI18n();
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
        {t("setup.progress", {
          current: currentIndex + 1,
          total: steps.length,
          step: t(`setup.step.${currentStep}`),
        })}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`h-2 rounded-full ${
              index <= currentIndex ? "bg-teal-600" : "bg-slate-200"
            }`}
            title={t(`setup.step.${step}`)}
          />
        ))}
      </div>
    </div>
  );
}
