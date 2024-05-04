import "server-only";

const dictionaries = {
  "en-US": () =>
    import("../dictionaries/en-US.json").then((module) => module.default),
  "pt-BR": () =>
    import("../dictionaries/pt-BR.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const dictionary = dictionaries[locale as keyof typeof dictionaries];
  if (!dictionary) throw new Error(`Locale "${locale}" not supported`);
  return dictionary();
};
