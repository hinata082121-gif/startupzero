import type { GameState } from "../gameState";
import { formatCurrency } from "../formatters";
import { useI18n } from "../i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import type { ActiveView } from "./Navigation";

type SettingsViewProps = {
  state: GameState;
  savedGameAvailable: boolean;
  saveSlots: Array<GameState | null>;
  onSave: () => void;
  onLoad: () => void;
  onNewGame: () => void;
  onShowTutorial: () => void;
  onOpenHelp: () => void;
  onNavigate: (view: ActiveView) => void;
  onSaveSlot: (slot: number) => void;
  onLoadSlot: (slot: number) => void;
};

export default function SettingsView({
  state,
  savedGameAvailable,
  saveSlots,
  onSave,
  onLoad,
  onNewGame,
  onShowTutorial,
  onOpenHelp,
  onNavigate,
  onSaveSlot,
  onLoadSlot,
}: SettingsViewProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {t("navigation.settings")}
            </p>
            <h2 className="text-2xl font-bold text-slate-950">{t("settings.preferences")}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <LanguageSwitcher />
            <div className="flex min-h-11 items-center rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
              {t("settings.adSupported")}
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button type="button" onClick={onSave} className="min-h-11 rounded-md bg-slate-950 px-4 py-2 text-sm font-bold text-white">
              {t("common.save")}
            </button>
            <button
              type="button"
              onClick={onLoad}
              disabled={!savedGameAvailable}
              className="min-h-11 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("common.load")}
            </button>
            <button type="button" onClick={onNewGame} className="min-h-11 rounded-md bg-teal-600 px-4 py-2 text-sm font-bold text-white">
              {t("common.newGame")}
            </button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={onShowTutorial}
              className="min-h-11 rounded-md border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800"
            >
              {t("settings.showTutorial")}
            </button>
            <button
              type="button"
              onClick={onOpenHelp}
              className="min-h-11 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700"
            >
              {t("settings.openHelp")}
            </button>
          </div>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              {t("settings.siteLinks")}
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {(["privacy", "terms", "about", "contact", "help"] as ActiveView[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => onNavigate(view)}
                  className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  {t(`navigation.${view}`)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <SaveSlotsPanel slots={saveSlots} onSave={onSaveSlot} onLoad={onLoadSlot} />
      </div>

      <MetaPanel state={state} />
    </div>
  );
}

function MetaPanel({ state }: { state: GameState }) {
  const { t, currentLanguage } = useI18n();
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t("dashboard.metaProgression")}
      </p>
      <h2 className="mt-1 text-2xl font-bold text-slate-950">
        {state.meta.xp} {t("common.xp")}
      </h2>
      <div className="mt-4 space-y-3 text-sm text-slate-700">
        <InfoRow label={t("dashboard.runs")} value={state.meta.runs.toLocaleString()} />
        <InfoRow label={t("dashboard.bestRevenue")} value={formatCurrency(state.meta.bestRevenue, currentLanguage)} />
        <InfoRow
          label={t("modes.founderLeague.progressLabel")}
          value={`${Math.min(state.meta.normalModeClears, 2)} / 2`}
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t("dashboard.currentRun")}
          </p>
          <p className="mt-1 leading-6">
            {t(`entities.scenarios.${state.scenario}.title`)} / {t(`entities.industries.${state.industry}.title`)} / {t(`entities.founders.${state.founder}.title`)} / {t(`entities.traits.${state.trait}`)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t("dashboard.achievements")}
          </p>
          <p className="mt-1 leading-6">
            {state.meta.achievements.length
              ? state.meta.achievements.map((achievement) => t(`entities.achievements.${achievement}`)).join(", ")
              : t("dashboard.noAchievements")}
          </p>
        </div>
        {state.deathReason && (
          <div className="rounded-md bg-red-50 p-3 text-red-800">
            <p className="text-xs font-semibold uppercase tracking-wide">{t("dashboard.whyEnded")}</p>
            <p className="mt-1 leading-6">
              {state.deathReason.startsWith("i18n:") ? t(state.deathReason.slice(5)) : state.deathReason}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function SaveSlotsPanel({
  slots,
  onSave,
  onLoad,
}: {
  slots: Array<GameState | null>;
  onSave: (slot: number) => void;
  onLoad: (slot: number) => void;
}) {
  const { t, currentLanguage } = useI18n();
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t("dashboard.saveSlots")}
        </p>
        <h2 className="text-xl font-bold text-slate-950">{t("dashboard.campaignSaves")}</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {slots.map((slot, index) => (
          <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="font-bold text-slate-950">{t("dashboard.slot", { slot: index + 1 })}</p>
            <p className="mt-1 min-h-10 text-sm leading-5 text-slate-600">
              {slot
                ? t("dashboard.slotSummary", {
                    month: slot.month,
                    scenario: `i18n:entities.scenarios.${slot.scenario}.title`,
                    industry: `i18n:entities.industries.${slot.industry}.title`,
                    revenue: formatCurrency(slot.revenue, currentLanguage),
                  })
                : t("common.empty")}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSave(index)}
                className="min-h-10 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
              >
                {t("common.save")}
              </button>
              <button
                type="button"
                onClick={() => onLoad(index)}
                disabled={!slot}
                className="min-h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t("common.load")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
