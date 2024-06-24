/*
  FILE NAME   : main.js
  PROGRAMMER  : DC6
  LAST UPDATE : 24.06.2024
  PURPOSE     : Final project main (server-side) javascript file.
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
  
  ws.onclose = () => {
    ws.send();
  }

  ws.onerror = () => {
    ws.send();
  }
});

const host = `192.168.30.20`;
const port = 8000;

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
})