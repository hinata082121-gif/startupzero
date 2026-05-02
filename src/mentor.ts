import type { ActionType, GameState } from "./gameState";
import type { TFunction } from "./i18n/types";

export type PremiumAdvice = {
  stateEvaluation: string;
  nextBestAction: ActionType;
  riskWarning: string;
  cashFlowAdvice: string;
};

export const getBasicHint = (state: GameState, t: TFunction): string => {
  if (state.cash < state.burnRate * 2) {
    return t("mentor.hintCash");
  }

  if (state.teamMorale < 30) {
    return t("mentor.hintMorale");
  }

  if (state.marketFit < 35 && state.productProgress >= 45) {
    return t("mentor.hintFit");
  }

  if (state.productProgress < 50) {
    return t("mentor.hintDevelop");
  }

  if (state.revenue < 25000 && state.users > 400) {
    return t("mentor.hintMarketing");
  }

  return t("mentor.hintDefault");
};

export const getPremiumAdvice = (state: GameState, t: TFunction): PremiumAdvice => {
  const monthlyNet = state.revenue - state.burnRate;
  const runwayText =
    monthlyNet >= 0
      ? t("mentor.runwayPositive")
      : t("mentor.runwayNegative", { runway: state.runway.toFixed(1) });

  let nextBestAction: ActionType = "Develop";
  if (state.teamMorale <= 25) {
    nextBestAction = "Rest";
  } else if (state.cash < state.burnRate * 2) {
    nextBestAction = "Fundraising";
  } else if (state.marketFit < 35 && state.productProgress >= 45) {
    nextBestAction = "Pivot";
  } else if (state.productProgress >= 55 && state.marketFit >= 35) {
    nextBestAction = "Marketing";
  } else if (state.productProgress < 55) {
    nextBestAction = "Develop";
  } else {
    nextBestAction = "Hire";
  }

  const riskWarning =
    state.teamMorale <= 20
      ? t("mentor.riskMorale")
      : state.cash <= state.burnRate
        ? t("mentor.riskCash")
        : state.burnRate > state.revenue * 3
          ? t("mentor.riskBurn")
          : t("mentor.riskDefault");

  return {
    stateEvaluation:
      state.status === "playing"
        ? t("mentor.evalPlaying", {
            month: state.month,
            users: state.users.toLocaleString(),
            fit: state.marketFit,
            progress: state.productProgress,
          })
        : t("mentor.evalEnded", { status: t(`common.status.${state.status}`) }),
    nextBestAction,
    riskWarning,
    cashFlowAdvice:
      monthlyNet >= 0
        ? t("mentor.cashPositive", { net: monthlyNet.toLocaleString() })
        : t("mentor.cashNegative", {
            net: Math.abs(monthlyNet).toLocaleString(),
            runway: runwayText,
          }),
  };
};
