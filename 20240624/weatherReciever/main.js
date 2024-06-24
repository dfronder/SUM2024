/*
  FILE NAME   : main.js
  PROGRAMMER  : DC6
  LAST UPDATE : 24.06.2024
  PURPOSE     : Weather information reciever javascript file.
*/

import http from "node:http";
import {WebSocketServer} from "ws";
import express from "express";
import child_process from "child_process";
import fs from "node:fs";

const command = `./led-image-viewer --led-rows=16 --led-gpio-mapping="classic-pi1" /home/dc6/Desktop/weatherReciever/weather.ppm --led-no-hardware-pulse --led-slowdown-gpio=4`;
let cmd = undefined;

const app = express();
app.get('/', (req, res, next) => {
  next();
});

app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocketServer({server});

function kill() {
  if (cmd != undefined) {
    if (cmd.killed != true) {
      process.kill(-cmd.pid);
      cmd.kill();
      cmd = undefined;
    }
  } 
}

wss.on("connection", (ws) => {

  ws.onmessage = (data) => {
    if (data.data == `RESTORE`) {
      kill();
      return;
    }
    let imageHEX = data.data.split(',');
    for (let i = 0; i < imageHEX.length; i++) {
      imageHEX[i] = Number(imageHEX[i]);
    }
    let ppm = new Uint8ClampedArray(13 + 32 * 16 * 3);
    ppm[0] = 80;
    ppm[1] = 54;
    ppm[2] = 10;
    ppm[3] = 51;
    ppm[4] = 50;
    ppm[5] = 32;
    ppm[6] = 49;
    ppm[7] = 54;
    ppm[8] = 10;
    ppm[9] = 50;
    ppm[10] = 53;
    ppm[11] = 53;
    ppm[12] = 10;
    let pos = 13;
    for (let i = 0; i < 32 * 16; i++) {
      ppm[pos++] = imageHEX[i] >> 16;
      ppm[pos++] = (imageHEX[i] >> 8) - ((imageHEX[i] >> 16) << 8);
      ppm[pos++] = imageHEX[i] - ((imageHEX[i] >> 8) << 8);
    }

    if (fs.existsSync("weather.ppm")) {
      fs.unlink("weather.ppm", (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    fs.writeFile('weather.ppm', ppm, err => {
      if (err) {
        console.error(err);
      } else {
        console.log(`PPM created succesfully`);
      }
    });

    kill();
    cmd = child_process.spawn(command, {detached: true, shell: true});
  }

  ws.onclose = () => {
    if (fs.existsSync("weather.ppm")) {
      fs.unlink("weather.ppm", (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
    kill();
  }
});

const host = `192.168.30.18`;
const port = 8000;

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
})