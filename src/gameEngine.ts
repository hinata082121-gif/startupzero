import {
  DEFAULT_META,
  calculateRunway,
  combineModifiers,
  getCompetitionLevel,
  initialCompetitionPressure,
  industryConfig,
  normalizeFounder,
  normalizeIndustry,
  pickCompetitorName,
  type ActionType,
  type ActionHistoryEntry,
  type AchievementId,
  type EventHistoryEntry,
  type GameState,
  type LogEntry,
  type LogKind,
  type MonthlyReport,
  type MonthlySnapshot,
} from "./gameState";
import { drawRandomEvent } from "./events";
import { calculateCompanyValuation, calculateFounderScore } from "./scoring/founderScore";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const numericEffects = (before: GameState, after: GameState) => ({
  cash: after.cash - before.cash,
  revenue: after.revenue - before.revenue,
  users: after.users - before.users,
  burnRate: after.burnRate - before.burnRate,
  runway: Number((after.runway - before.runway).toFixed(1)),
  morale: after.teamMorale - before.teamMorale,
  productProgress: after.productProgress - before.productProgress,
  marketFit: after.marketFit - before.marketFit,
  reputation: after.reputation - before.reputation,
});

const createSnapshot = (state: GameState): MonthlySnapshot => ({
  month: state.month,
  cash: state.cash,
  revenue: state.revenue,
  users: state.users,
  burnRate: state.burnRate,
  runway: Number(state.runway.toFixed(1)),
  morale: state.teamMorale,
  productProgress: state.productProgress,
  marketFit: state.marketFit,
  reputation: state.reputation,
  companyValuation: calculateCompanyValuation(state),
  founderScoreEstimate: calculateFounderScore(state),
});

const getPhase = (state: GameState) => {
  if (state.month <= 5) {
    return "early";
  }

  if (state.month <= 15) {
    return "mid";
  }

  return "late";
};

const addUnique = <T,>(items: T[], item: T): T[] =>
  items.includes(item) ? items : [...items, item];

const unlockAchievement = (
  state: GameState,
  achievement: AchievementId,
): GameState => {
  if (state.meta.achievements.includes(achievement)) {
    return state;
  }

  return {
    ...state,
    logs: addLog(state.logs, state.month, "logs.achievement", "result", {
      messageKey: "logs.achievement",
      params: { achievement: `i18n:entities.achievements.${achievement}` },
    }),
    meta: {
      ...state.meta,
      achievements: [...state.meta.achievements, achievement],
    },
  };
};

const addLog = (
  logs: LogEntry[],
  month: number,
  message: string,
  kind: LogKind = "system",
  i18n?: Pick<LogEntry, "messageKey" | "params">,
): LogEntry[] => [
  { id: crypto.randomUUID(), month, message, kind, ...i18n },
  ...logs,
].slice(0, 40);

