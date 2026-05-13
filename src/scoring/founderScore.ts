import type { GameState, IndustryType } from "../gameState";

export type ScoreBreakdown = {
  assets: number;
  valuation: number;
  revenue: number;
  users: number;
  marketFit: number;
  reputation: number;
  product: number;
  survival: number;
  difficulty: number;
  penalty: number;
  total: number;
};

const valuationMultiples: Record<IndustryType, { revenue: number; user: number; fit: number; reputation: number; product: number }> = {
  SaaS: { revenue: 5.2, user: 18, fit: 1450, reputation: 850, product: 950 },
  Game: { revenue: 2.8, user: 36, fit: 900, reputation: 1500, product: 700 },
  AI: { revenue: 4.8, user: 22, fit: 1700, reputation: 900, product: 1600 },
  Marketplace: { revenue: 3.6, user: 34, fit: 1850, reputation: 900, product: 750 },
  "Local Business Tech": { revenue: 3.4, user: 10, fit: 900, reputation: 1450, product: 650 },
};

export function calculateTotalAssets(state: GameState): number {
  return Math.max(0, state.cash) + Math.max(0, state.revenue * 3);
}

export function calculateCompanyValuation(state: GameState): number {
  const multiple = valuationMultiples[state.industry];
  const networkBonus = state.industry === "Marketplace" && state.month >= 18 ? 1.18 : 1;
  const aiBonus = state.industry === "AI" && state.marketFit >= 55 ? 1.12 : 1;

  return Math.max(
    0,
    Math.round(
      state.cash +
        state.revenue * 12 * multiple.revenue +
        state.users * multiple.user * networkBonus +
        state.marketFit * multiple.fit +
        state.reputation * multiple.reputation +
        state.productProgress * multiple.product * aiBonus,
    ),
  );
}

export function buildScoreBreakdown(state: GameState): ScoreBreakdown {
  const totalAssets = calculateTotalAssets(state);
  const companyValuation = calculateCompanyValuation(state);
  const completed = state.isFounderLeague && state.month >= state.maxMonths && state.cash > 0 && state.teamMorale > 0;
  const difficultyMultiplier = state.isFounderLeague ? 1.3 : 1;
  const penalty = state.cash <= 0 || state.teamMorale <= 0 ? -2200 : 0;

  const raw = {
    assets: Math.round(totalAssets / 3500),
    valuation: Math.round(companyValuation / 9000),
    revenue: Math.round((state.revenue * 12) / 5500),
    users: Math.round(Math.sqrt(Math.max(0, state.users)) * 8),
    marketFit: Math.round(state.marketFit * 13),
    reputation: Math.round(state.reputation * 11),
    product: Math.round(state.productProgress * 9),
    survival: Math.round(state.month * 32 + (completed ? 850 : 0)),
    difficulty: Math.round((difficultyMultiplier - 1) * 1000),
    penalty,
  };

  const subtotal =
    raw.assets +
    raw.valuation +
    raw.revenue +
    raw.users +
    raw.marketFit +
    raw.reputation +
    raw.product +
    raw.survival +
    penalty;
  const total = Math.max(0, Math.round(subtotal * difficultyMultiplier));

  return {
    ...raw,
    total,
  };
}

export function calculateFounderScore(state: GameState): number {
  return buildScoreBreakdown(state).total;
}

export function getDifficultyMultiplier(state: GameState): number {
  return state.isFounderLeague ? 1.3 : 1;
}
