import { scenarioConfig, type GameState, type IndustryType } from "./gameState";

export type GameEvent = {
  id?: string;
  titleKey: string;
  descriptionKey: string;
  type?: "common" | "industry";
  industry?: IndustryType | "Common";
  tags: Array<"positive" | "negative" | "cash" | "growth" | "morale" | "late" | "ending" | "team" | "competition" | "reputation" | "technical">;
  baseWeight: number;
  weight?: number;
  minMonth?: number;
  condition?: (state: GameState) => boolean;
  effects?: Partial<Record<keyof GameState, number>>;
  apply: (state: GameState) => GameState;
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const randomEvents: GameEvent[] = [
  {
    titleKey: "events.viralBuzz.title",
    descriptionKey: "events.viralBuzz.description",
    tags: ["positive", "growth"],
    baseWeight: 9,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(90, state.industry === "Game" ? 320 : 220),
      revenue: state.revenue + randomInt(2500, 6500),
    }),
  },
  {
    titleKey: "events.serverOutage.title",
    descriptionKey: "events.serverOutage.description",
    tags: ["negative", "cash", "morale"],
    baseWeight: 6,
    minMonth: 5,
    apply: (state) => ({
      ...state,
      users: Math.max(0, state.users - randomInt(20, 55)),
      teamMorale: state.teamMorale - 6,
      cash: state.cash - randomInt(3500, 7000),
    }),
  },
  {
    titleKey: "events.hiringMiss.title",
    descriptionKey: "events.hiringMiss.description",
    tags: ["negative", "morale"],
    baseWeight: 7,
    minMonth: 4,
    apply: (state) => ({
      ...state,
      teamMorale: state.teamMorale - (state.founder === "Sales Founder" ? 9 : 6),
      cash: state.cash - 2000,
    }),
  },
  {
    titleKey: "events.investorIntro.title",
    descriptionKey: "events.investorIntro.description",
    tags: ["positive", "cash"],
    baseWeight: 8,
    apply: (state) => ({
      ...state,
      cash: state.cash + randomInt(12000, state.founder === "Sales Founder" ? 42000 : 30000),
    }),
  },
  {
    titleKey: "events.newCompetitor.title",
    descriptionKey: "events.newCompetitor.description",
    tags: ["negative", "late"],
    baseWeight: 5,
    minMonth: 6,
    apply: (state) => ({
      ...state,
      marketFit: state.marketFit - 5,
      revenue: Math.max(0, state.revenue - randomInt(1000, 3500)),
    }),
  },
  {
    titleKey: "events.enterpriseLead.title",
    descriptionKey: "events.enterpriseLead.description",
    tags: ["positive", "cash", "late"],
    baseWeight: 7,
    minMonth: 5,
    apply: (state) => ({
      ...state,
      revenue: state.revenue + randomInt(4500, state.industry === "SaaS" ? 12000 : 9500),
      productProgress: state.productProgress + 4,
    }),
  },
  {
    titleKey: "events.teamBurnout.title",
    descriptionKey: "events.teamBurnout.description",
    tags: ["negative", "morale"],
    baseWeight: 6,
    minMonth: 6,
    apply: (state) => ({
      ...state,
      teamMorale: state.teamMorale - randomInt(6, state.trait === "Calm Operator" ? 10 : 15),
    }),
  },
  {
    titleKey: "events.productPraise.title",
    descriptionKey: "events.productPraise.description",
    tags: ["positive", "growth"],
    baseWeight: 10,
    apply: (state) => ({
      ...state,
      marketFit: state.marketFit + randomInt(5, 10),
      users: state.users + randomInt(60, 140),
    }),
  },
  {
    titleKey: "events.techDebt.title",
    descriptionKey: "events.techDebt.description",
    tags: ["negative", "cash", "late"],
    baseWeight: 5,
    minMonth: 6,
    apply: (state) => ({
      ...state,
      productProgress: state.productProgress - 8,
      burnRate: state.burnRate + (state.founder === "Engineer Founder" ? 1500 : 3000),
    }),
  },
  {
    titleKey: "events.communityLift.title",
    descriptionKey: "events.communityLift.description",
    tags: ["positive", "growth"],
    baseWeight: 10,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(70, state.trait === "Hustler" ? 240 : 170),
    }),
  },
  {
    titleKey: "events.pricingWin.title",
    descriptionKey: "events.pricingWin.description",
    tags: ["positive", "cash", "late"],
    baseWeight: 6,
    minMonth: 4,
    apply: (state) => ({
      ...state,
      revenue: state.revenue + randomInt(3000, 9000),
      users: Math.max(0, state.users - randomInt(10, 35)),
    }),
  },
  {
    titleKey: "events.keyContributor.title",
    descriptionKey: "events.keyContributor.description",
    tags: ["positive", "morale"],
    baseWeight: 8,
    apply: (state) => ({
      ...state,
      productProgress: state.productProgress + randomInt(8, 14),
      teamMorale: state.teamMorale + 6,
    }),
  },
  {
    titleKey: "events.cashCrunch.title",
    descriptionKey: "events.cashCrunch.description",
    tags: ["negative", "cash"],
    baseWeight: 4,
    minMonth: 4,
    apply: (state) => ({
      ...state,
      teamMorale: state.teamMorale - randomInt(2, 5),
      reputation: state.reputation + 1,
    }),
  },
  {
    titleKey: "events.retentionDip.title",
    descriptionKey: "events.retentionDip.description",
    tags: ["negative", "growth"],
    baseWeight: 5,
    minMonth: 7,
    apply: (state) => ({
      ...state,
      users: Math.max(0, state.users - randomInt(30, 90)),
      marketFit: state.marketFit - 4,
    }),
  },
  {
    titleKey: "events.platformFeature.title",
    descriptionKey: "events.platformFeature.description",
    tags: ["positive", "growth", "late"],
    baseWeight: 5,
    minMonth: 8,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(120, 280),
      revenue: state.revenue + randomInt(2000, 7000),
      burnRate: state.burnRate + 1500,
    }),
  },
  {
    titleKey: "events.maOffer.title",
    descriptionKey: "events.maOffer.description",
    tags: ["positive", "cash", "late", "ending"],
    baseWeight: 4,
    minMonth: 12,
    apply: (state) => ({
      ...state,
      cash: state.cash + randomInt(120000, 320000),
      revenue: state.revenue + randomInt(8000, 22000),
      ending: state.revenue >= 120000 || state.users >= 250000 ? "Exit" : state.ending,
    }),
  },
  {
    titleKey: "events.ipoWindow.title",
    descriptionKey: "events.ipoWindow.description",
    tags: ["positive", "cash", "late", "ending"],
    baseWeight: 2,
    minMonth: 18,
    apply: (state) => ({
      ...state,
      cash: state.cash + randomInt(250000, 700000),
      revenue: state.revenue + randomInt(25000, 80000),
      ending: state.revenue >= 500000 ? "Unicorn" : state.ending,
    }),
  },
  {
    titleKey: "events.massiveBacklash.title",
    descriptionKey: "events.massiveBacklash.description",
    tags: ["negative", "growth", "morale", "late"],
    baseWeight: 4,
    minMonth: 10,
    apply: (state) => ({
      ...state,
      users: Math.max(0, state.users - randomInt(800, Math.max(1200, Math.floor(state.users * 0.18)))),
      marketFit: state.marketFit - 8,
      teamMorale: state.teamMorale - 14,
    }),
  },
  {
    titleKey: "events.regulationShock.title",
    descriptionKey: "events.regulationShock.description",
    tags: ["negative", "cash", "late"],
    baseWeight: 5,
    minMonth: 9,
    apply: (state) => ({
      ...state,
      cash: state.cash - randomInt(18000, state.industry === "AI" ? 65000 : 42000),
      burnRate: state.burnRate + randomInt(3500, 9000),
      productProgress: state.productProgress - 7,
    }),
  },
  {
    titleKey: "events.competitorAcquired.title",
    descriptionKey: "events.competitorAcquired.description",
    tags: ["positive", "growth", "late"],
    baseWeight: 4,
    minMonth: 11,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(500, 2400),
      revenue: state.revenue + randomInt(12000, 45000),
      marketFit: state.marketFit + 6,
    }),
  },
  {
    id: "customerFeedback",
    titleKey: "events.customerFeedback.title",
    descriptionKey: "events.customerFeedback.description",
    type: "common",
    industry: "Common",
    tags: ["negative", "growth", "reputation"],
    baseWeight: 7,
    weight: 7,
    effects: { marketFit: 4, teamMorale: -2 },
    apply: (state) => ({
      ...state,
      marketFit: state.marketFit + randomInt(2, 5),
      teamMorale: state.teamMorale - 2,
    }),
  },
  {
    id: "smallSocialBuzz",
    titleKey: "events.smallSocialBuzz.title",
    descriptionKey: "events.smallSocialBuzz.description",
    type: "common",
    industry: "Common",
    tags: ["positive", "growth", "reputation"],
    baseWeight: 8,
    weight: 8,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(35, 130),
      reputation: state.reputation + 2,
    }),
  },
  {
    id: "candidateApplies",
    titleKey: "events.candidateApplies.title",
    descriptionKey: "events.candidateApplies.description",
    type: "common",
    industry: "Common",
    tags: ["positive", "team"],
    baseWeight: 6,
    weight: 6,
    apply: (state) => ({
      ...state,
      productProgress: state.productProgress + randomInt(3, 7),
      burnRate: state.burnRate + 900,
    }),
  },
  {
    id: "mediaMention",
    titleKey: "events.mediaMention.title",
    descriptionKey: "events.mediaMention.description",
    type: "common",
    industry: "Common",
    tags: ["positive", "growth", "reputation"],
    baseWeight: 5,
    weight: 5,
    minMonth: 4,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(80, 260),
      reputation: state.reputation + 5,
    }),
  },
  {
    id: "bugFound",
    titleKey: "events.bugFound.title",
    descriptionKey: "events.bugFound.description",
    type: "common",
    industry: "Common",
    tags: ["negative", "technical", "morale"],
    baseWeight: 6,
    weight: 6,
    minMonth: 3,
    apply: (state) => ({
      ...state,
      productProgress: state.productProgress - randomInt(3, 8),
      teamMorale: state.teamMorale - randomInt(2, state.founder === "Engineer Founder" ? 4 : 7),
    }),
  },
  {
    id: "referralLoop",
    titleKey: "events.referralLoop.title",
    descriptionKey: "events.referralLoop.description",
    type: "common",
    industry: "Common",
    tags: ["positive", "growth"],
    baseWeight: 5,
    weight: 5,
    condition: (state) => state.marketFit >= 35,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(90, 300),
      revenue: state.revenue + randomInt(1200, 5200),
    }),
  },
  {
    id: "saasEnterpriseDemo",
    titleKey: "events.saasEnterpriseDemo.title",
    descriptionKey: "events.saasEnterpriseDemo.description",
    type: "industry",
    industry: "SaaS",
    tags: ["positive", "cash", "growth"],
    baseWeight: 8,
    weight: 8,
    apply: (state) => ({
      ...state,
      revenue: state.revenue + randomInt(6000, 18000),
      reputation: state.reputation + 4,
      productProgress: state.productProgress + 2,
    }),
  },
  {
    id: "saasChurnSpike",
    titleKey: "events.saasChurnSpike.title",
    descriptionKey: "events.saasChurnSpike.description",
    type: "industry",
    industry: "SaaS",
    tags: ["negative", "cash", "growth"],
    baseWeight: 6,
    weight: 6,
    minMonth: 5,
    apply: (state) => ({
      ...state,
      revenue: Math.max(0, state.revenue - randomInt(2500, 8500)),
      marketFit: state.marketFit - 4,
    }),
  },
  {
    id: "saasRenewal",
    titleKey: "events.saasRenewal.title",
    descriptionKey: "events.saasRenewal.description",
    type: "industry",
    industry: "SaaS",
    tags: ["positive", "cash", "reputation"],
    baseWeight: 5,
    weight: 5,
    minMonth: 8,
    apply: (state) => ({
      ...state,
      cash: state.cash + randomInt(12000, 32000),
      revenue: state.revenue + randomInt(5000, 14000),
      reputation: state.reputation + 5,
    }),
  },
  {
    id: "saasSecurityReview",
    titleKey: "events.saasSecurityReview.title",
    descriptionKey: "events.saasSecurityReview.description",
    type: "industry",
    industry: "SaaS",
    tags: ["negative", "technical", "cash"],
    baseWeight: 5,
    weight: 5,
    minMonth: 6,
    apply: (state) => ({
      ...state,
      burnRate: state.burnRate + randomInt(1800, 5200),
      productProgress: state.productProgress - 3,
      reputation: state.reputation + 2,
    }),
  },
  {
    id: "streamerCoverage",
    titleKey: "events.streamerCoverage.title",
    descriptionKey: "events.streamerCoverage.description",
    type: "industry",
    industry: "Game",
    tags: ["positive", "growth", "reputation"],
    baseWeight: 9,
    weight: 9,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(500, 2800),
      reputation: state.reputation + randomInt(3, 8),
    }),
  },
  {
    id: "reviewBomb",
    titleKey: "events.reviewBomb.title",
    descriptionKey: "events.reviewBomb.description",
    type: "industry",
    industry: "Game",
    tags: ["negative", "morale", "reputation"],
    baseWeight: 7,
    weight: 7,
    minMonth: 5,
    apply: (state) => ({
      ...state,
      reputation: state.reputation - randomInt(6, 14),
      teamMorale: state.teamMorale - randomInt(5, 12),
      revenue: Math.max(0, state.revenue - randomInt(1500, 6500)),
    }),
  },
  {
    id: "gameUpdatePraise",
    titleKey: "events.gameUpdatePraise.title",
    descriptionKey: "events.gameUpdatePraise.description",
    type: "industry",
    industry: "Game",
    tags: ["positive", "growth", "morale"],
    baseWeight: 7,
    weight: 7,
    condition: (state) => state.productProgress >= 35,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(250, 1400),
      teamMorale: state.teamMorale + 5,
      revenue: state.revenue + randomInt(2500, 12000),
    }),
  },
  {
    id: "monetizationBacklash",
    titleKey: "events.monetizationBacklash.title",
    descriptionKey: "events.monetizationBacklash.description",
    type: "industry",
    industry: "Game",
    tags: ["negative", "cash", "reputation"],
    baseWeight: 5,
    weight: 5,
    minMonth: 6,
    apply: (state) => ({
      ...state,
      revenue: Math.max(0, state.revenue - randomInt(3000, 11000)),
      reputation: state.reputation - 8,
      marketFit: state.marketFit - 3,
    }),
  },
  {
    id: "newAiModel",
    titleKey: "events.newAiModel.title",
    descriptionKey: "events.newAiModel.description",
    type: "industry",
    industry: "AI",
    tags: ["positive", "growth", "technical"],
    baseWeight: 8,
    weight: 8,
    apply: (state) => ({
      ...state,
      productProgress: state.productProgress + randomInt(5, 12),
      marketFit: state.marketFit + randomInt(3, 8),
      burnRate: state.burnRate + 1800,
    }),
  },
  {
    id: "apiCostSpike",
    titleKey: "events.apiCostSpike.title",
    descriptionKey: "events.apiCostSpike.description",
    type: "industry",
    industry: "AI",
    tags: ["negative", "cash", "technical"],
    baseWeight: 8,
    weight: 8,
    minMonth: 4,
    apply: (state) => ({
      ...state,
      burnRate: state.burnRate + randomInt(4500, 12000),
      cash: state.cash - randomInt(4000, 16000),
    }),
  },
  {
    id: "accuracyBreakthrough",
    titleKey: "events.accuracyBreakthrough.title",
    descriptionKey: "events.accuracyBreakthrough.description",
    type: "industry",
    industry: "AI",
    tags: ["positive", "growth", "reputation"],
    baseWeight: 6,
    weight: 6,
    condition: (state) => state.productProgress >= 35,
    apply: (state) => ({
      ...state,
      marketFit: state.marketFit + randomInt(6, 13),
      reputation: state.reputation + 7,
      revenue: state.revenue + randomInt(4000, 16000),
    }),
  },
  {
    id: "aiRegulationFear",
    titleKey: "events.aiRegulationFear.title",
    descriptionKey: "events.aiRegulationFear.description",
    type: "industry",
    industry: "AI",
    tags: ["negative", "reputation", "late"],
    baseWeight: 6,
    weight: 6,
    minMonth: 6,
    apply: (state) => ({
      ...state,
      reputation: state.reputation - randomInt(4, 10),
      productProgress: state.productProgress - 4,
      burnRate: state.burnRate + 3000,
    }),
  },
  {
    id: "supplyShortage",
    titleKey: "events.supplyShortage.title",
    descriptionKey: "events.supplyShortage.description",
    type: "industry",
    industry: "Marketplace",
    tags: ["negative", "growth"],
    baseWeight: 8,
    weight: 8,
    apply: (state) => ({
      ...state,
      marketFit: state.marketFit - 5,
      revenue: Math.max(0, state.revenue - randomInt(1500, 5500)),
    }),
  },
  {
    id: "demandSurge",
    titleKey: "events.demandSurge.title",
    descriptionKey: "events.demandSurge.description",
    type: "industry",
    industry: "Marketplace",
    tags: ["positive", "growth"],
    baseWeight: 7,
    weight: 7,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(220, 1100),
      revenue: state.revenue + randomInt(2500, 9500),
    }),
  },
  {
    id: "takeRateComplaints",
    titleKey: "events.takeRateComplaints.title",
    descriptionKey: "events.takeRateComplaints.description",
    type: "industry",
    industry: "Marketplace",
    tags: ["negative", "reputation", "cash"],
    baseWeight: 5,
    weight: 5,
    minMonth: 6,
    apply: (state) => ({
      ...state,
      reputation: state.reputation - 6,
      revenue: Math.max(0, state.revenue - randomInt(1800, 7000)),
    }),
  },
  {
    id: "networkEffect",
    titleKey: "events.networkEffect.title",
    descriptionKey: "events.networkEffect.description",
    type: "industry",
    industry: "Marketplace",
    tags: ["positive", "growth", "late"],
    baseWeight: 5,
    weight: 5,
    minMonth: 8,
    condition: (state) => state.users >= 1200 && state.marketFit >= 35,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(700, 2600),
      revenue: state.revenue + randomInt(9000, 28000),
      marketFit: state.marketFit + 5,
    }),
  },
  {
    id: "localReferral",
    titleKey: "events.localReferral.title",
    descriptionKey: "events.localReferral.description",
    type: "industry",
    industry: "Local Business Tech",
    tags: ["positive", "cash", "reputation"],
    baseWeight: 8,
    weight: 8,
    apply: (state) => ({
      ...state,
      revenue: state.revenue + randomInt(2500, 8500),
      reputation: state.reputation + 6,
    }),
  },
  {
    id: "workflowMismatch",
    titleKey: "events.workflowMismatch.title",
    descriptionKey: "events.workflowMismatch.description",
    type: "industry",
    industry: "Local Business Tech",
    tags: ["negative", "growth"],
    baseWeight: 6,
    weight: 6,
    minMonth: 4,
    apply: (state) => ({
      ...state,
      marketFit: state.marketFit - 5,
      productProgress: state.productProgress + 2,
    }),
  },
  {
    id: "wordOfMouthAdoption",
    titleKey: "events.wordOfMouthAdoption.title",
    descriptionKey: "events.wordOfMouthAdoption.description",
    type: "industry",
    industry: "Local Business Tech",
    tags: ["positive", "growth", "cash"],
    baseWeight: 7,
    weight: 7,
    condition: (state) => state.reputation >= 45,
    apply: (state) => ({
      ...state,
      users: state.users + randomInt(45, 160),
      revenue: state.revenue + randomInt(3000, 10000),
    }),
  },
  {
    id: "supportLoad",
    titleKey: "events.supportLoad.title",
    descriptionKey: "events.supportLoad.description",
    type: "industry",
    industry: "Local Business Tech",
    tags: ["negative", "morale", "cash"],
    baseWeight: 5,
    weight: 5,
    minMonth: 5,
    apply: (state) => ({
      ...state,
      teamMorale: state.teamMorale - randomInt(3, 8),
      burnRate: state.burnRate + randomInt(1000, 3500),
      reputation: state.reputation + 2,
    }),
  },
];

