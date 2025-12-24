/**
 * Dictionary API Project
 * Requirements covered:
 * - fetch with async/await
 * - input validation
 * - loading + disable button
 * - error handling (no results, invalid input, failed call)
 * - dynamic DOM (cards, lists, audio)
 */

// Public Dictionary API (no key)
const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const wordInput = document.getElementById("wordInput");
const searchBtn = document.getElementById("searchBtn");
const resultsEl = document.getElementById("results");
const errorEl = document.getElementById("error");
const loadingEl = document.getElementById("loading");
const spinner = document.getElementById("spinner");
const themeToggle = document.getElementById("themeToggle");

const THEME_KEY = "dictionary-theme";

/** Utility: show/hide */
function setLoading(isLoading) {
  loadingEl.classList.toggle("hidden", !isLoading);
  if (spinner) spinner.classList.toggle("hidden", !isLoading);
  searchBtn.disabled = isLoading;
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

function clearError() {
  errorEl.textContent = "";
  errorEl.classList.add("hidden");
}

function setTheme(isLight) {
  document.body.classList.toggle("light-mode", isLight);
  if (themeToggle) {
    themeToggle.textContent = isLight ? "🌙" : "☀️";
    themeToggle.setAttribute("aria-pressed", String(isLight));
  }
  try { localStorage.setItem(THEME_KEY, isLight ? "light" : "dark"); } catch {}
}

function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch {}
  setTheme(saved === "light");
}

/** Utility: sanitize basic word input */
function normalizeWord(raw) {
  // trim whitespace + lowercase for request
  const w = (raw || "").trim();
  return w;
}

function isValidWord(word) {
  // allow letters, apostrophe, hyphen (basic rule)
  // e.g. "don't", "mother-in-law"
  return /^[a-zA-Z'-]+$/.test(word);
}

/** DOM: clear and render */
function clearResults() {
  resultsEl.innerHTML = "";
}

function createBadge(text) {
  const b = document.createElement("span");
  b.className = "badge";
  b.textContent = text;
  return b;
}

function pickAudioUrl(phonetics = []) {
  // find first non-empty audio url
  const p = phonetics.find(x => x && typeof x.audio === "string" && x.audio.trim());
  return p ? p.audio : "";
}

function renderEntry(entry) {
  const card = document.createElement("article");
  card.className = "card";

  const wordRow = document.createElement("div");
  wordRow.className = "wordRow";

  const h = document.createElement("h2");
  h.className = "word";
  h.textContent = entry.word || "Unknown";

  const phon = document.createElement("div");
  phon.className = "phonetic";
  phon.textContent = entry.phonetic || "";

  wordRow.appendChild(h);
  wordRow.appendChild(phon);

  const badges = document.createElement("div");
  badges.className = "badges";

  // Show source urls if present
  if (Array.isArray(entry.sourceUrls) && entry.sourceUrls.length) {
    badges.appendChild(createBadge("Source available"));
  }
  card.appendChild(wordRow);
  card.appendChild(badges);

  // Audio
  const audioUrl = pickAudioUrl(entry.phonetics || []);
  if (audioUrl) {
    const audioRow = document.createElement("div");
    audioRow.className = "audioRow";

    const label = document.createElement("span");
    label.className = "badge";
    label.textContent = "Pronunciation audio";

    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = audioUrl;

    audioRow.appendChild(label);
    audioRow.appendChild(audio);
    card.appendChild(audioRow);
  }

  // Meanings
  const title = document.createElement("div");
  title.className = "sectionTitle";
  title.textContent = "Meanings";
  card.appendChild(title);

  const meaningsWrap = document.createElement("div");
  meaningsWrap.className = "meanings";

  (entry.meanings || []).forEach((m) => {
    const meaning = document.createElement("div");
    meaning.className = "meaning";

    // Part of speech
    const pos = document.createElement("div");
    pos.appendChild(createBadge(m.partOfSpeech || "unknown"));
    meaning.appendChild(pos);

    // Definitions list
    const defs = document.createElement("ul");
    (m.definitions || []).slice(0, 4).forEach((d) => {
      const li = document.createElement("li");
      li.textContent = d.definition || "";
      defs.appendChild(li);

      // example
      if (d.example) {
        const ex = document.createElement("div");
        ex.className = "example";
        ex.textContent = `Example: ${d.example}`;
        li.appendChild(ex);
      }
    });

    meaning.appendChild(defs);

    // Synonyms/Antonyms (optional)
    const syns = (m.synonyms || []).slice(0, 8);
    if (syns.length) {
      const s = document.createElement("div");
      s.className = "sectionTitle";
      s.textContent = "Synonyms";
      meaning.appendChild(s);

      const synBadges = document.createElement("div");
      synBadges.className = "badges";
      syns.forEach(x => synBadges.appendChild(createBadge(x)));
      meaning.appendChild(synBadges);
    }

    const ants = (m.antonyms || []).slice(0, 8);
    if (ants.length) {
      const a = document.createElement("div");
      a.className = "sectionTitle";
      a.textContent = "Antonyms";
      meaning.appendChild(a);

      const antBadges = document.createElement("div");
      antBadges.className = "badges";
      ants.forEach(x => antBadges.appendChild(createBadge(x)));
      meaning.appendChild(antBadges);
    }

    meaningsWrap.appendChild(meaning);
  });

  card.appendChild(meaningsWrap);
  resultsEl.appendChild(card);
}

/** API call */
async function fetchWord(word) {
  const url = BASE_URL + encodeURIComponent(word);
  const res = await fetch(url);

  // dictionaryapi.dev returns JSON with title/message on error
  const data = await res.json();

  if (!res.ok) {
    const msg = data && data.message ? data.message : "Word not found.";
    throw new Error(msg);
  }

  return data; // array of entries
}

/** Main action */
async function handleSearch() {
  clearError();
  clearResults();

  const word = normalizeWord(wordInput.value);

  // Input validation
  if (!word) {
    showError("Please enter a word.");
    return;
  }
  if (!isValidWord(word)) {
    showError("Invalid input. Use letters, apostrophe (') or hyphen (-) only.");
    return;
  }

  setLoading(true);
  const start = Date.now();
  try {
    const entries = await fetchWord(word);

    // Ensure spinner is visible for at least 1 second
    const elapsed = Date.now() - start;
    if (elapsed < 1000) {
      await new Promise(res => setTimeout(res, 1000 - elapsed));
    }
    setLoading(false);

    if (!Array.isArray(entries) || entries.length === 0) {
      showError("No results found.");
      return;
    }

    entries.forEach(renderEntry);
  } catch (err) {
    setLoading(false);
    showError(`Failed: ${err.message || "API request failed."}`);
  }
}

// Button click
searchBtn.addEventListener("click", handleSearch);

// Enter key in input
wordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});

// Optional: demo default word on load
// wordInput.value = "inspiration";
// handleSearch();

initTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = !document.body.classList.contains("light-mode");
    setTheme(next);
  });
}
