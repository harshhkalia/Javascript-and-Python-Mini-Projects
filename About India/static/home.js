document.addEventListener("DOMContentLoaded", function () {
  const cities = [
    { name: "Delhi", id: "1273294" },
    { name: "Mumbai", id: "1275339" },
    { name: "Kolkata", id: "1275004" },
    { name: "Chennai", id: "1264527" },
    { name: "Bengaluru", id: "1277333" },
    { name: "Hyderabad", id: "1269843" },
    { name: "Bhopal", id: 1275841 },
    { name: "Thiruvananthapuram", id: 1254163 },
    { name: "Jaipur", id: 1269515 },
    { name: "Gandhinagar", id: 1271921 },
    { name: "Raipur", id: 1258972 },
    { name: "Patna", id: 1260086 },
    { name: "Dispur", id: 1273574 },
    { name: "Shimla", id: 1256277 },
    { name: "Srinagar", id: 1255634 },
    { name: "Dehradun", id: 1273313 },
    { name: "Ranchi", id: 1258526 },
    { name: "Chandigarh", id: 1274746 },
    { name: "Panaji", id: 1259229 },
    { name: "Agartala", id: 1279715 },
    { name: "Gangtok", id: 1271268 },
    { name: "Kohima", id: 1266507 },
    { name: "Aizawl", id: 1278158 },
    { name: "Shillong", id: 1256436 },
    { name: "Imphal", id: 1269743 },
  ];

  async function fetchWeather(city) {
    const apiKey = "8c00c6bf7d7387d1e873d762f94bf70d";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?id=${city.id}&appid=${apiKey}&units=metric`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in fetching the data of cities:", error);
      return null;
    }
  }

  function displayWeather(data) {
    const displayContainer = document.getElementById("resultContainer");
    if (data) {
      const cityName = data.name;
      const temperature = data.main.temp;
      const weatherDescription = data.weather[0].description;
      const weatherHtml = `<div id="cityInfo"><b>${cityName}</b> : ${temperature}°C, ${weatherDescription}</div>`;
      displayContainer.innerHTML += weatherHtml;
    } else {
      displayContainer.innerHTML += `<div>Error fetching the data of Indian states</div>`;
    }
  }

  cities.forEach(async (city) => {
    const data = await fetchWeather(city);
    displayWeather(data);
  });

  const getLocationButton = document.getElementById("currentLocationButton");
  getLocationButton.addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          getLocationName(latitude, longitude)
            .then((locationName) => {
              alert(`You are currently in ${locationName}`);
            })
            .catch((error) => {
              console.error("Error getting location name:", error);
              alert(
                "Error getting your current location. Please try again later."
              );
            });
        },
        function (error) {
          console.error("Error getting location:", error);
          alert("Error getting your current location. Please try again later.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  });

  function getLocationName(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const address = data.address;
        let locationName = "";

        if (address.city) {
          locationName += address.city;
        } else if (address.town) {
          locationName += address.town;
        } else if (address.village) {
          locationName += address.village;
        } else if (address.county) {
          locationName += address.county;
        }

        if (address.state) {
          locationName += `, ${address.state}`;
        }

        if (address.country) {
          locationName += `, ${address.country}`;
        }

        return locationName;
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
        return "Unknown location";
      });
  }

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const displayContainer = document.getElementById("resultContainer");
  let previousState = null;

  searchButton.addEventListener("click", function () {
    const location = searchInput.value;
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=8c00c6bf7d7387d1e873d762f94bf70d&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        previousState = displayContainer.innerHTML;

        displayContainer.innerHTML = "";
        const cityName = data.name;
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        const weatherInfo = document.createElement("div");
        weatherInfo.id = "weatherInfo";
        weatherInfo.innerHTML = `<b>Location: ${cityName}</b><br/>
            Temperature: ${temperature}°C<br/>
            Type: ${description}<br/>
            Humidity: ${humidity}%<br/>
            Wind Speed: ${windSpeed} m/s`;

        displayContainer.appendChild(weatherInfo);

        let searchAgainButton = document.createElement("button");
        searchAgainButton.textContent = "Search again";
        searchAgainButton.id = "inputFocusButton";
        searchAgainButton.addEventListener("click", function () {
          searchInput.focus();
        });

        displayContainer.appendChild(searchAgainButton);

        let goBackButton = document.createElement("button");
        goBackButton.textContent = "Go Back";
        goBackButton.id = "goBackButton";
        goBackButton.addEventListener("click", function () {
          displayContainer.innerHTML = previousState;
        });

        displayContainer.appendChild(goBackButton);
      })
      .catch((error) => {
        console.error("Error in fetching the searched data:", error);
        alert(
          "Unable to get weather of the location you searched. Please try again"
        );
      });
  });

  function fetchNews() {
    let newsDisplayContainer = document.getElementById("newsDisplayContainer");
    let apiKey = "2df59ac3ef09477a9dd92db2a22c0f93";

    fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        const articles = data.articles;
        let newsHtml = "";
        articles.forEach((article) => {
          const { title, description, url } = article;
          newsHtml += `
          <div class="news-article">
          <h3 id="titleHeading">${title}</h3>
          <p id="descriptionText">${description}</p>
          <a id="urlLink" href="${url}" target="_blank">Read more</a>
          </div>
          <br/>
          `;
        });
        newsDisplayContainer.innerHTML = newsHtml;
      })
      .catch((error) => {
        console.error("Error in fetching the news from server:", error);
        newsDisplayContainer.innerHTML =
          "Failed to fetch the news, maybe server issue occured";
      });
  }

  fetchNews();

  let refreshButton = document.getElementById("refreshNewsButton");
  refreshButton.addEventListener("click", fetchNews());

  const fromInput = document.getElementById("fromInput");
  const toInput = document.getElementById("toInput");
  const resultContainer = document.getElementById("amountConverted");
  const convertButton = document.getElementById("convertButton");
  const amountInput = document.getElementById("amountInput");

  fetch("https://api.exchangerate-api.com/v4/latest/INR")
    .then((response) => response.json())
    .then((data) => {
      const currencies = data.rates;
      for (const currency in currencies) {
        option1 = document.createElement("option");
        option2 = document.createElement("option");
        option1.text = currency;
        option2.text = currency;
        fromInput.add(option1);
        toInput.add(option2);
      }
    })
    .catch((error) => {
      console.error("Error in fetching currencies:", error);
    });

  convertButton.addEventListener("click", function () {
    const fromCurrency = fromInput.value;
    const toCurrency = toInput.value;
    const amount = amountInput.value;

    fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
      .then((response) => response.json())
      .then((data) => {
        const exchangeRate = data.rates[toCurrency];
        const convertedAmount = (amount * exchangeRate).toFixed(2);

        if (resultContainer.children.length > 0) {
          resultContainer.removeChild(resultContainer.children[0]);
        }

        const backDiv = document.createElement("div");
        backDiv.id = "resultDetails";
        backDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;

        resultContainer.appendChild(backDiv);
      })
      .catch((error) => {
        console.error("Error in converting the amount of currency:", error);
        resultContainer.textContent =
          "Failed to convert currency. Please try again later";
      });
  });

  const translateButton = document.getElementById("translateButton");

  translateButton.addEventListener("click", function () {
    alert("This function does not work currrently.");
  });

  let showProfileButton = document.getElementById("profileButton");
  let closeProfileButton = document.getElementById("closeProfile");
  let usernameHeading = document.getElementById("usernameHeading").innerText;
  let emailHeading = document.getElementById("emailHeading").innerText;

  let isProfileVisible = false;

  showProfileButton.addEventListener("click", function () {
    if (!isProfileVisible) {
      alert(`${usernameHeading}\n${emailHeading}`);
      isProfileVisible = true;
    }
  });

  closeProfileButton.addEventListener("click", function () {
    isProfileVisible = false;
  });

  let tweetsPageButton = document.getElementById("tweetsButton");
  tweetsPageButton.addEventListener("click", function () {
    window.location.href = "/tweets";
  });
});
