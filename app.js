const API_KEY = "b8ccb6f69b39f97d7f411f3af38d45b5";

const weatherDisplay = document.getElementById("weather-display");
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

/* 🔄 Loading UI */
function showLoading() {
  weatherDisplay.innerHTML = `
    <div class="loading-container">
      <div class="spinner"></div>
      <p>Loading weather...</p>
    </div>
  `;
}

/* ❌ Error UI */
function showError(message) {
  weatherDisplay.innerHTML = `
    <div class="error-message">
      ❌ ${message}
    </div>
  `;
}

/* 🌤️ Display Weather */
function displayWeather(data) {
  const icon = data.weather[0].icon;

  weatherDisplay.innerHTML = `
    <h2>${data.name}</h2>
    <h1>${data.main.temp} °C</h1>
    <p>${data.weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" />
  `;
}

/* 🌍 Fetch Weather (Async/Await) */
async function getWeather(city) {
  showLoading();

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  try {
    const response = await axios.get(url);
    displayWeather(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      showError("City not found. Check spelling.");
    } else {
      showError("Something went wrong.");
    }
  }
}

/* 🔘 Button Click */
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name");
    return;
  }

  getWeather(city);
  cityInput.value = "";
});

/* ⌨️ Enter Key Support */
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});