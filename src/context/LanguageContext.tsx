"use client";
import { createContext, FC, ReactNode, useState } from "react";

export interface LanguageContextType {
  locale: string;
  handleSetLocale: (locale: string) => void;
}

export const initialLocaleValue = "en";

export const LanguageContext = createContext<LanguageContextType>({
  locale: initialLocaleValue,
  handleSetLocale: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: string;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({
  children,
  defaultLanguage = initialLocaleValue,
}) => {
  const [locale, setLocale] = useState(defaultLanguage);

  const handleSetLocale = (newLocale: string) => {
    setLocale(newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, handleSetLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};
