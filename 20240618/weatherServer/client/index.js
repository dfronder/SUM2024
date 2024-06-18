// const lat = 59.94324825369481;
// const lon = 30.278047516212283;
const apiKEY = `4a39ca120c04f12899bae89cb5081145`;

const getWetherJSON = url => {
  fetch(url)
       .then(response => response.json())
       .then(json => {
          if (document.getElementById("weatherIco") != undefined) {
            document.getElementById("weatherIco").remove();
          }
          let img = document.createElement("img");
          img.src = `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;
          img.setAttribute("id", "weatherIco");
          document.body.insertAdjacentElement("afterend", img);
          console.log(json);
       })
  }

function getWeather() {
  const lat = document.getElementById("lat");
  const lon = document.getElementById("lon");
  getWetherJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${lat.value}&lon=${lon.value}&appid=${apiKEY}&units=metric&lang=en`);
} // End of 'getWeather' function

document.getElementById("sendData").onclick = function() {getWeather()};