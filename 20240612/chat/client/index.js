/*
 * FILE NAME   : index.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 12.06.2024
 * PURPOSE     : Main chat index java script file.
 */

let socket = new WebSocket("ws://localhost:8000");

function clearChain() {
  let t = document.getElementById("chain");
  t.value = '';
}

function sendMessage() {
  let msg_area = document.getElementById("message");
  let name_area = document.getElementById("name");
  let msg = msg_area.value;
  let name = name_area.value;
  let date = new Date();
  let dateStr = `[${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
  let str = dateStr + " " + name + ": " + msg + "\n";
  socket.send(str);
  return false;
}

function getWSMessage() {
  socket.onmessage = (event) => {
    let message = event.data;
    const t = document.getElementById("chain");
    t.value += message;
    t.scrollTop = t.scrollHeight;
  }
}

getWSMessage();

/* END OF 'index.js' FILE */