const normalizeState = (state: GameState): GameState => {
  const industry = normalizeIndustry(state.selectedIndustry ?? state.industry);
  const founder = normalizeFounder(state.selectedFounderType ?? state.founder);
  const modifiers = state.modifiers ?? combineModifiers(industry, founder);
  const gameMode = state.gameMode ?? state.mode ?? "normal";
  const competitionPressure = clamp(Math.round(state.competitionPressure ?? initialCompetitionPressure[industry] ?? 0), 0, 100);
  const normalized = {
    ...state,
    mode: state.mode ?? gameMode,
    gameMode,
    isFounderLeague: typeof state.isFounderLeague === "boolean" ? state.isFounderLeague : gameMode === "founderLeague",
    maxMonths: state.maxMonths ?? (gameMode === "founderLeague" ? 36 : 0),
    leagueRunId: state.leagueRunId ?? state.runId ?? crypto.randomUUID(),
    leagueSeed: state.leagueSeed ?? crypto.randomUUID().slice(0, 8),
    leagueStartedAt: state.leagueStartedAt ?? new Date().toISOString(),
    leagueEndedAt: state.leagueEndedAt,
    hasSubmittedLocalRanking:
      typeof state.hasSubmittedLocalRanking === "boolean" ? state.hasSubmittedLocalRanking : false,
    industry,
    founder,
    selectedIndustry: industry,
    selectedFounderType: founder,
    industryName: industry,
    founderTypeName: founder,
    modifiers,
    revenue: Math.max(0, Math.round(state.revenue)),
    users: Math.max(0, Math.round(state.users)),
    teamMorale: clamp(Math.round(state.teamMorale), 0, 100),
    productProgress: clamp(Math.round(state.productProgress), 0, 100),
    marketFit: clamp(Math.round(state.marketFit), 0, 100),
    reputation: clamp(Math.round(state.reputation ?? 42), 0, 100),
    competitionPressure,
    mainCompetitorName:
      state.mainCompetitorName ?? pickCompetitorName(industry, state.leagueSeed ?? state.runId ?? "startup-zero"),
    competitionLevel: getCompetitionLevel(competitionPressure),
    fundingStage: Math.max(0, Math.round(state.fundingStage ?? 0)),
    burnRate: Math.max(0, Math.round(state.burnRate)),
    cash: Math.round(state.cash),
    deathReason: state.deathReason ?? null,
    monthlyHistory: Array.isArray(state.monthlyHistory) ? state.monthlyHistory : [],
    actionHistory: Array.isArray(state.actionHistory) ? state.actionHistory : [],
    eventHistory: Array.isArray(state.eventHistory) ? state.eventHistory : [],
    meta: {
      ...DEFAULT_META,
      ...state.meta,
      unlockedIndustries: Array.from(
        new Set([
          ...DEFAULT_META.unlockedIndustries,
          ...(state.meta?.unlockedIndustries ?? []).map((item) => normalizeIndustry(item)),
        ]),
      ),
      unlockedFounders: Array.from(
        new Set([
          ...DEFAULT_META.unlockedFounders,
          ...(state.meta?.unlockedFounders ?? []).map((item) => normalizeFounder(item)),
        ]),
      ),
      achievements: state.meta?.achievements ?? [],
    },
  };

  return {
    ...normalized,
    runway: calculateRunway(normalized.cash, normalized.revenue, normalized.burnRate),
  };
};

const adjustCompetitionAfterAction = (state: GameState, action: ActionType) => {
  let pressure = state.competitionPressure;
  if (action === "Develop") pressure -= state.productProgress >= 55 ? 5 : 3;
  if (action === "Marketing") pressure += state.competitionPressure >= 60 ? 2 : 1;
  if (action === "Pivot") pressure -= state.marketFit < 40 ? 6 : 2;
  if (action === "Fundraising") pressure += state.fundingStage >= 1 ? 2 : 0;
  if (state.marketFit >= 65) pressure -= 2;
  if (state.reputation >= 65) pressure -= 2;
  pressure = clamp(Math.round(pressure), 0, 100);
  return {
    ...state,
    competitionPressure: pressure,
    competitionLevel: getCompetitionLevel(pressure),
  };
};

const applyLeaguePressure = (state: GameState, action: ActionType): GameState => {
  if (!state.isFounderLeague) {
    return state;
  }

  const pressureFactor = 1 - state.competitionPressure / 450;
  const fundraisingPenalty = action === "Fundraising" ? -0.1 : 0;
  return {
    ...state,
    users: action === "Marketing" ? Math.round(state.users * pressureFactor) : state.users,
    revenue: action === "Marketing" ? Math.round(state.revenue * (pressureFactor + 0.03)) : state.revenue,
    cash: action === "Marketing" ? state.cash - Math.round(900 * (1 + state.competitionPressure / 100)) : state.cash,
    burnRate: Math.round(state.burnRate * (action === "Marketing" ? 1.01 : 1)),
    modifiers: {
      ...state.modifiers,
      fundraising: state.modifiers.fundraising + fundraisingPenalty,
    },
  };
};

