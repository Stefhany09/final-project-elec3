const API_KEY = "bf54bde5769e9660fde812d689df121b";

// APIs (BONUS: multiple API calls combined)
const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// DOM
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const statusEl = document.getElementById("status");
const errorBox = document.getElementById("errorBox");
const placeSelect = document.getElementById("placeSelect");
const themeToggle = document.getElementById("themeToggle");

const weatherBox = document.getElementById("weatherResult");
const cityNameEl = document.getElementById("cityName");
const countryEl = document.getElementById("country");
const descriptionEl = document.getElementById("description");
const weatherIconEl = document.getElementById("weatherIcon");
const tempEl = document.getElementById("temp");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

const forecastBox = document.getElementById("forecastBox");
const forecastGrid = document.getElementById("forecastGrid");

const THEME_KEY = "weather-theme";

// Weather icon mapping
function getWeatherIcon(weatherCode, description = "") {
  const code = String(weatherCode);
  const desc = description.toLowerCase();
  
  // Thunderstorm (2xx)
  if (code.startsWith("2")) return "⛈️";
  
  // Drizzle (3xx)
  if (code.startsWith("3")) return "🌦️";
  
  // Rain (5xx)
  if (code.startsWith("5")) {
    if (desc.includes("light")) return "🌦️";
    if (desc.includes("heavy")) return "🌧️";
    return "🌧️";
  }
  
  // Snow (6xx)
  if (code.startsWith("6")) return "❄️";
  
  // Atmosphere (7xx)
  if (code.startsWith("7")) {
    if (desc.includes("fog") || desc.includes("mist")) return "🌫️";
    if (desc.includes("sand") || desc.includes("dust")) return "🌪️";
    return "🌫️";
  }
  
  // Clear (800)
  if (code === "800") return "☀️";
  
  // Clouds (80x)
  if (code.startsWith("80")) {
    if (desc.includes("few")) return "🌤️";
    if (desc.includes("scattered")) return "⛅";
    if (desc.includes("broken") || desc.includes("overcast")) return "☁️";
    return "☁️";
  }
  
  return "🌡️";
}

// UI helpers
function setLoading(isLoading, msg = "") {
  statusEl.textContent = msg;
  searchBtn.disabled = isLoading;
  cityInput.disabled = isLoading;
  placeSelect.disabled = isLoading;
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.add("hidden");
}

function hideResults() {
  weatherBox.classList.add("hidden");
  forecastBox.classList.add("hidden");
  forecastGrid.innerHTML = "";
}

function hidePlaceSelect() {
  placeSelect.classList.add("hidden");
  placeSelect.innerHTML = "";
}

function validateCityInput(value) {
  const city = value.trim();
  if (!city) return { ok: false, message: "Please enter a city/province name." };
  if (city.length < 2) return { ok: false, message: "Please enter at least 2 characters." };

  const allowed = /^[a-zA-ZÀ-ž\s.,'-]+$/;
  if (!allowed.test(city)) return { ok: false, message: "Please use letters and common punctuation only." };

  return { ok: true, city };
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    let extra = "";
    try {
      const data = await res.json();
      if (data?.message) extra = ` (${data.message})`;
    } catch {}
    throw new Error(`Request failed: ${res.status} ${res.statusText}${extra}`);
  }
  return res.json();
}

function setTheme(isDay) {
  document.body.classList.toggle("day-mode", isDay);

  if (themeToggle) {
    themeToggle.textContent = isDay ? "Night" : "Day";
    themeToggle.setAttribute("aria-pressed", String(isDay));
  }

  try {
    localStorage.setItem(THEME_KEY, isDay ? "day" : "night");
  } catch {}
}

function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(THEME_KEY);
  } catch {}
  setTheme(saved === "day");
}

// Geocode: return up to 5 candidate locations
async function geocodeCityOptions(city) {
  const url = `${GEO_URL}?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`;
  const data = await fetchJSON(url);
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Location not found. Check spelling.");
  }
  return data;
}

