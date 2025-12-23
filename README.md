# ELEC3 Final Project - Web Applications Suite

A collection of four responsive web applications built with vanilla HTML, CSS, and JavaScript. This suite includes a calculator, stopwatch, dictionary API integration, and weather API integration.

---

## 📋 Projects Overview

### 1. Calculator

#### Project Description
A fully functional calculator application that performs basic arithmetic operations. Users can input numbers, perform calculations (addition, subtraction, multiplication, division), and view results in real-time.

**Key Features:**
- Basic arithmetic operations (+, -, ×, ÷)
- Clear and delete functionality
- Real-time calculation display
- Responsive design for all devices
- Dark mode and light mode support

**Problem Solved:** Provides a quick, accessible calculator for basic mathematical computations without leaving the browser.

#### Instructions to Run
1. Open the project folder: `calculator/`
2. Open `index.html` in your web browser
3. Start performing calculations by clicking buttons or using your keyboard
4. Toggle between light and dark modes using the theme button

---

### 2. Stopwatch

#### Project Description
A precise stopwatch application with start, stop, and reset controls. Users can track elapsed time in hours, minutes, seconds, and milliseconds.

**Key Features:**
- Start/Stop/Reset functionality
- Precise time tracking (hours, minutes, seconds, milliseconds)
- Clean, minimalist UI
- Responsive design
- Dark mode and light mode support

**Problem Solved:** Provides a simple, accessible timer for tracking workout sessions, cooking time, or any timed activities.

#### Instructions to Run
1. Open the project folder: `stopwatch/`
2. Open `index.html` in your web browser
3. Click "Start" to begin timing
4. Click "Stop" to pause
5. Click "Reset" to clear the timer

---

### 3. Dictionary API

#### Project Description
A comprehensive dictionary application that uses the Free Dictionary API to search for word definitions, pronunciations, examples, and audio clips. Users can discover meanings, phonetics, parts of speech, and example usage for any English word.

**Key Features:**
- Word search with instant results
- Phonetic pronunciation display
- Multiple definitions and parts of speech
- Real-world usage examples
- Audio pronunciation clips
- Error handling for invalid searches
- Loading indicators
- Dark mode and light mode support
- Powder pink search bar with mode-specific styling

**Problem Solved:** Provides quick, accurate word definitions and pronunciations without using a physical dictionary.

#### API Details Used

| Detail | Information |
|--------|-------------|
| **API Name** | Free Dictionary API |
| **Base URL** | `https://api.dictionaryapi.dev/api/v2/entries/en/` |
| **Endpoints** | `GET /api/v2/entries/en/{word}` |
| **Required Parameters** | `word` - The English word to search for |
| **Authentication** | None (Public API) |
| **API Usage** | Fetches complete word data including definitions, phonetics, parts of speech, examples, and audio URLs |

**How API Data is Used:**
- Search queries are sent to the Dictionary API
- Response data is parsed and displayed in card format
- Audio files are embedded for pronunciation
- Error handling for words not found or network issues

#### Instructions to Run
1. Open the project folder: `dictionary-api/`
2. Open `index.html` in your web browser
3. Type a word in the search bar (e.g., "inspiration")
4. Click "Search" or press Enter
5. View definitions, examples, and click the audio icon for pronunciation
6. Toggle between light and dark modes

#### Screenshot References
- Search interface with powder pink search bar
- Word results with definitions and examples
- Audio player for pronunciation
- Dark and light mode views
- Error states for invalid searches

---

### 4. Weather API

#### Project Description
A real-time weather application that provides current weather conditions, forecasts, and detailed meteorological information for any location worldwide.

**Key Features:**
- Current weather display
- Temperature, humidity, wind speed
- Weather condition icons
- Responsive location-based search
- Multi-day forecast (if applicable)
- Dark mode and light mode support

**Problem Solved:** Provides up-to-date weather information for trip planning, outfit selection, and daily activities.

#### API Details Used

| Detail | Information |
|--------|-------------|
| **API Name** | OpenWeatherMap API (or similar weather service) |
| **Base URL** | `https://api.openweathermap.org/data/2.5/weather` |
| **Endpoints** | `GET /data/2.5/weather?q={city}&appid={API_KEY}` |
| **Required Parameters** | `q` (city name), `appid` (API key) |
| **Authentication** | API Key required |
| **API Usage** | Fetches real-time weather data including temperature, humidity, wind speed, and weather conditions |

**How API Data is Used:**
- User enters a city name
- Request is sent to weather API with location parameter
- Response data is parsed and displayed with weather icons
- Temperature and conditions are shown in a user-friendly format

#### Instructions to Run
1. Open the project folder: `weather-api/`
2. Open `index.html` in your web browser
3. Enter a city name in the search field
4. Click "Search" to retrieve weather data
5. View current conditions and forecast
6. Toggle between light and dark modes

#### Screenshot References
- Weather search interface
- Current weather display with temperature and conditions
- Weather icons and descriptions
- Dark and light mode views
- Error handling for invalid locations

---

## 🚀 General Setup Instructions

### Required Tools
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code, Sublime Text, etc.) - optional for viewing source code
- Internet connection (required for API projects)

### How to Access Projects
1. Clone or download the entire `final-project-elec3` folder
2. Navigate to the desired project subfolder
3. Double-click `index.html` to open in default browser, or
4. Right-click `index.html` → Open with → Select your browser

### API Key Setup (Weather API Only)
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Generate a free API key
3. In `weather-api/script.js`, replace `YOUR_API_KEY` with your actual API key
4. Save and refresh the page

### Local Development Server (Optional)
For better testing with APIs:
```bash
# Using Python 3
python -m http.server 8000

---

## 📁 Project Structure

```
final-project-elec3/
├── calculator/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── dictionary-api/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── stopwatch/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── weather-api/
│   ├── index.html
│   ├── script.js
│   └── style.css

```

---

## 👩‍💻 Developer Information

| Aspect | Details |
|--------|---------|
| **Developer Name** | Stephanie Mae Arenas|
| **Role** | Solo Developer |
| **Project Type** | ELEC3 Final Project |

### Responsibilities
- ✅ **API Integration** - Implemented REST API calls using async/await and Fetch API
- ✅ **JavaScript Logic & Data Processing** - Developed core functionality with input validation, error handling, and DOM manipulation
- ✅ **UI & CSS Design** - Created responsive, modern interfaces with dark/light mode support
- ✅ **Testing & Debugging** - Ensured functionality across different browsers and devices
- ✅ **Documentation** - Comprehensive README and inline code comments

---

## 🎨 Design Features

All projects include:
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Dark & Light Mode** - Toggle between themes with emoji buttons (☀️ / 🌙)
- **Modern UI** - Powder pink accents and smooth animations
- **Accessibility** - ARIA labels and semantic HTML
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback during API calls

---

## 🔧 Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Responsive design, flexbox, CSS variables
- **JavaScript (ES6+)** - Async/await, fetch API, DOM manipulation
- **Third-Party APIs** - Free Dictionary API, Weather API

---

## 📝 Notes

- All projects use vanilla JavaScript (no frameworks)
- APIs are accessed via HTTPS for security
- Local storage is used for theme preference persistence
- Input validation prevents errors and improves user experience

---

## 📄 License

This project is created for educational purposes as part of ELEC3 coursework.

---

**Last Updated:** December 20, 2025

For questions or feedback, please review the individual project source files included in each folder.
