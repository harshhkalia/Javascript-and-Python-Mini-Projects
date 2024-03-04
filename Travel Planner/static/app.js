document.addEventListener("DOMContentLoaded", function () {
  async function fetchExchangeRates() {
    const url = `https://openexchangerates.org/api/latest.json?app_id=001284fd9bd24df4b340890f2ec9cb32`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network was not OK");
      }
      const data = await response.json();
      return data.rates;
    } catch (error) {
      console.error("Error Fetching exchange rates:", error);
      return {};
    }
  }
  async function getCurrencyName(currencyCode) {
    let apiKey = "001284fd9bd24df4b340890f2ec9cb32";
    let apiUrl = `https://openexchangerates.org/api/currencies.json?app_id=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch currency names");
      }
      const data = await response.json();
      if (currencyCode in data) {
        return data[currencyCode];
      } else {
        return currencyCode;
      }
    } catch (error) {
      console.error("Error fetching currency name:");
      return currencyCode;
    }
  }
  async function populateCurrencySelectors() {
    try {
      const rates = await fetchExchangeRates("USD");
      const currencyCodes = Object.keys(rates);
      const fromCurrencySelect = document.getElementById(
        "fromCurrencySelector"
      );
      const toCurrencySelect = document.getElementById("toCurrencySelector");

      for (let currencyCode of currencyCodes) {
        const currencyName = await getCurrencyName(currencyCode);
        const option = new Option(currencyName, currencyCode);
        fromCurrencySelect.appendChild(option.cloneNode(true));
        toCurrencySelect.appendChild(option.cloneNode(true));
      }
    } catch (error) {
      console.error("Error populating country selector:", error);
    }
  }
  populateCurrencySelectors();

  document
    .getElementById("convertButton")
    .addEventListener("click", async function () {
      let fromCountry = document.getElementById("fromCurrencySelector").value;
      let toCountry = document.getElementById("toCurrencySelector").value;
      let inputValue = document.getElementById("fromCurrency").value;

      let rates = await fetchExchangeRates(fromCountry);

      let conversionRates = rates[toCountry];
      let outputValue = inputValue * conversionRates;

      let forCountryName = await getCurrencyName(fromCountry);
      let toCountryName = await getCurrencyName(toCountry);

      let result = document.createElement("h3");
      result.id = "result";
      result.classList.add("convertedValue");
      result.textContent = `${inputValue} ${forCountryName} is about
       ${outputValue.toFixed(2)} ${toCountryName}`;

      let oldResult = document.getElementById("result");
      if (oldResult) {
        document
          .getElementById("outputContainer")
          .replaceChild(result, oldResult);
      } else {
        document.getElementById("outputContainer").appendChild(result);
      }

      let warningText = document.createElement("p");
      warningText.classList.add("belowText");
      warningText.textContent =
        "This conversion is not correct because the API is not working correctly, it's only giving me correct currency names in selectors but not converting the values.";

      alert(warningText.textContent);
    });
});

let isMoved = false;

document.getElementById("convertButton").addEventListener("click", function () {
  let outputContainer = document.getElementById("outputContainer");
  if (!isMoved) {
    outputContainer.style.left = "450px";
    isMoved = true;
  }
});

document
  .getElementById("closeConversionContainer")
  .addEventListener("click", function () {
    let outputContainer = document.getElementById("outputContainer");
    outputContainer.style.left = "20px";
    isMoved = false;
  });

document.getElementById("showNotes").addEventListener("click", function () {
  let notesContainer = document.getElementById("notesContainer");
  notesContainer.style.display = "block";

  let hideButton = document.getElementById("showNotes");
  hideButton.style.display = "none";
});

document.getElementById("closeNotes").addEventListener("click", function () {
  let hideContainer = document.getElementById("notesContainer");
  hideContainer.style.display = "none";

  let showButton = document.getElementById("showNotes");
  showButton.style.display = "block";
});

let textArea = document.getElementById("writeNotes");
let submitButton = document.getElementById("submitButton");
let showNotesButton = document.getElementById("showNotes");
let allNotesContainer = document.getElementById("notesContainer");

textArea.addEventListener("focus", function () {
  submitButton.style.display = "none";
  showNotesButton.style.bottom = "70px";
  allNotesContainer.style.bottom = "147px";
});

textArea.addEventListener("blur", function () {
  submitButton.style.display = "inline";
  showNotesButton.style.bottom = "102px";
  allNotesContainer.style.bottom = "179px";
});

function openNav() {
  document.getElementById("sidePanel").style.width = "400px";
}

function closeNav() {
  document.getElementById("sidePanel").style.width = "0px";
}

document
  .getElementById("bookmarks-heading")
  .addEventListener("click", function () {
    let bookmarkContainer = document.getElementById("bookmark-elements");
    bookmarkContainer.style.display = "block";

    let hideElements = document.getElementById("calculateExpensesElements");
    hideElements.style.display = "none";

    let hideContainer = document.getElementById("accountDetailsElements");
    hideContainer.style.display = "none";

    alert(
      "I forget to add this functionality on this page, this is just a container without functions."
    );
  });

document
  .getElementById("expenses-heading")
  .addEventListener("click", function () {
    let hideElements = document.getElementById("bookmark-elements");
    hideElements.style.display = "none";

    let hideContainer = document.getElementById("accountDetailsElements");
    hideContainer.style.display = "none";

    let showElement = document.getElementById("calculateExpensesElements");
    showElement.style.display = "block";
  });

document.getElementById("user-account").addEventListener("click", function () {
  let hideCalculations = document.getElementById("calculateExpensesElements");
  hideCalculations.style.display = "none";

  let hideBookmarks = document.getElementById("bookmark-elements");
  hideBookmarks.style.display = "none";
});

let expenses = [];

function addExpense() {
  let expenseName = document.getElementById("expenseName").value;
  let amountValue = document.getElementById("amountValue").value;
  let notesInput = document.getElementById("notesInput").value;

  let expense = {
    name: expenseName,
    amount: amountValue,
    notes: notesInput,
  };
  expenses.push(expense);
  displayExpenses();
}

function subtractExpense() {
  if (expenses.length > 0) {
    expenses.pop();
    displayExpenses();
  }
}

function displayExpenses() {
  let displayContainer = document.getElementById("displayExpenses");
  displayContainer.innerHTML = "";

  for (let i = 0; i < expenses.length; i++) {
    let expense = expenses[i];
    displayContainer.innerHTML += `<div><span class='displayExpenseName'>${expense.name}</span><br><span class='displayAmountValue'>${expense.amount} </span><br><span class='displayNotesInput'>${expense.notes} </span><br><button id='removeExpense' onClick ='removeExpense(${i})'>Delete </button> </div>`;
  }
  displayContainer.innerHTML += `<button id='removeAllExpenses' onClick='removeAllExpenses()'>Remove All</button>`;
}

function removeExpense(index) {
  expenses.splice(index, 1);
  displayExpenses();
}

function removeAllExpenses() {
  expenses = [];
  displayExpenses();

  let removeAllButton = document.getElementById("removeAllExpenses");
  removeAllButton.parentNode.removeChild(removeAllButton);
}

document
  .getElementById("refToSignup")
  .addEventListener("click", function (event) {
    let hideContainer = document.getElementById("loginContainer");
    hideContainer.style.display = "none";

    let showContainer = document.getElementById("signupContainer");
    showContainer.style.display = "block";
    showContainer.style.top = "165px";
    event.preventDefault();
  });

document
  .getElementById("loginContainerLink")
  .addEventListener("click", function (event) {
    let hideContainer = document.getElementById("signupContainer");
    hideContainer.style.display = "none";

    let showContainer = document.getElementById("loginContainer");
    showContainer.style.display = "block";
    event.preventDefault();
  });

window.onload = function () {
  document
    .getElementById("user-account")
    .addEventListener("click", function (event) {
      let hideContainer = document.getElementById("bookmark-elements");
      hideContainer.style.display = "none";

      let hideElements = document.getElementById("calculateExpensesElements");
      hideElements.style.display = "none";

      let showContainer = document.getElementById("accountDetailsElements");
      showContainer.style.display = "block";
      event.preventDefault();
    });
};

document.addEventListener("DOMContentLoaded", function () {
  let signupForm = document.getElementById("inputFormSignup");

  signupForm.addEventListener("submit", function (event) {
    let password = document.getElementById("newPassword").value;
    let confirmPassword = document.getElementById("confirmPasswordInput").value;

    if (password !== confirmPassword) {
      alert("Password do not match. Please try again");
      event.preventDefault();
    }
  });
});

function redirectToLogin() {
  let signupContainer = document.getElementById("signupContainer");
  let loginContainer = document.getElementById("loginContainer");

  loginContainer.style.display = "block";
  signupContainer.style.display = "none";
}

document
  .getElementById("notesandreminders")
  .addEventListener("click", function () {
    let showContainer = document.getElementById("notesandreminderselements");
    showContainer.style.display = "block";

    let hideContainer = document.getElementById("currencyConverterContainer");
    hideContainer.style.display = "none";

    let hidecontainer = document.getElementById("currentLocationElements");
    hidecontainer.style.display = "none";

    let showHeading = document.getElementById("notesRem-heading");
    showHeading.style.display = "block";

    let hideHeading1 = document.getElementById("currencyConv-heading");
    hideHeading1.style.display = "none";

    let hideHeading2 = document.getElementById("result-heading");
    hideHeading2.style.display = "none";

    let hideHeading3 = document.getElementById("location-heading");
    hideHeading3.style.display = "none";

    let hideOneContainer = document.getElementById("search-resultElements");
    hideOneContainer.style.display = "none";
  });

document
  .getElementById("currency-converter")
  .addEventListener("click", function () {
    let showContainer = document.getElementById("currencyConverterContainer");
    showContainer.style.display = "block";

    let hideContainer = document.getElementById("notesandreminderselements");
    hideContainer.style.display = "none";

    let hidecontainer = document.getElementById("currentLocationElements");
    hidecontainer.style.display = "none";

    let showHeading = document.getElementById("currencyConv-heading");
    showHeading.style.display = "block";

    let hideHeading1 = document.getElementById("result-heading");
    hideHeading1.style.display = "none";

    let hideHeading3 = document.getElementById("notesRem-heading");
    hideHeading3.style.display = "none";

    let hideHeading2 = document.getElementById("location-heading");
    hideHeading2.style.display = "none";

    let hideOneContainer = document.getElementById("search-resultElements");
    hideOneContainer.style.display = "none";
  });

let myMap = L.map("currentLocationMapContainer").setView(
  [20.5937, 78.9629],
  13
);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(myMap);

document.getElementById("get-location").addEventListener("click", function () {
  let showContainer = document.getElementById("currentLocationElements");
  showContainer.style.display = "block";

  let hideOneContainer = document.getElementById("search-resultElements");
  hideOneContainer.style.display = "none";

  let hideHeading1 = document.getElementById("result-heading");
  hideHeading1.style.display = "none";

  let hideHeading2 = document.getElementById("currencyConv-heading");
  hideHeading2.style.display = "none";

  let hideHeading3 = document.getElementById("notesRem-heading");
  hideHeading3.style.display = "none";

  let showHeading = document.getElementById("location-heading");
  showHeading.style.display = "block";

  let hideContainer = document.getElementById("notesandreminderselements");
  hideContainer.style.display = "none";

  let hidecontainer = document.getElementById("currencyConverterContainer");
  hidecontainer.style.display = "none";

  document
    .getElementById("currLocationMoreDetails")
    .addEventListener("click", function () {
      let moreDetails = document.getElementById("moreDetailsContainer");
      moreDetails.style.display = "block";

      let lessDetails = document.getElementById("calculateDistanceContainer");
      lessDetails.style.display = "none";
    });

  document.getElementById("moreGoBack").addEventListener("click", function () {
    let hideContainer = document.getElementById("moreDetailsContainer");
    hideContainer.style.display = "none";

    let otherContainer = document.getElementById("weatherDetails");
    if (otherContainer) {
      otherContainer.style.display = "none";
    }

    let showContainer = document.getElementById("calculateDistanceContainer");
    showContainer.style.display = "block";

    let newHeading = document.createElement("p");
    newHeading.textContent = "PLEASE REFRESH THE PAGE TO SEE CONTENT AGAIN.";
    newHeading.classList.add("goBackHeading");

    showContainer.innerHTML = "";
    showContainer.appendChild(newHeading);
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

function showPosition(position) {
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;

  fetch(
    "http://api.openweathermap.org/data/2.5/weather?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=8c00c6bf7d7387d1e873d762f94bf70d"
  )
    .then((response) => response.json())
    .then((data) => {
      let tempInCelsius = data.main.temp - 273.15;

      document.getElementById("currentLocationHeading1").innerText =
        "Your Current Location:                      " + data.name;
      document.getElementById("currentLocationHeading2").innerText =
        "Current Weather There:                      " +
        tempInCelsius.toFixed(2) +
        "°C";
    })
    .catch((error) => {
      console.log("Error", error);
    });
}

function display10DayForecast() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lon = position.coords.longitude;
      const lat = position.coords.latitude;

      const weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`;

      fetch(weatherApi)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const weatherContainer = document.createElement("div");
          weatherContainer.id = "weather-details";

          for (let i = 0; i < 10; i++) {
            const date = new Date(data.daily[i].time).toLocaleDateString();
            const tempMax = data.daily[i].temperature_2m_max.toFixed(1);
            const tempMin = data.daily[i].temperature_2m_min.toFixed(1);

            const weatherInfo = `${date}: Max ${tempMax}°C, Min ${tempMin}°C`;
            const weatherHeading = document.createElement("p");
            weatherHeading.textContent = weatherInfo;
            weatherContainer.appendChild(weatherHeading);
          }

          const theContainer = document.getElementById(
            "calculateDistanceContainer"
          );
          while (theContainer.firstChild) {
            theContainer.removeChild(theContainer.firstChild);
          }

          theContainer.appendChild(weatherContainer);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          alert(
            "The api is not fetching the needed data or maybe There is something wrong in the code."
          );
        });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("currentLocation10DaysWeather")
    .addEventListener("click", display10DayForecast);
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("currentLocation10DaysWeather")
    .addEventListener("click", display10DayForecast);
});

