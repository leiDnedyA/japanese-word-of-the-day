
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const loadingWord = {
  word: "ローディング",
  furigana: "",
  romaji: "rōdingu",
  meaning: "loading...",
};

export const containsKanji = (word) => {
  const kanjiRegex = /[\u4E00-\u9FAF]/;
  return kanjiRegex.test(word);
};

