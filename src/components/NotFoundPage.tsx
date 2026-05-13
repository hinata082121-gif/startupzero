import { navLabels } from "../content/publicPages";
import { useI18n } from "../i18n";
import PublicSiteLayout from "./PublicSiteLayout";

export default function NotFoundPage() {
  const { currentLanguage } = useI18n();
  const labels = navLabels[currentLanguage];

  return (
    <PublicSiteLayout activeRoute="/404">
      <section className="mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-red-600">404</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            {currentLanguage === "ja" ? "ページが見つかりません" : "Page not found"}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {currentLanguage === "ja"
              ? "指定されたページは存在しないか、移動した可能性があります。公開ガイドまたはゲーム本体へ移動してください。"
              : "The requested page does not exist or may have moved. Use the public guide pages or open the game."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a className="rounded-lg bg-teal-600 px-4 py-3 font-black text-white" href="/">
              {labels.home}
            </a>
            <a className="rounded-lg bg-slate-100 px-4 py-3 font-black text-slate-700" href="/play">
              {labels.play}
            </a>
          </div>
        </div>
      </section>
    </PublicSiteLayout>
  );
}

