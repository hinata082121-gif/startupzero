import { useEffect, useMemo, useState } from "react";
import {
  trackActionSelected,
  trackGameOver,
  trackGameStart,
  trackVictory,
} from "./analytics/tracking";
import AnalysisView from "./components/AnalysisView";
import ActionsView from "./components/ActionsView";
import AdBanner from "./components/AdBanner";
import ActionConfirmModal from "./components/ActionConfirmModal";
import FooterLinks from "./components/FooterLinks";
import HelpView from "./components/HelpView";
import HomeView from "./components/HomeView";
import LeagueResultModal from "./components/LeagueResultModal";
import LogView from "./components/LogView";
import MentorView from "./components/MentorView";
import MonthlyResultModal from "./components/MonthlyResultModal";
import Navigation, { type ActiveView } from "./components/Navigation";
import NotFoundPage from "./components/NotFoundPage";
import PublicContentPage from "./components/PublicContentPage";
import PublicSiteLayout from "./components/PublicSiteLayout";
import RankingView from "./components/RankingView";
import ReportView from "./components/ReportView";
import SettingsView from "./components/SettingsView";
import NewGameSetupModal from "./components/setup/NewGameSetupModal";
import StatusBadge from "./components/StatusBadge";
import StaticPageView from "./components/StaticPageView";
import type { StaticPage } from "./components/StaticPageView";
import TutorialOverlay from "./components/TutorialOverlay";
import TurnProgressOverlay from "./components/TurnProgressOverlay";
import { getPublicPage, publicRoutes, type PublicRoute } from "./content/publicPages";
import { playSound } from "./sound";
import {
  DEFAULT_META,
  SAVE_SLOTS_KEY,
  STORAGE_KEY,
  combineModifiers,
  createInitialState,
  getCompetitionLevel,
  initialCompetitionPressure,
  normalizeFounder,
  normalizeIndustry,
  normalizeScenario,
  pickCompetitorName,
  type ActionType,
  type FounderType,
  type GameMode,
  type GameState,
  type IndustryType,
  type MetaProgression,
  type MonthlyReport,
  type ScenarioType,
} from "./gameState";
import { isGameState, playTurn } from "./gameEngine";
import { useI18n } from "./i18n";
import { saveFounderLeagueRanking } from "./league/rankings";
import { safeStorage } from "./utils/safeStorage";

