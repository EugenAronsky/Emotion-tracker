"use client";

import { createScopedStore } from "stan-js";

export type Language = "en" | "ru" | "he";

interface LanguageState {
  lang: Language;
}

const initialLang: Language =
  typeof localStorage !== "undefined"
    ? (localStorage.getItem(`${window.origin}-lang`) as Language) || "en"
    : "en";

export const { StoreProvider, useScopedStore, useStore } =
  createScopedStore<LanguageState>({
    lang: initialLang,
  });