const applyAction = (state: GameState, action: ActionType): GameState => {
  const phase = getPhase(state);
  const earlyDiscount = phase === "early" ? 0.62 : phase === "mid" ? 1 : 1.12;
  const developBonus =
    (state.founder === "Engineer Founder" || state.trait === "Engineer" ? 1.25 : 1) *
    state.modifiers.productProgress;
  const growthBonus = (state.trait === "Hustler" ? 1.22 : 1) * state.modifiers.usersGrowth;
  const salesBonus = (state.founder === "Sales Founder" ? 1.22 : 1) * state.modifiers.revenueGrowth;
  const productBonus = (state.founder === "Product Founder" ? 1.2 : 1) * state.modifiers.marketFit;
  const moraleDrain = (state.trait === "Calm Operator" ? 0.75 : state.trait === "Hustler" ? 1.25 : 1) / state.modifiers.morale;
  const industry = industryConfig[state.industry];
  const fitFactor = clamp(0.72 + state.marketFit / 100, 0.72, 1.42);

  const applyLeague = (next: GameState) => adjustCompetitionAfterAction(applyLeaguePressure(next, action), action);

  switch (action) {
    case "Develop": {
      const progressGain = Math.round((phase === "early" ? 15 : phase === "mid" ? 13 : 11) * developBonus * (state.teamMorale < 25 ? 0.85 : 1));
      const fitGain = Math.round((phase === "early" ? 5 : state.productProgress >= 65 ? 2 : 3) * productBonus);
      const cashCost = Math.round((phase === "early" ? 5200 : phase === "mid" ? 7200 : 9800) * (state.industry === "AI" ? 1.15 : 1) * (phase === "early" ? 0.82 : 1));
      const moraleLoss = Math.round((phase === "early" ? 2 : phase === "mid" ? 4 : 6) * moraleDrain);
      return applyLeague({
        ...state,
        productProgress: state.productProgress + progressGain,
        marketFit: state.marketFit + fitGain,
        reputation: state.reputation + (state.productProgress >= 60 ? 1 : 0),
        cash: state.cash - cashCost,
        teamMorale: state.teamMorale - moraleLoss,
        logs: addLog(
          state.logs,
          state.month,
          "logs.develop",
          "action",
          {
            messageKey: "logs.develop",
            params: {
              progress: progressGain,
              fit: fitGain,
              cash: cashCost.toLocaleString(),
              reason: phase === "early" ? "i18n:logs.learningPhaseNote" : "i18n:logs.developReason",
            },
          },
        ),
      });
    }
    case "Hire":
      {
        const moraleRiskChance = (phase === "late" ? 0.42 : phase === "mid" ? 0.26 : 0.12) + (state.teamMorale < 35 ? 0.12 : 0);
        const moraleRisk = Math.random() < moraleRiskChance;
        const lowMoralePenalty = state.teamMorale < 30 ? 0.75 : 1;
        const progressGain = Math.round((phase === "early" ? 7 : phase === "mid" ? 10 : 12) * developBonus * lowMoralePenalty);
        const burnIncrease = Math.round((phase === "early" ? 3200 : phase === "mid" ? 5200 : 7800) + state.fundingStage * 450);
        const cashCost = Math.round((phase === "early" ? 2500 : phase === "mid" ? 4500 : 6500) * earlyDiscount);
        const moraleLoss = Math.round((moraleRisk ? (phase === "late" ? 10 : phase === "mid" ? 8 : 5) : phase === "late" ? 5 : phase === "mid" ? 3 : 2) * moraleDrain);
        return applyLeague({
          ...state,
          burnRate: state.burnRate + burnIncrease,
          productProgress: state.productProgress + progressGain,
          reputation: state.reputation + (moraleRisk ? 0 : 1),
          teamMorale: state.teamMorale - moraleLoss,
          cash: state.cash - cashCost,
          logs: addLog(
            state.logs,
            state.month,
            "logs.hire",
            "action",
            {
              messageKey: "logs.hire",
              params: {
                progress: progressGain,
                burn: burnIncrease.toLocaleString(),
                note: state.teamMorale < 30
                  ? "i18n:logs.hireLimited"
                  : moraleRisk
                    ? "i18n:logs.hireStrain"
                    : "i18n:logs.hireGood",
              },
            },
          ),
        });
      }
    case "Marketing":
      {
        const userGain = Math.round(
          randomInt(90, phase === "early" ? 190 : phase === "mid" ? 260 : 390) *
            growthBonus *
            industry.growthMultiplier *
            (state.marketFit >= 35 ? 1.12 : 0.88) *
            (state.industry === "Marketplace" && state.users > 1500 ? 1.25 : 1),
        );
        const revenueGain = Math.round(
          randomInt(1800, phase === "early" ? 4800 : phase === "mid" ? 7600 : 11500) *
            salesBonus *
            industry.revenueMultiplier *
            fitFactor *
            (state.industry === "SaaS" && state.productProgress < 35 ? 0.78 : 1) *
            (state.industry === "Marketplace" && state.marketFit < 30 ? 0.76 : 1) *
            (state.industry === "Game" ? randomInt(75, 135) / 100 : 1),
        );
        const burnIncrease = Math.round((phase === "early" ? 600 : phase === "mid" ? 1800 : 3600) * state.modifiers.burnRate);
        const cashCost = Math.round((phase === "early" ? 5500 : phase === "mid" ? 9000 : 12500) * earlyDiscount);
        return applyLeague({
          ...state,
          users: state.users + userGain,
          revenue: state.revenue + revenueGain,
          burnRate: state.burnRate + burnIncrease,
          reputation: state.reputation + (state.marketFit >= 45 ? 2 : 0),
          cash: state.cash - cashCost,
          teamMorale: state.teamMorale - Math.round((phase === "late" ? 3 : phase === "mid" ? 2 : 1) * moraleDrain),
          logs: addLog(
            state.logs,
            state.month,
            "logs.marketing",
            "action",
            {
              messageKey: "logs.marketing",
              params: {
                users: userGain.toLocaleString(),
                revenue: revenueGain.toLocaleString(),
                burn: burnIncrease.toLocaleString(),
                reason: state.marketFit < 30 ? "i18n:logs.marketingWeakFit" : "i18n:logs.marketingStrongFit",
              },
            },
          ),
        });
      }
    case "Fundraising": {
      const baseChance = phase === "early" ? 0.52 : phase === "mid" ? 0.44 : 0.38;
      const chance = clamp(
        baseChance +
        (state.founder === "Sales Founder" || state.trait === "Storyteller" ? 0.12 : 0) +
        state.modifiers.fundraising +
        (state.revenue > 25000 ? 0.08 : 0) +
        (state.reputation / 100) * 0.18 +
        (state.marketFit / 100) * 0.1 -
        state.fundingStage * 0.04 -
        (state.runway < 2 ? 0.05 : 0) -
        (state.scenario === "Crisis Mode" ? 0.05 : 0),
        0.18,
        0.78,
      );
      const success = Math.random() < chance;
      const nextStage = state.fundingStage + 1;
      const raiseAmount = Math.round((phase === "late" ? 90000 : phase === "mid" ? 65000 : 46000) + nextStage * 18000 + state.reputation * 280);
      return success
        ? applyLeague({
            ...state,
            cash: state.cash + raiseAmount,
            burnRate: state.burnRate + (phase === "late" ? 4200 : phase === "mid" ? 2400 : 1200) + nextStage * 500,
            reputation: state.reputation + 6,
            fundingStage: nextStage,
            growthPressure: state.growthPressure + (phase === "late" ? 0.05 : 0.025),
            logs: addLog(
              state.logs,
              state.month,
              "logs.fundraisingSuccess",
              "action",
              {
                messageKey: "logs.fundraisingSuccess",
                params: {
                  chance: (chance * 100).toFixed(0),
                  cash: raiseAmount.toLocaleString(),
                  stage: nextStage,
                },
              },
            ),
          })
        : applyLeague({
            ...state,
            teamMorale: state.teamMorale - Math.round((phase === "early" ? 6 : phase === "mid" ? 8 : 10) * moraleDrain),
            reputation: state.reputation - 4,
            logs: addLog(
              state.logs,
              state.month,
              "logs.fundraisingFail",
              "action",
              {
                messageKey: "logs.fundraisingFail",
                params: {
                  chance: (chance * 100).toFixed(0),
                  reputation: state.reputation,
                  fit: state.marketFit,
                },
              },
            ),
          });
    }
    case "Pivot":
      {
        const fitGain = Math.round(randomInt(phase === "early" ? 12 : 9, phase === "late" ? 24 : 20) * productBonus);
        const progressLoss = phase === "early" ? 5 : phase === "mid" ? 11 : 20;
        const userLoss = Math.min(state.users, phase === "early" ? 15 : phase === "mid" ? 50 : Math.max(80, Math.floor(state.users * 0.08)));
        const moraleLoss = Math.round(((phase === "late" ? 15 : phase === "mid" ? 10 : 7) - (state.marketFit < 30 ? 2 : 0)) * moraleDrain);
        return applyLeague({
          ...state,
          marketFit: state.marketFit + fitGain,
          productProgress: state.productProgress - progressLoss,
          users: state.users - userLoss,
          reputation: state.reputation - (phase === "late" ? 4 : 1),
          teamMorale: state.teamMorale - moraleLoss,
          logs: addLog(
            state.logs,
            state.month,
            "logs.pivot",
            "action",
            {
              messageKey: "logs.pivot",
              params: {
                fit: fitGain,
                progress: progressLoss,
                users: userLoss,
                timing: phase === "late" ? "i18n:logs.pivotDangerous" : "i18n:logs.pivotManageable",
              },
            },
          ),
        });
      }
    case "Rest":
      {
        const moraleGain = state.trait === "Calm Operator" ? 22 : phase === "late" ? 16 : phase === "mid" ? 18 : 20;
        const cashCost = phase === "early" ? 1000 : phase === "mid" ? 1800 : 2600;
        const burnReduction = phase === "early" ? 700 : phase === "mid" ? 1000 : 1200;
        return applyLeague({
          ...state,
          teamMorale: state.teamMorale + moraleGain,
          productProgress: state.productProgress - (phase === "late" ? 6 : phase === "mid" ? 3 : 1),
          cash: state.cash - cashCost,
          burnRate: Math.max(0, state.burnRate - burnReduction),
          logs: addLog(
            state.logs,
            state.month,
            "logs.rest",
            "action",
            {
              messageKey: "logs.rest",
              params: { morale: moraleGain, burn: burnReduction.toLocaleString() },
            },
          ),
        });
      }
    default:
      return state;
  }
};

