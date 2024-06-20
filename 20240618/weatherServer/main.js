/*
 * FILE NAME   : main.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 20.06.2024
 * PURPOSE     : Weather server server java script file.
 */

import http from "node:http";
import {WebSocketServer} from "ws";
import express from "express";
import favicon from "serve-favicon";

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
    let image = data.data;
    let ppm = image;
    ppm = JSON.stringify(ppm);

    ws.send(ppm);
  }
})

const host = `127.0.0.1`;
const port = 8000;

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
})

/* END OF 'main.js' FILE */