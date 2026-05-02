import { useState } from "react";
import { useI18n } from "../i18n";

type TutorialOverlayProps = {
  onClose: () => void;
  onOpenHelp: () => void;
};

const steps = ["goal", "turn", "metrics", "help"];

export default function TutorialOverlay({ onClose, onOpenHelp }: TutorialOverlayProps) {
  const { t } = useI18n();
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-40 flex items-end bg-slate-950/60 p-4 sm:items-center sm:justify-center">
      <section className="w-full max-w-xl rounded-xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {t("tutorial.welcome")}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {t(`tutorial.steps.${step}.title`)}
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {t("tutorial.progress", { current: stepIndex + 1, total: steps.length })}
          </span>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-700">
          {t(`tutorial.steps.${step}.body`)}
        </p>

        <div className="mt-5 flex gap-2">
          {steps.map((item, index) => (
            <span
              key={item}
              className={`h-2 flex-1 rounded-full ${
                index <= stepIndex ? "bg-teal-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700"
          >
            {t("tutorial.skip")}
          </button>
          <button
            type="button"
            onClick={onOpenHelp}
            className="min-h-11 rounded-md border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800"
          >
            {t("tutorial.viewHelp")}
          </button>
          <button
            type="button"
            onClick={() => (isLastStep ? onClose() : setStepIndex((current) => current + 1))}
            className="min-h-11 rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
          >
            {isLastStep ? t("tutorial.start") : t("tutorial.next")}
          </button>
        </div>
      </section>
    </div>
  );
}
