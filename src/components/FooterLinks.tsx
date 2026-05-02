import { useI18n } from "../i18n";
import type { ActiveView } from "./Navigation";

type FooterLinksProps = {
  onNavigate: (view: ActiveView) => void;
};

const footerLinks: ActiveView[] = ["privacy", "terms", "about", "contact", "help"];

export default function FooterLinks({ onNavigate }: FooterLinksProps) {
  const { t } = useI18n();

  return (
    <footer className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <nav className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold">
        {footerLinks.map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => onNavigate(view)}
            className="rounded-md px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
          >
            {t(`navigation.${view}`)}
          </button>
        ))}
      </nav>
    </footer>
  );
}
