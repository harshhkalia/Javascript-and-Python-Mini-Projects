var isMoved = false;

function toogle() {
  let resultContainer = document.getElementById("result-container");
  let getDetailsButton = document.getElementById("get-details");
  getDetailsButton.style.display = "none";
  resultContainer.style.transform = "translateX(0)";

  let currentPosition = parseInt(resultContainer.style.right) || 0;
  let closeButton = document.getElementById("close-button");
  let displayContainer = document.getElementById("weather-condition-container");
  displayContainer.style.display = "none";

  let switchButton = document.getElementById("switch-cities");
  switchButton.style.display = "none";

  let hidenButton = document.getElementById("switch-national");
  hidenButton.style.display = "none";

  let mapContainer = document.getElementById("mapsandnavigation");
  mapContainer.style.display = "none";

  let newsButton = document.getElementById("get-national");
  newsButton.style.display = "none";

  if (currentPosition === 0) {
    closeButton.style.display = "none";
  } else {
    closeButton.style.display = "block";
  }

  isMoved = !isMoved;
}

function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

function searchWeather() {
  let searchInput = document.getElementById("search-bar").value;
  let apiKey = "8c00c6bf7d7387d1e873d762f94bf70d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let tempratureCelsius = kelvinToCelsius(data.main.temp);
      let resultContainer = document.getElementById("result-container");
      resultContainer.innerHTML = "";
      let closeButton = document.getElementById("close-button");
      closeButton.style.display = "block";

      let detailsContainer = {
        Location: data.name,
        Temprature: `${tempratureCelsius.toFixed(2)} °C`,
        Weather: data.weather[0].description,
        Humidity: `${data.main.humidity} %`,
        "Wind Speed": `${data.wind.speed} m/s`,
      };

      Object.keys(detailsContainer).forEach((key) => {
        let detailContainer = document.createElement("div");
        detailContainer.classList.add("weather-details");

        let heading = document.createElement("h3");
        heading.textContent = key;

        let paragraph = document.createElement("p");
        paragraph.textContent = detailsContainer[key];

        detailContainer.appendChild(heading);
        detailContainer.appendChild(paragraph);
        resultContainer.appendChild(detailContainer);
      });

      openResultContainer();
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      let resultContainer = document.getElementById("result-container");
      resultContainer.innerHTML =
        "<p>Error fetching weather data. Please try again later.</p>";
    });
}

function openResultContainer() {
  let resultContainer = document.getElementById("result-container");
  let currentPosition = resultContainer.offsetLeft;

  if (!isMoved) {
    resultContainer.style.transform =
      "translateX(" + (currentPosition + 0) + "px)";

    let getDetailsButton = document.getElementById("get-details");
    getDetailsButton.style.display = "block";
  }
  isMoved = true;
}

function getDetails() {
  let searchInput = document.getElementById("search-bar").value;
  let apiKey = "8c00c6bf7d7387d1e873d762f94bf70d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network was not ok");
      }
      return response.json();
    })
    .then((data) => {
      let temprature = data.main.temp;
      let convertedTemprature = convertCelsiusToFahrenheit(temprature);

      let resultContainer = document.getElementById("result-container");
      resultContainer.innerHTML = "";

      let tempratureContainer = document.createElement("div");
      tempratureContainer.classList.add("temprature-container");

      let location = document.createElement("h3");
      location.textContent = `Location: ${data.name}`;

      let tempratureInCelsius = document.createElement("p");
      tempratureInCelsius.textContent = `Temprature(Celsius): ${kelvinToCelsius(
        data.main.temp
      ).toFixed(2)} °C`;

      let tempratureInFahrenheit = document.createElement("p");
      tempratureInFahrenheit.textContent = `Temprature(Fahrenheit): ${convertedTemprature.toFixed(
        2
      )} °F`;

      tempratureContainer.appendChild(location);
      tempratureContainer.appendChild(tempratureInCelsius);
      tempratureContainer.appendChild(tempratureInFahrenheit);

      resultContainer.appendChild(tempratureContainer);
    })
    .catch((error) => {
      console.error("Error converting temprature to Fahrenheit", error);
    });

  function convertCelsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }

  function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
  }
}

function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        getWeatherByCoordinates(latitude, longitude);
      },
      function (error) {
        console.error("Error getting location. Please try again", error);
        alert("Error getting your location. Please try again.");
      }
    );
  } else {
    alert("Geolocation is not supported in this browser");
  }
  let closeButton = document.getElementById("close-button");
  closeButton.style.display = "block";

  let newsContainer = document.getElementById("news-container");
  newsContainer.style.bottom = "517px";

  openResultContainer();
}

function getWeatherByCoordinates(latitude, longitude) {
  let apiKey = "8c00c6bf7d7387d1e873d762f94bf70d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network was not ok");
      }
      return response.json();
    })
    .then((data) => {
      displayWeatherDetails(data);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again later");
    });
}