const hydrateMeta = (meta?: Partial<MetaProgression>): MetaProgression => ({
  ...DEFAULT_META,
  ...meta,
  normalModeClears: meta?.normalModeClears ?? DEFAULT_META.normalModeClears,
  founderLeagueUnlocked:
    meta?.founderLeagueUnlocked ??
    (meta?.normalModeClears ?? DEFAULT_META.normalModeClears) >= 2,
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

const defaultFounderName = () =>
  (safeStorage.getItem("startup-zero-language") ?? navigator.language).toLowerCase().startsWith("ja")
    ? "創業者"
    : "Founder";

const defaultCompanyName = () => "Zero Inc.";

const hydrateGameState = (state: Partial<GameState>): GameState => ({
  ...state,
  runId: state.runId ?? crypto.randomUUID(),
  hasStarted: typeof state.hasStarted === "boolean" ? state.hasStarted : true,
  mode: state.mode ?? "normal",
  gameMode: state.gameMode ?? state.mode ?? "normal",
  isFounderLeague: typeof state.isFounderLeague === "boolean" ? state.isFounderLeague : (state.gameMode ?? state.mode) === "founderLeague",
  maxMonths: state.maxMonths ?? ((state.gameMode ?? state.mode) === "founderLeague" ? 36 : 0),
  leagueRunId: state.leagueRunId ?? state.runId ?? crypto.randomUUID(),
  leagueSeed: state.leagueSeed ?? crypto.randomUUID().slice(0, 8),
  leagueStartedAt: state.leagueStartedAt ?? new Date().toISOString(),
  leagueEndedAt: state.leagueEndedAt,
  hasSubmittedLocalRanking:
    typeof state.hasSubmittedLocalRanking === "boolean" ? state.hasSubmittedLocalRanking : false,
  founderName: state.founderName ?? defaultFounderName(),
  companyName: state.companyName ?? defaultCompanyName(),
  hasRecordedClear: typeof state.hasRecordedClear === "boolean" ? state.hasRecordedClear : false,
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
  scenario: normalizeScenario(state.scenario),
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
  competitionPressure:
    state.competitionPressure ??
    initialCompetitionPressure[normalizeIndustry(state.selectedIndustry ?? state.industry)] ??
    0,
  mainCompetitorName:
    state.mainCompetitorName ??
    pickCompetitorName(
      normalizeIndustry(state.selectedIndustry ?? state.industry),
      state.leagueSeed ?? state.runId ?? "startup-zero",
    ),
  competitionLevel: state.competitionLevel ?? getCompetitionLevel(
    state.competitionPressure ??
      initialCompetitionPressure[normalizeIndustry(state.selectedIndustry ?? state.industry)] ??
      0,
  ),
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
        productProgressDelta: report.productProgressDelta ?? 0,
        marketFitDelta: report.marketFitDelta ?? 0,
        reputationDelta: report.reputationDelta ?? 0,
        burnRateDelta: report.burnRateDelta ?? 0,
        summary: report.summaryKey ? report.summary : "",
        summaryKey: report.summaryKey ?? "reports.legacy",
      }))
    : [],
  lastMonthDelta: state.lastMonthDelta ?? null,
  monthlyHistory: Array.isArray(state.monthlyHistory)
    ? state.monthlyHistory.map((snapshot) => ({
        ...snapshot,
        companyValuation: snapshot.companyValuation ?? 0,
        founderScoreEstimate: snapshot.founderScoreEstimate ?? 0,
      }))
    : [],
  actionHistory: Array.isArray(state.actionHistory) ? state.actionHistory : [],
  eventHistory: Array.isArray(state.eventHistory) ? state.eventHistory : [],
  rewardAdWatched:
    typeof state.rewardAdWatched === "boolean" ? state.rewardAdWatched : false,
  meta: hydrateMeta(state.meta),
});

const loadSavedGame = (): GameState | null => {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!isGameState(parsed)) {
      return null;
    }

    const hydrated = hydrateGameState(parsed);
    return hydrated.hasStarted ? hydrated : null;
  } catch {
    return null;
  }
};

