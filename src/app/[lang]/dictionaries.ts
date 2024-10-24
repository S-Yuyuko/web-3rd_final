export type SupportedLocales = 'en' | 'zh'; // Define supported locales

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  zh: () => import('./dictionaries/zh.json').then((module) => module.default),
};

export const getDictionary = async (locale: SupportedLocales) => {
  const loadDictionary = dictionaries[locale];
  if (loadDictionary) {
    return loadDictionary();
  } else {
    return dictionaries.en(); // Fallback to English if the locale is not supported
  }
};
