import { en } from ".messages/en.json";
import { createTranslator } from "next-intl";

const locales = {
  en,
  vi,
};

export async function getTranslations(locale: string) {
  const defaultLocale = await getLocale();
  const translations = locales[locale] || locales[defaultLocale];
  return createTranslator({ locale, messages: translations });
}
