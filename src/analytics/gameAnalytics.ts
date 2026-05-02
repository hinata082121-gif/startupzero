import type { GameState } from "../gameState";
import type {
  ActionPattern,
  GameRisk,
  HomeSummary,
  MentorAdvice,
  PlayStyle,
  ScoreBreakdown,
  TrendItem,
} from "./types";

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const monthlyNet = (state: GameState) => state.revenue - state.burnRate;

export const calculateFinancialHealth = (state: GameState) =>
  clampScore(
    (state.runway >= 12 ? 45 : state.runway * 3.75) +
      (monthlyNet(state) >= 0 ? 30 : Math.max(0, 25 + monthlyNet(state) / 1000)) +
      Math.min(25, state.cash / 4000),
  );

export const calculateGrowthScore = (state: GameState) =>
  clampScore(Math.min(45, state.users / 45) + Math.min(40, state.revenue / 1250) + state.reputation * 0.15);

export const calculateProductScore = (state: GameState) =>
  clampScore(state.productProgress * 0.75 + state.marketFit * 0.25);

export const calculateTeamScore = (state: GameState) =>
  clampScore(state.teamMorale * 0.85 + Math.max(0, 15 - state.burnRate / 5000));

export const calculateMarketScore = (state: GameState) =>
  clampScore(state.marketFit * 0.7 + state.reputation * 0.3);

export const calculateOverallScore = (state: GameState) => {
  const scores = [
    calculateFinancialHealth(state),
    calculateGrowthScore(state),
    calculateProductScore(state),
    calculateTeamScore(state),
    calculateMarketScore(state),
  ];
  return clampScore(scores.reduce((sum, score) => sum + score, 0) / scores.length);
};

export const getScoreBreakdown = (state: GameState): ScoreBreakdown => ({
  financialHealth: calculateFinancialHealth(state),
  growthScore: calculateGrowthScore(state),
  productScore: calculateProductScore(state),
  teamScore: calculateTeamScore(state),
  marketScore: calculateMarketScore(state),
  overallScore: calculateOverallScore(state),
});

export const detectRisks = (state: GameState): GameRisk[] => {
  const risks: GameRisk[] = [];
  if (state.cash < state.burnRate || state.runway < 2) {
    risks.push({
      id: "cashShortage",
      severity: state.runway < 1.5 ? "critical" : "high",
      titleKey: "analysis.riskItems.cashShortage.title",
      descriptionKey: "analysis.riskItems.cashShortage.description",
      mitigationKey: "analysis.riskItems.cashShortage.mitigation",
    });
  }
  if (state.teamMorale < 30) {
    risks.push({
      id: "teamCollapse",
      severity: state.teamMorale < 15 ? "critical" : "high",
      titleKey: "analysis.riskItems.teamCollapse.title",
      descriptionKey: "analysis.riskItems.teamCollapse.description",
      mitigationKey: "analysis.riskItems.teamCollapse.mitigation",
    });
  }
  if (state.users < 350 && state.month > 5) {
    risks.push({
      id: "growthStall",
      severity: "medium",
      titleKey: "analysis.riskItems.growthStall.title",
      descriptionKey: "analysis.riskItems.growthStall.description",
      mitigationKey: "analysis.riskItems.growthStall.mitigation",
    });
  }
  if (state.productProgress < 35 && state.month > 4) {
    risks.push({
      id: "immatureProduct",
      severity: "medium",
      titleKey: "analysis.riskItems.immatureProduct.title",
      descriptionKey: "analysis.riskItems.immatureProduct.description",
      mitigationKey: "analysis.riskItems.immatureProduct.mitigation",
    });
  }
  if (state.marketFit < 28 && state.month > 4) {
    risks.push({
      id: "poorFit",
      severity: "high",
      titleKey: "analysis.riskItems.poorFit.title",
      descriptionKey: "analysis.riskItems.poorFit.description",
      mitigationKey: "analysis.riskItems.poorFit.mitigation",
    });
  }
  if (state.users > 800 && state.revenue / Math.max(state.users, 1) < 18) {
    risks.push({
      id: "weakMonetization",
      severity: "medium",
      titleKey: "analysis.riskItems.weakMonetization.title",
      descriptionKey: "analysis.riskItems.weakMonetization.description",
      mitigationKey: "analysis.riskItems.weakMonetization.mitigation",
    });
  }
  return risks;
};

const trendDirection = (delta: number, threshold: number): TrendItem["direction"] =>
  delta > threshold ? "up" : delta < -threshold ? "down" : "flat";

