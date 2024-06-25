/*
 * FILE NAME   : index.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 25.06.2024
 * PURPOSE     : Final project index (client-side) javascript file.
 */

import {PixelFontCanvas} from "./lib/PixelFontCanvas.js";

let socket = new WebSocket("ws://192.168.30.20:8000");
let socketReciever = new WebSocket("ws://192.168.30.18:8000");

PixelFontCanvas.loadFont("fonts/", "cg.fnt");

let lat;
let lon;
let loop;
let apiKEY;
fetch("../key.env").then(response => response.text()).then(text => {
  apiKEY = text;  
});

function restore() {
  const canv = document.getElementById("can");
  const text = document.getElementById("data");
  const endTrack = document.getElementById("endTrack");
  const but = document.createElement("input");
  const div = document.getElementById("div");
  text.disabled = false;
  endTrack.remove();
  but.type = "button";
  but.value = "Start";
  but.setAttribute("id", "track");
  but.onclick = function() {trackWeather()};
  div.appendChild(but);
  text.value = "";
  clearInterval(loop);
  if (canv != undefined) {
    canv.remove();
  }
}

function createPageDescription(json) {
  let img = document.createElement("img");
  let place = document.createElement("p");
  let temp = document.createElement("p");
  let desc = document.createElement("p");
  let lon = document.createElement("p");
  let lat = document.createElement("p");
  let div = document.getElementById("left");
  place.textContent = `Tracking place: ${json.name}, ${json.sys.country}\n\n\n`;
  temp.textContent = `Current temperature: ${json.main.temp}°C\n\n\n`;
  desc.textContent = `Weather description: ${json.weather[0].description}\n\n\n`;
  lon.textContent = `Longitude: ${json.coord.lon}\n\n\n`;
  lat.textContent = `Latitude: ${json.coord.lat}\n\n\n`;
  img.src = `https://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;
  img.setAttribute("id", "weatherIco");
  place.setAttribute("id", "textPlace");
  temp.setAttribute("id", "textTemp");
  desc.setAttribute("id", "textDesc");
  lon.setAttribute("id", "textLon");
  lat.setAttribute("id", "textLat");
  div.insertAdjacentElement("beforeend", place);
  div.insertAdjacentElement("beforeend", lon);
  div.insertAdjacentElement("beforeend", lat);
  div.insertAdjacentElement("beforeend", temp);
  div.insertAdjacentElement("beforeend", desc);
  div.insertAdjacentElement("beforeend", img);
}

function deletePageDescription() {
  if (document.getElementById("weatherIco") != undefined)
    document.getElementById("weatherIco").remove();
  if (document.getElementById("textPlace") != undefined)
    document.getElementById("textPlace").remove();
  if (document.getElementById("textTemp") != undefined)
    document.getElementById("textTemp").remove();
  if (document.getElementById("textDesc") != undefined)
    document.getElementById("textDesc").remove();
  if (document.getElementById("textLon") != undefined)
    document.getElementById("textLon").remove();
  if (document.getElementById("textLat") != undefined)
    document.getElementById("textLat").remove();
}

function generateCanvas(data) {
  let canv = document.getElementById("can");
  if (canv != undefined) {
    canv.remove();
  }
  let img = new Image();
  canv = document.createElement("canvas");
  let ctx = canv.getContext("2d");
  canv.width = 32;
  canv.height = 16;
  canv.setAttribute("id", "can");
  ctx.fillStyle = "#000000";
  ctx.imageSmoothingEnabled = false;
  ctx.fillRect(0, 0, canv.width, canv.height);
  img.src = `../png/${data[1]}.png`;
  img.onload = () => {
    ctx.drawImage(img, 2, 2);
    PixelFontCanvas.drawText(canv, `${data[0]}'`, {
      font: 'CG',
      x: data[0] < 0 ? 17 : 19,
      y: 6,
      scale: 1,
      align: 'left',
      tint: '#FFFFFF'
    });
    let imgDataRGBA = ctx.getImageData(0, 0, canv.width, canv.height).data;
    let imgDataHEX = new Array(canv.width * canv.height);
    let pos = 0;
    for (let i = 0; i < canv.width * canv.height * 4; i += 4) {
      imgDataHEX[pos++] = (imgDataRGBA[i] << 16) | (imgDataRGBA[i + 1] << 8) | (imgDataRGBA[i + 2]);
    }
    socketReciever.send(JSON.stringify(imgDataHEX));
  }
}