const applyMonthlyFinance = (state: GameState): GameState => {
  const scaleBurnIncrease =
    state.month > 15 && (state.users > 2500 || state.revenue > 35000)
      ? Math.round(Math.min(4500, state.burnRate * 0.012 + state.users * 0.08))
      : 0;
  const adjustedBurnRate = state.burnRate + scaleBurnIncrease;
  const effectiveBurn = Math.round(adjustedBurnRate * state.growthPressure);

  return {
    ...state,
    burnRate: adjustedBurnRate,
    cash: state.cash + state.revenue - effectiveBurn,
    logs: addLog(
      state.logs,
      state.month,
      "logs.finance",
      "finance",
      {
        messageKey: "logs.finance",
        params: {
          revenue: state.revenue.toLocaleString(),
          burn: effectiveBurn.toLocaleString(),
          scale: scaleBurnIncrease > 0 ? "i18n:logs.scaleBurn" : "i18n:logs.noScaleBurn",
        },
      },
    ),
  };
};

const applyRandomEvent = (state: GameState): { state: GameState; eventName: string | null; eventId: string | null; eventType: string | null } => {
  const event = drawRandomEvent(state);

  if (!event) {
    return { state, eventName: null, eventId: null, eventType: null };
  }

  return {
    state: {
      ...event.apply(state),
      logs: addLog(state.logs, state.month, event.titleKey, "event", {
        messageKey: "logs.event",
        params: {
          title: `i18n:${event.titleKey}`,
          description: `i18n:${event.descriptionKey}`,
        },
      }),
    },
    eventName: event.titleKey,
    eventId: event.id ?? event.titleKey,
    eventType: event.type ?? "common",
  };
};

