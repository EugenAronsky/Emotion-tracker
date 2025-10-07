import { useStore } from "@/app/store";
import { translations } from "@/lib/translations";

export function useTranslation() {
  const { lang } = useStore();
  return (key: keyof (typeof translations)["en"]) =>
    translations[lang][key] as any;
}
