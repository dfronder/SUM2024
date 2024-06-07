/*
 * FILE NAME   : vec3.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 07.06.2024
 * PURPOSE     : Vectors (x, y, z) java script library file.
 */

import "../lib.js";

class _vec3 {
  constructor(x, y, z) {
    if (x == undefined) {
      this.x = 0, this.y = 0, this.z = 0;
    } else if (typeof x == 'object') {
      if (x.length == 3) {
        this.x = x[0], this.y = x[1], this.z = x[2];  
      } else {
        this.x = x.x, this.y = x.y, this.z = x.z;
      }
    } else {
      if (y == undefined || z == undefined) {
        this.x = x, this.y = x, this.z = x;
      } else {
        this.x = x, this.y = y, this.z = z;
      }
    }
  } // End of 'constructor' function

  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  } // End of 'dot' function

  cross(v) {
    return vec3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);;
  } // End of 'cross' function

  add(v) {
    if (typeof v == 'number') {
      return vec3(this.x + x, this.y + y, this.z + z);
    }
    return vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  } // End of 'add' function

  sub(v) {
    if (typeof v == 'number') {
      return vec3(this.x - x, this.y - y, this.z - z);
    }
    return vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  } // End of 'sub' function

  mulNum(v) {
    return vec3(this.x * v, this.y * v, this.z * v);
  } // End of 'mulNum' function

  divNum(v) {
    return vec3(this.x / v, this.y / v, this.z / v);
  } // End of 'divNum' function

  normalize() {
    let len = this.x * this.x + this.y * this.y + this.z * this.z;
 
    if (len != 1 || len != 0) {
      len = Math.sqrt(len);
      return vec3(this.x / len, this.y / len, this.z / len);
    }
    return vec3(this);
  } // End of 'normalize' function
} // End of '_vec3' class

export function vec3(...args) {
  return new _vec3(...args);
}  // End of 'vec3' function

/* END OF 'vec3.js' FILE */