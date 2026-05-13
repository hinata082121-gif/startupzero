import type { ActionType } from "./gameState";

export type EffectDirection = "up" | "up2" | "down" | "down2" | "flat" | "risk";

export type ActionEffectHint = {
  metricKey: string;
  direction: EffectDirection;
};

export const actionEffectHints: Record<ActionType, ActionEffectHint[]> = {
  Develop: [
    { metricKey: "dashboard.productProgress", direction: "up2" },
    { metricKey: "dashboard.marketFit", direction: "up" },
    { metricKey: "dashboard.cash", direction: "down" },
    { metricKey: "dashboard.revenue", direction: "flat" },
  ],
  Hire: [
    { metricKey: "dashboard.productProgress", direction: "up" },
    { metricKey: "dashboard.team", direction: "up" },
    { metricKey: "dashboard.burnRate", direction: "up" },
    { metricKey: "dashboard.cash", direction: "down2" },
  ],
  Marketing: [
    { metricKey: "dashboard.users", direction: "up2" },
    { metricKey: "dashboard.revenue", direction: "up" },
    { metricKey: "dashboard.cash", direction: "down" },
    { metricKey: "dashboard.morale", direction: "flat" },
  ],
  Fundraising: [
    { metricKey: "dashboard.cash", direction: "up2" },
    { metricKey: "dashboard.reputation", direction: "risk" },
    { metricKey: "dashboard.morale", direction: "flat" },
    { metricKey: "effects.failureRisk", direction: "risk" },
  ],
  Pivot: [
    { metricKey: "dashboard.marketFit", direction: "up" },
    { metricKey: "dashboard.productProgress", direction: "down" },
    { metricKey: "dashboard.reputation", direction: "flat" },
    { metricKey: "effects.riskyReset", direction: "risk" },
  ],
  Rest: [
    { metricKey: "dashboard.morale", direction: "up2" },
    { metricKey: "dashboard.cash", direction: "down" },
    { metricKey: "effects.growth", direction: "flat" },
    { metricKey: "effects.lowRisk", direction: "flat" },
  ],
};

export const directionSymbol: Record<EffectDirection, string> = {
  up: "↑",
  up2: "↑↑",
  down: "↓",
  down2: "↓↓",
  flat: "→",
  risk: "±",
};

export const directionTone: Record<EffectDirection, string> = {
  up: "text-emerald-700 bg-emerald-50 border-emerald-200",
  up2: "text-emerald-800 bg-emerald-50 border-emerald-200",
  down: "text-rose-700 bg-rose-50 border-rose-200",
  down2: "text-rose-800 bg-rose-50 border-rose-200",
  flat: "text-slate-700 bg-slate-50 border-slate-200",
  risk: "text-amber-800 bg-amber-50 border-amber-200",
};
