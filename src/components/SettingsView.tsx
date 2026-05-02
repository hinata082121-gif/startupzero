import type { ReactNode } from "react";
import {
  type FounderType,
  type GameState,
  type IndustryType,
  type MetaProgression,
  type ScenarioType,
  founderConfig,
  industryConfig,
} from "../gameState";
import { useI18n } from "../i18n";
import LanguageSwitcher from "./LanguageSwitcher";

type SettingsViewProps = {
  state: GameState;
  isPremiumUser: boolean;
  savedGameAvailable: boolean;
  saveSlots: Array<GameState | null>;
  selectedScenario: ScenarioType;
  selectedIndustry: IndustryType;
  selectedFounder: FounderType;
  setupMode?: boolean;
  onPremiumChange: (enabled: boolean) => void;
  onSave: () => void;
  onLoad: () => void;
  onNewGame: () => void;
  onShowTutorial: () => void;
  onOpenHelp: () => void;
  onSaveSlot: (slot: number) => void;
  onLoadSlot: (slot: number) => void;
  onScenarioChange: (scenario: ScenarioType) => void;
  onIndustryChange: (industry: IndustryType) => void;
  onFounderChange: (founder: FounderType) => void;
};

const allScenarios: ScenarioType[] = ["Bootstrapped", "VC Funded", "Crisis Mode"];
const allIndustries: IndustryType[] = ["Local Business Tech", "SaaS", "Game", "AI", "Marketplace"];
const allFounders: FounderType[] = [
  "Product Founder",
  "Engineer Founder",
  "Sales Founder",
  "Growth Founder",
  "Bootstrap Founder",
];

export default function SettingsView({
  state,
  isPremiumUser,
  savedGameAvailable,
  saveSlots,
  selectedScenario,
  selectedIndustry,
  selectedFounder,
  setupMode = false,
  onPremiumChange,
  onSave,
  onLoad,
  onNewGame,
  onShowTutorial,
  onOpenHelp,
  onSaveSlot,
  onLoadSlot,
  onScenarioChange,
  onIndustryChange,
  onFounderChange,
}: SettingsViewProps) {
  const { t } = useI18n();

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        {setupMode && (
          <section className="rounded-xl border border-teal-200 bg-teal-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {t("setup.title")}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">{t("setup.subtitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-teal-950">{t("setup.body")}</p>
          </section>
        )}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {t("navigation.settings")}
            </p>
            <h2 className="text-2xl font-bold text-slate-950">{t("settings.preferences")}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <LanguageSwitcher />
            <label className="flex min-h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isPremiumUser}
                onChange={(event) => onPremiumChange(event.target.checked)}
                className="h-4 w-4 accent-teal-700"
              />
              {t("settings.premiumToggle")}
            </label>
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
              {setupMode ? t("setup.startGame") : t("common.newGame")}
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
        </section>

        <SetupPanel
          meta={state.meta}
          selectedScenario={selectedScenario}
          selectedIndustry={selectedIndustry}
          selectedFounder={selectedFounder}
          onScenarioChange={onScenarioChange}
          onIndustryChange={onIndustryChange}
          onFounderChange={onFounderChange}
          setupMode={setupMode}
        />

        <SaveSlotsPanel slots={saveSlots} onSave={onSaveSlot} onLoad={onLoadSlot} />
      </div>

      <MetaPanel state={state} />
    </div>
  );
}

type SetupPanelProps = {
  meta: MetaProgression;
  selectedScenario: ScenarioType;
  selectedIndustry: IndustryType;
  selectedFounder: FounderType;
  onScenarioChange: (scenario: ScenarioType) => void;
  onIndustryChange: (industry: IndustryType) => void;
  onFounderChange: (founder: FounderType) => void;
  setupMode?: boolean;
};

function SetupPanel({
  meta,
  selectedScenario,
  selectedIndustry,
  selectedFounder,
  onScenarioChange,
  onIndustryChange,
  onFounderChange,
  setupMode = false,
}: SetupPanelProps) {
  const { t } = useI18n();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {t("dashboard.replaySetup")}
        </p>
        <h2 className="text-xl font-bold text-slate-950">
          {setupMode ? t("setup.configureRun") : t("dashboard.nextRunLoadout")}
        </h2>
      </div>
      <div className="grid gap-4">
        <ChoiceGroup title={t("dashboard.scenario")}>
          {allScenarios.map((scenario) => (
            <ChoiceButton
              key={scenario}
              selected={selectedScenario === scenario}
              onClick={() => onScenarioChange(scenario)}
              title={t(`entities.scenarios.${scenario}.title`)}
              description={t(`entities.scenarios.${scenario}.description`)}
            />
          ))}
        </ChoiceGroup>

        <ChoiceGroup title={t("dashboard.industry")}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {allIndustries.map((industry) => {
              const unlocked = meta.unlockedIndustries.includes(industry);
              const config = industryConfig[industry];
            return (
              <ChoiceButton
                key={industry}
                selected={selectedIndustry === industry}
                disabled={!unlocked}
                onClick={() => onIndustryChange(industry)}
                title={`${t(`entities.industries.${industry}.title`)} ${unlocked ? "" : t("common.locked")}`}
                description={t(`entities.industries.${industry}.description`)}
                difficulty={t(`setup.difficulty.${config.difficulty}`)}
                recommendation={t(config.recommendationKey)}
                strengths={config.strengths.map((key) => t(key))}
                weaknesses={config.weaknesses.map((key) => t(key))}
                bonuses={config.initialBonus.map((key) => t(key))}
              />
            );
            })}
          </div>
        </ChoiceGroup>

        <ChoiceGroup title={t("dashboard.founder")}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {allFounders.map((founder) => {
              const unlocked = meta.unlockedFounders.includes(founder);
              const config = founderConfig[founder];
            return (
              <ChoiceButton
                key={founder}
                selected={selectedFounder === founder}
                disabled={!unlocked}
                onClick={() => onFounderChange(founder)}
                title={`${t(`entities.founders.${founder}.title`)} ${unlocked ? "" : t("common.locked")}`}
                description={t(`entities.founders.${founder}.description`)}
                difficulty={t(`setup.difficulty.${config.difficulty}`)}
                recommendation={t(config.recommendationKey)}
                strengths={config.strengths.map((key) => t(key))}
                weaknesses={config.weaknesses.map((key) => t(key))}
                bonuses={config.initialBonus.map((key) => t(key))}
              />
            );
            })}
          </div>
        </ChoiceGroup>
      </div>
    </section>
  );
}

function ChoiceGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-bold text-slate-700">{title}</p>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

function ChoiceButton({
  title,
  description,
  selected,
  disabled,
  onClick,
  difficulty,
  recommendation,
  strengths = [],
  weaknesses = [],
  bonuses = [],
}: {
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  difficulty?: string;
  recommendation?: string;
  strengths?: string[];
  weaknesses?: string[];
  bonuses?: string[];
}) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-h-20 rounded-md border p-3 text-left text-sm transition ${
        selected ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-slate-50"
      } disabled:cursor-not-allowed disabled:opacity-45`}
    >
      <span className="flex flex-wrap items-center gap-2 font-bold text-slate-950">
        {title}
        {recommendation && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
            {recommendation}
          </span>
        )}
        {difficulty && (
          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-slate-600">
            {difficulty}
          </span>
        )}
      </span>
      <span className="mt-1 line-clamp-2 block leading-5 text-slate-600">{description}</span>
      {(strengths.length > 0 || weaknesses.length > 0 || bonuses.length > 0) && (
        <span className="mt-3 grid gap-2 text-xs leading-5 text-slate-600">
          {strengths.length > 0 && (
            <span>
              <span className="font-bold text-emerald-700">{t("setup.strengths")}: </span>
              {strengths.join(" / ")}
            </span>
          )}
          {weaknesses.length > 0 && (
            <span>
              <span className="font-bold text-red-700">{t("setup.weaknesses")}: </span>
              {weaknesses.join(" / ")}
            </span>
          )}
          {bonuses.length > 0 && (
            <span>
              <span className="font-bold text-sky-700">{t("setup.initialBonus")}: </span>
              {bonuses.join(" / ")}
            </span>
          )}
        </span>
      )}
    </button>
  );
}

function MetaPanel({ state }: { state: GameState }) {
  const { t } = useI18n();
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
        <InfoRow label={t("dashboard.bestRevenue")} value={`$${state.meta.bestRevenue.toLocaleString()}`} />
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
  const { t } = useI18n();
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
                    revenue: slot.revenue.toLocaleString(),
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
