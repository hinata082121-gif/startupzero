import { useMemo } from "react";
import type { ReactNode } from "react";
import { generateMentorAdvice } from "../analytics/gameAnalytics";
import type { RecommendedAction } from "../analytics/types";
import type { GameState } from "../gameState";
import { useI18n } from "../i18n";

type AIMentorPanelProps = {
  state: GameState;
};

export default function AIMentorPanel({ state }: AIMentorPanelProps) {
  const { t, currentLanguage } = useI18n();
  const advice = useMemo(() => generateMentorAdvice(state), [state, currentLanguage]);

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {t("mentor.title")}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {t("mentor.analysisTitle")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t("mentor.adSupportedDepth")}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            {t("mentor.adSupportedLabel")}
          </span>
        </div>
      </div>

      <MentorCard title={t("mentor.currentAnalysis")} tone="blue">
        <div className="grid gap-2 sm:grid-cols-2">
          {advice.currentAnalysis.map((key) => (
            <p key={key} className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-950">
              {t(key)}
            </p>
          ))}
        </div>
      </MentorCard>

      <MentorCard title={t("mentor.recommendedActions")} tone="green">
        <div className="space-y-2">
          {advice.recommendedActions.map((item, index) => (
            <RecommendationRow key={`${item.action}-${item.reasonKey}`} item={item} index={index} />
          ))}
        </div>
      </MentorCard>

      <MentorCard title={t("mentor.riskWarnings")} tone="amber">
        <div className="space-y-2">
          {advice.riskWarnings.map((key) => (
            <p key={key} className="rounded-lg bg-amber-50 px-3 py-2 text-sm leading-6 text-amber-950">
              {t(key)}
            </p>
          ))}
        </div>
      </MentorCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <MentorCard title={t("mentor.reasoning")} tone="purple">
          <p className="text-sm leading-6 text-slate-700">{t(advice.reasoningKey)}</p>
        </MentorCard>
        <MentorCard title={t("mentor.beginnerNote")} tone="slate">
          <p className="text-sm leading-6 text-slate-700">{t(advice.beginnerNoteKey)}</p>
        </MentorCard>
      </div>
    </section>
  );
}

const MentorCard = ({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "blue" | "green" | "amber" | "purple" | "slate";
  children: ReactNode;
}) => {
  const colors = {
    blue: "border-blue-200",
    green: "border-emerald-200",
    amber: "border-amber-200",
    purple: "border-purple-200",
    slate: "border-slate-200",
  };

  return (
    <section className={`rounded-xl border ${colors[tone]} bg-white p-4 shadow-sm`}>
      <h3 className="text-lg font-bold text-slate-950">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
};

const RecommendationRow = ({ item, index }: { item: RecommendedAction; index: number }) => {
  const { t } = useI18n();

  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
          {index + 1}
        </span>
        <p className="font-bold text-emerald-950">{t(`actions.${item.action}.title`)}</p>
      </div>
      <p className="mt-2 text-sm leading-6 text-emerald-900">{t(item.reasonKey)}</p>
    </div>
  );
};