document.getElementById("searchNotes").addEventListener("input", function () {
  let searchQuery = this.value;

  fetch("/get_notes?search=" + encodeURIComponent(searchQuery))
    .then((response) => response.json())
    .then((notes) => {
      let notesContainer = document.getElementById("notesContainer");

      while (notesContainer.firstChild) {
        notesContainer.removeChild(notesContainer.firstChild);
      }

      notes.forEach((note) => {
        let noteElement = document.createElement("div");
        noteElement.classList.add("notesInContainer");
        noteElement.innerHTML =
          "Tittle: " +
          note[1] +
          "<br><br>Your Note: " +
          note[3] +
          "<br><br>Expected Date: " +
          note[2] +
          "<br><br>Note added at: " +
          note[4];
        notesContainer.appendChild(noteElement);

        let editButton = document.createElement("button");
        editButton.innerHTML = "EDIT";
        editButton.classList.add("notesEditBtn");
        editButton.addEventListener("click", function () {
          let newContent = prompt("Enter new content for note:");
          if (newContent) {
            fetch("/edit_note", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `note_id=${note[0]}&new_content=${encodeURIComponent(
                newContent
              )}`,
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === "success") {
                  window.location.href = "/";
                } else {
                  alert("Failed to edit the note.");
                }
              });
          }
        });
        noteElement.appendChild(editButton);

        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "DELETE";
        deleteButton.classList.add("notesDeleteBtn");
        deleteButton.addEventListener("click", function () {
          if (confirm("Are you sure that you want to delete this note.")) {
            fetch("/delete_note", {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: `note_id=${note[0]}`,
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === "success") {
                  window.location.href = "/";
                } else {
                  alert("Failed to delete this note.");
                }
              });
          }
        });
        noteElement.appendChild(deleteButton);

        notesContainer.appendChild(noteElement);

        let hrLine = document.createElement("hr");
        hrLine.classList.add("endingLine");
        notesContainer.appendChild(hrLine);
      });
    });
});

