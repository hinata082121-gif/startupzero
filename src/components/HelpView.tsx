import type { ReactNode } from "react";
import { useI18n } from "../i18n";

const flowSteps = ["one", "two", "three", "four", "five"];

const metrics = [
  "cash",
  "revenue",
  "users",
  "burnRate",
  "runway",
  "teamMorale",
  "productProgress",
  "marketFit",
  "reputation",
  "fundingStage",
];

const actions = [
  "develop",
  "hire",
  "marketing",
  "fundraising",
  "pivot",
  "rest",
];

const principles = ["runway", "users", "morale", "balance", "recovery"];

export default function HelpView() {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          {t("navigation.help")}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">{t("help.title")}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {t("help.intro")}
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <HelpCard title={t("help.objective.title")}>
          <p>{t("help.objective.body")}</p>
        </HelpCard>

        <HelpCard title={t("help.flow.title")}>
          <ol className="grid gap-2 sm:grid-cols-2">
            {flowSteps.map((step) => (
              <li key={step} className="rounded-lg bg-slate-50 px-3 py-2">
                {t(`help.flow.${step}`)}
              </li>
            ))}
          </ol>
        </HelpCard>
      </section>

      <HelpCard title={t("help.metrics.title")}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <GlossaryItem
              key={metric}
              title={t(`help.metrics.${metric}.title`)}
              description={t(`help.metrics.${metric}.description`)}
            />
          ))}
        </div>
      </HelpCard>

      <HelpCard title={t("help.actions.title")}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => (
            <GlossaryItem
              key={action}
              title={t(`help.actions.${action}.title`)}
              description={t(`help.actions.${action}.description`)}
            />
          ))}
        </div>
      </HelpCard>

      <section className="grid gap-4 xl:grid-cols-2">
        <HelpCard title={t("help.industries.title")}>
          <p>{t("help.industries.body")}</p>
        </HelpCard>
        <HelpCard title={t("help.founders.title")}>
          <p>{t("help.founders.body")}</p>
        </HelpCard>
      </section>

      <HelpCard title={t("help.principles.title")}>
        <div className="grid gap-2 sm:grid-cols-2">
          {principles.map((principle) => (
            <p
              key={principle}
              className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold leading-6 text-amber-950"
            >
              {t(`help.principles.${principle}`)}
            </p>
          ))}
        </div>
      </HelpCard>
    </div>
  );
}

function HelpCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm">
      <h3 className="mb-3 text-lg font-bold text-slate-950">{title}</h3>
      {children}
    </section>
  );
}

function GlossaryItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <h4 className="font-bold text-slate-950">{title}</h4>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}
