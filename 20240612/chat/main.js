/*
 * FILE NAME   : main.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 12.06.2024
 * PURPOSE     : Main chat server java script file.
 */

import http from "node:http";
import {WebSocketServer} from "ws";
import express from "express";

let connected = 0;

const clients = new Set();

const app = express();
app.get('/', (req, res, next) => {
  next();
});
app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocketServer({server});

wss.on("connection", (ws) => {
  clients.add(ws);
  connected = connected + 1;

  ws.on("message", (message) => {
    ws.send(`${message}`);
  })
  ws.onmessage = (msg) => {
    let m = msg.data;

    for (let cl of clients) {
      cl.send(m);
    }
  }

  ws.on('close', () => {
    clients.delete(ws);
  });

  ws.send("New client connected\n");
})

const host = `localhost`;
const port = 8000;

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
})

/* END OF 'main.js' FILE */