document
  .getElementById("searchDistanceButton")
  .addEventListener("click", function () {
    let inputLocation = document.getElementById("searchDistance").value;

    fetch(
      "https://api.opencagedata.com/geocode/v1/json?q=" +
        inputLocation +
        "&key=8f5bad66d13247d5a86be91751523482"
    )
      .then((response) => response.json())
      .then((data) => {
        let inputLat = data.results[0].geometry.lat;
        let inputLng = data.results[0].geometry.lng;

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            let currLat = position.coords.latitude;
            let currLon = position.coords.longitude;

            let distance = getDistanceLatLongInKm(
              currLat,
              currLon,
              inputLat,
              inputLng
            );
            alert(
              "The distance from your current location to " +
                inputLocation +
                " is " +
                distance.toFixed(2) +
                " km."
            );
          });
        } else {
          alert("Geolocation is not supported in this browser.");
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  });

function getDistanceLatLongInKm(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function displayWeatherDetails() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=8c00c6bf7d7387d1e873d762f94bf70d`;

      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const weatherContainer = document.createElement("div");
          weatherContainer.id = "weatherDetails";

          const temperature = data.main.temp.toFixed(1);
          const windSpeed = data.wind.speed;
          const humidity = data.main.humidity;
          const weatherDescription = data.weather[0].description;
          const weatherIcon = data.weather[0].icon;

          const temperatureElement = document.createElement("p");
          temperatureElement.textContent = `Temperature: ${temperature}°C`;
          temperatureElement.classList.add("innerDetails");
          weatherContainer.appendChild(temperatureElement);

          const windspeedElement = document.createElement("p");
          windspeedElement.textContent = `Wind Speed: ${windSpeed}m/s`;
          windspeedElement.classList.add("innerDetails");
          weatherContainer.appendChild(windspeedElement);

          const humidityElement = document.createElement("p");
          humidityElement.textContent = `Humidity: ${humidity}%`;
          humidityElement.classList.add("innerDetails");
          weatherContainer.appendChild(humidityElement);

          const weatherDescriptionElement = document.createElement("p");
          weatherDescriptionElement.textContent = `Weather Type: ${weatherDescription}`;
          weatherDescriptionElement.classList.add("innerDetails");
          weatherContainer.appendChild(weatherDescriptionElement);

          const weatherIconElement = document.createElement("img");
          weatherIconElement.src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
          weatherIconElement.alt = "Weather Icon";
          weatherContainer.appendChild(weatherIconElement);
          weatherIconElement.classList.add("weatherIcon");

          const theContainer = document.getElementById(
            "calculateDistanceContainer"
          );
          theContainer.innerHTML = "";
          theContainer.appendChild(weatherContainer);
          let backButton = document.createElement("button");
          backButton.textContent = "GO BACK";
          backButton.classList.add("goBack");

          backButton.addEventListener("click", function () {
            document.getElementById("moreDetailsContainer").style.display =
              "block";
            document.getElementById(
              "calculateDistanceContainer"
            ).style.display = "none";
          });
          theContainer.appendChild(backButton);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    });
  }
  let hideContainer = document.getElementById("moreDetailsContainer");
  hideContainer.style.display = "none";

  let showContainer = document.getElementById("calculateDistanceContainer");
  showContainer.innerHTML = "";
  showContainer.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("moreWeatherDetails")
    .addEventListener("click", displayWeatherDetails);
});

function fetchNearbyPlaces(lat, lon) {
  fetch(
    `https://api.opentripmap.com/0.1/en/places/radius?radius=5000&lon=${lon}&lat=${lat}&format=json&apikey=5ae2e3f221c38a28845f05b64f6ae6a9a75c5f8e64917d40a8ce25b4`
  )
    .then((response) => response.json())
    .then((data) => {
      let container = document.getElementById("calculateDistanceContainer");
      container.innerHTML = "";

      if (data.features && data.features.length > 0) {
        let placesHTML = "<h2> Nearby Places of Interest:</h2>";
        data.features.forEach((place) => {
          placesHTML += `<p>${place.properties.name}</p>`;
        });
        container.innerHTML = placesHTML;
      } else {
        alert(
          "I didn't get an API for this function. So it's not working :-( "
        );
      }
    })
    .catch((error) => {
      console.error("Error Fetching Nearby Places:", error);
    });
}

