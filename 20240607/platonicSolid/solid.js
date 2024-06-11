/*
 * FILE NAME   : solid.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 11.06.2024
 * PURPOSE     : Platonic solid javascript library.
 */

import {vec3, getN} from "./mathLib/vec3.js";
import {vertex} from "./lib.js";

///////////
// Classes
///////////

class _tetrahedron {
  constructor(rnd) {

  } // End of 'constructor' function
} // End of '_tetrahedron' class

class _cube {
  constructor(rnd) {

  } // End of 'constructor' function
} // End of '_cube' class

class _octahedron {
  constructor(rnd) {

  } // End of 'constructor' function
} // End of '_octahedron' class

class _dodecahedron {
  constructor(rnd) {

  } // End of 'constructor' function
} // End of '_dodecahedron' class

class _icosahedron {
  constructor(rnd) {

  } // End of 'constructor' function
} // End of '_icosahedron' class

/////////////
// Functions
/////////////

export function tetrahedron(...args) {
  return new _tetrahedron(...args);
} // End of 'tetrahedron' function

export function cube(...args) {
  return new _cube(...args);
} // End of 'cube' function

export function octahedron(...args) {
  return new _octahedron(...args);
} // End of 'octahedron' function

export function dodecahedron(...args) {
  return new _dodecahedron(...args);
} // End of 'dodecahedron' function

export function icosahedron(...args) {
  return new _icosahedron(...args);
} // End of 'icosahedron' function

/* END OF 'solid.js' FILE */