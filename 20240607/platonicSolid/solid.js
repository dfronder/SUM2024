/*
 * FILE NAME   : solid.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 11.06.2024
 * PURPOSE     : Platonic solid javascript library.
 */

import {vec3} from "./mathLib/vec3.js";
import {vertex} from "./lib.js";

export function tetrahedron(rnd) {
  const sqrt3 = Math.sqrt(3);
  const sqrt6 = Math.sqrt(6);
  const vert = [vertex(0, 0, -sqrt3 / 3), vertex(sqrt6 / 6, 0, sqrt3 / 6), vertex(-sqrt6 / 6, 0, sqrt3 / 6), vertex(0, sqrt6 / 3, 0)];
  const ind = [
    0, 1, 2, 0, 3, 2, 2, 3, 1, 1, 3, 0
  ];
  const vertexes = [];
  for (let i of ind) {
    let vrtx = vertex(vert[i].p);
    vrtx.n = vec3(vert[i].n); 
    vertexes.push(vrtx);
  }

  return rnd.primCreate(rnd.gl.TRIANGLES, vertexes, vertexes.length, ind, ind.length);
} // End of 'tetrahedron' function

export function cube(rnd) {
  const vert =  [vertex(-0.5), vertex(0.5, -0.5, -0.5), vertex(-0.5, 0.5, -0.5), 
                 vertex(-0.5, -0.5, 0.5), vertex(0.5, 0.5, -0.5), 
                vertex(0.5, -0.5, 0.5), vertex(-0.5, 0.5, 0.5), vertex(0.5)];
  const ind = [0, 1, 2, 
               1, 2, 4, 
               1, 4, 7, 
               1, 7, 5, 
               7, 5, 3, 
               7, 3, 6,
               0, 1, 3,
               3, 1, 5,
               6, 3, 0,
               6, 0, 2,
               2, 6, 7,
               2, 7, 4];
  const vertexes = [];
  for (let i of ind) {
    let vrtx = vertex(vert[i].p);
    vrtx.n = vec3(vert[i].n); 
    vertexes.push(vrtx);
  }

  return rnd.primCreate(rnd.gl.TRIANGLES, vertexes, vertexes.length, ind, ind.length);
} // End of 'cube' function

export function octahedron(rnd) {
  const sqrt2 = Math.sqrt(2) / 2;
  const vert = [vertex(sqrt2, 0, 0), vertex(-sqrt2, 0, 0),
                vertex(0, 0, sqrt2), vertex(0, 0, -sqrt2), 
                vertex(0, sqrt2, 0), vertex(0, -sqrt2, 0)];
  const ind = [0, 3, 4, 0, 2, 4, 2, 4, 1, 1, 3, 4,
               1, 3, 5, 3, 5, 0, 0, 5, 2, 2, 5, 1];
  const vertexes = [];
  for (let i of ind) {
    let vrtx = vertex(vert[i].p);
    vrtx.n = vec3(vert[i].n); 
    vertexes.push(vrtx);
  }

  return rnd.primCreate(rnd.gl.TRIANGLES, vertexes, vertexes.length, ind, ind.length);
} // End of 'octahedron' function

export function dodecahedron(rnd) {
  const icovert = [];
  let angle = 0;
  for (let i = 0; i < 5; i++) {
    icovert.push(vec3(Math.cos(angle), -0.5, Math.sin(angle)));
    angle += 2 * Math.PI / 5;
  }
  angle = Math.PI;
  for (let i = 0; i < 5; i++) {
    icovert.push(vec3(Math.cos(angle), 0.5, Math.sin(angle)));
    angle += 2 * Math.PI / 5;
  }
  icovert.push(vec3(0, Math.sqrt(5) / 2, 0));
  icovert.push(vec3(0, -Math.sqrt(5) / 2, 0));
  const icoind = [8, 7, 0, 0, 4, 7, 7, 6, 4, 4, 3, 6, 6, 5, 
                  3, 3, 2, 5, 5, 9, 2, 2, 1, 9, 9, 8, 1, 1, 0, 8,
                  5, 6, 10, 6, 7, 10, 7, 8, 10, 8, 9, 10, 9, 5, 10,
                  0, 1, 11, 1, 2, 11, 2, 3, 11, 3, 4, 11, 4, 0, 11];
  const icovertexes = [];
  for (let i of icoind) 
    icovertexes.push(vec3(icovert[i]));
  const vert = [];
  for (let i = 0; i < icoind.length; i += 3)
    vert.push(vertex(icovertexes[i].add(icovertexes[i + 1]).add(icovertexes[i + 2]).div(3)));
  const ind = [0, 1, 2, 0, 2, 11, 0, 11, 12,
               11, 2, 3, 11, 3, 4, 11, 4, 10,
               10, 4, 5, 10, 5, 6, 10, 6, 14, 
               14, 6, 7, 14, 7, 8, 14, 8, 13,
               13, 8, 9, 13, 9, 0, 13, 0, 12,
               2, 1, 3, 1, 3, 19, 1, 15, 19,
               3, 19, 18, 3, 18, 5, 3, 5, 4,
               5, 18, 17, 5, 6, 17, 6, 17, 7,
               7, 17, 16, 7, 16, 8, 16, 8, 9,
               9, 16, 15, 9, 15, 1, 9, 1, 0,
               10, 11, 14, 11, 14, 13, 11, 13, 12,
               17, 18, 19, 17, 19, 15, 17, 15, 16];
  const vertexes = [];
  for (let i of ind) {
    let vrtx = vertex(vert[i].point);
    vrtx.normal = vec3(vert[i].normal); 
    vertexes.push(vrtx);
  }

  return rnd.primCreate(rnd.gl.TRIANGLES, vertexes, vertexes.length, ind, ind.length);
} // End of 'dodecahedron' function

export function icosahedron(rnd) {
  const vert = [];
  let angle = 0;
  for (let i = 0; i < 5; i++) {
    vert.push(vertex(Math.cos(angle), -0.5, Math.sin(angle)));
    angle += 2 * Math.PI / 5;
  }
  angle = Math.PI;
  for (let i = 0; i < 5; i++) {
    vert.push(vertex(Math.cos(angle), 0.5, Math.sin(angle)));
    angle += 2 * Math.PI / 5;
  }
  vert.push(vertex(0, Math.sqrt(5) / 2, 0));
  vert.push(vertex(0, -Math.sqrt(5) / 2, 0));
  const ind = [8, 7, 0, 0, 4, 7, 7, 6, 4, 4, 3, 6, 6, 5, 
    3, 3, 2, 5, 5, 9, 2, 2, 1, 9, 9, 8, 1, 1, 0, 8,
    5, 6, 10, 6, 7, 10, 7, 8, 10, 8, 9, 10, 9, 5, 10,
    0, 1, 11, 1, 2, 11, 2, 3, 11, 3, 4, 11, 4, 0, 11];
  const vertexes = [];
  for (let i of ind) {
    let vrtx = vertex(vert[i].p);
    vrtx.n = vec3(vert[i].n); 
    vertexes.push(vrtx);
  }

  return rnd.primCreate(rnd.gl.TRIANGLES, vertexes, vertexes.length, ind, ind.length);
} // End of 'icosahedron' function

/* END OF 'solid.js' FILE */