document
  .getElementById("moreFamousPlaces")
  .addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        fetchNearbyPlaces(position.coords.latitude, position.coords.longitude);
      });
    } else {
      console.log("Navigator is not available for this browser.");
    }

    let hideBox = document.getElementById("moreDetailsContainer");
    hideBox.style.display = "none";

    let showBox = document.getElementById("calculateDistanceContainer");
    showBox.style.display = "block";
  });

function fetchNearbyRestaurantsAndCafes(lat, lon) {
  const clientId = "SSLOZ2U44APMZTCHW20LJVCE2USTXXCTZFU3TMGT5CLXTGRA";
  const clientSecret = "K2VQTKY4LL3DX5FU4NAVNJYPC5ST05AXVUOO23FWZ2QASXHA";
  const endpoint = `https://api.foursquare.com/v2/venues/explore?client_id=${clientId}&client_secret=${clientSecret}&v=20220101&ll=${lat},${lon}&radius=500&limit=10&section=food`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      let container = document.getElementById("calculateDistanceContainer");
      container.innerHTML = "";

      if (data.response.groups && data.response.groups.length > 0) {
        let placesHTML = "<h2> Nearby Restaurants and Cafes:</h2>";
        data.response.groups[0].items.forEach((item) => {
          placesHTML += `<p>${item.venue.name}</p>`;
        });
        container.innerHTML = placesHTML;
      } else {
        alert("I tried so many API's but again same issue occured :-(");
      }
    })
    .catch((error) => {
      console.error("Error Fetching Nearby Restaurants and Cafes:", error);
    });
}

