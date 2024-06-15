/*
 * FILE NAME   : sdf.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 15.06.2024
 * PURPOSE     : SDF Marching parabolas algorithm javascript library file.
 */

import {vec2, transpose} from "./mth.js";
import {buildOrData, imgWidth, imgHeight} from "./main.js";

const INF = 9999999;
let sdfImgData = [];
let buildSdfData = [];
let max_dist = 0;

function intersectParabolas(p, q) {
  let x = ((q.y + q.x * q.x) - (p.y + p.x * p.x)) / (2 * q.x - 2 * p.x);
  return vec2(x, undefined);
} // End of 'intersectParabolas' function

function findHullParabolas(singleRow, hullVertices, hullIntersections) {
  let d = singleRow;
  let v = hullVertices;
  let z = hullIntersections;
  let k = 0;
  v[0].x = 0;
  z[0].x = -INF;
  z[1].x = INF;
  for (let i = 0; i < d.length - 2; i++) {
    let q = vec2(i, d[i]);
    let p = v[k];
    let s = intersectParabolas(p, q);
    while (s.x <= z[k].x) {
      k = k - 1;
      p = v[k];
      s = intersectParabolas(p, q);
    }
    k = k + 1;
    v[k] = q;
    z[k].x = s.x;
    if (i == d.length - 1)
      return;
    z[k + 1].x = INF;
  }
} // End of 'findHullParabolas' function

function marchParabolas(singleRow, hullVertices, hullIntersections) {
  let d = singleRow;
  let v = hullVertices;
  let z = hullIntersections;
  let k = 0;
  for (let q = 0; q < d.length - 1; q++) {
    while (z[k + 1].x < q)
      k = k + 1;
    let dx = q - v[k].x;
    d[q] = dx * dx + v[k].y;
  }
} // End of 'marchParabolas' function

function horizontalPass(singleRow) {
  let hullVertices = [singleRow.length];
  let hullIntersections = [singleRow.length];
  for (let i = 0; i < singleRow.length; i++) {
    hullVertices[i] = vec2();
    hullIntersections[i] = vec2();
  }
  findHullParabolas(singleRow, hullVertices, hullIntersections);
  marchParabolas(singleRow, hullVertices, hullIntersections);
} // End of 'horizontalPass' function

export function buildSDF() {
  buildSdfData = [imgHeight];
  for (let i = 0; i < imgHeight; i++) {
    buildSdfData[i] = new Array(imgWidth);
  }
  for (let i = 0; i < imgHeight; i++) {
    for (let j = 0; j < imgWidth; j++) {
      buildSdfData[i][j] = INF;
    }
  }
  for (let i = 0; i < imgHeight; i++) {
    for (let j = 0; j < imgWidth; j++) {
      if (buildOrData[imgHeight * i + j] == 0) {
        buildSdfData[i][j] = 0;
      } else {
        buildSdfData[i][j] = INF;
      }  
    }
  }

  for (let row = 0; row < imgHeight; row++)
    horizontalPass(buildSdfData[row]);

  buildSdfData = transpose(buildSdfData, imgWidth, imgHeight);

  for (let row = 0; row < imgHeight; row++)
    horizontalPass(buildSdfData[row]);

  buildSdfData = transpose(buildSdfData, imgWidth, imgHeight);

  for (let i = 0; i < imgHeight; i++) {
    for (let j = 0; j < imgWidth; j++) {
      buildSdfData[i][j] = Math.round(Math.sqrt(buildSdfData[i][j]));
      if (buildSdfData[i][j] > max_dist)
        max_dist = buildSdfData[i][j];
    }  
  }
} // End of 'buildSDF' function

export function drawSDF() {
  for (let i = 0; i < imgHeight; i++) {
    for (let j = 0; j < imgWidth; j++) {
      buildSdfData[i][j] /= max_dist;
    }
  }  
  sdfImgData = new Uint8ClampedArray(imgWidth * imgHeight * 4);

  for (let y = 0; y < imgHeight; y++) {
    for (let x = 0; x < imgWidth; x++) {
        let pos = (y * imgWidth + x) * 4;
        sdfImgData[pos] = buildSdfData[y][x] * 20000;
        sdfImgData[pos + 1] = buildSdfData[y][x] * 20000;
        sdfImgData[pos + 2] = buildSdfData[y][x] * 20000;
        sdfImgData[pos + 3] = 255;
    }

  let canvas = document.getElementById('sdfCan');
  let context = canvas.getContext('2d');
  let idata = context.createImageData(imgWidth, imgHeight);
  idata.data.set(sdfImgData);
  context.putImageData(idata, 0, 0);
}} // End of 'drawSDF' function

/* END OF 'sdf.js' FILE */