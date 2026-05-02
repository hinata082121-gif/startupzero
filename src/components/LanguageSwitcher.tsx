import { trackLanguageChanged } from "../analytics/tracking";
import { useI18n } from "../i18n";
import type { Language } from "../i18n/types";

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage, t } = useI18n();

  return (
    <label className="flex min-h-11 w-full items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm sm:w-auto">
      <span aria-hidden="true" className="text-base leading-none">
        🌐
      </span>
      <span className="whitespace-nowrap">{t("common.language")}</span>
      <select
        aria-label={t("common.language")}
        value={currentLanguage}
        onChange={(event) => {
          const language = event.target.value as Language;
          setLanguage(language);
          trackLanguageChanged({ language });
        }}
        className="min-h-8 min-w-24 flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:flex-none"
      >
        <option value="en">{t("common.english")}</option>
        <option value="ja">{t("common.japanese")}</option>
      </select>
    </label>
  );
}