document
  .getElementById("moreRestaurentsAndCafes")
  .addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        fetchNearbyRestaurantsAndCafes(
          position.coords.latitude,
          position.coords.longitude
        );
      });
    } else {
      console.log("Navigator is not available for this browser.");
    }

    let hideBox = document.getElementById("moreDetailsContainer");
    hideBox.style.display = "none";

    let showBox = document.getElementById("calculateDistanceContainer");
    showBox.style.display = "block";
  });

function fetchNearbyTransportation(lat, lon) {
  const appId = "e47a9aab";
  const appKey = "3dfdf87774630780e52c93e02c3cf526";
  const endpoint = `https://transportapi.com/v3/uk/places.json?lat=${lat}&lon=${lon}&app_id=${appId}&app_key=${appKey}&type=train_station,bus_stop,tram_stop`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      let container = document.getElementById("calculateDistanceContainer");
      container.innerHTML = "";

      if (data.member && data.member.length > 0) {
        let transportationHTML =
          "<h2 class = 'transportation-heading'> NEARBY TRANSPORTATION:</h2>";
        data.member.forEach((place) => {
          transportationHTML += `<p class = 'transportation-parah'>${place.name}</p>`;
        });
        container.innerHTML = transportationHTML;
        alert(
          "This API only fetch the locations of UK not From all over the world."
        );
        let newButton = document.createElement("button");
        newButton.textContent = "GO BACK";
        newButton.classList.add("closeTransportation");
        newButton.onclick = function () {
          let hideElement = document.getElementById(
            "calculateDistanceContainer"
          );
          hideElement.style.display = "none";

          let showElement = document.getElementById("moreDetailsContainer");
          showElement.style.display = "block";
        };
        container.appendChild(newButton);
      } else {
        container.innerHTML =
          "<p class = 'none-message'>No transportation information found nearby.</p>";
        let newButton = document.createElement("button");
        newButton.textContent = "GO BACK";
        newButton.classList.add("closeTransportation");
        newButton.onclick = function () {
          let hideElement = document.getElementById(
            "calculateDistanceContainer"
          );
          hideElement.style.display = "none";

          let showElement = document.getElementById("moreDetailsContainer");
          showElement.style.display = "block";
        };
        container.appendChild(newButton);
      }
    })
    .catch((error) => {
      console.error("Error Fetching Nearby Transportation:", error);
    });
}