function displayWeatherDetails(data) {
  let resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = "";

  let tempratureCelsius = kelvinToCelsius(data.main.temp);

  let tempratureButton = document.getElementById("get-details");
  tempratureButton.style.display = "none";

  let currentLocationDetailsContainer = document.createElement("div");
  currentLocationDetailsContainer.classList.add("current-location-details");

  let locationName = document.createElement("h3");
  locationName.textContent = data.name;

  let temperature = document.createElement("p");
  temperature.textContent = `Temprature:${tempratureCelsius.toFixed(2)} °C`;

  let weather = document.createElement("p");
  weather.textContent = `Weather: ${data.weather[0].description}`;

  let humidity = document.createElement("p");
  humidity.textContent = `Humidity: ${data.main.humidity} %`;

  let windSpeed = document.createElement("p");
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

  currentLocationDetailsContainer.appendChild(locationName);
  currentLocationDetailsContainer.appendChild(temperature);
  currentLocationDetailsContainer.appendChild(weather);
  currentLocationDetailsContainer.appendChild(humidity);
  currentLocationDetailsContainer.appendChild(windSpeed);

  resultContainer.appendChild(currentLocationDetailsContainer);
}

function getConditions() {
  const apiKey = "8c00c6bf7d7387d1e873d762f94bf70d";
  const cityIds = [
    1269843, 1273294, 1279233, 1275004, 1277333, 1275841, 1275339, 1264527,
    1255364, 1259229, 1269515, 1254163, 1273313, 1273665, 1258526, 1269665,
    1256237, 1252783, 1269743, 1255634, 1266486,
  ];
  const promises = cityIds.map((cityId) => {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}`;
    return fetch(apiUrl).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  });

  Promise.all(promises)
    .then((results) => {
      displayWeatherConditions(results);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again later");
    });

  let displayContainer = document.getElementById("weather-condition-container");
  displayContainer.style.display = "block";

  let switchButton = document.getElementById("switch-cities");
  switchButton.style.display = "block";

  let mapContainer = document.getElementById("mapsandnavigation");
  mapContainer.style.bottom = "600px";

  let newsButton = document.getElementById("get-national");
  newsButton.style.display = "block";
  newsButton.style.bottom = "395px";
}

function displayWeatherConditions(weatherData) {
  const resultContainer = document.getElementById(
    "weather-condition-container"
  );
  resultContainer.innerHTML = "";

  weatherData.forEach((data) => {
    const cityContainer = document.createElement("div");
    cityContainer.classList.add("city-container");

    let hidenButton = document.getElementById("switch-national");
    hidenButton.style.display = "none";

    let showButton = document.getElementById("switch-cities");
    showButton.style.display = "block";

    const cityName = document.createElement("h3");
    cityName.textContent = data.name;

    const temperature = document.createElement("p");
    const temperatureCelsius = kelvinToCelsius(data.main.temp);
    temperature.textContent = `Temperature: ${temperatureCelsius.toFixed(
      2
    )} °C`;

    cityContainer.appendChild(cityName);
    cityContainer.appendChild(temperature);

    resultContainer.appendChild(cityContainer);
  });
}

document
  .getElementById("switch-cities")
  .addEventListener("click", switchToInternational);

function switchToInternational() {
  let newsButton = document.getElementById("get-national");
  newsButton.style.display = "none";

  let newsDetails = document.getElementById("get-international");
  newsDetails.style.display = "block";
  newsDetails.style.bottom = "394px";

  let weatherConditionContainer = document.getElementById(
    "weather-condition-container"
  );
  weatherConditionContainer.innerHTML = "";

  let internationalCityIds = [
    5128581, 2643743, 2988507, 1850147, 2147714, 292223, 1816670, 524901,
    3169070, 6167865, 3469058, 1261481, 1835848, 360630, 323786, 1642911,
    3530597, 3435910, 3117735, 3143244, 2950159, 108410, 1880252, 2761369,
    2964574,
  ];

  let promises = internationalCityIds.map((cityId) => {
    let apiKey = "8c00c6bf7d7387d1e873d762f94bf70d";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}`;
    return fetch(apiUrl).then((response) => {
      if (!response.ok) {
        throw new Error("Network was not ok");
      }
      return response.json();
    });
  });

  Promise.all(promises)
    .then((results) => {
      displayInternationalData(results);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Error fetching weather data. Please try again later");
    });
}

function displayInternationalData(weatherData) {
  let resultContainer = document.getElementById("weather-condition-container");

  weatherData.forEach((data) => {
    let cityContainer = document.createElement("div");
    cityContainer.classList.add("interNational-city-container");

    let cityName = document.createElement("h3");
    cityName.textContent = data.name;

    let hidenButton = document.getElementById("switch-cities");
    hidenButton.style.display = "none";

    let showButton = document.getElementById("switch-national");
    showButton.style.display = "block";

    let temperature = document.createElement("p");
    let temperatureCelsius = kelvinToCelsius(data.main.temp);
    temperature.textContent = `Temperature: ${temperatureCelsius.toFixed(
      2
    )} °C`;

    cityContainer.appendChild(cityName);
    cityContainer.appendChild(temperature);

    resultContainer.appendChild(cityContainer);
  });
}

function switchBack() {
  let backgroundContainer = document.getElementById(
    "weather-condition-container"
  );
  backgroundContainer.innerHTML = "";

  getConditions();

  let hidenButton = document.getElementById("switch-cities");
  hidenButton.style.display = "none";
}

function openMap() {
  let mapContainer = document.getElementById("mapsandnavigation");
  mapContainer.style.display = "block";

  let map = L.map("mapsandnavigation").setView([20.5937, 78.9629], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  L.control.locate({ position: "topright" }).addTo(map);
}
