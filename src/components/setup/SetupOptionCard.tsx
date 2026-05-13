import type { ReactNode } from "react";
import { useI18n } from "../../i18n";

type SetupOptionCardProps = {
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  disabledReason?: string;
  difficulty?: string;
  recommendation?: string;
  strengths?: string[];
  weaknesses?: string[];
  bonuses?: string[];
  illustration?: ReactNode;
  onSelect: () => void;
};

export default function SetupOptionCard({
  title,
  description,
  selected,
  disabled = false,
  disabledReason,
  difficulty,
  recommendation,
  strengths = [],
  weaknesses = [],
  bonuses = [],
  illustration,
  onSelect,
}: SetupOptionCardProps) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`group min-h-28 rounded-xl border p-3 text-left transition duration-200 ${
        selected ? "border-teal-500 bg-teal-50 shadow-md shadow-teal-100 ring-2 ring-teal-200" : "border-slate-200 bg-white hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
      } disabled:cursor-not-allowed disabled:opacity-45`}
    >
      {illustration && <div className="mb-3">{illustration}</div>}
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
      {disabledReason && (
        <p className="mt-2 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold leading-4 text-slate-700">
          {disabledReason}
        </p>
      )}
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