document
  .getElementById("moreTransportations")
  .addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        fetchNearbyTransportation(
          position.coords.latitude,
          position.coords.longitude
        );
      });
    } else {
      console.log("Navigator is not available for this browser.");
    }

    let hideBox = document.getElementById("moreDetailsContainer");
    hideBox.style.display = "none";

    let showBox = document.getElementById("calculateDistanceContainer");
    showBox.innerHTML = "";
    showBox.style.overflowY = "auto";
    showBox.style.display = "block";
  });

function fetchNearbyAccommodations(lat, lon) {
  const apiKey = "5ae2e3f221c38a28845f05b64f6ae6a9a75c5f8e64917d40a8ce25b4";
  const radius = 5000;
  const endpoint = `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&format=json&apikey=${apiKey}&kinds=accommodation`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      let container = document.getElementById("calculateDistanceContainer");
      container.innerHTML = "";

      if (data.features && data.features.length > 0) {
        let accommodationsHTML = "<h2> Nearby Accommodations:</h2>";
        data.features.forEach((accommodation) => {
          accommodationsHTML += `<p>${accommodation.properties.name}</p>`;
        });
        container.innerHTML = accommodationsHTML;
      } else {
        container.innerHTML =
          "<p class ='error-message'>NO RELATED DATA FOUND HERE.</p>";
        alert("The API does not work for this function.");
      }
    })
    .catch((error) => {
      console.error("Error Fetching Nearby Accommodations:", error);
    });
}

document
  .getElementById("moreAccomodations")
  .addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        fetchNearbyAccommodations(
          position.coords.latitude,
          position.coords.longitude
        );
      });
    } else {
      console.log("Navigator is not available for this browser.");
    }

    let hideBox = document.getElementById("moreDetailsContainer");
    hideBox.style.display = "none";

    let showBox = document.getElementById("calculateDistanceContainer");
    showBox.innerHTML = "";
    showBox.style.overflowY = "auto";
    showBox.style.display = "block";
  });

function fetchLocationPhotos(lat, lon) {
  const apiKey = "8W_4OEhQvvkyQ6IBgSmqyjNkt8PNsTQaoHh1slAGCIc";
  const endpoint = `https://api.unsplash.com/search/photos?query=landscape&orientation=landscape&per_page=5&client_id=${apiKey}&lat=${lat}&lon=${lon}`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      let container = document.getElementById("calculateDistanceContainer");
      container.innerHTML = "";

      if (data.results && data.results.length > 0) {
        let photosHTML = "<h2 id ='photos-heading'> LOCATION PHOTOS</h2>";
        data.results.forEach((photo) => {
          photosHTML += `<img id='fetched-images' src="${photo.urls.regular}" alt="${photo.alt_description}" />`;
        });
        container.innerHTML = photosHTML;
        alert(
          "I don't know the location of these pics but these locations are too beautiful."
        );
        let newButton = document.createElement("button");
        newButton.textContent = "GO BACK";
        newButton.classList.add("closePhotos");
        newButton.onclick = function () {
          let hideElement = document.getElementById(
            "calculateDistanceContainer"
          );
          hideElement.style.display = "none";

          let showElement = document.getElementById("moreDetailsContainer");
          showElement.style.display = "block";
        };
        container.appendChild(newButton);
      } else {
        container.innerHTML = "<p>No photos found for this location.</p>";
        let newButton = document.createElement("button");
        newButton.textContent = "GO BACK";
        newButton.classList.add("closePhotos");
        newButton.onclick = function () {
          let hideElement = document.getElementById(
            "calculateDistanceContainer"
          );
          hideElement.style.display = "none";

          let showElement = document.getElementById("moreDetailsContainer");
          showElement.style.display = "block";
        };
        container.appendChild(newButton);
      }
    })
    .catch((error) => {
      console.error("Error Fetching Location Photos:", error);
    });
}

document
  .getElementById("morePhotosAndVideos")
  .addEventListener("click", function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        fetchLocationPhotos(
          position.coords.latitude,
          position.coords.longitude
        );
      });
    } else {
      console.log("Navigator is not available for this browser.");
    }

    let hideBox = document.getElementById("moreDetailsContainer");
    hideBox.style.display = "none";

    let showBox = document.getElementById("calculateDistanceContainer");
    showBox.innerHTML = "";
    showBox.style.overflowY = "auto";
    showBox.style.display = "block";
  });