async function getCurrentWeather(lat, lon) {
  const url = `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return fetchJSON(url);
}

async function getForecast(lat, lon) {
  const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  return fetchJSON(url);
}

function formatPlace(p) {
  const state = p.state ? `, ${p.state}` : "";
  return `${p.name}${state}, ${p.country}`;
}

function populatePlaceSelect(places) {
  placeSelect.innerHTML = "";
  for (const p of places) {
    const opt = document.createElement("option");
    opt.value = JSON.stringify({
      lat: p.lat,
      lon: p.lon,
      name: p.name,
      state: p.state || "",
      country: p.country || "",
    });
    opt.textContent = formatPlace(p);
    placeSelect.appendChild(opt);
  }
  placeSelect.classList.remove("hidden");
}

function getSelectedPlace() {
  return JSON.parse(placeSelect.value);
}

// Render current weather
function showWeather(data, place) {
  const city = place?.name || data.name || "Unknown";
  const state = place?.state ? `, ${place.state}` : "";
  const country = place?.country || data.sys?.country || "";

  const weatherData = data.weather?.[0];
  const description = weatherData?.description || "N/A";
  const weatherCode = weatherData?.id;
  const icon = getWeatherIcon(weatherCode, description);
  
  const temp = Math.round(data.main?.temp ?? 0);
  const feelsLike = Math.round(data.main?.feels_like ?? 0);
  const humidity = data.main?.humidity ?? 0;
  const wind = data.wind?.speed ?? 0;

  cityNameEl.textContent = `${city}${state}`;
  countryEl.textContent = country ? `Country: ${country}` : "";
  weatherIconEl.textContent = icon;
  descriptionEl.textContent = description;
  tempEl.textContent = temp;
  feelsLikeEl.textContent = feelsLike;
  humidityEl.textContent = humidity;
  windEl.textContent = wind;

  weatherBox.classList.remove("hidden");
}

// Forecast helpers (3-hour intervals) - extended to show all available days
function pickDailyFrom3HourList(list) {
  const byDay = new Map();

  for (const item of list) {
    const dt = new Date(item.dt * 1000);
    const dayKey = dt.toISOString().slice(0, 10);
    if (!byDay.has(dayKey)) byDay.set(dayKey, []);
    byDay.get(dayKey).push(item);
  }

  // Get all available days (API typically provides ~5 days)
  const days = Array.from(byDay.entries());
  const chosen = [];

  for (const [, items] of days) {
    let best = items[0];
    let bestDist = Infinity;

    for (const it of items) {
      const d = new Date(it.dt * 1000);
      const dist = Math.abs(d.getUTCHours() - 12);
      if (dist < bestDist) {
        bestDist = dist;
        best = it;
      }
    }
    chosen.push(best);
  }

  return chosen;
}

function formatDayLabel(unixSeconds) {
  const d = new Date(unixSeconds * 1000);
  const dayName = d.toLocaleDateString(undefined, { weekday: "short" });
  const date = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return { day: dayName, date };
}

function showForecast(forecastData) {
  const list = forecastData.list || [];
  if (!list.length) return;

  const daily = pickDailyFrom3HourList(list);
  forecastGrid.innerHTML = "";

  for (const item of daily) {
    const temp = Math.round(item.main?.temp ?? 0);
    const weatherData = item.weather?.[0];
    const desc = weatherData?.description || "N/A";
    const weatherCode = weatherData?.id;
    const icon = getWeatherIcon(weatherCode, desc);
    const { day, date } = formatDayLabel(item.dt);

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <p class="f-day">${day}</p>
      <p class="f-date">${date}</p>
      <div class="f-icon">${icon}</div>
      <p class="f-temp">${temp}°C</p>
      <p class="f-desc">${desc}</p>
    `;
    forecastGrid.appendChild(card);
  }

  forecastBox.classList.remove("hidden");
}

// Run fetch for a selected place
async function fetchForPlace(place) {
  hideResults();
  clearError();

  try {
    setLoading(true, "Loading weather...");

    const current = await getCurrentWeather(place.lat, place.lon);
    showWeather(current, place);

    setLoading(true, "Loading extended forecast...");
    const forecast = await getForecast(place.lat, place.lon);
    showForecast(forecast);

    setLoading(false, "");
  } catch (err) {
    console.error(err);
    setLoading(false, "");
    showError(err.message || "Failed to fetch weather.");
  }
}

// Main search
async function runSearch() {
  clearError();
  hideResults();
  hidePlaceSelect();

  const check = validateCityInput(cityInput.value);
  if (!check.ok) {
    showError(check.message);
    return;
  }

  try {
    setLoading(true, "Searching location...");

    const places = await geocodeCityOptions(check.city);
    populatePlaceSelect(places);

    setLoading(false, "");
    await fetchForPlace(getSelectedPlace());
  } catch (err) {
    console.error(err);
    setLoading(false, "");
    showError(err.message || "Failed to find location.");
  }
}

// Events
searchBtn.addEventListener("click", runSearch);

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") runSearch();
});

placeSelect.addEventListener("change", () => {
  fetchForPlace(getSelectedPlace());
});

initTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const next = !document.body.classList.contains("day-mode");
    setTheme(next);
  });
}
