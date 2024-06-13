/*
 * FILE NAME   : index.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 13.06.2024
 * PURPOSE     : Main chat index java script file.
 */

let socket = new WebSocket("ws://localhost:8000");

function clearChain() {
  let t = document.getElementById("chain");
  t.value = '';
} // End of 'clearChain' function

function sendMessage() {
  let msg_area = document.getElementById("message");
  let name_area = document.getElementById("name");
  let msg = msg_area.value;
  let name = name_area.value;
  let date = new Date();
  let dateStr = `[${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
  let str = dateStr + " " + name + ": " + msg + "\n";
  socket.send(str);
  msg_area.value = '';
  return false;
} // End of 'sendMessage' function

function getWSMessage() {
  socket.onmessage = (event) => {
    let message = event.data;
    const t = document.getElementById("chain");
    t.value += message;
    t.scrollTop = t.scrollHeight;
  }
} // End of 'getWSMessage' function

getWSMessage();

/* END OF 'index.js' FILE */