export const analyzeTrends = (state: GameState): TrendItem[] => {
  const previous = state.monthlyHistory[1] ?? state.monthlyHistory[0];
  if (!previous) {
    return [
      { id: "users", labelKey: "dashboard.users", direction: "flat", value: 0 },
      { id: "revenue", labelKey: "dashboard.revenue", direction: "flat", value: 0 },
      { id: "cash", labelKey: "dashboard.cash", direction: "flat", value: 0 },
      { id: "morale", labelKey: "dashboard.morale", direction: "flat", value: 0 },
      { id: "marketFit", labelKey: "dashboard.marketFit", direction: "flat", value: 0 },
    ];
  }
  return [
    { id: "users", labelKey: "dashboard.users", direction: trendDirection(state.users - previous.users, 25), value: state.users - previous.users },
    { id: "revenue", labelKey: "dashboard.revenue", direction: trendDirection(state.revenue - previous.revenue, 1000), value: state.revenue - previous.revenue },
    { id: "cash", labelKey: "dashboard.cash", direction: state.cash >= previous.cash ? "improving" : "worsening", value: state.cash - previous.cash },
    { id: "morale", labelKey: "dashboard.morale", direction: Math.abs(state.teamMorale - previous.morale) <= 2 ? "stable" : state.teamMorale > previous.morale ? "improving" : "worsening", value: state.teamMorale - previous.morale },
    { id: "marketFit", labelKey: "dashboard.marketFit", direction: trendDirection(state.marketFit - previous.marketFit, 2), value: state.marketFit - previous.marketFit },
  ];
};

export const analyzeActionHistory = (state: GameState): ActionPattern => {
  const recent = state.actionHistory.slice(0, 8);
  if (!recent.length) {
    return { dominantAction: null, messageKey: "analysis.actionPatterns.none" };
  }
  const counts = recent.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.actionId] = (acc[entry.actionId] ?? 0) + 1;
    return acc;
  }, {});
  const [dominantAction, count] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (count < 3) {
    return { dominantAction: null, messageKey: "analysis.actionPatterns.balanced" };
  }
  return {
    dominantAction: dominantAction as ActionPattern["dominantAction"],
    messageKey: `analysis.actionPatterns.${dominantAction}`,
    params: { count },
  };
};

export const determinePlayStyle = (state: GameState): PlayStyle => {
  const pattern = analyzeActionHistory(state);
  if (pattern.dominantAction === "Develop") return "productBuilder";
  if (pattern.dominantAction === "Marketing") return "growthHacker";
  if (pattern.dominantAction === "Fundraising") return "fundraisingHeavy";
  if (pattern.dominantAction === "Rest") return "survivalOperator";
  return "balancedFounder";
};

export const generateHomeSummary = (state: GameState): HomeSummary => {
  const risks = detectRisks(state);
  const topRisk = risks.find((risk) => risk.severity === "critical") ?? risks[0];
  if (topRisk) {
    return {
      statusKey: topRisk.titleKey,
      riskLevel: topRisk.severity,
      summaryKey: "home.summaryAtRisk",
    };
  }
  if (calculateOverallScore(state) >= 70) {
    return { statusKey: "home.summaryHealthyTitle", riskLevel: "low", summaryKey: "home.summaryHealthy" };
  }
  return { statusKey: "home.summaryStableTitle", riskLevel: "medium", summaryKey: "home.summaryStable" };
};

export const generateMentorAdvice = (state: GameState): MentorAdvice => {
  const risks = detectRisks(state);
  const recommendations: MentorAdvice["recommendedActions"] = [];
  if (state.runway < 3) recommendations.push({ action: "Fundraising", reasonKey: "mentor.reasons.shortRunway" });
  if (state.teamMorale < 35) recommendations.push({ action: "Rest", reasonKey: "mentor.reasons.lowMorale" });
  if (state.productProgress >= 45 && state.marketFit >= 35 && state.users < 1000) recommendations.push({ action: "Marketing", reasonKey: "mentor.reasons.readyToGrow" });
  if (state.productProgress < 45) recommendations.push({ action: "Develop", reasonKey: "mentor.reasons.productWeak" });
  if (state.marketFit < 30 && state.productProgress >= 35) recommendations.push({ action: "Pivot", reasonKey: "mentor.reasons.fitWeak" });
  if (recommendations.length < 3) recommendations.push({ action: "Hire", reasonKey: "mentor.reasons.capacity" });

  return {
    currentAnalysis: [
      state.revenue >= state.burnRate ? "mentor.analysis.financePositive" : "mentor.analysis.financeNegative",
      state.users > 1000 ? "mentor.analysis.growthStrong" : "mentor.analysis.growthEarly",
      state.teamMorale >= 50 ? "mentor.analysis.teamStable" : "mentor.analysis.teamFragile",
      state.productProgress >= 55 ? "mentor.analysis.productReady" : "mentor.analysis.productNeedsWork",
      state.marketFit >= 45 ? "mentor.analysis.marketHealthy" : "mentor.analysis.marketUnclear",
    ],
    recommendedActions: recommendations.slice(0, 3),
    riskWarnings: risks.length ? risks.map((risk) => risk.descriptionKey) : ["mentor.riskNoneDetailed"],
    reasoningKey: risks.length ? "mentor.reasoningRiskFirst" : "mentor.reasoningGrowthBalance",
    beginnerNoteKey: state.runway < 4 ? "mentor.beginnerRunway" : state.marketFit < 35 ? "mentor.beginnerMarketFit" : "mentor.beginnerDefault",
  };
};
