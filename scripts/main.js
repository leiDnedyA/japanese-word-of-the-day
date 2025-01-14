console.log("Welcome! ようこそ！ (●'◡'●)")

const START_DATE_STRING = "2024-01-06";
const START_INDEX = 3;

// Show this word while loading
let word = {
  "word": "ようこそ",
  "furigana": "ようこそ",
  "romaji": "yokosou",
  "meaning": "Welcome",
};

let jlptLevel = 5;
let levelWordCount = 0;
let wordIndex = 0;
let romajiVisible = false;

const furiganaText = document.getElementById("furigana");
const wordText = document.getElementById("word");
const meaningText = document.getElementById("meaning");
const showRomajiButton = document.getElementById("show-romaji-button");
const randomWordButton = document.getElementById("random-word-button");
const jlptLevelDropdown = document.getElementById("jlpt-level-dropdown");

/**
 * Checks if a Japanese word contains kanji characters.
 * 
 * @param {string} word - The Japanese word to evaluate.
 * @returns {boolean} - Returns true if the word contains kanji, otherwise false.
 */
function containsKanji(word) {
  // Unicode range for kanji: U+4E00 to U+9FAF
  const kanjiRegex = /[\u4E00-\u9FAF]/;
  return kanjiRegex.test(word);
}

async function getJlptLevelWordCount(level = 1) {
  if (level < 1 || level > 5) {
    throw new Error(`Error, invalid JLPT level ${level}.`)
  }
  // get the total count
  const response = await fetch(`https://jlpt-vocab-api.vercel.app/api/words?level=${level}&limit=1`)
  const data = await response.json();
  return data.total;
}

async function getJlptWord(index, level = 1) {
  const response = await fetch(`https://jlpt-vocab-api.vercel.app/api/words?level=${level}&offset=${index}&limit=1`)
  const data = await response.json();
  return data.words[0];
}

function toggleRomaji() {
  romajiVisible = !romajiVisible;
  renderCurrentWord();
  localStorage.setItem("romajiVisible", `${romajiVisible}`);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function showRandomWord() {
  setLoading(true);
  wordIndex = getRandomInt(0, levelWordCount - 1);
  word = await getJlptWord(wordIndex, jlptLevel);
  renderCurrentWord();
  setLoading(false);
}

function renderCurrentWord() {
  wordText.textContent = word.word;
  meaningText.textContent = word.meaning;

  const hasKanji = word.furigana !== "";

  if (!hasKanji && !romajiVisible) {
    furiganaText.classList.add("empty");
  } else {
    furiganaText.classList.remove("empty");
  }

  if (romajiVisible) {
    if (!hasKanji) {
      // Only display the romaji
      furiganaText.textContent = `${word.romaji}`;
    } else {
      furiganaText.textContent = `${word.furigana} (${word.romaji})`;
    }
  } else {
    if (hasKanji) {
      furiganaText.textContent = word.furigana;
    }
  }

  if (romajiVisible) {
    showRomajiButton.innerText = "Hide Romaji";
  } else {
    showRomajiButton.innerText = "Show Romaji";
  }
}

function setLoading(loading = true) {
  const container = document.getElementById("container");
  if (loading) {
    container.classList.add("loading");
    word = {
      "word": "ローディング",
      "furigana": "",
      "romaji": "rōdingu",
      "meaning": "loading...",
    };
    renderCurrentWord();
  } else {
    container.classList.remove("loading");
  }
}

function getTodaysHash() {
  // Normalize time so word changes at 12AM local time for user
  const startDate = new Date(START_DATE_STRING);
  startDate.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffInMilliseconds = now - startDate;
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  return diffInDays + START_INDEX;
}

async function handleJlptLevelChange(target) {
  setLoading(true);

  jlptLevel = parseInt(target.value);

  // store value in localstorage
  localStorage.setItem("jlptLevel", `${jlptLevel}`);

  // update view
  const todaysHash = getTodaysHash();
  levelWordCount = await getJlptLevelWordCount(jlptLevel);
  wordIndex = todaysHash % levelWordCount;
  word = await getJlptWord(wordIndex, jlptLevel);

  setLoading(false);
  renderCurrentWord();
}

async function initialize() {
  setLoading(true);

  // fetch values from localstorage
  const storedJlptLevel = localStorage.getItem("jlptLevel");
  const storedRomajiVisible = localStorage.getItem("romajiVisible");

  if (storedJlptLevel) {
    if (!isNaN(parseInt(storedJlptLevel))) {
      jlptLevel = parseInt(storedJlptLevel)
      jlptLevelDropdown.value = jlptLevel;
    } else {
      localStorage.removeItem("jlptLevel");
    }
  }

  if (storedRomajiVisible === "true") {
    romajiVisible = true;
  }

  // set current word
  const todaysHash = getTodaysHash();
  levelWordCount = await getJlptLevelWordCount(jlptLevel);
  wordIndex = todaysHash % levelWordCount;
  word = await getJlptWord(wordIndex, jlptLevel);

  setLoading(false);
  renderCurrentWord();
}

window.onload = initialize;