const completeRun = (state: GameState, outcome: "won" | "lost", reason: string): GameState => {
  if (state.metaAwarded) {
    return {
      ...state,
      status: outcome,
      deathReason: reason,
      logs: addLog(
        state.logs,
        state.month,
        "logs.resultRepeat",
        "result",
        {
          messageKey: "logs.resultRepeat",
          params: {
            label: outcome === "won" ? "i18n:logs.victory" : "i18n:logs.gameOver",
            reason: reason.startsWith("i18n:") ? reason : reason,
          },
        },
      ),
    };
  }

  const baseXp = Math.max(10, state.month * 8 + Math.floor(state.revenue / 1500));
  const winBonus = outcome === "won" ? 90 : 0;
  const xpGained = baseXp + winBonus;
  const totalXp = state.meta.xp + xpGained;
  let unlockedIndustries = state.meta.unlockedIndustries;
  let unlockedFounders = state.meta.unlockedFounders;
  let achievements = state.meta.achievements;
  const shouldRecordNormalClear =
    outcome === "won" && state.mode === "normal" && !state.hasRecordedClear;
  const normalModeClears = state.meta.normalModeClears + (shouldRecordNormalClear ? 1 : 0);
  const unlockMessages: string[] = [];

  if (totalXp >= 80 && !unlockedIndustries.includes("Game")) {
    unlockedIndustries = addUnique(unlockedIndustries, "Game");
    unlockMessages.push("entities.industries.Game.title");
  }

  if (totalXp >= 160 && !unlockedFounders.includes("Sales Founder")) {
    unlockedFounders = addUnique(unlockedFounders, "Sales Founder");
    unlockMessages.push("entities.founders.Sales Founder.title");
  }

  if (totalXp >= 260 && !unlockedIndustries.includes("AI")) {
    unlockedIndustries = addUnique(unlockedIndustries, "AI");
    unlockMessages.push("entities.industries.AI.title");
  }

  if (totalXp >= 380 && !unlockedFounders.includes("Growth Founder")) {
    unlockedFounders = addUnique(unlockedFounders, "Growth Founder");
    unlockMessages.push("entities.founders.Growth Founder.title");
  }

  if (totalXp >= 520 && !unlockedIndustries.includes("Marketplace")) {
    unlockedIndustries = addUnique(unlockedIndustries, "Marketplace");
    unlockMessages.push("entities.industries.Marketplace.title");
  }

  const resultLog = addLog(
    state.logs,
    state.month,
    "logs.result",
    "result",
    {
      messageKey: "logs.result",
      params: {
        label: outcome === "won" ? "i18n:logs.victory" : "i18n:logs.gameOver",
        reason,
        xp: xpGained,
        unlocks: unlockMessages.length ? "i18n:logs.unlocksEarned" : "i18n:logs.noUnlocks",
      },
    },
  );

  return {
    ...state,
    status: outcome,
    deathReason: reason,
    metaAwarded: true,
    hasRecordedClear: state.hasRecordedClear || shouldRecordNormalClear,
    logs: resultLog,
    meta: {
      ...state.meta,
      xp: totalXp,
      runs: state.meta.runs + 1,
      bestRevenue: Math.max(state.meta.bestRevenue, state.revenue),
      normalModeClears,
      founderLeagueUnlocked: state.meta.founderLeagueUnlocked || normalModeClears >= 2,
      unlockedIndustries,
      unlockedFounders,
      achievements,
    },
  };
};

