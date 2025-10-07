import { Language, useStore } from "@/app/store";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export default function LanguagePicker({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang, setLang } = useStore();

  useEffect(() => {
    const isRTL = lang === "he";
    localStorage.setItem(`${window.origin}-lang`, lang);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
  }, [lang]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={lang === "he" ? "start" : "end"}
        className="w-fit min-w-fit *:pr-8 *:pl-2 *:[&>span]:right-2 *:[&>span]:left-auto"
      >
        <DropdownMenuCheckboxItem
          checked={lang === "en"}
          onClick={() => setLang("en")}
        >
          English
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={lang === "ru"}
          onClick={() => setLang("ru")}
        >
          Русский
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={lang === "he"}
          onClick={() => setLang("he")}
        >
          עברית
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
