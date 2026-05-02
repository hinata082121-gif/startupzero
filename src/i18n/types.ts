export type Language = "en" | "ja";

export type TranslationParams = Record<string, string | number>;

export type TFunction = (key: string, params?: TranslationParams) => string;

export type TranslationTree = {
  [key: string]: string | TranslationTree;
};
