/*
 * FILE NAME   : render.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 08.06.2024
 * PURPOSE     : Main render module java script file.
 */

import * as pcsd from "./lib.js";

class _anim {
  constructor(canvas) {
    this.gl = canvas.getContext("webgl2");
    this.timer = new pcsd.timer();
    this.camera = pcsd.camera();

    this.camera.set(pcsd.vec3(4.5), pcsd.vec3(0, 1, 0), pcsd.vec3(0, 1, 0));

    this.camera.frameH = canvas.height;
    this.camera.frameW = canvas.width;
    this.camera.projSize = 0.1;
    this.camera.projDist = 0.1;
    this.camera.projFarClip = 1000;
    this.camera.setSize(this.camera.frameW, this.camera.frameH);
    this.shader = pcsd.shader("default");
  } // End of 'constructor' function

  initGL() {
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.clearColor(0.30, 0.47, 0.8, 1);
  } // End of 'initGL' function

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
  } // End of 'render' function
} // End of '_anim' function

export function anim(...args) {
  return new _anim(...args);
} // End of 'anim' function

/* END OF 'render.js' FILE */