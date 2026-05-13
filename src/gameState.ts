export type ActionType =
  | "Develop"
  | "Hire"
  | "Marketing"
  | "Fundraising"
  | "Pivot"
  | "Rest";

export type GameStatus = "playing" | "won" | "lost";

export type LogKind = "system" | "action" | "finance" | "event" | "result" | "ad";

export type IndustryType =
  | "SaaS"
  | "Game"
  | "AI"
  | "Marketplace"
  | "Local Business Tech";

export type ScenarioType = "Standard Startup" | "Bootstrapped" | "VC Funded" | "Crisis Mode";

export type GameMode = "normal" | "founderLeague";

export type FounderType =
  | "Engineer Founder"
  | "Sales Founder"
  | "Product Founder"
  | "Growth Founder"
  | "Bootstrap Founder";

export type TraitType = "Hustler" | "Engineer" | "Storyteller" | "Calm Operator";

export type EndingType =
  | "Unicorn"
  | "Exit"
  | "Bankruptcy"
  | "Team Collapse"
  | "Founder League Complete"
  | "Lifestyle Business"
  | "MVP Success"
  | null;

export type CompetitionLevel = "low" | "medium" | "high" | "extreme";

export type AchievementId =
  | "first_fundraise"
  | "one_million_users"
  | "profitable"
  | "successful_exit";

export type LogEntry = {
  id: string;
  month: number;
  message: string;
  messageKey?: string;
  params?: Record<string, string | number>;
  kind?: LogKind;
};

export type MonthlyReport = {
  id: string;
  month: number;
  action: ActionType;
  eventName: string | null;
  cashDelta: number;
  revenueDelta: number;
  usersDelta: number;
  moraleDelta: number;
  productProgressDelta: number;
  marketFitDelta: number;
  reputationDelta: number;
  burnRateDelta: number;
  runway: number;
  summary: string;
  summaryKey?: string;
  summaryParams?: Record<string, string | number>;
};

export type MonthlyDelta = {
  cash: number;
  revenue: number;
  users: number;
  teamMorale: number;
  productProgress: number;
  marketFit: number;
  reputation: number;
  burnRate: number;
  runway: number;
};

export type MonthlySnapshot = {
  month: number;
  cash: number;
  revenue: number;
  users: number;
  burnRate: number;
  runway: number;
  morale: number;
  productProgress: number;
  marketFit: number;
  reputation: number;
  companyValuation?: number;
  founderScoreEstimate?: number;
};

export type ActionHistoryEntry = {
  month: number;
  actionId: ActionType;
  actionName: string;
  effects: Partial<Record<"cash" | "revenue" | "users" | "burnRate" | "runway" | "morale" | "productProgress" | "marketFit" | "reputation", number>>;
};

export type EventHistoryEntry = {
  month: number;
  eventId: string;
  eventType: string;
  effects: Partial<Record<"cash" | "revenue" | "users" | "burnRate" | "runway" | "morale" | "productProgress" | "marketFit" | "reputation", number>>;
};

export type MetaProgression = {
  xp: number;
  runs: number;
  bestRevenue: number;
  normalModeClears: number;
  founderLeagueUnlocked: boolean;
  unlockedIndustries: IndustryType[];
  unlockedFounders: FounderType[];
  achievements: AchievementId[];
};

export type GameModifiers = {
  usersGrowth: number;
  revenueGrowth: number;
  productProgress: number;
  marketFit: number;
  burnRate: number;
  morale: number;
  fundraising: number;
  reputation: number;
  eventRisk: number;
};

