"use client";

import { createScopedStore } from "stan-js";

export type Language = "en" | "ru" | "he";

interface LanguageState {
  lang: Language;
}

export const { StoreProvider, useScopedStore, useStore } =
  createScopedStore<LanguageState>({
    lang: "en",
  });
