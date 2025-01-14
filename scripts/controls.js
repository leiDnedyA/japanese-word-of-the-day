import { getRandomInt, loadingWord } from "./util.js";
import { getTodaysHash } from "./hash.js";
import { getJlptLevelWordCount, getJlptWord } from "./fetch_jlpt_api.js";

console.log("Welcome! ようこそ！ (●'◡'●)");

export function setLoading(loading) {
  const container = document.getElementById("container");
  if (loading) {
    container.classList.add("loading");
    app.currentWord = { ...loadingWord }
    renderCurrentWord(app.currentWord, app.state.romajiVisible);
  } else {
    container.classList.remove("loading");
  }
}

export function renderCurrentWord() {
  const { elements } = app.config;

  const word = app.state.currentWord;

  elements.word.textContent = word.word;
  elements.meaning.textContent = word.meaning;

  const hasKanji = word.furigana !== "";
  const romajiVisible = app.state.romajiVisible;

  if (!hasKanji && !romajiVisible) {
    elements.furigana.classList.add("empty");
  } else {
    elements.furigana.classList.remove("empty");
  }

  if (romajiVisible) {
    if (!hasKanji) {
      elements.furigana.textContent = `${word.romaji}`;
    } else {
      elements.furigana.textContent = `${word.furigana} (${word.romaji})`;
    }
  } else {
    if (hasKanji) {
      elements.furigana.textContent = word.furigana;
    }
  }

  elements.showRomajiButton.innerText = romajiVisible ? "Hide Romaji" : "Show Romaji";
}

export function initializeEventHandlers() {
  const drawingPageLink = document.getElementById("drawing-page-link");
  if (drawingPageLink) {
    drawingPageLink.addEventListener("click", function(event) {
      event.preventDefault();
      window.location.href = "/draw";
    });
  }

  const romajiToggle = app.config.elements.showRomajiButton;
  if (romajiToggle) {
    romajiToggle.addEventListener("click", function() {
      app.state.romajiVisible = !app.state.romajiVisible;
      renderCurrentWord();
      localStorage.setItem("romajiVisible", `${app.state.romajiVisible}`);
    });
  }

  if (app.config.elements.randomWordButton) {
    app.config.elements.randomWordButton.addEventListener("click", async function() {
      setLoading(true);

      app.state.wordIndex = getRandomInt(0, app.state.levelWordCount - 1);
      app.state.currentWord = await getJlptWord(app.state.wordIndex, app.state.jlptLevel);

      renderCurrentWord(app.state.currentWord, app.state.romajiVisible);
      setLoading(false);
    });
  }

  if (app.config.elements.jlptLevelDropdown) {
    app.config.elements.jlptLevelDropdown.addEventListener("change", async function(event) {
      setLoading(false);

      app.state.jlptLevel = parseInt(event.target.value);
      localStorage.setItem("jlptLevel", `${app.state.jlptLevel}`);

      const todaysHash = getTodaysHash();
      app.state.levelWordCount = await getJlptLevelWordCount(app.state.jlptLevel);
      app.state.wordIndex = todaysHash % app.state.levelWordCount;
      app.state.currentWord = await getJlptWord(app.state.wordIndex, app.state.jlptLevel);

      setLoading(false);
      renderCurrentWord(app.state.currentWord, app.state.romajiVisible);
    });
  }
}