export type GameState = {
  runId: string;
  hasStarted: boolean;
  mode: GameMode;
  gameMode: GameMode;
  isFounderLeague: boolean;
  maxMonths: number;
  leagueRunId: string;
  leagueSeed: string;
  leagueStartedAt: string;
  leagueEndedAt?: string;
  hasSubmittedLocalRanking: boolean;
  founderName: string;
  companyName: string;
  hasRecordedClear: boolean;
  month: number;
  scenario: ScenarioType;
  industry: IndustryType;
  founder: FounderType;
  selectedIndustry: IndustryType;
  selectedFounderType: FounderType;
  industryName: string;
  founderTypeName: string;
  modifiers: GameModifiers;
  trait: TraitType;
  ending: EndingType;
  growthPressure: number;
  cash: number;
  revenue: number;
  users: number;
  teamMorale: number;
  productProgress: number;
  marketFit: number;
  reputation: number;
  competitionPressure: number;
  mainCompetitorName: string;
  competitionLevel: CompetitionLevel;
  fundingStage: number;
  burnRate: number;
  runway: number;
  status: GameStatus;
  deathReason: string | null;
  metaAwarded: boolean;
  logs: LogEntry[];
  monthlyReports: MonthlyReport[];
  lastMonthDelta: MonthlyDelta | null;
  monthlyHistory: MonthlySnapshot[];
  actionHistory: ActionHistoryEntry[];
  eventHistory: EventHistoryEntry[];
  rewardAdWatched: boolean;
  meta: MetaProgression;
};

export const STORAGE_KEY = "startup-zero-save-v1";
export const SAVE_SLOTS_KEY = "startup-zero-save-slots-v1";

export const DEFAULT_META: MetaProgression = {
  xp: 0,
  runs: 0,
  bestRevenue: 0,
  normalModeClears: 0,
  founderLeagueUnlocked: false,
  unlockedIndustries: ["Local Business Tech", "SaaS", "Game", "AI", "Marketplace"],
  unlockedFounders: [
    "Product Founder",
    "Engineer Founder",
    "Sales Founder",
    "Growth Founder",
    "Bootstrap Founder",
  ],
  achievements: [],
};

export const competitorNames: Record<IndustryType, string[]> = {
  SaaS: ["CloudWorks Pro", "FlowBase", "TaskHive"],
  Game: ["PixelNova", "NeonForge", "StreamQuest"],
  AI: ["NeuralPeak", "PromptAxis", "OmniModel Labs"],
  Marketplace: ["TradeLoop", "MatchGrid", "SupplyHub"],
  "Local Business Tech": ["LocalFlow", "ShopMate Pro", "TownWorks"],
};

export const initialCompetitionPressure: Record<IndustryType, number> = {
  "Local Business Tech": 25,
  SaaS: 40,
  Game: 50,
  AI: 60,
  Marketplace: 65,
};

export const getCompetitionLevel = (pressure: number): CompetitionLevel => {
  if (pressure >= 80) return "extreme";
  if (pressure >= 60) return "high";
  if (pressure >= 35) return "medium";
  return "low";
};

