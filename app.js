const API_KEY = "b8ccb6f69b39f97d7f411f3af38d45b5";

function getWeather(city) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  axios.get(url)
    .then(response => {
      const data = response.data;
      displayWeather(data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}

function displayWeather(data) {
  document.getElementById("city").textContent = data.name;

  document.getElementById("temp").textContent =
    data.main.temp + " °C";

  document.getElementById("desc").textContent =
    data.weather[0].description;

  const iconCode = data.weather[0].icon;

  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Hardcoded city for Part 1
getWeather("Paris");