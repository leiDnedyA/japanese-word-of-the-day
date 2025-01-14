import { initializeEventHandlers, renderCurrentWord, setLoading } from "./controls.js";
import { getJlptLevelWordCount, getJlptWord } from "./fetch_jlpt_api.js";
import { getTodaysHash } from "./hash.js";
import { loadingWord } from "./util.js";

const app = {
  config: {
    elements: {
      furigana: document.getElementById("furigana"),
      word: document.getElementById("word"),
      meaning: document.getElementById("meaning"),
      showRomajiButton: document.getElementById("show-romaji-button"),
      randomWordButton: document.getElementById("random-word-button"),
      jlptLevelDropdown: document.getElementById("jlpt-level-dropdown"),
    }
  },
  state: {
    currentWord: null,
    jlptLevel: 5,
    levelWordCount: 0,
    wordIndex: 0,
    romajiVisible: false
  }
};

app.state.currentWord = { ...loadingWord };

async function initialize() {
  setLoading(true, app.state.currentWord, (word) => app.state.currentWord = word);

  initializeEventHandlers();

  // Load stored preferences
  const storedJlptLevel = localStorage.getItem("jlptLevel");
  const storedRomajiVisible = localStorage.getItem("romajiVisible");

  if (storedJlptLevel && !isNaN(parseInt(storedJlptLevel))) {
    app.state.jlptLevel = parseInt(storedJlptLevel);
    app.config.elements.jlptLevelDropdown.value = app.state.jlptLevel;
  } else {
    localStorage.removeItem("jlptLevel");
  }

  if (storedRomajiVisible === "true") {
    app.state.romajiVisible = true;
  }

  // Set current word
  const todaysHash = getTodaysHash();
  app.state.levelWordCount = await getJlptLevelWordCount(app.state.jlptLevel);
  app.state.wordIndex = todaysHash % app.state.levelWordCount;
  app.state.currentWord = await getJlptWord(app.state.wordIndex, app.state.jlptLevel);

  setLoading(false, app.state.currentWord, (word) => app.state.currentWord = word);
  renderCurrentWord(app.state.currentWord);
}

window.onload = initialize;
window.app = app;
