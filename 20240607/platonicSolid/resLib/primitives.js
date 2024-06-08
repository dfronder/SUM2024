/*
 * FILE NAME   : primitives.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 08.06.2024
 * PURPOSE     : OpenGL primitives java script library file.
 */

import {vec3} from "../mathLib/vec3.js";
import {mat4} from "../mathLib/mat4.js";

class _vertex {
  constructor() {
    this.p = new vec3();
    this.n = new vec3();
  } // End of 'constructor' function
} // End of '_vertex' class

export function vertex(...args) {
  return new _vertex(...args);
} // End of 'vertex' function

class _primitive {
  constructor(vert, type, noofv, ind, noofi) {
    this.va = 0
    this.vbuf = 0;
    this.ibuf = 0;
    window.gl.createVertexArray(1, this.va);
    
    if (vert != null && noofv != 0)
    {
      glBindVertexArray(this.va);
    
      this.vbuf = window.gl.createBuffer();
      window.gl.bindBuffer(window.gl.ARRAY_BUFFER, this.vbuf);
      window.gl.bufferData(window.gl.ARRAY_BUFFER, new Float32Array(vert), window.gl.STATIC_DRAW);
    
      window.gl.vertexAttribPointer(0, 3, window.gl.FLOAT, false, 6, 0);
      window.gl.vertexAttribPointer(1, 3, window.gl.FLOAT, false, 6, 3);
    
      window.gl.enableVertexAttribArray(0);
      window.gl.enableVertexAttribArray(1);
    }
    
    if (ind != null && noofi != 0) {
      this.ibuf = window.gl.createBuffer();
      window.gl.bindBuffer(window.gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
      window.gl.bufferData(window.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(ind), window.gl.STATIC_DRAW);
      this.numOfElements = noofi;
    } else {
      this.numOfElements = noofv;
    }
    
    this.type = type;
    this.trans = new mat4();
  } // End of 'constructor' function

  draw(world) {

  } // End of 'draw' function

  free() {
    if (this.va != 0) {
      window.gl.bindVertexArray(this.va);
      window.gl.bindBuffer(window.gl.ARRAY_BUFFER, 0);
      window.gl.deleteBuffer(1, this.va);
      window.gl.deleteVertexArray(1, this.va);
    }
    if (this.ibuf != 0) {
      window.gl.deleteBuffer(1, this.ibuf);
    }
  } // End of 'free' function
} // End of '_primitive' clas

export function primitive(...args) {
  return new _primitive(...args);
}  // End of 'primitive' function

/* END OF 'primitives.js' FILE */