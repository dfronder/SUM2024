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

const command = `./led-image-viewer --led-rows=16 --led-gpio-mapping="classic-pi1" /home/dc6/Desktop/weatherReciever/weather.ppm --led-no-hardware-pulse --led-slowdown-gpio=5`;
let cmd = undefined;
let weaDis;

const app = express();
app.get('/', (req, res, next) => {
  next();
});

app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocketServer({server});

function printMsg(text, r, g, b, rep) {
  child_process.execSync(`./text-scroller -f --led-rows=16 --led-gpio-mapping="classic-pi1" 9x15.bdf --led-no-hardware-pulse --led-slowdown-gpio=5 "${text}" -C ${r},${g},${b} -l ${rep}`);
}

function spawn()  {
  if (cmd == undefined) {
    cmd = child_process.spawn(command, {detached: true, shell: true});
    weaDis = false;
  }
}

function kill() {
  if (cmd != undefined) {
    if (cmd.killed != true) {
      process.kill(-cmd.pid);
      cmd.kill();
      cmd = undefined;
      weaDis = true;
    }
  } 
}

wss.on("connection", (ws) => {
  ws.onerror = (error) => {
    printMsg("ERROR!", 255, 0, 0, 1);
    ws.send(`${error}`);
  }

  ws.onmessage = (data) => {
    if (data.data == `RESTORE`) {
      kill();
      weaDis = false;
      return;
    }
    let array = JSON.parse(data.data);
    if (array[0] == `MSG`) {
      kill();
      try {
        printMsg("MSG!", 255, 20, 147, 1);
        printMsg(array[1], array[2], array[3], array[4], 2);
      } catch(err) {
        console.log(`${err}`);
      }
      
      if (weaDis == true)
        spawn();
      return;
    }
    let imageHEX = array;
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
    spawn();
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
    printMsg("Client disconnected.", 255, 0, 0, 1);
  }
  printMsg("Client connected.", 0, 255, 0, 1);
});

const host = `192.168.30.18`;
const port = 8000;

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
  printMsg("RPI Server started.", 255, 255, 255, 1);
});