let region = "";
let day = "";
let data = "";
let regionData = "";
let defaultData = "cairo";

const apiKey = "bdc_f25af025b83f485880d58582306fd250";
const apiUrl = "https://api.bigdatacloud.net/data/reverse-geocode-client";

const searchInput = document.querySelector("#searchInput");
const today = document.querySelector(".today");
const tom = document.querySelector(".tomorrow");
const afterTom = document.querySelector(".after-tomorrow");
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const btn = document.querySelector(".sub");
btn.addEventListener("click", () => init(searchInput.value));
searchInput.addEventListener("input", async function () {
  if (searchInput.value) await init(searchInput.value);
});

async function getLocation() {
  if (navigator.geolocation) {
    await navigator.geolocation.watchPosition(getPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
  // await initializeApp();
}

async function getPosition(position) {
  try {
    const url = `${apiUrl}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en&key=${apiKey}`;
    let res = await fetch(url);
    data = await res.json();
    const region = data.city;
    await init(region);
    if (region) {
      console.log("City:", region);
      // Update your UI or perform other actions with the city name
    } else {
      console.log("City not found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
function getDay() {
  const d = new Date();
  day = d.getDay();
  return day;
}

async function fetchData(region) {
  try {
    regionData = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=48eed6a0aa9b4cd5889200026231108&q=${region}&days=7
`
    );
    if (!regionData.ok) {
      throw new Error(`HTTP error! Status: ${regionData.status}`);
    }
    regionData = await regionData.json();
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
}

function updateToday() {
  if (regionData && regionData.location && regionData.location.name) {
    today.innerHTML = `
  
  <div class="d-flex flex-row w-attr justify-content-between">
  <p class="px-3">${weekday[getDay()]}</p>
  <p class="px-3">11 August</p>
</div>
<div class="d-flex gap-3 flex-column w-100 px-3 pt-1">
<div class="fs-3">${regionData.location.name} </div>
<div class="row align-content-center align-items-center">
  <div class="temp col-6">${regionData.current.temp_c}°C </div>
  <div class="img-1 col-6">
  <img src="${regionData.current.condition.icon}" alt="w">
  </div>


</div>
<div class="deg" >${regionData.current.condition.text} </div>
<div class="row">
<div class="row col-3 gap-0">
  <div class="img-2 col-6">
    <img src="photos/icon-umberella.png" alt="w">
  </div>
  <div class="col-6">20%</div>
</div>
<div class="row col-3 mx-2">
  <div class="img-2 col-6 ms-auto">
  <img src="photos/icon-wind.png" alt="w">
  </div>
  <div class="col-6">${regionData.current.wind_kph}km/h</div>
</div>
<div class="row col-3 mx-3 ">
  <div class="img-2 col-6">
    <img src="photos/icon-compass.png" alt="w">
  </div>
  <div class="col-6">20%</div>

</div>
</div>
</div>
`;
  }
}
function updateTomorrow() {
  // const fore = regionData.forecast;
  const foreTom = regionData.forecast.forecastday[1];
  const deg = foreTom.day;
  const date = new Date(foreTom.date);

  tom.innerHTML = `
  <div class="d-flex flex-column gap-3 align-content-center align-items-center justify-content-center">
  <div class="wt-attr">${weekday[date.getUTCDay()]}</div>
  <div><img src="${deg.condition.icon}"> </div>
  <div class="fs-4 fw-bold">${deg.maxtemp_c} °C</div>
  <div>${deg.mintemp_c} °C</div>
  <div class="deg-text">${deg.condition.text}</div>
  </div>`;
}

async function init(region) {
  await fetchData(region);
  updateToday();
  updateTomorrow();
  updateAfterTomorrow();
}

function updateAfterTomorrow() {
  const foreTom = regionData.forecast.forecastday[2];
  const deg = foreTom.day;
  const date = new Date(foreTom.date);

  afterTom.innerHTML = `
  <div class="d-flex flex-column gap-3 align-content-center align-items-center justify-content-center">
  <div class="co">${weekday[date.getUTCDay()]}</div>
  <div><img src="${deg.condition.icon}"></div>
  <div class="fs-4 fw-bold">${deg.maxtemp_c} °C</div>
  <div>${deg.mintemp_c} °C</div>
  <div class="deg-text">${deg.condition.text}</div>
  </div>`;
}
getLocation();