const getEventChance = (state: GameState) => {
  const scenarioRisk = scenarioConfig[state.scenario]?.eventRisk ?? 1;
  const phaseChance = (state.month <= 5 ? 0.22 : state.month <= 15 ? 0.36 : 0.48) * scenarioRisk;
  const stressBonus = state.month > 5 && (state.runway < 4 || state.teamMorale < 30) ? 0.06 : 0;
  return Math.min(0.55, phaseChance + stressBonus);
};

const getEventWeight = (event: GameEvent, state: GameState) => {
  if (event.minMonth && state.month < event.minMonth) {
    return 0;
  }

  if (event.condition && !event.condition(state)) {
    return 0;
  }

  if (event.industry && event.industry !== "Common" && event.industry !== state.industry) {
    return 0;
  }

  let weight = event.weight ?? event.baseWeight;
  const isEarly = state.month <= 5;
  const isLate = state.month >= 16;

  if (isEarly && event.tags.includes("negative")) {
    weight *= 0.35;
  }

  if (isEarly && event.tags.includes("positive")) {
    weight *= 1.35;
  }

  if (state.runway < 3 && event.tags.includes("cash") && event.tags.includes("negative")) {
    weight *= event.titleKey === "events.cashCrunch.title" ? 2.6 : 0.65;
  }

  if (state.runway < 3 && event.tags.includes("cash") && event.tags.includes("positive")) {
    weight *= 1.45;
  }

  if (state.teamMorale < 35 && event.tags.includes("morale") && event.tags.includes("negative")) {
    weight *= state.teamMorale < 18 ? 0.75 : 1.3;
  }

  if (state.users > 1000 && event.titleKey === "events.serverOutage.title") {
    weight *= state.users > 10000 ? 1.8 : 1.35;
  }

  if (state.marketFit > 50 && event.tags.includes("growth") && event.tags.includes("positive")) {
    weight *= 1.35;
  }

  if (state.marketFit < 25 && event.titleKey === "events.retentionDip.title") {
    weight *= 1.45;
  }

  if (isLate && event.tags.includes("late")) {
    weight *= 1.6;
  }

  if (state.industry === "Game" && event.tags.includes("growth")) {
    weight *= 1.25;
  }

  if (state.scenario === "Crisis Mode" && event.tags.includes("negative")) {
    weight *= 1.35;
  }

  if (state.scenario === "VC Funded" && event.tags.includes("ending")) {
    weight *= 1.35;
  }

  if (event.industry === state.industry) {
    weight *= 1.35;
  }

  if (state.industry === "AI" && event.tags.includes("competition")) {
    weight *= 1.15;
  }

  if (state.founder === "Growth Founder" && event.titleKey === "events.viralBuzz.title") {
    weight *= 1.35;
  }

  if (state.founder === "Bootstrap Founder" && event.tags.includes("cash") && event.tags.includes("negative")) {
    weight *= 0.8;
  }

  if (state.trait === "Calm Operator" && event.tags.includes("negative")) {
    weight *= 0.85;
  }

  return weight * (state.modifiers?.eventRisk ?? 1);
};

export const drawRandomEvent = (state: GameState) => {
  if (Math.random() > getEventChance(state)) {
    return null;
  }

  const weightedEvents = randomEvents
    .map((event) => ({ event, weight: getEventWeight(event, state) }))
    .filter(({ weight }) => weight > 0);
  const totalWeight = weightedEvents.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) {
    return null;
  }
  let roll = Math.random() * totalWeight;

  for (const item of weightedEvents) {
    roll -= item.weight;
    if (roll <= 0) {
      return item.event;
    }
  }

  return weightedEvents[weightedEvents.length - 1]?.event ?? null;
};
