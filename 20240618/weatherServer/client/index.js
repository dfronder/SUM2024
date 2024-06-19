/*
 * FILE NAME   : index.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 19.06.2024
 * PURPOSE     : Weather index javascript file.
 */

// Lat and Lon of SPb
// const lat = 59.94324825369481;
// const lon = 30.278047516212283;
// var ppm = require("ppm");

import {PixelFontCanvas} from "./lib/PixelFontCanvas.js";

const apiKEY = `4a39ca120c04f12899bae89cb5081145`;

const getWetherJSON = url => {
  fetch(url)
       .then(response => response.json())
       .then(json => {
         let img = new Image();
         let canv = document.createElement("canvas");
         let ctx = canv.getContext("2d");
         canv.width = 32;
         canv.height = 16;
         ctx.fillStyle = "#000000";
         ctx.imageSmoothingEnabled = false;
         ctx.fillRect(0, 0, canv.width, canv.height);
         img.src = `../png/${json.weather[0].icon}.png`;
         img.onload = () => {
           ctx.drawImage(img, 2, 2);
           ctx.fillStyle = "#FFFFFF";
           ctx.font = "6px helvetica";
           ctx.textRendering = "geometricPrecision";
           ctx.fillText(`${json.main.temp.toFixed(0)}°C`, 17, 11);
           document.body.insertAdjacentElement("beforeend", canv);
           let imgDataRGBA = ctx.getImageData(0, 0, canv.width, canv.height).data;
           let imgDataRGB = new Uint8ClampedArray(canv.width * canv.height * 3);
           let pos = 0;
           for (let i = 0; i < canv.width * canv.height * 4; i += 4) {
             imgDataRGB[pos] = imgDataRGBA[i];
             imgDataRGB[pos++] = imgDataRGBA[i + 1];
             imgDataRGB[pos++] = imgDataRGBA[i + 2];
           }
           console.log(imgDataRGBA);
           console.log(imgDataRGB);
           console.log(json);
         }
       });
  }

function getWeather() {
  const lat = document.getElementById("lat");
  const lon = document.getElementById("lon");
  getWetherJSON(`https://api.openweathermap.org/data/2.5/weather?lat=${lat.value}&lon=${lon.value}&appid=${apiKEY}&units=metric&lang=en`);
} // End of 'getWeather' function

document.getElementById("sendData").onclick = function() {getWeather()};

/* END OF 'index.js' FILE */