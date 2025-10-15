"use client";

import { PropsWithChildren, useMemo, useState } from "react";
import { initialLocaleValue, LanguageContext } from "./LanguageContext";

export const LanguageContextProvider = ({
  children,
  locale: overrideLocale,
}: PropsWithChildren<{ locale?: string }>) => {
  const [locale, setLocale] = useState(overrideLocale ?? initialLocaleValue);
  function handleSetLocale(value: string) {
    setLocale(value);
  }

  const messages = useMemo(() => {
    return locale === "en"
      ? require("../../messages/en.json")
      : require("../../messages/vi.json");
  }, [locale]);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        handleSetLocale,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
