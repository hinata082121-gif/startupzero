import type { Language } from "./i18n/types";

export function formatCurrency(value: number, language: Language): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (language === "ja") {
    if (abs >= 100000000) {
      return `${sign}${trimNumber(abs / 100000000)}億円`;
    }
    if (abs >= 10000) {
      return `${sign}${trimNumber(abs / 10000)}万円`;
    }
    return `${sign}${Math.round(abs).toLocaleString("ja-JP")}円`;
  }

  if (abs >= 1000000) {
    return `${sign}$${trimNumber(abs / 1000000)}M`;
  }
  if (abs >= 1000) {
    return `${sign}$${trimNumber(abs / 1000)}K`;
  }
  return `${sign}$${Math.round(abs).toLocaleString("en-US")}`;
}

export function formatSignedCurrency(value: number, language: Language): string {
  if (value === 0) {
    return formatCurrency(0, language);
  }

  return `${value > 0 ? "+" : ""}${formatCurrency(value, language)}`;
}

const trimNumber = (value: number) =>
  Number.isInteger(value) ? value.toLocaleString() : value.toFixed(1).replace(/\.0$/, "");
