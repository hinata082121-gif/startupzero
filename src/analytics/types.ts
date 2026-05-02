import type { ActionType } from "../gameState";

export type ScoreBreakdown = {
  financialHealth: number;
  growthScore: number;
  productScore: number;
  teamScore: number;
  marketScore: number;
  overallScore: number;
};

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type GameRisk = {
  id: string;
  severity: RiskSeverity;
  titleKey: string;
  descriptionKey: string;
  mitigationKey: string;
};

export type TrendDirection = "up" | "flat" | "down" | "improving" | "worsening" | "stable";

export type TrendItem = {
  id: string;
  labelKey: string;
  direction: TrendDirection;
  value: number;
};

export type ActionPattern = {
  dominantAction: ActionType | null;
  messageKey: string;
  params?: Record<string, string | number>;
};

export type PlayStyle =
  | "productBuilder"
  | "growthHacker"
  | "fundraisingHeavy"
  | "survivalOperator"
  | "balancedFounder";

export type HomeSummary = {
  statusKey: string;
  riskLevel: RiskSeverity;
  summaryKey: string;
};

export type RecommendedAction = {
  action: ActionType;
  reasonKey: string;
};

export type MentorAdvice = {
  currentAnalysis: string[];
  recommendedActions: RecommendedAction[];
  riskWarnings: string[];
  reasoningKey: string;
  beginnerNoteKey: string;
};
