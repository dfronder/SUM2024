/*
 * FILE NAME   : main.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 18.06.2024
 * PURPOSE     : Weather server server java script file.
 */

/*
import http from "node:http";
import {WebSocketServer} from "ws";
import express from "express";

const app = express();
app.get('/', (req, res, next) => {
  next();
});
app.use(express.static("client"));

const server = http.createServer(app);

const wss = new WebSocketServer({server});

function addClient(ws, wss, WebSocket) {
  ws.userid = max_connected;
  max_connected += 1;
  clients.push(ws)

  console.log("Client Connect: " + ws.userid + ". " + clients.length + " Online")

  ws.onmessage = (msg) => {
    let m = msg.data;

    for (let cl of clients) {
      cl.send(m);
    }
  }

  ws.on('close', () =>  {
    removeClient(ws);
  });
}

wss.on("connection", (ws) => {
  addClient(ws, wss);
})

const host = `localhost`;
const port = 8000;

server.listen(port, host, () => {
  console.log(`Server started on http://${host}:${port}`);
})
*/

/* END OF 'main.js' FILE */