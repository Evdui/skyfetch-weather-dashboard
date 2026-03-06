function WeatherApp(apiKey) {
  this.apiKey = apiKey;

  this.apiUrl =
    "https://api.openweathermap.org/data/2.5/weather";

  this.forecastUrl =
    "https://api.openweathermap.org/data/2.5/forecast";

  this.searchBtn = document.getElementById("search-btn");
  this.unitToggle = document.getElementById("unit-toggle");
  this.cityInput = document.getElementById("city-input");
  this.weatherDisplay =
    document.getElementById("weather-display");
  this.recentContainer =
    document.getElementById("recent-container");

  this.recentSection =
    document.querySelector(".recent-section");

  this.recentSearches = [];
  this.unit = "metric";

  this.init();
}

/* ======================= */
/* INIT */
/* ======================= */

WeatherApp.prototype.init = function () {

  this.searchBtn.addEventListener(
    "click",
    this.handleSearch.bind(this)
  );

  this.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") this.handleSearch();
  });

  this.unitToggle.addEventListener(
    "click",
    this.toggleUnit.bind(this)
  );

  this.loadRecentSearches();

  /* Hide weather box on first load */
  this.weatherDisplay.classList.add("hidden");

  /* Show recent searches */
  this.recentSection.style.display = "block";
};

/* ======================= */
/* UNIT TOGGLE */
/* ======================= */

WeatherApp.prototype.toggleUnit = function () {

  this.unit =
    this.unit === "metric"
      ? "imperial"
      : "metric";

  this.unitToggle.textContent =
    this.unit === "metric"
      ? "°C"
      : "°F";

  const lastCity =
    localStorage.getItem("lastCity");

  if (lastCity)
    this.getWeather(lastCity);
};

/* ======================= */
/* SEARCH HANDLER */
/* ======================= */

WeatherApp.prototype.handleSearch =
function () {

  const city =
    this.cityInput.value.trim();

  if (!city) {
    this.showError("Enter a city name");
    return;
  }

  this.getWeather(city);

  this.cityInput.value = "";
};

/* ======================= */
/* LOADING */
/* ======================= */

WeatherApp.prototype.showLoading =
function () {

  this.searchBtn.disabled = true;

  /* Show weather box */
  this.weatherDisplay.classList.remove("hidden");

  this.weatherDisplay.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>`;
};

/* ======================= */
/* ERROR */
/* ======================= */

WeatherApp.prototype.showError =
function (msg) {

  this.searchBtn.disabled = false;

  this.weatherDisplay.innerHTML =
    `<p class="error-message">❌ ${msg}</p>`;
};

/* ======================= */
/* FETCH WEATHER */
/* ======================= */

WeatherApp.prototype.getWeather =
async function (city) {

  this.showLoading();

  try {

    const currentUrl =
      `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=${this.unit}`;

    const forecastUrl =
      `${this.forecastUrl}?q=${city}&appid=${this.apiKey}&units=${this.unit}`;

    const [current, forecast] =
      await Promise.all([
        axios.get(currentUrl),
        axios.get(forecastUrl),
      ]);

    this.renderWeather(
      current.data,
      forecast.data
    );

    this.saveRecentSearch(
      current.data.name
    );

    /* Hide recent section */
    this.recentSection.style.display =
      "none";

    this.searchBtn.disabled = false;

  }

  catch (error) {

    this.showError("City not found");

  }
};

/* ======================= */
/* DISPLAY WEATHER */
/* ======================= */

WeatherApp.prototype.renderWeather =
function (current, forecast) {

  const unitSymbol =
    this.unit === "metric"
      ? "°C"
      : "°F";

  const icon =
    current.weather[0].icon;

  const days =
    forecast.list
      .filter(item =>
        item.dt_txt.includes("12:00:00"))
      .slice(0, 5);

  let forecastHTML = "";

  days.forEach(day => {

    const date =
      new Date(day.dt * 1000);

    const dayName =
      date.toLocaleDateString(
        "en-US",
        { weekday: "short" }
      );

    forecastHTML += `
      <div class="forecast-card">
        <h4>${dayName}</h4>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" />
        <p>${Math.round(day.main.temp)} ${unitSymbol}</p>
        <p>${day.weather[0].description}</p>
      </div>`;
  });

  this.weatherDisplay.innerHTML = `
    <h2>${current.name}</h2>
    <h1>${Math.round(current.main.temp)} ${unitSymbol}</h1>
    <p>${current.weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />

    <div class="forecast-section">
      <h3>5-Day Forecast</h3>

      <div class="forecast-container">
        ${forecastHTML}
      </div>

    </div>`;
};

/* ======================= */
/* RECENT SEARCHES */
/* ======================= */

WeatherApp.prototype.loadRecentSearches =
function () {

  const saved =
    localStorage.getItem(
      "recentSearches"
    );

  if (saved) {

    this.recentSearches =
      JSON.parse(saved);

    this.displayRecentSearches();

  }

};

WeatherApp.prototype.saveRecentSearch =
function (city) {

  city =
    city.charAt(0).toUpperCase() +
    city.slice(1);

  this.recentSearches =
    this.recentSearches.filter(
      c => c !== city
    );

  this.recentSearches.unshift(city);

  if (this.recentSearches.length > 5)
    this.recentSearches.pop();

  localStorage.setItem(
    "recentSearches",
    JSON.stringify(
      this.recentSearches
    )
  );

  localStorage.setItem(
    "lastCity",
    city
  );

  this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches =
function () {

  this.recentContainer.innerHTML =
    "";

  this.recentSearches.forEach(city => {

    const btn =
      document.createElement(
        "button"
      );

    btn.textContent = city;

    btn.className =
      "recent-btn";

    btn.addEventListener(
      "click",
      () => {
        this.getWeather(city);
      }
    );

    this.recentContainer.appendChild(
      btn
    );

  });
};

/* ======================= */
/* CREATE APP */
/* ======================= */

const app =
  new WeatherApp("b8ccb6f69b39f97d7f411f3af38d45b5");


/* ================================= */
/* 🌙 THEME + BACKGROUND ROTATION    */
/* ================================= */

const darkImages = [
  "assets/dark/1.jpg",
  "assets/dark/2.jpg",
  "assets/dark/3.jpg",
  "assets/dark/4.jpg"
];

const lightImages = [
  "assets/light/1.jpg",
  "assets/light/2.jpg",
  "assets/light/3.jpg",
  "assets/light/4.jpg"
];

let currentMode = "dark";
let currentIndex = 0;
let rotationInterval;

function changeBackground() {

  const images =
    currentMode === "dark"
      ? darkImages
      : lightImages;

  document.body.style.backgroundImage =
    `url('${images[currentIndex]}')`;

  currentIndex =
    (currentIndex + 1) %
    images.length;

}

function startRotation() {

  clearInterval(rotationInterval);

  changeBackground();

  rotationInterval =
    setInterval(
      changeBackground,
      180000
    );

}

const toggleBtn =
  document.getElementById(
    "mode-toggle"
  );

toggleBtn.addEventListener(
  "click",
  () => {

    if (currentMode === "dark") {

      currentMode = "light";

      document.body.classList.remove(
        "dark"
      );

      document.body.classList.add(
        "light"
      );

      toggleBtn.textContent = "☀️";

    }

    else {

      currentMode = "dark";

      document.body.classList.remove(
        "light"
      );

      document.body.classList.add(
        "dark"
      );

      toggleBtn.textContent = "🌙";

    }

    currentIndex = 0;

    startRotation();

  }
);

document.body.classList.add("dark");

startRotation();