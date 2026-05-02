import { useEffect, useMemo, useState } from "react";
import {
  trackActionSelected,
  trackGameOver,
  trackGameStart,
  trackVictory,
} from "./analytics/tracking";
import { BannerAd } from "./components/AdPanels";
import AnalysisView from "./components/AnalysisView";
import ActionsView from "./components/ActionsView";
import ChangeToast from "./components/ChangeToast";
import HelpView from "./components/HelpView";
import HomeView from "./components/HomeView";
import LogView from "./components/LogView";
import MentorView from "./components/MentorView";
import Navigation, { type ActiveView } from "./components/Navigation";
import ReportView from "./components/ReportView";
import SettingsView from "./components/SettingsView";
import StatusBadge from "./components/StatusBadge";
import TutorialOverlay from "./components/TutorialOverlay";
import { playSound } from "./sound";
import {
  DEFAULT_META,
  SAVE_SLOTS_KEY,
  STORAGE_KEY,
  combineModifiers,
  createInitialState,
  normalizeFounder,
  normalizeIndustry,
  type ActionType,
  type FounderType,
  type GameState,
  type IndustryType,
  type MetaProgression,
  type ScenarioType,
} from "./gameState";
import { applyRewardAd, isGameState, playTurn } from "./gameEngine";
import { useI18n } from "./i18n";

const hydrateMeta = (meta?: Partial<MetaProgression>): MetaProgression => ({
  ...DEFAULT_META,
  ...meta,
  unlockedIndustries: Array.from(
    new Set([
      ...DEFAULT_META.unlockedIndustries,
      ...(meta?.unlockedIndustries ?? []).map((industry) => normalizeIndustry(industry)),
    ]),
  ),
  unlockedFounders: Array.from(
    new Set([
      ...DEFAULT_META.unlockedFounders,
      ...(meta?.unlockedFounders ?? []).map((founder) => normalizeFounder(founder)),
    ]),
  ),
});

const hydrateGameState = (state: Partial<GameState>): GameState => ({
  ...state,
  runId: state.runId ?? crypto.randomUUID(),
  industry: normalizeIndustry(state.selectedIndustry ?? state.industry),
  founder: normalizeFounder(state.selectedFounderType ?? state.founder),
  selectedIndustry: normalizeIndustry(state.selectedIndustry ?? state.industry),
  selectedFounderType: normalizeFounder(state.selectedFounderType ?? state.founder),
  industryName: normalizeIndustry(state.selectedIndustry ?? state.industry),
  founderTypeName: normalizeFounder(state.selectedFounderType ?? state.founder),
  modifiers:
    state.modifiers ??
    combineModifiers(
      normalizeIndustry(state.selectedIndustry ?? state.industry),
      normalizeFounder(state.selectedFounderType ?? state.founder),
    ),
  trait: state.trait ?? "Calm Operator",
  scenario: state.scenario ?? "Bootstrapped",
  ending: state.ending ?? null,
  growthPressure: state.growthPressure ?? 1,
  month: state.month ?? 1,
  cash: state.cash ?? 100000,
  revenue: state.revenue ?? 5000,
  users: state.users ?? 100,
  teamMorale: state.teamMorale ?? 70,
  productProgress: state.productProgress ?? 20,
  marketFit: state.marketFit ?? 10,
  reputation: state.reputation ?? 42,
  fundingStage: state.fundingStage ?? (state.scenario === "VC Funded" ? 1 : 0),
  burnRate: state.burnRate ?? 12000,
  runway: state.runway ?? 14,
  status: state.status ?? "playing",
  deathReason: state.deathReason ?? null,
  metaAwarded: state.metaAwarded ?? false,
  logs: (state.logs ?? []).map((log) => ({
    ...log,
    message: log.messageKey ? log.message : "",
    messageKey: log.messageKey ?? "logs.legacy",
    kind: log.kind ?? "system",
  })),
  monthlyReports: Array.isArray(state.monthlyReports)
    ? state.monthlyReports.map((report) => ({
        ...report,
        summary: report.summaryKey ? report.summary : "",
        summaryKey: report.summaryKey ?? "reports.legacy",
      }))
    : [],
  monthlyHistory: Array.isArray(state.monthlyHistory) ? state.monthlyHistory : [],
  actionHistory: Array.isArray(state.actionHistory) ? state.actionHistory : [],
  eventHistory: Array.isArray(state.eventHistory) ? state.eventHistory : [],
  rewardAdWatched:
    typeof state.rewardAdWatched === "boolean" ? state.rewardAdWatched : false,
  meta: hydrateMeta(state.meta),
});

const loadSavedGame = (): GameState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return isGameState(parsed) ? hydrateGameState(parsed) : null;
  } catch {
    return null;
  }
};

