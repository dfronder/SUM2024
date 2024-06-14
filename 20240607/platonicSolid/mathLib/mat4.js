/*
 * FILE NAME   : mat4.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 14.06.2024
 * PURPOSE     : Matrices (4x4) java script library file.
 */

import {vec3} from "./vec3.js";

class _mat4 {
  constructor(m) {
    if (m == null) {
      this.m = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    } else {
      this.m = m.m;
    }
  } // End of 'constructor' function

  ortho(left, right, bottom, top, near, far) {
    this.m = [[2 / (right - left), 0, 0, 0], 
              [0, 2 / (top - bottom), 0, 0],
              [0, 0, -2 / (far - near), 0],
              [-(right + left) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1]];
    return this;
  } // End of 'ortho' function

  frustum(left, right, bottom, top, near, far) {
    this.m = [[(2 * near) / (right - left), 0, 0, 0], 
              [0, (2 * near) / (top - bottom), 0, 0],
              [(right + left) / (right - left), (top + bottom) / (top - bottom), -(far + near) / (far - near), -1],
              [0, 0, -(2 * near * far) / (far - near), 0]];
    return this;
  } // End of 'frustum' function

  view(loc, at, up1) {
    let dir = vec3();
    let right = vec3();
    let up = vec3();
    let asl = at.sub(loc);
    dir = asl.normalize();
    let dcu1 = dir.cross(up1);
    right = dcu1.normalize();
    let rcd = right.cross(dir);
    up = rcd.normalize();
    this.m = [[right.x, up.x, -dir.x, 0],
              [right.y, up.y, -dir.y, 0],
              [right.z, up.z, -dir.z, 0],
              [-loc.dot(right), -loc.dot(up), loc.dot(dir), 1]];
    return this;
  } // End of 'view' function

  mul(m) {
    let newMatr = new mat4();
    
    newMatr.m[0][0] = this.m[0][0] * m.m[0][0] + this.m[0][1] * m.m[1][0] + this.m[0][2] * m.m[2][0] + this.m[0][3] * m.m[3][0];
    newMatr.m[0][1] = this.m[0][0] * m.m[0][1] + this.m[0][1] * m.m[1][1] + this.m[0][2] * m.m[2][1] + this.m[0][3] * m.m[3][1];
    newMatr.m[0][2] = this.m[0][0] * m.m[0][2] + this.m[0][1] * m.m[1][2] + this.m[0][2] * m.m[2][2] + this.m[0][3] * m.m[3][2];
    newMatr.m[0][3] = this.m[0][0] * m.m[0][3] + this.m[0][1] * m.m[1][3] + this.m[0][2] * m.m[2][3] + this.m[0][3] * m.m[3][3];
    newMatr.m[1][0] = this.m[1][0] * m.m[0][0] + this.m[1][1] * m.m[1][0] + this.m[1][2] * m.m[2][0] + this.m[1][3] * m.m[3][0];
    newMatr.m[1][1] = this.m[1][0] * m.m[0][1] + this.m[1][1] * m.m[1][1] + this.m[1][2] * m.m[2][1] + this.m[1][3] * m.m[3][1];
    newMatr.m[1][2] = this.m[1][0] * m.m[0][2] + this.m[1][1] * m.m[1][2] + this.m[1][2] * m.m[2][2] + this.m[1][3] * m.m[3][2];
    newMatr.m[1][3] = this.m[1][0] * m.m[0][3] + this.m[1][1] * m.m[1][3] + this.m[1][2] * m.m[2][3] + this.m[1][3] * m.m[3][3];
    newMatr.m[2][0] = this.m[2][0] * m.m[0][0] + this.m[2][1] * m.m[1][0] + this.m[2][2] * m.m[2][0] + this.m[2][3] * m.m[3][0];
    newMatr.m[2][1] = this.m[2][0] * m.m[0][1] + this.m[2][1] * m.m[1][1] + this.m[2][2] * m.m[2][1] + this.m[2][3] * m.m[3][1];
    newMatr.m[2][2] = this.m[2][0] * m.m[0][2] + this.m[2][1] * m.m[1][2] + this.m[2][2] * m.m[2][2] + this.m[2][3] * m.m[3][2];
    newMatr.m[2][3] = this.m[2][0] * m.m[0][3] + this.m[2][1] * m.m[1][3] + this.m[2][2] * m.m[2][3] + this.m[2][3] * m.m[3][3];
    newMatr.m[3][0] = this.m[3][0] * m.m[0][0] + this.m[3][1] * m.m[1][0] + this.m[3][2] * m.m[2][0] + this.m[3][3] * m.m[3][0];
    newMatr.m[3][1] = this.m[3][0] * m.m[0][1] + this.m[3][1] * m.m[1][1] + this.m[3][2] * m.m[2][1] + this.m[3][3] * m.m[3][1];
    newMatr.m[3][2] = this.m[3][0] * m.m[0][2] + this.m[3][1] * m.m[1][2] + this.m[3][2] * m.m[2][2] + this.m[3][3] * m.m[3][2];
    newMatr.m[3][3] = this.m[3][0] * m.m[0][3] + this.m[3][1] * m.m[1][3] + this.m[3][2] * m.m[2][3] + this.m[3][3] * m.m[3][3];

    return newMatr;
  } // End of 'mul' function

