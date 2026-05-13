import { actionEffectHints, directionSymbol, directionTone, type EffectDirection } from "../actionEffects";
import type { ActionType } from "../gameState";
import { useI18n } from "../i18n";

type ActionConfirmModalProps = {
  action: ActionType;
  onExecute: () => void;
  onCancel: () => void;
};

export default function ActionConfirmModal({ action, onExecute, onCancel }: ActionConfirmModalProps) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-3 py-4">
      <section className="w-full max-w-[560px] rounded-2xl bg-white p-5 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{t("turn.confirmEyebrow")}</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">{t("turn.confirmTitle")}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          {t("turn.confirmDescription", { action: `i18n:actions.${action}.title` })}
        </p>
        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-sm font-bold text-slate-950">{t(`actions.${action}.title`)}</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{t(`actions.${action}.description`)}</p>
          <p className="mt-2 text-xs font-semibold text-slate-500">{t(`actions.${action}.effect`)}</p>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{t("turn.affectedMetrics")}</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {actionEffectHints[action].map((effect) => (
              <EffectRow
                key={effect.metricKey}
                label={t(effect.metricKey)}
                direction={effect.direction}
              />
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            {t("turn.back")}
          </button>
          <button
            type="button"
            onClick={onExecute}
            className="min-h-11 rounded-md bg-teal-600 px-5 py-2 text-sm font-black text-white hover:bg-teal-700"
          >
            {t("turn.execute")}
          </button>
        </div>
      </section>
    </div>
  );
}

const EffectRow = ({ label, direction }: { label: string; direction: EffectDirection }) => (
  <div className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm font-bold ${directionTone[direction]}`}>
    <span>{label}</span>
    <span className="text-base">{directionSymbol[direction]}</span>
  </div>
);
