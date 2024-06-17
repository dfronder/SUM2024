/*
 * FILE NAME   : main.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 17.06.2024
 * PURPOSE     : SDF Image main javascript file.
 */

let img = new Image();
let imgData = [];
export let buildOrData = [];
export let imgWidth = 0;
export let imgHeight = 0;

import {buildSDF, drawSDF} from "./sdf.js";

function loadOriginal() {
  img.src = 'images/sprite.png';
} // End of 'loadOriginal' function

setTimeout(() => {
  // Original canvas
  let textOriginal = document.getElementById("originalText");
  let canvOr = document.createElement("canvas");
  canvOr.width = img.width;
  canvOr.height = img.height;
  canvOr.setAttribute("id", "originalCan");
  textOriginal.insertAdjacentElement("afterend", canvOr);

  // SDF canvas
  let textSDF = document.getElementById("sdfText")
  let canvSDF = document.createElement("canvas");
  canvSDF.width = img.width;
  canvSDF.height = img.height;
  canvSDF.setAttribute("id", "sdfCan");
  textSDF.insertAdjacentElement("afterend", canvSDF);

  // Get image size
  imgWidth = img.width;
  imgHeight = img.height;

  // Draw original
  let context = canvOr.getContext('2d');
  context.drawImage(img, 0, 0, canvOr.width, canvOr.height);

  // Get image data
  imgData = context.getImageData(0, 0, canvOr.width, canvOr.height).data;

  // Convert data
  for (let i = 0; i < imgData.length; i += 4)
    buildOrData.push(imgData[i] /= 255);
}, 10)

loadOriginal();
setTimeout(() => {
  buildSDF();
  drawSDF();
}, 50);

/* END OF 'main.js' FILE */