import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { en } from "./en";
import { ja } from "./ja";
import type { Language, TFunction, TranslationParams, TranslationTree } from "./types";
import { safeStorage } from "../utils/safeStorage";

export const LANGUAGE_STORAGE_KEY = "startup-zero-language";
const LEGACY_LANGUAGE_STORAGE_KEY = "startup-zero-language-v1";

const translations: Record<Language, TranslationTree> = { en, ja };

type LanguageContextValue = {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: TFunction;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const interpolate = (value: string, params?: TranslationParams) =>
  value.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(params?.[key] ?? `{{${key}}}`));

const getNestedValue = (tree: TranslationTree, key: string): string | undefined => {
  const value = key.split(".").reduce<string | TranslationTree | undefined>((current, part) => {
    if (!current || typeof current === "string") {
      return undefined;
    }

    return current[part];
  }, tree);

  return typeof value === "string" ? value : undefined;
};

const detectInitialLanguage = (): Language => {
  const saved =
    safeStorage.getItem(LANGUAGE_STORAGE_KEY) ??
    safeStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
  if (saved === "en" || saved === "ja") {
    return saved;
  }

  return navigator.language.toLowerCase().startsWith("ja") ? "ja" : "en";
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(detectInitialLanguage);

  const value = useMemo<LanguageContextValue>(() => {
    const t: TFunction = (key, params) => {
      const translated = getNestedValue(translations[currentLanguage], key);
      const resolvedParams = params
        ? Object.fromEntries(
            Object.entries(params).map(([paramKey, paramValue]) => [
              paramKey,
              typeof paramValue === "string" && paramValue.startsWith("i18n:")
                ? (getNestedValue(translations[currentLanguage], paramValue.slice(5)) ??
                  getNestedValue(translations.en, paramValue.slice(5)) ??
                  paramValue.slice(5))
                : paramValue,
            ]),
          )
        : undefined;

      if (translated) {
        return interpolate(translated, resolvedParams);
      }

      const fallback = getNestedValue(translations.en, key);
      console.warn(`[i18n] Missing translation: ${currentLanguage}.${key}`);
      return fallback ? interpolate(fallback, resolvedParams) : key;
    };

    return {
      currentLanguage,
      setLanguage: (language) => {
        safeStorage.setItem(LANGUAGE_STORAGE_KEY, language);
        safeStorage.setItem(LEGACY_LANGUAGE_STORAGE_KEY, language);
        setCurrentLanguage(language);
      },
      t,
    };
  }, [currentLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useI18n = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useI18n must be used inside LanguageProvider");
  }

  return context;
};

const flattenKeys = (tree: TranslationTree, prefix = ""): string[] =>
  Object.entries(tree).flatMap(([key, value]) => {
    const next = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [next] : flattenKeys(value, next);
  });

export const validateTranslations = () => {
  const enKeys = new Set(flattenKeys(en));
  const jaKeys = new Set(flattenKeys(ja));
  const missingInJa = [...enKeys].filter((key) => !jaKeys.has(key));
  const missingInEn = [...jaKeys].filter((key) => !enKeys.has(key));

  if (missingInJa.length || missingInEn.length) {
    console.warn("[i18n] Translation key mismatch", { missingInJa, missingInEn });
  }

  return { missingInJa, missingInEn };
};
