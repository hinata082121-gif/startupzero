import { useState } from "react";
import { actionEffectHints, directionSymbol, directionTone, type EffectDirection } from "../actionEffects";
import { actions, type ActionType, type GameStatus } from "../gameState";
import { useI18n } from "../i18n";

type ActionPanelProps = {
  status: GameStatus;
  onAction: (action: ActionType) => void;
};

const actionMeta: Record<ActionType, { risk: "Low" | "Med" | "High"; reward: "Low" | "Med" | "High" }> = {
  Develop: {
    risk: "Low",
    reward: "Med",
  },
  Hire: {
    risk: "Med",
    reward: "High",
  },
  Marketing: {
    risk: "Med",
    reward: "High",
  },
  Fundraising: {
    risk: "High",
    reward: "High",
  },
  Pivot: {
    risk: "High",
    reward: "High",
  },
  Rest: {
    risk: "Low",
    reward: "Low",
  },
};

export default function ActionPanel({ status, onAction }: ActionPanelProps) {
  const disabled = status !== "playing";
  const isCraftNovaLayout = __CRAFTNOVA_BUILD__;
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const { t } = useI18n();

  const handleAction = (action: ActionType) => {
    setSelectedAction(action);
    window.setTimeout(() => setSelectedAction(null), 220);
    onAction(action);
  };

  return (
    <section className={isCraftNovaLayout ? "rounded-lg border border-slate-200 bg-white p-3 shadow-sm" : "rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"}>
      <div className={isCraftNovaLayout ? "mb-2 flex items-start justify-between gap-3" : "mb-5 flex items-start justify-between gap-4"}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t("actions.choose")}
          </p>
          <h2 className={isCraftNovaLayout ? "text-xl font-bold text-slate-950" : "text-2xl font-bold text-slate-950"}>{t("actions.thisMonth")}</h2>
        </div>
        <div className={isCraftNovaLayout ? "rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold capitalize text-slate-700" : "rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold capitalize text-slate-700"}>
          {t(`common.status.${status}`)}
        </div>
      </div>

      <div className={isCraftNovaLayout ? "grid gap-2 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-3 sm:grid-cols-2"}>
        {actions.map((action) => {
          const meta = actionMeta[action];
          const active = selectedAction === action;

          return (
            <button
              key={action}
              type="button"
              disabled={disabled}
              onClick={() => handleAction(action)}
              className={`group rounded-lg border bg-slate-50 text-left transition duration-150 hover:-translate-y-0.5 hover:border-teal-500 hover:bg-teal-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-slate-200 disabled:hover:bg-slate-50 ${
                isCraftNovaLayout ? "min-h-24 p-3" : "min-h-32 p-4"
              } ${
                active ? "scale-[0.99] border-teal-600 ring-2 ring-teal-100" : "border-slate-200"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="block text-base font-bold text-slate-950">
                  {t(`actions.${action}.title`)}
                </span>
                <div className="flex gap-1">
                  <RiskBadge label={t("actions.riskShort", { risk: t(`actions.risk.${meta.risk}`) })} risk={meta.risk} />
                  <RewardBadge label={t("actions.rewardShort", { reward: t(`actions.reward.${meta.reward}`) })} reward={meta.reward} />
                </div>
              </div>
              <span className={isCraftNovaLayout ? "mt-1 block line-clamp-2 text-xs leading-5 text-slate-600" : "mt-2 block text-sm leading-6 text-slate-600"}>
                {t(`actions.${action}.description`)}
              </span>
              <span className={isCraftNovaLayout ? "hidden" : "mt-3 block rounded-md bg-white px-3 py-2 text-xs leading-5 text-slate-500 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100"}>
                {t(`actions.${action}.effect`)}
              </span>
              <div className={isCraftNovaLayout ? "mt-2 flex flex-wrap gap-1" : "mt-3 grid gap-1.5 sm:grid-cols-2"}>
                {actionEffectHints[action].map((effect) => (
                  <EffectPill
                    key={`${action}-${effect.metricKey}`}
                    label={t(effect.metricKey)}
                    direction={effect.direction}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

const RiskBadge = ({ label, risk }: { label: string; risk: "Low" | "Med" | "High" }) => {
  const className =
    risk === "High"
      ? "bg-red-100 text-red-700"
      : risk === "Med"
        ? "bg-amber-100 text-amber-700"
        : "bg-emerald-100 text-emerald-700";

  return <span className={`rounded px-2 py-1 text-[11px] font-bold ${className}`}>{label}</span>;
};

const EffectPill = ({ label, direction }: { label: string; direction: EffectDirection }) => (
  <span className={`rounded border px-2 py-1 text-[11px] font-bold ${directionTone[direction]}`}>
    {label} {directionSymbol[direction]}
  </span>
);

const RewardBadge = ({ label, reward }: { label: string; reward: "Low" | "Med" | "High" }) => {
  const className =
    reward === "High"
      ? "bg-teal-100 text-teal-700"
      : reward === "Med"
        ? "bg-sky-100 text-sky-700"
        : "bg-slate-200 text-slate-600";

  return <span className={`rounded px-2 py-1 text-[11px] font-bold ${className}`}>{label}</span>;
};
