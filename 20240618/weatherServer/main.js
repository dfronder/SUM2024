import http from "node:http";
import {WebSocketServer} from "ws";
import express from "express";
import favicon from "serve-favicon";
import fs from "node:fs";

const app = express();
app.get('/', (req, res, next) => {
  next();
});
app.use(favicon('favicon.ico'));
app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocketServer({server});

wss.on("connection", (ws) => {

  ws.onmessage = (data) => {
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

    fs.writeFile('example.ppm', ppm, { flag: 'a' }, err => {
      if (err) {
        console.error(err);
      } else {
        console.log(`PPM created succesfully`);
      }
    });
  }
});

const host = `127.0.0.1`;
const port = 8000;

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
})