const apiKey = "99a155366a5f13462934cb1f9df40af3";

let weatherCity = document.getElementById("city");
let imgOut = document.getElementById("imgOut");
let temperaturOut = document.getElementById("temperatur");
let windOut = document.getElementById("wind");
let cloudOut = document.getElementById("cloudiness");
let pressureOut = document.getElementById("pressure");
let humidityOut = document.getElementById("humidity");
let sunriseOut = document.getElementById("sunrise");
let sunsetOut = document.getElementById("sunset");
let geoCordsOut = document.getElementById("geocords");

let timeOut = document.getElementById("localeTime");

let cityInput = document.getElementById("cityInput");

let windDirection;

const windDirections = [
    { min: 349, max: 11, direction: "North" },
    { min: 12, max: 33, direction: "North-Northeast" },
    { min: 34, max: 56, direction: "Northeast" },
    { min: 57, max: 78, direction: "East-Northeast" },
    { min: 79, max: 101, direction: "East" },
    { min: 102, max: 123, direction: "East-Southeast" },
    { min: 124, max: 146, direction: "Southeast" },
    { min: 147, max: 168, direction: "South-Southeast" },
    { min: 169, max: 191, direction: "South" },
    { min: 192, max: 213, direction: "South-Southwest" },
    { min: 214, max: 236, direction: "Southwest" },
    { min: 237, max: 258, direction: "West-Southwest" },
    { min: 259, max: 281, direction: "West" },
    { min: 282, max: 303, direction: "West-Northwest" },
    { min: 304, max: 326, direction: "Northwest" },
    { min: 327, max: 348, direction: "North-Northwest" }
];

function getWindDirection(degrees) {
  const direction = windDirections.find((item) => {
    return degrees >= item.min && degrees <= item.max;
  });

  return direction ? direction.direction : "";
}

function showWeather() {
  city = document.getElementById("cityInput").value;
  weatherCity.innerHTML = city;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=de&appid=${apiKey}`)
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      if (data.cod == "404") {
        cityInput.value = "";
        alert("Stadt nicht gefunden.");
        return;
      }
      let i = data.wind.deg;
      windDirection = getWindDirection(i);

        const shiftInSeconds = data.timezone;
        const berlinTime = new Date();
        const berlinOffset = berlinTime.getTimezoneOffset() * 60;
        const utcTime = new Date();
        utcTime.setSeconds(utcTime.getSeconds() + shiftInSeconds + berlinOffset);

        timeOut.innerHTML = utcTime.toLocaleTimeString('en-US', { hour12: false });

      imgOut.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      temperaturOut.innerHTML = (data.main.temp - 274.15).toFixed(2) + "°C";
      windOut.innerHTML = data.wind.speed + " m/s " + windDirection;
      cloudOut.innerHTML = data.weather[0].description;
      pressureOut.innerHTML = data.main.pressure + " hPa";
      humidityOut.innerHTML = data.main.humidity + "%";
      geoCordsOut.innerHTML = `[${data.coord.lat}, ${data.coord.lon}]`;

      sunriseOut.innerHTML = (new Date(data.sys.sunrise * 1000 + data.timezone * 1000 - 3600 * 1000)).toLocaleTimeString(data.sys.country);

      sunsetOut.innerHTML = (new Date(data.sys.sunset * 1000 + data.timezone * 1000 - 3600 * 1000)).toLocaleTimeString(data.sys.country);
    });
}

cityInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    showWeather();
  }
});
