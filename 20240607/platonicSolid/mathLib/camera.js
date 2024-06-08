/*
 * FILE NAME   : camera.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 08.06.2024
 * PURPOSE     : Camera java script library file.
 */

import {vec3} from "./vec3.js";
import {mat4} from "./mat4.js";

class _camera {
  constructor() {
    this.loc = new vec3();
    this.at = new vec3();
    this.dir = new vec3();
    this.right = new vec3();
    this.up = new vec3();
    this.matView = new mat4();
    this.matProj = new mat4();
    this.matVP = new mat4();
    this.frameW = 0;
    this.frameH = 0;
    this.wp = 0;
    this.hp = 0;
    this.projSize = 0;
    this.projDist = 0;
    this.projFarClip = 0;
  } // End of 'constructor' function

  set(loc, at, up) {
    this.matView.view(loc, at, up);

    this.right = vec3(this.matView.m[0][0],
                      this.matView.m[1][0],
                      this.matView.m[2][0]);
    this.up = vec3(this.matView.m[0][1],
                   this.matView.m[1][1],
                   this.matView.m[2][1]);
    this.dir = vec3(-this.matView.m[0][2],
                    -this.matView.m[1][2],
                    -this.matView.m[2][2]);
    this.loc = loc;
    this.at = at;
  
    this.matVP = this.matView.mul(this.matProj);
  } // End of 'set' function
  
  setProj(projSize, projDist, projFarClip) {
    let rx, ry;

    this.projDist = projDist;
    this.projFarClip = projFarClip;
    rx = ry = this.projSize = projSize;
  
    if (this.frameW >= this.frameH)
      rx *= this.frameW / this.frameH;
    else
      ry *= this.frameH / this.frameW;
  
    this.wp = rx;
    this.wp = ry;
    this.matProj.frustum(-rx / 2, rx / 2, -ry / 2, ry / 2, this.projDist, this.projFarClip);
    this.matVP.mul(this.matView, this.matProj);
  } // End of 'setProj' function

  setSize(frameW, frameH) {
    this.frameW = frameW;
    this.frameH = frameH;
    this.setProj(this.projSize, this.projDist, this.projFarClip);
  } // End of 'setSize' function
} // End of '_camera' class

export function camera(...args) {
  return new _camera(...args);
}  // End of 'camera' function

/* END OF 'camera.js' FILE */