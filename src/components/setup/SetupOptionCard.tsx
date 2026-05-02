import { useI18n } from "../../i18n";

type SetupOptionCardProps = {
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  difficulty?: string;
  recommendation?: string;
  strengths?: string[];
  weaknesses?: string[];
  bonuses?: string[];
  onSelect: () => void;
};

export default function SetupOptionCard({
  title,
  description,
  selected,
  disabled = false,
  difficulty,
  recommendation,
  strengths = [],
  weaknesses = [],
  bonuses = [],
  onSelect,
}: SetupOptionCardProps) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`min-h-28 rounded-lg border p-3 text-left transition ${
        selected ? "border-teal-600 bg-teal-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"
      } disabled:cursor-not-allowed disabled:opacity-45`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-black text-slate-950">{title}</h3>
        {recommendation && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
            {recommendation}
          </span>
        )}
        {difficulty && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
            {difficulty}
          </span>
        )}
      </div>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">{description}</p>
      {selected && (
        <div className="mt-3 grid gap-1 text-[11px] leading-4 text-slate-600">
          {strengths.length > 0 && (
            <p>
              <span className="font-bold text-emerald-700">{t("setup.strengths")}: </span>
              {strengths.slice(0, 2).join(" / ")}
            </p>
          )}
          {weaknesses.length > 0 && (
            <p>
              <span className="font-bold text-red-700">{t("setup.weaknesses")}: </span>
              {weaknesses.slice(0, 2).join(" / ")}
            </p>
          )}
          {bonuses.length > 0 && (
            <p>
              <span className="font-bold text-sky-700">{t("setup.initialBonus")}: </span>
              {bonuses.slice(0, 2).join(" / ")}
            </p>
          )}
        </div>
      )}
    </button>
  );
}
