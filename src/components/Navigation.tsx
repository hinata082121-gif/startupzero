import { useI18n } from "../i18n";

export type ActiveView =
  | "home"
  | "actions"
  | "report"
  | "analysis"
  | "mentor"
  | "ranking"
  | "log"
  | "help"
  | "privacy"
  | "terms"
  | "about"
  | "contact"
  | "settings";

type NavigationProps = {
  activeView: ActiveView;
  onChange: (view: ActiveView) => void;
};

const items: Array<{ id: ActiveView; mark: string }> = [
  { id: "home", mark: "H" },
  { id: "actions", mark: "A" },
  { id: "report", mark: "R" },
  { id: "analysis", mark: "N" },
  { id: "mentor", mark: "M" },
  { id: "ranking", mark: "#" },
  { id: "log", mark: "L" },
  { id: "help", mark: "?" },
  { id: "settings", mark: "S" },
];

export default function Navigation({ activeView, onChange }: NavigationProps) {
  const { t } = useI18n();
  const isCraftNovaLayout = __CRAFTNOVA_BUILD__;

  if (isCraftNovaLayout) {
    return (
      <nav className="fixed inset-x-0 bottom-0 z-30 flex gap-1 overflow-x-auto border-t border-slate-200 bg-white/95 px-2 py-1.5 shadow-lg backdrop-blur">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex min-h-11 min-w-16 flex-col items-center justify-center rounded-md px-2 text-[10px] font-bold transition ${
              activeView === item.id ? "bg-teal-600 text-white" : "text-slate-600"
            }`}
          >
            <span className="text-xs leading-none">{item.mark}</span>
            <span className="mt-0.5 max-w-full truncate">{t(`navigation.${item.id}`)}</span>
          </button>
        ))}
      </nav>
    );
  }

  return (
    <>
      <nav className="hidden h-full border-r border-slate-200 bg-slate-950 px-3 py-5 text-white lg:block">
        <div className="mb-6 px-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">
            {t("app.productLabel")}
          </p>
          <h1 className="mt-1 text-xl font-bold">{t("app.title")}</h1>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold transition ${
                activeView === item.id
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-xs">
                {item.mark}
              </span>
              {t(`navigation.${item.id}`)}
            </button>
          ))}
        </div>
      </nav>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-slate-200 bg-white/95 px-1 py-1 shadow-lg backdrop-blur lg:hidden">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`flex min-h-14 flex-col items-center justify-center rounded-md text-[11px] font-bold transition ${
              activeView === item.id ? "bg-teal-600 text-white" : "text-slate-600"
            }`}
          >
            <span className="text-xs">{item.mark}</span>
            <span className="mt-0.5 max-w-full truncate">{t(`navigation.${item.id}`)}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
