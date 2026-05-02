import { useI18n } from "../i18n";

export type StaticPage = "privacy" | "terms" | "about" | "contact";

type StaticPageViewProps = {
  page: StaticPage;
};

const sectionKeys: Record<StaticPage, string[]> = {
  privacy: [
    "overview",
    "adsense",
    "cookies",
    "thirdParty",
    "adCookies",
    "optOut",
    "analytics",
    "contact",
  ],
  terms: ["use", "game", "ads", "disclaimer", "changes"],
  about: ["overview", "simulation", "beginner", "education"],
  contact: ["email", "bugs", "adsPolicy"],
};

export default function StaticPageView({ page }: StaticPageViewProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          {t(`site.${page}.eyebrow`)}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-950">
          {t(`site.${page}.title`)}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {t(`site.${page}.intro`)}
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {sectionKeys[page].map((section) => (
          <article
            key={section}
            className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 shadow-sm"
          >
            <h3 className="text-lg font-bold text-slate-950">
              {t(`site.${page}.sections.${section}.title`)}
            </h3>
            <p className="mt-2">{t(`site.${page}.sections.${section}.body`)}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