const saveGame = (state: GameState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadSaveSlots = (): Array<GameState | null> => {
  try {
    const raw = localStorage.getItem(SAVE_SLOTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return [0, 1, 2].map((index) =>
      parsed[index] && isGameState(parsed[index])
        ? hydrateGameState(parsed[index])
        : null,
    );
  } catch {
    return [null, null, null];
  }
};

const saveToSlot = (slot: number, state: GameState) => {
  const slots = loadSaveSlots();
  slots[slot] = state;
  localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
};

const TUTORIAL_KEY = "startup-zero-tutorial-seen";
const LEGACY_TUTORIAL_KEY = "startup-zero-tutorial-seen-v1";

export default function App() {
  const { t } = useI18n();
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const [state, setState] = useState<GameState>(() => createInitialState());
  const [showSetup, setShowSetup] = useState(() => loadSavedGame() === null);
  const [noticeKey, setNoticeKey] = useState("app.autosaveReady");
  const [noticeParams, setNoticeParams] = useState<
    Record<string, string | number> | undefined
  >();
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>(
    "SaaS",
  );
  const [selectedFounder, setSelectedFounder] = useState<FounderType>(
    "Product Founder",
  );
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>(
    state.scenario,
  );
  const [saveSlots, setSaveSlots] = useState(loadSaveSlots);
  const [showTutorial, setShowTutorial] = useState(
    () =>
      localStorage.getItem(TUTORIAL_KEY) !== "true" &&
      localStorage.getItem(LEGACY_TUTORIAL_KEY) !== "true",
  );
  const [showChangeToast, setShowChangeToast] = useState(false);

  const savedGameAvailable = useMemo(
    () => loadSavedGame() !== null,
    [state.month, state.runId],
  );

  useEffect(() => {
    saveGame(state);
  }, [state]);

  useEffect(() => {
    if (!state.monthlyReports[0]) {
      return;
    }

    setShowChangeToast(true);
    const timeout = window.setTimeout(() => setShowChangeToast(false), 2600);
    return () => window.clearTimeout(timeout);
  }, [state.monthlyReports]);

  const handleAction = (action: ActionType) => {
    setState((current) => {
      const next = playTurn(current, action);
      trackActionSelected({
        action,
        month: current.month,
        runId: current.runId,
        industry: current.industry,
        founder: current.founder,
      });
      if (current.status === "playing" && next.status === "lost") {
        trackGameOver({ runId: current.runId, month: next.month, reason: next.deathReason });
      }
      if (current.status === "playing" && next.status === "won") {
        trackVictory({ runId: current.runId, month: next.month, ending: next.ending });
      }
      playSound(
        next.status === "lost"
          ? "failure"
          : next.status === "won"
            ? "success"
            : "action",
      );
      return next;
    });
    setNoticeKey("app.turnPlayed");
    setNoticeParams(undefined);
    setActiveView("home");
  };

  const handleSave = () => {
    saveGame(state);
    setNoticeKey("app.gameSaved");
    setNoticeParams(undefined);
  };

  const handleLoad = () => {
    const saved = loadSavedGame();
    if (saved) {
      setState(saved);
      setSelectedIndustry(saved.industry);
      setSelectedFounder(saved.founder);
      setSelectedScenario(saved.scenario);
      setNoticeKey("app.gameLoaded");
      setNoticeParams(undefined);
      setActiveView("home");
      setShowSetup(false);
      return;
    }

    setNoticeKey("app.noSave");
    setNoticeParams(undefined);
  };

  const handleNewGame = () => {
    setShowSetup(true);
    setNoticeKey("app.chooseSetup");
    setNoticeParams(undefined);
    setActiveView("home");
  };

  const handleStartConfiguredGame = () => {
    const industry = selectedIndustry;
    const founder = selectedFounder;
    const fresh = createInitialState(
      state.meta,
      industry,
      founder,
      selectedScenario,
    );
    trackGameStart({ runId: fresh.runId, industry, founder, scenario: selectedScenario });
    setState(fresh);
    saveGame(fresh);
    setNoticeKey("app.newRun");
    setNoticeParams({
      industry: `i18n:entities.industries.${industry}.title`,
      founder: `i18n:entities.founders.${founder}.title`,
    });
    setShowSetup(false);
    setActiveView("home");
    playSound("success");
  };

  const handleSaveSlot = (slot: number) => {
    saveToSlot(slot, state);
    setSaveSlots(loadSaveSlots());
    setNoticeKey("app.slotSaved");
    setNoticeParams({ slot: slot + 1 });
  };

  const handleLoadSlot = (slot: number) => {
    const saved = saveSlots[slot];
    if (!saved) {
      setNoticeKey("app.slotEmpty");
      setNoticeParams({ slot: slot + 1 });
      return;
    }

    setState(saved);
    setSelectedIndustry(saved.industry);
    setSelectedFounder(saved.founder);
    setSelectedScenario(saved.scenario);
    setNoticeKey("app.slotLoaded");
    setNoticeParams({ slot: slot + 1 });
    setActiveView("home");
    setShowSetup(false);
  };

  const handleRewardAd = () => {
    setState((current) => applyRewardAd(current));
    setNoticeKey("app.rewardClaimed");
    setNoticeParams(undefined);
  };

  const handlePremiumChange = (enabled: boolean) => {
    setIsPremiumUser(enabled);
    setNoticeKey(enabled ? "app.premiumOn" : "app.premiumOff");
    setNoticeParams(undefined);
  };

  const handleCloseTutorial = () => {
    localStorage.setItem(TUTORIAL_KEY, "true");
    localStorage.setItem(LEGACY_TUTORIAL_KEY, "true");
    setShowTutorial(false);
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  const handleOpenHelpFromTutorial = () => {
    handleCloseTutorial();
    setActiveView("help");
  };

  const banner =
    state.status === "won"
      ? t("app.bannerWon")
      : state.status === "lost"
        ? t("app.bannerLost")
        : t("app.bannerPlaying");

  const renderView = () => {
    if (activeView === "help") {
      return <HelpView />;
    }

    if (showSetup) {
      return (
        <SettingsView
          state={state}
          isPremiumUser={isPremiumUser}
          savedGameAvailable={savedGameAvailable}
          saveSlots={saveSlots}
          selectedScenario={selectedScenario}
          selectedIndustry={selectedIndustry}
          selectedFounder={selectedFounder}
          setupMode
          onPremiumChange={handlePremiumChange}
          onSave={handleSave}
          onLoad={handleLoad}
          onNewGame={handleStartConfiguredGame}
          onShowTutorial={handleShowTutorial}
          onOpenHelp={() => setActiveView("help")}
          onSaveSlot={handleSaveSlot}
          onLoadSlot={handleLoadSlot}
          onScenarioChange={setSelectedScenario}
          onIndustryChange={setSelectedIndustry}
          onFounderChange={setSelectedFounder}
        />
      );
    }

    switch (activeView) {
      case "actions":
        return (
          <ActionsView
            state={state}
            onAction={handleAction}
            onRewardAd={handleRewardAd}
          />
        );
      case "report":
        return <ReportView state={state} />;
      case "analysis":
        return <AnalysisView state={state} />;
      case "mentor":
        return <MentorView state={state} isPremiumUser={isPremiumUser} />;
      case "log":
        return <LogView logs={state.logs} />;
      case "help":
        return <HelpView />;
      case "settings":
        return (
          <SettingsView
            state={state}
            isPremiumUser={isPremiumUser}
            savedGameAvailable={savedGameAvailable}
            saveSlots={saveSlots}
            selectedScenario={selectedScenario}
            selectedIndustry={selectedIndustry}
            selectedFounder={selectedFounder}
            setupMode={false}
            onPremiumChange={handlePremiumChange}
            onSave={handleSave}
            onLoad={handleLoad}
            onNewGame={handleNewGame}
            onShowTutorial={handleShowTutorial}
            onOpenHelp={() => setActiveView("help")}
            onSaveSlot={handleSaveSlot}
            onLoadSlot={handleLoadSlot}
            onScenarioChange={setSelectedScenario}
            onIndustryChange={setSelectedIndustry}
            onFounderChange={setSelectedFounder}
          />
        );
      case "home":
      default:
        return (
          <HomeView
            state={state}
            onGoActions={() => setActiveView("actions")}
            onGoMentor={() => setActiveView("mentor")}
          />
        );
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 pb-44 lg:pb-12">
      <div className="grid min-h-screen lg:grid-cols-[240px_minmax(0,1fr)]">
        <Navigation activeView={activeView} onChange={setActiveView} />

        <div className="min-w-0 px-3 py-4 sm:px-5 lg:px-6">
          <header className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                  {t(`navigation.${activeView}`)}
                </p>
                <h1 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
                  {t("app.title")}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  {banner}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={state.status} />
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                  {t("common.month", { month: state.month })}
                </span>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                  {t(`entities.industries.${state.industry}.title`)}
                </span>
              </div>
            </div>
          </header>

          <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-950">
            {t(noticeKey, noticeParams)}
          </div>

          <section className="min-h-[calc(100vh-220px)]">{renderView()}</section>
        </div>
      </div>

      <ChangeToast report={state.monthlyReports[0]} visible={showChangeToast} />
      {showTutorial && (
        <TutorialOverlay
          onClose={handleCloseTutorial}
          onOpenHelp={handleOpenHelpFromTutorial}
        />
      )}
      <BannerAd />
    </main>
  );
}