const resolveStatus = (state: GameState): GameState => {
  if (state.isFounderLeague) {
    if (state.cash <= 0) {
      return completeRun(
        { ...state, ending: "Bankruptcy", leagueEndedAt: new Date().toISOString() },
        "lost",
        "i18n:league.result.bankrupt",
      );
    }

    if (state.teamMorale <= 0) {
      return completeRun(
        { ...state, ending: "Team Collapse", leagueEndedAt: new Date().toISOString() },
        "lost",
        "i18n:league.result.teamCollapse",
      );
    }

    if (state.month > state.maxMonths) {
      return completeRun(
        { ...state, ending: "Founder League Complete", leagueEndedAt: new Date().toISOString() },
        "won",
        "i18n:league.result.completed",
      );
    }

    return state;
  }

  if (state.ending === "Unicorn") {
    return completeRun(state, "won", "i18n:entities.deathReasons.unicornIpo");
  }

  if (state.ending === "Exit") {
    return completeRun(state, "won", "i18n:entities.deathReasons.exitSuccess");
  }

  if (
    state.month >= 36 &&
    state.revenue >= 80000 &&
    state.revenue >= state.burnRate &&
    state.cash > 0
  ) {
    return completeRun(
      { ...state, ending: "Lifestyle Business" },
      "won",
      "i18n:entities.deathReasons.lifestyle",
    );
  }

  if (state.users >= 1000000 && state.revenue >= 500000) {
    return completeRun({ ...state, ending: "Unicorn" }, "won", "i18n:entities.deathReasons.unicornScale");
  }

  if (state.cash <= 0) {
    return completeRun(
      { ...state, ending: "Bankruptcy" },
      "lost",
      "i18n:entities.deathReasons.bankruptcy",
    );
  }

  if (state.teamMorale <= 0) {
    return completeRun(
      state,
      "lost",
      "i18n:entities.deathReasons.morale",
    );
  }

  if (state.revenue >= 50000) {
    return completeRun({ ...state, ending: "MVP Success" }, "won", "i18n:entities.deathReasons.mvp");
  }

  return state;
};