document
  .getElementById("moreUserReviews")
  .addEventListener("click", function () {
    let showContainer = document.getElementById("calculateDistanceContainer");
    showContainer.style.innerHTML = "";
    showContainer.style.display = "block";

    fetch("/get_reviews")
      .then((response) => response.json())
      .then((data) => {
        let reviewHTML = "<h2 id ='userReviewHeading'>USER REVIEWS</h2>";
        if (data.length > 0) {
          reviewHTML += "<ul>";
          data.forEach((review) => {
            reviewHTML += `<li><strong>${review.UserName}</strong>: ${review.ReviewText} (Rating: ${review.Rating})</li>`;
          });
          reviewHTML += "</ul>";
          let newButton = document.createElement("button");
          newButton.textContent = "GO BACK";
          newButton.classList.add("closeReviews");
          newButton.onclick = function () {
            let hideElement = document.getElementById(
              "calculateDistanceContainer"
            );
            hideElement.style.display = "none";

            let showElement = document.getElementById("moreDetailsContainer");
            showElement.style.display = "block";
          };
          showContainer.appendChild(newButton);
        } else {
          reviewHTML +=
            "<p id ='noReviewMessage'>No reviews found for this location.</p>";
        }
        document.getElementById("calculateDistanceContainer").innerHTML =
          reviewHTML;

        let newButton = document.createElement("button");
        newButton.textContent = "GO BACK";
        newButton.classList.add("closeReviews");
        newButton.onclick = function () {
          let hideElement = document.getElementById(
            "calculateDistanceContainer"
          );
          hideElement.style.display = "none";

          let showElement = document.getElementById("moreDetailsContainer");
          showElement.style.display = "block";
        };
        showContainer.appendChild(newButton);
      })
      .catch((error) => {
        console.log("Error Fetching The Reviews:", error);
      });
    let hideContainer = document.getElementById("moreDetailsContainer");
    hideContainer.style.display = "none";
  });

let headingAppend = false;

document
  .getElementById("search-button")
  .addEventListener("click", function (event) {
    event.preventDefault();

    let showContainer = document.getElementById("search-resultElements");
    showContainer.style.display = "block";

    let hideContainer1 = document.getElementById("currentLocationElements");
    hideContainer1.style.display = "none";

    let hideContainer2 = document.getElementById("currencyConverterContainer");
    hideContainer2.style.display = "none";

    let hideContainer3 = document.getElementById("notesandreminderselements");
    hideContainer3.style.display = "none";

    let showHeading = document.getElementById("result-heading");
    showHeading.style.display = "block";

    let hideHeading1 = document.getElementById("notesRem-heading");
    hideHeading1.style.display = "none";

    let hideHeading2 = document.getElementById("currencyConv-heading");
    hideHeading2.style.display = "none";

    let hideHeading3 = document.getElementById("location-heading");
    hideHeading3.style.display = "none";

    let searchedLocation = document.getElementById("search-bar").value;

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchedLocation}&appid=8c00c6bf7d7387d1e873d762f94bf70d&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("search-locationHeading1").textContent =
          "You searched for: " + searchedLocation;
        document.getElementById("search-locationCurrWeather").textContent =
          "Current weather there: " + data.main.temp + "°C";
      })
      .catch((error) => {
        console.error("Error Fetching The Requested Data:", error);
      });
    fetchUsefulTips();

    let anotherContainer = document.getElementById("map-container");

    if (!headingAppend) {
      let newHeading = document.createElement("h3");
      newHeading.textContent = "This map is available in 'current-location'";
      newHeading.classList.add("map-heading");

      anotherContainer.appendChild(newHeading);

      headingAppend = true;
    }
  });

function fetchUsefulTips() {
  fetch("https://api.adviceslip.com/advice")
    .then((response) => response.json())
    .then((data) => {
      displayUsefulTips(data.slip.advice);
    })
    .catch((error) => {
      console.error("Error Fetching Useful Tips:", error);
    });
}

function displayUsefulTips(tips) {
  let tipsContainer = document.getElementById("useful-tipsContainer");

  let tipsText = document.createElement("p");
  tipsText.textContent = tips;
  tipsText.classList.add("useful-tips");

  let tipElement = document.getElementsByClassName("useful-tips");
  while (tipElement.length > 2) {
    tipsContainer.removeChild(tipElement[0]);
  }

  tipsContainer.appendChild(tipsText);
  tipsContainer.style.overflowY = "auto";
}

document
  .getElementById("moreOptionsButton")
  .addEventListener("click", function () {
    let hideContainer = document.getElementById("useful-tipsContainer");
    hideContainer.style.display = "none";

    let showContainer = document.getElementById("moreOptionsContainer");
    showContainer.style.display = "block";
  });

document.getElementById("more-GoBack").addEventListener("click", function () {
  let hideContainer = document.getElementById("moreOptionsContainer");
  hideContainer.style.display = "none";

  let showContainer = document.getElementById("useful-tipsContainer");
  showContainer.innerHTML = "";
  showContainer.style.display = "block";

  let theHeading = document.createElement("h3");
  theHeading.textContent = "PLEASE REFRESH THE PAGE TO SEE CONTENT AGAIN.";
  theHeading.id = "container-heading";

  showContainer.appendChild(theHeading);
});

document
  .getElementById("search-location10daysWeather")
  .addEventListener("click", function () {
    alert("This API does not work for this function.");
  });

