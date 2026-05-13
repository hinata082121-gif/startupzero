import type { GameState } from "../gameState";
import type { ScoreBreakdown } from "../scoring/founderScore";
import { buildScoreBreakdown, calculateCompanyValuation, calculateTotalAssets, getDifficultyMultiplier } from "../scoring/founderScore";
import { safeStorage } from "../utils/safeStorage";

export const FOUNDER_LEAGUE_RANKINGS_KEY = "startup-zero-founder-league-rankings";
export const GAME_VERSION = "0.1.0";
export const RULES_VERSION = "founder-league-v1";

export type FounderLeagueResult = "completed" | "bankrupt" | "teamCollapse" | "exit" | "failed";

export type FounderLeagueRankingEntry = {
  id: string;
  runId: string;
  gameMode: "founderLeague";
  playerName: string;
  companyName: string;
  scenario: string;
  industry: string;
  founderType: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  totalAssets: number;
  companyValuation: number;
  cash: number;
  revenue: number;
  users: number;
  marketFit: number;
  reputation: number;
  productProgress: number;
  monthReached: number;
  result: FounderLeagueResult;
  difficulty: string;
  difficultyMultiplier: number;
  gameVersion: string;
  rulesVersion: string;
  seed: string;
  actionHistory: GameState["actionHistory"];
  eventHistory: GameState["eventHistory"];
  monthlyHistory: GameState["monthlyHistory"];
  createdAt: string;
};

export function getFounderLeagueResult(state: GameState): FounderLeagueResult {
  if (state.ending === "Exit") return "exit";
  if (state.cash <= 0 || state.ending === "Bankruptcy") return "bankrupt";
  if (state.teamMorale <= 0 || state.ending === "Team Collapse") return "teamCollapse";
  if (state.month >= state.maxMonths) return "completed";
  return "failed";
}

export function loadFounderLeagueRankings(): FounderLeagueRankingEntry[] {
  try {
    const raw = safeStorage.getItem(FOUNDER_LEAGUE_RANKINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function buildFounderLeagueRankingEntry(state: GameState): FounderLeagueRankingEntry {
  const scoreBreakdown = buildScoreBreakdown(state);
  return {
    id: crypto.randomUUID(),
    runId: state.leagueRunId || state.runId,
    gameMode: "founderLeague",
    playerName: state.founderName,
    companyName: state.companyName,
    scenario: state.scenario,
    industry: state.industry,
    founderType: state.founder,
    score: scoreBreakdown.total,
    scoreBreakdown,
    totalAssets: calculateTotalAssets(state),
    companyValuation: calculateCompanyValuation(state),
    cash: state.cash,
    revenue: state.revenue,
    users: state.users,
    marketFit: state.marketFit,
    reputation: state.reputation,
    productProgress: state.productProgress,
    monthReached: Math.min(state.month, state.maxMonths || state.month),
    result: getFounderLeagueResult(state),
    difficulty: "Founder League",
    difficultyMultiplier: getDifficultyMultiplier(state),
    gameVersion: GAME_VERSION,
    rulesVersion: RULES_VERSION,
    seed: state.leagueSeed,
    actionHistory: state.actionHistory,
    eventHistory: state.eventHistory,
    monthlyHistory: state.monthlyHistory,
    createdAt: new Date().toISOString(),
  };
}

export function saveFounderLeagueRanking(state: GameState): { entry: FounderLeagueRankingEntry; rank: number; rankings: FounderLeagueRankingEntry[] } {
  const existing = loadFounderLeagueRankings().filter((entry) => entry.runId !== (state.leagueRunId || state.runId));
  const entry = buildFounderLeagueRankingEntry(state);
  const rankings = [entry, ...existing]
    .sort((a, b) => b.score - a.score || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 100);
  safeStorage.setItem(FOUNDER_LEAGUE_RANKINGS_KEY, JSON.stringify(rankings));
  return { entry, rank: rankings.findIndex((item) => item.runId === entry.runId) + 1, rankings };
}