const createMonthlyReport = (
  before: GameState,
  after: GameState,
  action: ActionType,
  eventName: string | null,
): MonthlyReport => ({
  id: crypto.randomUUID(),
  month: before.month,
  action,
  eventName,
  cashDelta: after.cash - before.cash,
  revenueDelta: after.revenue - before.revenue,
  usersDelta: after.users - before.users,
  moraleDelta: after.teamMorale - before.teamMorale,
  productProgressDelta: after.productProgress - before.productProgress,
  marketFitDelta: after.marketFit - before.marketFit,
  reputationDelta: after.reputation - before.reputation,
  burnRateDelta: after.burnRate - before.burnRate,
  runway: after.runway,
  summary: `${action} completed. ${
    eventName ? eventName : "reports.noEventText"
  }`,
  summaryKey: eventName ? "reports.summaryWithEvent" : "reports.summaryWithoutEvent",
  summaryParams: {
    action: `i18n:actions.${action}.title`,
    event: eventName ? `i18n:${eventName}` : "",
    cash: (after.cash - before.cash).toLocaleString(),
  },
});

const createMonthlyDelta = (before: GameState, after: GameState) => ({
  cash: after.cash - before.cash,
  revenue: after.revenue - before.revenue,
  users: after.users - before.users,
  teamMorale: after.teamMorale - before.teamMorale,
  productProgress: after.productProgress - before.productProgress,
  marketFit: after.marketFit - before.marketFit,
  reputation: after.reputation - before.reputation,
  burnRate: after.burnRate - before.burnRate,
  runway: after.runway - before.runway,
});

