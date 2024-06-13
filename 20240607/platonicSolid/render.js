/*
 * FILE NAME   : render.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 13.06.2024
 * PURPOSE     : Main render module java script file.
 */

import * as dc from "./lib.js";

class _anim {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl2");
    this.initGL();
    this.timer = new dc.timer();
    this.camera = dc.camera();

    this.camera.set(dc.vec3(0, 0, 4), dc.vec3(0), dc.vec3(0, 1, 0));

    this.camera.frameH = canvas.height;
    this.camera.frameW = canvas.width;
    this.camera.projSize = 0.1;
    this.camera.projSize = 0.1;
    this.camera.projFarClip = 1000;
    this.camera.setProj(this.camera.projSize, this.camera.projSize, this.camera.projFarClip);
  } // End of 'constructor' function

  initGL() {
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.clearColor(0.30, 0.47, 0.8, 1);
  } // End of 'initGL' function

  render() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.camera.setProj(this.camera.projDist, this.camera.projSize, this.camera.projFarClip);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.clearDepth(1.0);
  } // End of 'render' function

  primCreate(...args) {
    return dc.primitive(this, ...args);
  } // End of 'primCreate' function

  shaderCreate(...args) {
    return dc.shader(this, ...args);
  } // End of 'shaderCreate' function

  primCreateTetrahedron() {
    return new dc.tetrahedron(this);
  } // End of 'primCreateTetrahedron' function

  primCreateCube() {
    return new dc.cube(this);
  } // End of 'primCreateTetrahedron' function

  primCreateOctahedron() {
    return new dc.octahedron(this);
  } // End of 'primCreateTetrahedron' function
  
  primCreateDodecahedron() {
    return new dc.dodecahedron(this);
  } // End of 'primCreateTetrahedron' function
  
  primCreateIcosahedron() {
    return new dc.icosahedron(this);
  } // End of 'primCreateTetrahedron' function
} // End of '_anim' function

export function anim(...args) {
  return new _anim(...args);
} // End of 'anim' function

/* END OF 'render.js' FILE */