  transpose() {
    this.m = [[this.m[0][0], this.m[1][0], this.m[2][0], this.m[3][0]],
              [this.m[0][1], this.m[1][1], this.m[2][1], this.m[3][1]],
              [this.m[0][2], this.m[1][2], this.m[2][2], this.m[3][2]],
              [this.m[0][3], this.m[1][3], this.m[2][3], this.m[3][3]]];
    return this;
  } // End of 'transpose' function

  translate(t) {
    if (typeof t == 'object') {
      this.m = [[1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [t.x, t.y, t.z, 1]];
    }
    return this;
  } // End of 'translate' function

  scale(s) {
    if (typeof s == 'object') {
      this.m = [[s.x, 0, 0, 0],
                [0, s.y, 0, 0],
                [0, 0, s.z, 0],
                [0, 0, 0, 1]];
    }
    return this;
  } // End of 'scale' function

  rotateX(a) {
    if (typeof a == 'number') {
      let A = a * (Math.PI / 180.0);
      this.m = [[Math.cos(A), Math.sin(A), 0, 0],
                [-Math.sin(A), Math.cos(A), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]];
    }
    return this;
  } // End of 'rotateX' function

  rotateY(a) {
    if (typeof a == 'number') {
      let A = a * (Math.PI / 180.0);
      this.m = [[1, 0, 0, 0],
                [0, Math.cos(A), Math.sin(A), 0],
                [0, -Math.sin(A), Math.cos(A), 0],
                [0, 0, 0, 1]];
    }
    return this;
  } // End of 'rotateY' function

  rotateZ(a) {
    if (typeof a == 'number') {
      let A = a * (Math.PI / 180.0);
      this.m = [[Math.cos(A), 0, -Math.sin(A), 0],
                [0, 1, 0, 0],
                [Math.sin(A), 0, Math.cos(A), 0],
                [0, 0, 0, 1]];
     }
    return this;
  } // End of 'rotateZ' function

  rotate(a, v) {
    if (typeof v == 'object' && typeof a == 'number') {
      let A = a * (Math.PI / 180.0);
      let si = Math.sin(A), co = Math.cos(A);
      let V1 = v.normalize();

      this.m = [[co + V1.x * V1.x * (1 - co), V1.x * V1.y * (1 - co) + V1.z * si, V1.x * V1.z * (1 - co) - V1.y * si, 0],
                [V1.y * V1.x * (1 - co) - V1.z * si, co + V1.y * V1.y * (1 - co), V1.y * V1.z * (1 - co) + V1.y * si, 0],
                [V1.z * V1.x * (1 - co) + V1.y * si, V1.z * V1.y * (1 - co) - V1.x * si, co + V1.z * V1.z * (1 - co), 0],
                [0, 0, 0, 1]];
    }
    return this;
  } // End of 'scale' function

  toArray() {
    return [].concat(...this.m);
  } // End of 'toArray' function

  determ3x3(a11, a12, a13, a21, a22, a23, a31, a32, a33) {
    return a11 * a22 * a33 + a12 * a23 * a31 + a13 * a21 * a32 -
      a11 * a23 * a32 - a12 * a21 * a33 - a13 * a22 * a31;
  } // End of 'determ3x3' funtion

  determ() {
    return +this.m[0][0] * this.determ3x3(this.m[1][1], this.m[1][2], this.m[1][3],
                                          this.m[2][1], this.m[2][2], this.m[2][3],
                                          this.m[3][1], this.m[3][2], this.m[3][3]) +
           -this.m[0][1] * this.determ3x3(this.m[1][0], this.m[1][2], this.m[1][3],
                                          this.m[2][0], this.m[2][2], this.m[2][3],
                                          this.m[3][0], this.m[3][2], this.m[3][3]) +
           +this.m[0][2] * this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][3],
                                          this.m[2][0], this.m[2][1], this.m[2][3],
                                          this.m[3][0], this.m[3][1], this.m[3][3]) +
           -this.m[0][3] * this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][2],
                                          this.m[2][0], this.m[2][1], this.m[2][2],
                                          this.m[3][0], this.m[3][1], this.m[3][2]);
  } // End of 'determ' function

  inverse() {
    let det = this.determ();
    let r = new mat4();
  
    if (det == 0)
      return this;
  
    r.m[0][0] =
      +this.determ3x3(this.m[1][1], this.m[1][2], this.m[1][3],
                      this.m[2][1], this.m[2][2], this.m[2][3],
                      this.m[3][1], this.m[3][2], this.m[3][3]) / det;
  
    r.m[1][0] =
      -this.determ3x3(this.m[1][0], this.m[1][2], this.m[1][3],
                      this.m[2][0], this.m[2][2], this.m[2][3],
                      this.m[3][0], this.m[3][2], this.m[3][3]) / det;
  
    r.m[2][0] =
      +this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][3],
                      this.m[2][0], this.m[2][1], this.m[2][3],
                      this.m[3][0], this.m[3][1], this.m[3][3]) / det;
  
    r.m[3][0] =
      -this.determ3x3(this.m[1][0], this.m[1][1], this.m[1][2],
                      this.m[2][0], this.m[2][1], this.m[2][2],
                      this.m[3][0], this.m[3][1], this.m[3][2]) / det;
  
    r.m[0][1] =
      -this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                      this.m[2][1], this.m[2][2], this.m[2][3],
                      this.m[3][1], this.m[3][2], this.m[3][3]) / det;
  
    r.m[1][1] =
      +this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                      this.m[2][0], this.m[2][2], this.m[2][3],
                      this.m[3][0], this.m[3][2], this.m[3][3]) / det;
  
    r.m[2][1] =
      -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                      this.m[2][0], this.m[2][1], this.m[2][3],
                      this.m[3][0], this.m[3][1], this.m[3][3]) / det;
  
    r.m[3][1] =
      +this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                      this.m[2][0], this.m[2][1], this.m[2][2],
                      this.m[3][0], this.m[3][1], this.m[3][2]) / det;
  
  
    r.m[0][2] =
      +this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                      this.m[1][1], this.m[1][2], this.m[1][3],
                      this.m[3][1], this.m[3][2], this.m[3][3]) / det;
  
    r.m[1][2] =
      -this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                      this.m[1][0], this.m[1][2], this.m[1][3],
                      this.m[3][0], this.m[3][2], this.m[3][3]) / det;
  
    r.m[2][2] =
      +this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                      this.m[1][0], this.m[1][1], this.m[1][3],
                      this.m[3][0], this.m[3][1], this.m[3][3]) / det;
  
    r.m[3][2] =
      -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                      this.m[1][0], this.m[1][1], this.m[1][2],
                      this.m[3][0], this.m[3][1], this.m[3][2]) / det;
  
  
    r.m[0][3] =
      -this.determ3x3(this.m[0][1], this.m[0][2], this.m[0][3],
                      this.m[1][1], this.m[1][2], this.m[1][3],
                      this.m[2][1], this.m[2][2], this.m[2][3]) / det;
  
    r.m[1][3] =
      +this.determ3x3(this.m[0][0], this.m[0][2], this.m[0][3],
                      this.m[1][0], this.m[1][2], this.m[1][3],
                      this.m[2][0], this.m[2][2], this.m[2][3]) / det;
  
    r.m[2][3] =
      -this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][3],
                      this.m[1][0], this.m[1][1], this.m[1][3],
                      this.m[2][0], this.m[2][1], this.m[2][3]) / det;
  
    r.m[3][3] =
      +this.determ3x3(this.m[0][0], this.m[0][1], this.m[0][2],
                      this.m[1][0], this.m[1][1], this.m[1][2],
                      this.m[2][0], this.m[2][1], this.m[2][2]) / det;
  
    return r;
  } // End of 'inverse' function
} // End of '_mat4' class

export function mat4(...args) {
  return new _mat4(...args);
} // End of 'mat4' function

/* END OF 'mat4.js' FILE */