import type { GameState } from "../gameState";

export type AppView =
  | "home"
  | "actions"
  | "report"
  | "analysis"
  | "mentor"
  | "ranking"
  | "log"
  | "settings"
  | "help"
  | "about"
  | "privacy"
  | "terms"
  | "contact"
  | "setup";

export function canShowAds(view: AppView, state: GameState): boolean {
  if (!state.hasStarted || view === "setup") {
    return false;
  }

  const disallowedViews: AppView[] = [
    "actions",
    "ranking",
    "settings",
    "privacy",
    "terms",
    "contact",
    "setup",
  ];

  if (disallowedViews.includes(view)) {
    return false;
  }

  if (view === "log") {
    return (state.eventHistory?.length ?? 0) >= 5;
  }

  return ["home", "report", "analysis", "help", "about", "mentor"].includes(view);
}
