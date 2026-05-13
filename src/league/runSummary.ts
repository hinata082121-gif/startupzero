import type { GameState } from "../gameState";
import { buildFounderLeagueRankingEntry } from "./rankings";

export function buildFounderLeagueRunSummary(state: GameState) {
  const entry = buildFounderLeagueRankingEntry(state);
  return {
    runId: entry.runId,
    seed: entry.seed,
    gameVersion: entry.gameVersion,
    rulesVersion: entry.rulesVersion,
    playerName: entry.playerName,
    companyName: entry.companyName,
    scenario: entry.scenario,
    industry: entry.industry,
    founderType: entry.founderType,
    actionHistory: entry.actionHistory,
    eventHistory: entry.eventHistory,
    monthlyHistory: entry.monthlyHistory,
    finalState: state,
    score: entry.score,
    scoreBreakdown: entry.scoreBreakdown,
  };
}

export function serializeFounderLeagueRun(state: GameState) {
  return JSON.stringify(buildFounderLeagueRunSummary(state));
}