function fetchWeatherDetails(location) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=8c00c6bf7d7387d1e873d762f94bf70d&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      let temperature = data.main.temp;
      let humidity = data.main.humidity;
      let description = data.weather[0].description;
      let weatherType = data.weather[0].main;
      let iconCode = data.weather[0].icon;

      let imageUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

      let theContainer = document.getElementById("useful-tipsContainer");
      theContainer.innerHTML = `<h2 id='heading-weather'>WEATHER DETAILS</h2>
                                <p class='weather-details'>Temperature: ${temperature}°C</p>
                                <p class='weather-details'>Humidity: ${humidity}%</p>
                                <p class='weather-details'>Description: ${description}</p>
                                <p class='weather-details'>Weather Type: ${weatherType}</p>
                                <img id='weather-icon' src='${imageUrl}' alt='weather-icon'>`;

      let newButton = document.createElement("button");
      newButton.textContent = "GO BACK";
      newButton.id = "closeWeatherDetails";
      newButton.onclick = function () {
        let hideContainer = document.getElementById("useful-tipsContainer");
        hideContainer.style.display = "none";

        let showContainer = document.getElementById("moreOptionsContainer");
        showContainer.style.display = "block";
      };
      theContainer.appendChild(newButton);
    })
    .catch((error) => {
      console.error("Error Fetching Weather Details:", error);
    });
}

document
  .getElementById("more-weather-details")
  .addEventListener("click", function () {
    let searchedLocation = document.getElementById("search-bar").value;
    fetchWeatherDetails(searchedLocation);

    let hideContainer = document.getElementById("moreOptionsContainer");
    hideContainer.style.display = "none";

    let showContainer = document.getElementById("useful-tipsContainer");
    showContainer.innerHTML = "";
    showContainer.style.display = "block";
  });

document
  .getElementById("more-famous-places")
  .addEventListener("click", function () {
    alert('Explore more about this function in "Current Location".');
  });

document
  .getElementById("more-restaurentsandcafes")
  .addEventListener("click", function () {
    alert('Explore more about this function in "Current Location".');
  });

document
  .getElementById("more-transportations")
  .addEventListener("click", function () {
    alert('Explore more about this function in "Current Location".');
  });

document
  .getElementById("more-accomodations")
  .addEventListener("click", function () {
    alert('Explore more about this function in "Current Location".');
  });

document
  .getElementById("more-photosandvideos")
  .addEventListener("click", function () {
    alert('Explore more about this function in "Current Location".');
  });

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("more-userReviews")
    .addEventListener("click", function () {
      let location = document.getElementById("search-bar").value;

      let showContainer = document.getElementById("useful-tipsContainer");
      showContainer.innerHTML = "";
      showContainer.style.display = "block";

      fetch(`/searched_location_reviews?location=${location}`)
        .then((response) => response.json())
        .then((data) => {
          let reviewHTML =
            '<h2 id="searchedReviewHeading">SEARCHED REVIEWS</h2>';
          if (data.length > 0) {
            reviewHTML += "<ul>";
            data.forEach((review) => {
              reviewHTML += `<li id="reviewInContainer"><strong>${review.UserName}</strong>: ${review.ReviewText} (Rating: ${review.Rating})</li>`;
            });
            reviewHTML += "</ul>";
            alert(
              "It's not fetching reviews correctly from backend and i am not getting what's wrong here."
            );
          } else {
            reviewHTML +=
              '<p id="noSearchedFound">No review found for this location.</p>';
          }
          document.getElementById("useful-tipsContainer").innerHTML =
            reviewHTML;

          let newButton = document.createElement("button");
          newButton.textContent = "GO BACK";
          newButton.id = "closeSearchedReviews";
          newButton.onclick = function () {
            let hideContainer = document.getElementById("useful-tipsContainer");
            hideContainer.style.display = "none";

            let showContainer = document.getElementById("moreOptionsContainer");
            showContainer.style.display = "block";
          };
          showContainer.appendChild(newButton);
        })
        .catch((error) => {
          console.error("Error Fetching Review:", error);
        });
      let hideContainer = document.getElementById("moreOptionsContainer");
      hideContainer.style.display = "none";
    });
});

document.getElementById("scrolltotop").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("search-again").addEventListener("click", function () {
  document.getElementById("search-bar").value = "";
  document.getElementById("search-bar").focus();
});

document
  .getElementById("gmail-link")
  .addEventListener("click", function (event) {
    event.preventDefault();

    let gmailID = "kaliaharsh24@gmail.com";

    let mailTo = "mailto:" + encodeURIComponent(gmailID);

    window.open(mailTo, "_blank");
  });

document
  .getElementById("instagram-link")
  .addEventListener("click", function (event) {
    event.preventDefault();

    let instagramLink = "https://www.instagram.com/_.harsh.kalia_/";

    window.open(instagramLink, "_blank");
  });
