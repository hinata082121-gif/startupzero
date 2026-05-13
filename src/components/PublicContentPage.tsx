import AdSlot from "@ads/AdSlot";
import { canShowPublicAds } from "../ads/publicAdPolicy";
import {
  getPublicPage,
  navLabels,
  type PublicRoute,
} from "../content/publicPages";
import { useI18n } from "../i18n";

type PublicContentPageProps = {
  route: PublicRoute;
};

export default function PublicContentPage({ route }: PublicContentPageProps) {
  const { currentLanguage } = useI18n();
  const page = getPublicPage(currentLanguage, route);
  const labels = navLabels[currentLanguage];

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-br from-white via-teal-50 to-slate-100">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-teal-700">
              Startup Zero
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
              {page.intro}
            </p>
            {page.ctaLabel && page.ctaHref && (
              <div className="mt-7">
                <a
                  href={page.ctaHref}
                  className="inline-flex min-h-12 items-center rounded-lg bg-teal-600 px-5 text-base font-black text-white shadow-sm transition hover:bg-teal-700"
                >
                  {page.ctaLabel}
                </a>
              </div>
            )}
          </div>
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-wide text-slate-500">
              {currentLanguage === "ja" ? "このページで分かること" : "On this page"}
            </h2>
            <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-700">
              {page.sections.map((section) => (
                <li key={section.title} className="flex gap-2">
                  <span className="mt-2 h-2 w-2 flex-none rounded-full bg-teal-500" />
                  <span>{section.title}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-5">
          {page.sections.map((section, index) => (
            <article
              key={section.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-black text-teal-700">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-8 text-slate-700">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        {canShowPublicAds(route) && (
          <div className="mt-8 border-t border-slate-200 pt-2">
            <AdSlot label={currentLanguage === "ja" ? "広告" : "Advertisement"} />
          </div>
        )}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">
            {currentLanguage === "ja" ? "関連ページ" : "Related pages"}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {page.related.map((related) => (
              <a
                key={related}
                href={related}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-teal-100 hover:text-teal-800"
              >
                {related === "/play"
                  ? labels.play
                  : getPublicPage(currentLanguage, related as PublicRoute).h1}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