function trackWeather() {
  if (socket.readyState != socket.OPEN) {
    alert(`ERROR: Server is not available.`);
    return;
  }
  if (socketReciever.readyState != socket.OPEN) {
    alert(`ERROR: RPI Server is not available.`);
    return;
  }
  let oldData;
  let data;
  const text = document.getElementById("data"); 
  const array = text.value.split(", ");
  const track = document.getElementById("track");
  const div = document.getElementById("div");
  track.remove();
  const endTrack = document.createElement("button");
  endTrack.textContent = "Stop";
  endTrack.setAttribute("id", "endTrack");
  endTrack.onclick = () => {
    restore();
    deletePageDescription();
    socketReciever.send(`RESTORE`);
  }
  div.appendChild(endTrack);
  text.disabled = true;
  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${array[0]},${array[1]}&appid=${apiKEY}&units=metric&lang=en`)
    .then(response => response.json())
    .then(json => {
      if (json.length == 0) {
        restore();
        deletePageDescription();
        alert(`ERROR: Failed to get location data.`);
        return;
      }
      lat = json[0].lat;
      lon = json[0].lon;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${json[0].lat}&lon=${json[0].lon}&appid=${apiKEY}&units=metric&lang=en`)
        .then(response => response.json())
        .then(json => {
          if (json.length == 0) {
            restore();
            deletePageDescription();
            alert(`ERROR: Failed to get location data.`);
            return;
          }
          data = [json.main.temp.toFixed(0), json.weather[0].icon];
          createPageDescription(json);
          generateCanvas(data);
          oldData = data;
          loop = setInterval(() => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKEY}&units=metric&lang=en`)
              .then(response => response.json())
              .then(json => {
                if (json.length == 0) {
                  restore();
                  deletePageDescription();
                  alert(`ERROR: Failed to get weather data.`);
                  return;
                }
                data = [json.main.temp.toFixed(0), json.weather[0].icon];
                if (oldData[0] != data[0] || oldData[1] != data[1]) {
                  oldData = data;
                  deletePageDescription();
                  createPageDescription(json);
                  generateCanvas(data);
                } 
            });
          }, 60000);
        });
      });
}

function sendMsg() {
  if (socket.readyState != socket.OPEN) {
    alert(`ERROR: Server is not available.`);
    return;
  }
  if (socketReciever.readyState != socket.OPEN) {
    alert(`ERROR: RPI Server is not available.`);
    return;
  }
  let tag = document.getElementById("color");
  let x = tag.value;
  let r = eval("0x" + x[1] + x[2]);
  let g = eval("0x" + x[3] + x[4]);
  let b = eval("0x" + x[5] + x[6]);
  let text = document.getElementById("message").value;
  document.getElementById("message").value = ``;
  socketReciever.send(JSON.stringify([`MSG`, text, r, g, b]));
}

function getMessage() {
  socket.onclose = () => {
    restore();
    socketReciever.send(`RESTORE`);
    alert(`ALERT: Server was closed.`);
  }

  socket.onerror = () => {
    restore();
    socketReciever.send(`RESTORE`);
    alert(`ERROR: Failed to set connection with server.`);
  }

  socketReciever.onmessage = (event) => {
    alert(event.data);
  }
}

document.getElementById("data").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("track").click();
  }
});

document.getElementById("message").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("msg").click();
  }
});

document.getElementById("track").onclick = function() {trackWeather()};
document.getElementById("msg").onclick = function() {sendMsg()};

getMessage();

/* END OF 'index.js' FILE */