export const pickCompetitorName = (industry: IndustryType, seed: string) => {
  const names = competitorNames[industry];
  const index = Math.abs(seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % names.length;
  return names[index];
};

export const DEFAULT_MODIFIERS: GameModifiers = {
  usersGrowth: 1,
  revenueGrowth: 1,
  productProgress: 1,
  marketFit: 1,
  burnRate: 1,
  morale: 1,
  fundraising: 0,
  reputation: 1,
  eventRisk: 1,
};

export const industryConfig: Record<
  IndustryType,
  {
    description: string;
    growthCurve: string;
    revenueModel: string;
    difficulty: "Easy" | "Normal" | "Hard" | "Expert";
    recommendationKey: string;
    strengths: string[];
    weaknesses: string[];
    initialBonus: string[];
    modifiers: Partial<GameModifiers>;
    cash: number;
    revenue: number;
    users: number;
    morale: number;
    progress: number;
    fit: number;
    burn: number;
    growthMultiplier: number;
    revenueMultiplier: number;
  }
> = {
  SaaS: {
    description: "entities.industries.SaaS.description",
    growthCurve: "steady",
    revenueModel: "subscription",
    difficulty: "Normal",
    recommendationKey: "setup.recommendations.standard",
    strengths: ["entities.industries.SaaS.strength1", "entities.industries.SaaS.strength2"],
    weaknesses: ["entities.industries.SaaS.weakness1", "entities.industries.SaaS.weakness2"],
    initialBonus: ["entities.industries.SaaS.bonus1", "entities.industries.SaaS.bonus2"],
    cash: 100000,
    revenue: 5000,
    users: 100,
    morale: 70,
    progress: 20,
    fit: 10,
    burn: 12000,
    growthMultiplier: 1,
    revenueMultiplier: 1.12,
    modifiers: { revenueGrowth: 1.1, marketFit: 1.12 },
  },
  Game: {
    description: "entities.industries.Game.description",
    growthCurve: "hit-driven",
    revenueModel: "launch-sales",
    difficulty: "Hard",
    recommendationKey: "setup.recommendations.advanced",
    strengths: ["entities.industries.Game.strength1", "entities.industries.Game.strength2"],
    weaknesses: ["entities.industries.Game.weakness1", "entities.industries.Game.weakness2"],
    initialBonus: ["entities.industries.Game.bonus1", "entities.industries.Game.bonus2"],
    cash: 95000,
    revenue: 4000,
    users: 220,
    morale: 68,
    progress: 20,
    fit: 10,
    burn: 14000,
    growthMultiplier: 1.35,
    revenueMultiplier: 0.92,
    modifiers: { usersGrowth: 1.25, revenueGrowth: 0.95, morale: 0.95, reputation: 1.2, eventRisk: 1.12 },
  },
  AI: {
    description: "entities.industries.AI.description",
    growthCurve: "late-adoption",
    revenueModel: "usage-based",
    difficulty: "Hard",
    recommendationKey: "setup.recommendations.advanced",
    strengths: ["entities.industries.AI.strength1", "entities.industries.AI.strength2"],
    weaknesses: ["entities.industries.AI.weakness1", "entities.industries.AI.weakness2"],
    initialBonus: ["entities.industries.AI.bonus1", "entities.industries.AI.bonus2"],
    cash: 115000,
    revenue: 5000,
    users: 100,
    morale: 70,
    progress: 30,
    fit: 10,
    burn: 18000,
    growthMultiplier: 1.05,
    revenueMultiplier: 1.35,
    modifiers: { revenueGrowth: 1.12, burnRate: 1.15, fundraising: 0.1, eventRisk: 1.14 },
  },
  Marketplace: {
    description: "entities.industries.Marketplace.description",
    growthCurve: "network-effects",
    revenueModel: "take-rate",
    difficulty: "Expert",
    recommendationKey: "setup.recommendations.expert",
    strengths: ["entities.industries.Marketplace.strength1", "entities.industries.Marketplace.strength2"],
    weaknesses: ["entities.industries.Marketplace.weakness1", "entities.industries.Marketplace.weakness2"],
    initialBonus: ["entities.industries.Marketplace.bonus1", "entities.industries.Marketplace.bonus2"],
    cash: 100000,
    revenue: 3500,
    users: 160,
    morale: 70,
    progress: 20,
    fit: 18,
    burn: 12000,
    growthMultiplier: 0.9,
    revenueMultiplier: 1.25,
    modifiers: { usersGrowth: 0.9, revenueGrowth: 1.08, marketFit: 1.1, eventRisk: 1.08 },
  },
  "Local Business Tech": {
    description: "entities.industries.Local Business Tech.description",
    growthCurve: "stable-local",
    revenueModel: "service-subscription",
    difficulty: "Easy",
    recommendationKey: "setup.recommendations.beginner",
    strengths: [
      "entities.industries.Local Business Tech.strength1",
      "entities.industries.Local Business Tech.strength2",
    ],
    weaknesses: [
      "entities.industries.Local Business Tech.weakness1",
      "entities.industries.Local Business Tech.weakness2",
    ],
    initialBonus: [
      "entities.industries.Local Business Tech.bonus1",
      "entities.industries.Local Business Tech.bonus2",
    ],
    cash: 85000,
    revenue: 7000,
    users: 70,
    morale: 76,
    progress: 22,
    fit: 16,
    burn: 9500,
    growthMultiplier: 0.78,
    revenueMultiplier: 1.08,
    modifiers: { usersGrowth: 0.82, revenueGrowth: 1.05, burnRate: 0.9, reputation: 1.12, eventRisk: 0.9 },
  },
};

export const industryDescriptions: Record<IndustryType, string> = {
  SaaS: industryConfig.SaaS.description,
  Game: industryConfig.Game.description,
  AI: industryConfig.AI.description,
  Marketplace: industryConfig.Marketplace.description,
  "Local Business Tech": industryConfig["Local Business Tech"].description,
};

export const scenarioConfig: Record<
  ScenarioType,
  {
    description: string;
    difficulty: "Easy" | "Normal" | "Hard" | "Expert";
    recommendationKey: string;
    cashMultiplier: number;
    burnMultiplier: number;
    moraleDelta: number;
    growthPressure: number;
    eventRisk: number;
  }
> = {
  "Standard Startup": {
    description: "entities.scenarios.Standard Startup.description",
    difficulty: "Normal",
    recommendationKey: "setup.recommendations.standard",
    cashMultiplier: 1,
    burnMultiplier: 1,
    moraleDelta: 0,
    growthPressure: 1,
    eventRisk: 1,
  },
  Bootstrapped: {
    description: "entities.scenarios.Bootstrapped.description",
    difficulty: "Hard",
    recommendationKey: "setup.recommendations.advanced",
    cashMultiplier: 0.35,
    burnMultiplier: 0.75,
    moraleDelta: 8,
    growthPressure: 0.85,
    eventRisk: 0.9,
  },
  "VC Funded": {
    description: "entities.scenarios.VC Funded.description",
    difficulty: "Normal",
    recommendationKey: "setup.recommendations.standard",
    cashMultiplier: 2.4,
    burnMultiplier: 1.35,
    moraleDelta: -4,
    growthPressure: 1.35,
    eventRisk: 1.08,
  },
  "Crisis Mode": {
    description: "entities.scenarios.Crisis Mode.description",
    difficulty: "Expert",
    recommendationKey: "setup.recommendations.expert",
    cashMultiplier: 0.8,
    burnMultiplier: 1.05,
    moraleDelta: -12,
    growthPressure: 1.15,
    eventRisk: 1.35,
  },
};

export const founderConfig: Record<
  FounderType,
  {
    description: string;
    difficulty: "Easy" | "Normal" | "Hard" | "Expert";
    recommendationKey: string;
    strengths: string[];
    weaknesses: string[];
    initialBonus: string[];
    modifiers: Partial<GameModifiers>;
  }
> = {
  "Engineer Founder": {
    description: "entities.founders.Engineer Founder.description",
    difficulty: "Normal",
    recommendationKey: "setup.recommendations.standard",
    strengths: [
      "entities.founders.Engineer Founder.strength1",
      "entities.founders.Engineer Founder.strength2",
    ],
    weaknesses: [
      "entities.founders.Engineer Founder.weakness1",
      "entities.founders.Engineer Founder.weakness2",
    ],
    initialBonus: [
      "entities.founders.Engineer Founder.bonus1",
      "entities.founders.Engineer Founder.bonus2",
    ],
    modifiers: { productProgress: 1.22, usersGrowth: 0.92, fundraising: -0.05 },
  },
  "Sales Founder": {
    description: "entities.founders.Sales Founder.description",
    difficulty: "Easy",
    recommendationKey: "setup.recommendations.beginner",
    strengths: [
      "entities.founders.Sales Founder.strength1",
      "entities.founders.Sales Founder.strength2",
    ],
    weaknesses: [
      "entities.founders.Sales Founder.weakness1",
      "entities.founders.Sales Founder.weakness2",
    ],
    initialBonus: [
      "entities.founders.Sales Founder.bonus1",
      "entities.founders.Sales Founder.bonus2",
    ],
    modifiers: { usersGrowth: 1.12, revenueGrowth: 1.15, fundraising: 0.12, burnRate: 1.08, productProgress: 0.9 },
  },
  "Product Founder": {
    description: "entities.founders.Product Founder.description",
    difficulty: "Normal",
    recommendationKey: "setup.recommendations.standard",
    strengths: [
      "entities.founders.Product Founder.strength1",
      "entities.founders.Product Founder.strength2",
    ],
    weaknesses: [
      "entities.founders.Product Founder.weakness1",
    ],
    initialBonus: [
      "entities.founders.Product Founder.bonus1",
      "entities.founders.Product Founder.bonus2",
    ],
    modifiers: { marketFit: 1.2, revenueGrowth: 1.05 },
  },
  "Growth Founder": {
    description: "entities.founders.Growth Founder.description",
    difficulty: "Hard",
    recommendationKey: "setup.recommendations.advanced",
    strengths: [
      "entities.founders.Growth Founder.strength1",
      "entities.founders.Growth Founder.strength2",
    ],
    weaknesses: [
      "entities.founders.Growth Founder.weakness1",
      "entities.founders.Growth Founder.weakness2",
    ],
    initialBonus: [
      "entities.founders.Growth Founder.bonus1",
      "entities.founders.Growth Founder.bonus2",
    ],
    modifiers: { usersGrowth: 1.28, revenueGrowth: 1.05, burnRate: 1.12, morale: 0.9, eventRisk: 1.08 },
  },
  "Bootstrap Founder": {
    description: "entities.founders.Bootstrap Founder.description",
    difficulty: "Normal",
    recommendationKey: "setup.recommendations.standard",
    strengths: [
      "entities.founders.Bootstrap Founder.strength1",
      "entities.founders.Bootstrap Founder.strength2",
    ],
    weaknesses: [
      "entities.founders.Bootstrap Founder.weakness1",
      "entities.founders.Bootstrap Founder.weakness2",
    ],
    initialBonus: [
      "entities.founders.Bootstrap Founder.bonus1",
      "entities.founders.Bootstrap Founder.bonus2",
    ],
    modifiers: { burnRate: 0.86, usersGrowth: 0.9, fundraising: -0.08, morale: 1.08 },
  },
};

export const founderDescriptions: Record<FounderType, string> = {
  "Engineer Founder": founderConfig["Engineer Founder"].description,
  "Sales Founder": founderConfig["Sales Founder"].description,
  "Product Founder": founderConfig["Product Founder"].description,
  "Growth Founder": founderConfig["Growth Founder"].description,
  "Bootstrap Founder": founderConfig["Bootstrap Founder"].description,
};

export const traitDescriptions: Record<TraitType, string> = {
  Hustler: "entities.traits.Hustler",
  Engineer: "entities.traits.Engineer",
  Storyteller: "entities.traits.Storyteller",
  "Calm Operator": "entities.traits.Calm Operator",
};

export const calculateRunway = (cash: number, revenue: number, burnRate: number) => {
  const monthlyLoss = Math.max(burnRate - revenue, 1);
  return cash > 0 ? cash / monthlyLoss : 0;
};

export const combineModifiers = (
  industry: IndustryType,
  founder: FounderType,
): GameModifiers => {
  const industryModifiers = industryConfig[industry]?.modifiers ?? {};
  const founderModifiers = founderConfig[founder]?.modifiers ?? {};
  return {
    ...DEFAULT_MODIFIERS,
    ...industryModifiers,
    ...founderModifiers,
    usersGrowth:
      DEFAULT_MODIFIERS.usersGrowth *
      (industryModifiers.usersGrowth ?? 1) *
      (founderModifiers.usersGrowth ?? 1),
    revenueGrowth:
      DEFAULT_MODIFIERS.revenueGrowth *
      (industryModifiers.revenueGrowth ?? 1) *
      (founderModifiers.revenueGrowth ?? 1),
    productProgress:
      DEFAULT_MODIFIERS.productProgress *
      (industryModifiers.productProgress ?? 1) *
      (founderModifiers.productProgress ?? 1),
    marketFit:
      DEFAULT_MODIFIERS.marketFit *
      (industryModifiers.marketFit ?? 1) *
      (founderModifiers.marketFit ?? 1),
    burnRate:
      DEFAULT_MODIFIERS.burnRate *
      (industryModifiers.burnRate ?? 1) *
      (founderModifiers.burnRate ?? 1),
    morale:
      DEFAULT_MODIFIERS.morale *
      (industryModifiers.morale ?? 1) *
      (founderModifiers.morale ?? 1),
    fundraising:
      DEFAULT_MODIFIERS.fundraising +
      (industryModifiers.fundraising ?? 0) +
      (founderModifiers.fundraising ?? 0),
    reputation:
      DEFAULT_MODIFIERS.reputation *
      (industryModifiers.reputation ?? 1) *
      (founderModifiers.reputation ?? 1),
    eventRisk:
      DEFAULT_MODIFIERS.eventRisk *
      (industryModifiers.eventRisk ?? 1) *
      (founderModifiers.eventRisk ?? 1),
  };
};

export const normalizeIndustry = (industry?: string): IndustryType => {
  if (industry === "Local Business Tech") return "Local Business Tech";
  if (industry === "Game" || industry === "AI" || industry === "Marketplace" || industry === "SaaS") {
    return industry;
  }
  return "SaaS";
};

export const normalizeFounder = (founder?: string): FounderType => {
  if (founder === "Technical") return "Engineer Founder";
  if (founder === "Sales") return "Sales Founder";
  if (founder === "Product") return "Product Founder";
  if (
    founder === "Engineer Founder" ||
    founder === "Sales Founder" ||
    founder === "Product Founder" ||
    founder === "Growth Founder" ||
    founder === "Bootstrap Founder"
  ) {
    return founder;
  }
  return "Product Founder";
};

export const normalizeScenario = (scenario?: string): ScenarioType => {
  if (scenario === "standard" || scenario === "Standard" || scenario === "Standard Startup") {
    return "Standard Startup";
  }
  if (scenario === "VC Backed") {
    return "VC Funded";
  }
  if (scenario === "Standard Startup" || scenario === "Bootstrapped" || scenario === "VC Funded" || scenario === "Crisis Mode") {
    return scenario;
  }
  return "Standard Startup";
};

export const getRandomTrait = (): TraitType => {
  const traits: TraitType[] = ["Hustler", "Engineer", "Storyteller", "Calm Operator"];
  return traits[Math.floor(Math.random() * traits.length)];
};

export const createInitialState = (
  meta: MetaProgression = DEFAULT_META,
  industry: IndustryType = "SaaS",
  founder: FounderType = "Product Founder",
  scenario: ScenarioType = "Standard Startup",
  mode: GameMode = "normal",
  founderName = "Founder",
  companyName = "Zero Inc.",
): GameState => {
  industry = normalizeIndustry(industry);
  founder = normalizeFounder(founder);
  scenario = normalizeScenario(scenario);
  const industrySettings = industryConfig[industry];
  const scenarioSettings = scenarioConfig[scenario];
  const modifiers = combineModifiers(industry, founder);
  let cash = Math.round(industrySettings.cash * scenarioSettings.cashMultiplier);
  let revenue = industrySettings.revenue;
  let users = industrySettings.users;
  let teamMorale = industrySettings.morale + scenarioSettings.moraleDelta;
  let productProgress = industrySettings.progress;
  let marketFit = industrySettings.fit;
  let reputation = scenario === "VC Funded" ? 58 : scenario === "Crisis Mode" ? 34 : 42;
  let fundingStage = scenario === "VC Funded" ? 1 : 0;
  let burnRate = Math.round(industrySettings.burn * scenarioSettings.burnMultiplier * modifiers.burnRate);
  const trait = getRandomTrait();
  const leagueSeed = crypto.randomUUID().slice(0, 8);
  const competitionPressure = initialCompetitionPressure[industry] + (mode === "founderLeague" ? 8 : 0);

  if (founder === "Engineer Founder") {
    productProgress += 10;
  }

  if (founder === "Sales Founder") {
    revenue += 2500;
    reputation += 7;
    teamMorale -= 5;
  }

  if (founder === "Product Founder") {
    marketFit += 10;
    teamMorale += 5;
  }

  if (founder === "Growth Founder") {
    users += 120;
    burnRate += 1800;
    teamMorale -= 4;
  }

  if (founder === "Bootstrap Founder") {
    cash += 9000;
    burnRate -= 1200;
    users -= 20;
  }

  teamMorale = Math.round(teamMorale * modifiers.morale);
  reputation = Math.round(reputation * modifiers.reputation);

  if (trait === "Hustler") {
    users += 80;
    teamMorale -= 6;
  }

  if (trait === "Engineer") {
    productProgress += 8;
    revenue -= 1000;
  }

  if (trait === "Storyteller") {
    cash += 10000;
    reputation += 8;
    productProgress -= 4;
  }

  if (trait === "Calm Operator") {
    teamMorale += 10;
    burnRate += 1000;
  }

  return {
    runId: crypto.randomUUID(),
    hasStarted: false,
    mode,
    gameMode: mode,
    isFounderLeague: mode === "founderLeague",
    maxMonths: mode === "founderLeague" ? 36 : 0,
    leagueRunId: crypto.randomUUID(),
    leagueSeed,
    leagueStartedAt: new Date().toISOString(),
    hasSubmittedLocalRanking: false,
    founderName: founderName.trim() || "Founder",
    companyName: companyName.trim() || "Zero Inc.",
    hasRecordedClear: false,
    month: 1,
    scenario,
    industry,
    founder,
    selectedIndustry: industry,
    selectedFounderType: founder,
    industryName: industry,
    founderTypeName: founder,
    modifiers,
    trait,
    ending: null,
    growthPressure: scenarioSettings.growthPressure,
    cash,
    revenue,
    users,
    teamMorale,
    productProgress,
    marketFit,
    reputation,
    competitionPressure,
    mainCompetitorName: pickCompetitorName(industry, leagueSeed),
    competitionLevel: getCompetitionLevel(competitionPressure),
    fundingStage,
    burnRate,
    runway: calculateRunway(cash, revenue, burnRate),
    status: "playing",
    deathReason: null,
    metaAwarded: false,
    logs: [
      {
        id: crypto.randomUUID(),
        month: 1,
        message: `${scenario} ${industry} startup founded by a ${founder} founder. Trait: ${trait}.`,
        messageKey: "logs.initial",
        params: {
          scenario: `i18n:entities.scenarios.${scenario}.title`,
          industry: `i18n:entities.industries.${industry}.title`,
          founder: `i18n:entities.founders.${founder}.title`,
          trait: `i18n:entities.traits.${trait}`,
        },
        kind: "system",
      },
    ],
    monthlyReports: [],
    lastMonthDelta: null,
    monthlyHistory: [],
    actionHistory: [],
    eventHistory: [],
    rewardAdWatched: false,
    meta: {
      ...DEFAULT_META,
      ...meta,
      normalModeClears: meta.normalModeClears ?? DEFAULT_META.normalModeClears,
      founderLeagueUnlocked:
        meta.founderLeagueUnlocked ??
        (meta.normalModeClears ?? DEFAULT_META.normalModeClears) >= 2,
      unlockedIndustries: Array.from(
        new Set([
          ...DEFAULT_META.unlockedIndustries,
          ...(meta.unlockedIndustries ?? []).map((item) => normalizeIndustry(item)),
        ]),
      ),
      unlockedFounders: Array.from(
        new Set([
          ...DEFAULT_META.unlockedFounders,
          ...(meta.unlockedFounders ?? []).map((item) => normalizeFounder(item)),
        ]),
      ),
      achievements: meta.achievements ?? [],
    },
  };
};

export const actions: ActionType[] = [
  "Develop",
  "Hire",
  "Marketing",
  "Fundraising",
  "Pivot",
  "Rest",
];