export const playTurn = (state: GameState, action: ActionType): GameState => {
  if (state.status !== "playing") {
    return state;
  }

  const before = state;
  const afterAction = normalizeState(applyAction(state, action));
  const actionHistoryEntry: ActionHistoryEntry = {
    month: before.month,
    actionId: action,
    actionName: action,
    effects: numericEffects(before, afterAction),
  };
  const afterFinance = normalizeState(applyMonthlyFinance(afterAction));
  const randomEventResult = applyRandomEvent(afterFinance);
  const afterEvent = normalizeState(randomEventResult.state);
  const eventHistoryEntry: EventHistoryEntry | null = randomEventResult.eventId
    ? {
        month: before.month,
        eventId: randomEventResult.eventId,
        eventType: randomEventResult.eventType ?? "common",
        effects: numericEffects(afterFinance, afterEvent),
      }
    : null;
  const nextMonthState = {
    ...afterEvent,
    month: afterEvent.status === "playing" ? afterEvent.month + 1 : afterEvent.month,
  };

  const resolved = normalizeState(resolveStatus(nextMonthState));
  const report = createMonthlyReport(before, resolved, action, randomEventResult.eventName);
  const withReport = {
    ...resolved,
    monthlyReports: [report, ...resolved.monthlyReports].slice(0, 12),
    lastMonthDelta: createMonthlyDelta(before, resolved),
    monthlyHistory: [createSnapshot(resolved), ...resolved.monthlyHistory].slice(0, 48),
    actionHistory: [actionHistoryEntry, ...resolved.actionHistory].slice(0, 60),
    eventHistory: eventHistoryEntry
      ? [eventHistoryEntry, ...resolved.eventHistory].slice(0, 60)
      : resolved.eventHistory,
    rewardAdWatched: false,
  };

  return checkAchievements(withReport, action);
};

const checkAchievements = (state: GameState, action: ActionType): GameState => {
  let next = state;

  if (action === "Fundraising" && state.cash > 120000) {
    next = unlockAchievement(next, "first_fundraise");
  }

  if (state.users >= 1000000) {
    next = unlockAchievement(next, "one_million_users");
  }

  if (state.revenue >= state.burnRate && state.revenue > 0) {
    next = unlockAchievement(next, "profitable");
  }

  if (state.ending === "Exit") {
    next = unlockAchievement(next, "successful_exit");
  }

  return next;
};

export const applyRewardAd = (state: GameState): GameState => {
  if (state.status !== "lost" || state.rewardAdWatched) {
    return state;
  }

  return normalizeState({
    ...state,
    cash: state.cash + 50,
    teamMorale: state.teamMorale + 5,
    status: "playing",
    deathReason: null,
    rewardAdWatched: true,
    logs: addLog(
      state.logs,
      state.month,
      "logs.rewardAd",
      "ad",
      { messageKey: "logs.rewardAd" },
    ),
  });
};

export const isGameState = (value: unknown): value is GameState => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const state = value as Partial<GameState>;
  return (
    typeof state.month === "number" &&
    typeof state.cash === "number" &&
    typeof state.revenue === "number" &&
    typeof state.users === "number" &&
    typeof state.teamMorale === "number" &&
    typeof state.productProgress === "number" &&
    typeof state.marketFit === "number" &&
    typeof state.burnRate === "number" &&
    typeof state.runway === "number" &&
    (state.status === "playing" || state.status === "won" || state.status === "lost") &&
    Array.isArray(state.logs)
  );
};