const saveGame = (state: GameState) => {
  if (!state.hasStarted) {
    return;
  }

  safeStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadSaveSlots = (): Array<GameState | null> => {
  try {
    const raw = safeStorage.getItem(SAVE_SLOTS_KEY);
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
  if (!state.hasStarted) {
    return;
  }

  const slots = loadSaveSlots();
  slots[slot] = state;
  safeStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
};

const TUTORIAL_KEY = "startup-zero-tutorial-seen";
const LEGACY_TUTORIAL_KEY = "startup-zero-tutorial-seen-v1";

const normalizePath = (path: string) => {
  const normalized = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
  return normalized || "/";
};

const isPublicRoute = (path: string): path is PublicRoute =>
  publicRoutes.includes(path as PublicRoute);

const ensureMeta = (name: string, attr: "name" | "property" = "name") => {
  const selector = `meta[${attr}="${name}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  if (existing) {
    return existing;
  }

  const meta = document.createElement("meta");
  meta.setAttribute(attr, name);
  document.head.appendChild(meta);
  return meta;
};

const ensureCanonical = () => {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (existing) {
    return existing;
  }

  const link = document.createElement("link");
  link.rel = "canonical";
  document.head.appendChild(link);
  return link;
};

export default function App() {
  const { t, currentLanguage } = useI18n();
  const isCraftNovaLayout = __CRAFTNOVA_BUILD__;
  const [route, setRoute] = useState(() =>
    typeof window === "undefined" ? "/" : normalizePath(window.location.pathname),
  );
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const [state, setState] = useState<GameState>(() => createInitialState());
  const [showSetup, setShowSetup] = useState(() => loadSavedGame() === null);
  const [noticeKey, setNoticeKey] = useState("app.autosaveReady");
  const [noticeParams, setNoticeParams] = useState<
    Record<string, string | number> | undefined
  >();
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>(
    "SaaS",
  );
  const [selectedFounder, setSelectedFounder] = useState<FounderType>(
    "Product Founder",
  );
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType>(
    normalizeScenario(state.scenario),
  );
  const [selectedMode, setSelectedMode] = useState<GameMode>("normal");
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);
  const [turnProgressMonth, setTurnProgressMonth] = useState<number | null>(null);
  const [latestResult, setLatestResult] = useState<{
    state: GameState;
    report: MonthlyReport;
    action: ActionType;
  } | null>(null);
  const [leagueResult, setLeagueResult] = useState<{
    state: GameState;
    rank: number;
  } | null>(null);
  const [saveSlots, setSaveSlots] = useState(loadSaveSlots);
  const [showTutorial, setShowTutorial] = useState(
    () =>
      safeStorage.getItem(TUTORIAL_KEY) !== "true" &&
      safeStorage.getItem(LEGACY_TUTORIAL_KEY) !== "true",
  );

  useEffect(() => {
    if (isCraftNovaLayout) {
      return;
    }

    const handlePopState = () => setRoute(normalizePath(window.location.pathname));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isCraftNovaLayout]);

  useEffect(() => {
    if (isCraftNovaLayout || typeof document === "undefined") {
      return;
    }

    const origin = window.location.origin;
    const currentPath = normalizePath(window.location.pathname);
    const canonicalPath = isPublicRoute(currentPath) ? currentPath : currentPath === "/play" ? "/play" : "/404";
    const robots = ensureMeta("robots");
    const canonical = ensureCanonical();

    if (isPublicRoute(currentPath)) {
      const page = getPublicPage(currentLanguage, currentPath);
      document.title = page.title;
      ensureMeta("description").content = page.description;
      ensureMeta("og:title", "property").content = page.title;
      ensureMeta("og:description", "property").content = page.description;
      robots.content = "index,follow";
      canonical.href = `${origin}${canonicalPath === "/" ? "/" : canonicalPath}`;
      return;
    }

    if (currentPath === "/play") {
      const title = "Startup Zero - Play";
      const description = "Play Startup Zero, a browser startup simulation game.";
      document.title = title;
      ensureMeta("description").content = description;
      ensureMeta("og:title", "property").content = title;
      ensureMeta("og:description", "property").content = description;
      robots.content = "noindex,follow";
      canonical.href = `${origin}/play`;
      return;
    }

    document.title = "Page not found - Startup Zero";
    ensureMeta("description").content = "This Startup Zero page could not be found.";
    ensureMeta("og:title", "property").content = "Page not found - Startup Zero";
    ensureMeta("og:description", "property").content = "This Startup Zero page could not be found.";
    robots.content = "noindex,follow";
    canonical.href = `${origin}/404`;
  }, [route, isCraftNovaLayout, currentLanguage]);

  const savedGameAvailable = useMemo(
    () => loadSavedGame() !== null,
    [state.month, state.runId],
  );

  useEffect(() => {
    saveGame(state);
  }, [state]);

  const handleAction = (action: ActionType) => {
    setPendingAction(action);
  };

  const executePendingAction = () => {
    if (!pendingAction) {
      return;
    }

    const action = pendingAction;
    setPendingAction(null);
    setTurnProgressMonth(state.month);

    window.setTimeout(() => {
      const current = state;
      const next = playTurn(current, action);
      let nextState = next;
      if (next.isFounderLeague && next.status !== "playing") {
        const saved = saveFounderLeagueRanking(next);
        nextState = {
          ...next,
          hasSubmittedLocalRanking: true,
        };
        setLeagueResult({ state: nextState, rank: saved.rank });
      }

      setState(nextState);
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
      setTurnProgressMonth(null);
      if (!next.isFounderLeague || next.status === "playing") {
        if (nextState.monthlyReports[0]) {
          setLatestResult({ state: nextState, report: nextState.monthlyReports[0], action });
        }
      }
      setNoticeKey("app.turnPlayed");
      setNoticeParams(undefined);
    }, 900);
  };

  const closeMonthlyResult = () => {
    setLatestResult(null);
    setActiveView("home");
  };

  const handleSave = () => {
    if (!state.hasStarted) {
      setNoticeKey("app.noSave");
      setNoticeParams(undefined);
      return;
    }

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
      setSelectedScenario(normalizeScenario(saved.scenario));
      setSelectedMode(saved.gameMode ?? saved.mode);
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

  const handleStartConfiguredGame = (setup?: {
    mode: GameMode;
    scenario: ScenarioType;
    industry: IndustryType;
    founder: FounderType;
    founderName: string;
    companyName: string;
  }) => {
    const industry = setup?.industry ?? selectedIndustry;
    const founder = setup?.founder ?? selectedFounder;
    const scenario = setup?.scenario ?? selectedScenario;
    const mode = setup?.mode ?? selectedMode;
    const founderName = setup?.founderName ?? t("setup.defaultFounderName");
    const companyName = setup?.companyName ?? t("setup.defaultCompanyName");
    const fresh = {
      ...createInitialState(state.meta, industry, founder, scenario, mode, founderName, companyName),
      hasStarted: true,
    };
    trackGameStart({ runId: fresh.runId, industry, founder, scenario });
    setState(fresh);
    setSelectedIndustry(industry);
    setSelectedFounder(founder);
    setSelectedScenario(scenario);
    setSelectedMode(mode);
    saveGame(fresh);
    setNoticeKey("app.newRun");
    setNoticeParams({
      industry: `i18n:entities.industries.${industry}.title`,
      founder: `i18n:entities.founders.${founder}.title`,
    });
    setShowSetup(false);
    setLeagueResult(null);
    setLatestResult(null);
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
    setSelectedScenario(normalizeScenario(saved.scenario));
    setSelectedMode(saved.gameMode ?? saved.mode);
    setNoticeKey("app.slotLoaded");
    setNoticeParams({ slot: slot + 1 });
    setActiveView("home");
    setShowSetup(false);
  };

  const handleCloseTutorial = () => {
    safeStorage.setItem(TUTORIAL_KEY, "true");
    safeStorage.setItem(LEGACY_TUTORIAL_KEY, "true");
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

  if (!isCraftNovaLayout && isPublicRoute(route)) {
    return (
      <PublicSiteLayout activeRoute={route}>
        <PublicContentPage route={route} />
      </PublicSiteLayout>
    );
  }

  if (!isCraftNovaLayout && route !== "/play") {
    return <NotFoundPage />;
  }

  const renderView = () => {
    if (activeView === "help") {
      return <HelpView />;
    }

    if (["privacy", "terms", "about", "contact"].includes(activeView)) {
      return <StaticPageView page={activeView as StaticPage} />;
    }

    switch (activeView) {
      case "actions":
        return (
          <ActionsView
            state={state}
            onAction={handleAction}
          />
        );
      case "report":
        return <ReportView state={state} />;
      case "analysis":
        return <AnalysisView state={state} />;
      case "mentor":
        return <MentorView state={state} />;
      case "ranking":
        return <RankingView />;
      case "log":
        return <LogView logs={state.logs} />;
      case "help":
        return <HelpView />;
      case "privacy":
      case "terms":
      case "about":
      case "contact":
        return <StaticPageView page={activeView} />;
      case "settings":
        return (
          <SettingsView
            state={state}
            savedGameAvailable={savedGameAvailable}
            saveSlots={saveSlots}
            onSave={handleSave}
            onLoad={handleLoad}
            onNewGame={handleNewGame}
            onShowTutorial={handleShowTutorial}
            onOpenHelp={() => setActiveView("help")}
            onNavigate={setActiveView}
            onSaveSlot={handleSaveSlot}
            onLoadSlot={handleLoadSlot}
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
    <main
      className={
        isCraftNovaLayout
          ? "craftnova-compact h-[100dvh] overflow-hidden bg-slate-100 pb-16"
          : "min-h-screen bg-slate-100 pb-44 lg:pb-12"
      }
    >
      <div
        className={
          isCraftNovaLayout
            ? "flex h-full min-h-0 flex-col"
            : "grid min-h-screen lg:grid-cols-[240px_minmax(0,1fr)]"
        }
      >
        <Navigation activeView={activeView} onChange={setActiveView} />

        <div
          className={
            isCraftNovaLayout
              ? "flex min-h-0 min-w-0 flex-1 flex-col px-2 py-2"
              : "min-w-0 px-3 py-4 sm:px-5 lg:px-6"
          }
        >
          <header
            className={
              isCraftNovaLayout
                ? "mb-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm"
                : "mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            }
          >
            <div className={isCraftNovaLayout ? "flex items-center justify-between gap-2" : "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                  {t(`navigation.${activeView}`)}
                </p>
                <h1 className={isCraftNovaLayout ? "mt-0.5 text-lg font-bold leading-tight text-slate-950" : "mt-1 text-2xl font-bold text-slate-950 sm:text-3xl"}>
                  {t("app.title")}
                </h1>
                <p className={isCraftNovaLayout ? "mt-0.5 truncate text-xs font-bold text-slate-800" : "mt-1 text-sm font-bold text-slate-800"}>
                  {state.companyName} / {t("home.ceoLine", { name: state.founderName })}
                </p>
                {!isCraftNovaLayout && (
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    {banner}
                  </p>
                )}
              </div>
              <div className={isCraftNovaLayout ? "flex max-w-[45%] flex-wrap items-center justify-end gap-1" : "flex flex-wrap items-center gap-2"}>
                <StatusBadge status={state.status} />
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                  {t("common.month", { month: state.month })}
                </span>
                <span className="max-w-full truncate rounded-full bg-purple-100 px-2 py-1 text-xs font-bold text-purple-700">
                  {t(`entities.industries.${state.industry}.title`)}
                </span>
              </div>
            </div>
          </header>

          <div className={isCraftNovaLayout ? "mb-2 truncate rounded-md border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-950" : "mb-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-950"}>
            {t(noticeKey, noticeParams)}
          </div>

          <section
            className={
              isCraftNovaLayout
                ? "min-h-0 flex-1 overflow-y-auto pr-1"
                : "min-h-[calc(100vh-220px)]"
            }
          >
            {renderView()}
          </section>
          <AdBanner view={showSetup ? "setup" : activeView} state={state} />
          {!isCraftNovaLayout && <FooterLinks onNavigate={setActiveView} />}
        </div>
      </div>

      {showTutorial && (
        <TutorialOverlay
          onClose={handleCloseTutorial}
          onOpenHelp={handleOpenHelpFromTutorial}
        />
      )}
      {showSetup && (
        <NewGameSetupModal
          meta={state.meta}
          initialScenario={selectedScenario}
          initialIndustry={selectedIndustry}
          initialFounder={selectedFounder}
          canCancel={savedGameAvailable}
          onCancel={() => setShowSetup(false)}
          onStart={handleStartConfiguredGame}
          initialMode={selectedMode}
          defaultFounderName={t("setup.defaultFounderName")}
          defaultCompanyName={t("setup.defaultCompanyName")}
        />
      )}
      {pendingAction && (
        <ActionConfirmModal
          action={pendingAction}
          onExecute={executePendingAction}
          onCancel={() => setPendingAction(null)}
        />
      )}
      {turnProgressMonth !== null && <TurnProgressOverlay month={turnProgressMonth} />}
      {latestResult && (
        <MonthlyResultModal
          state={latestResult.state}
          report={latestResult.report}
          action={latestResult.action}
          onNextMonth={closeMonthlyResult}
        />
      )}
      {leagueResult && (
        <LeagueResultModal
          state={leagueResult.state}
          rank={leagueResult.rank}
          onViewRanking={() => {
            setLeagueResult(null);
            setActiveView("ranking");
          }}
          onTryAgain={() => {
            setLeagueResult(null);
            setSelectedMode("founderLeague");
            setShowSetup(true);
            setActiveView("home");
          }}
          onBackToNormal={() => {
            setLeagueResult(null);
            setSelectedMode("normal");
            setShowSetup(true);
            setActiveView("home");
          }}
        />
      )}
    </main>
  );
}
