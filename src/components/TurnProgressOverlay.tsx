import { useI18n } from "../i18n";

type TurnProgressOverlayProps = {
  month: number;
};

export default function TurnProgressOverlay({ month }: TurnProgressOverlayProps) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
      <section className="w-full max-w-[520px] rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-teal-600" />
        <h2 className="mt-5 text-2xl font-black text-slate-950">
          {t("turn.advancing", { month })}
        </h2>
        <div className="mt-4 space-y-2 text-sm font-semibold text-slate-600">
          <p>{t("turn.processingTeam")}</p>
          <p>{t("turn.checkingMarket")}</p>
        </div>
      </section>
    </div>
  );
}
