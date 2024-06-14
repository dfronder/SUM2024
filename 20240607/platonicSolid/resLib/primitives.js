/*
 * FILE NAME   : primitives.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 14.06.2024
 * PURPOSE     : OpenGL primitives and vertices java script library file.
 */

import {vec3, mat4} from "../lib.js";

class _vertex {
  constructor(pos, norm) {
    this.pos = pos;
    this.norm = norm;
  }
} // end of '_vertex' class

export function vertex(...args) {
  return new _vertex(...args);
} // end of 'vertex' function

class _primitive {
  constructor(rnd, type, vert, ind) {
    this.rnd = rnd;
    let vert_array = [];
    let i = 0;

    if (ind != null)
      this.autoNormals(vert, ind);

    for (let v of vert) {
      vert_array[i++] = v.pos.x;
      vert_array[i++] = v.pos.y;
      vert_array[i++] = v.pos.z;
      vert_array[i++] = v.norm.x;
      vert_array[i++] = v.norm.y;
      vert_array[i++] = v.norm.z;
    }
    
    this.va = this.rnd.gl.createVertexArray();

    this.rnd.gl.bindVertexArray(this.va);
    this.vbuf = this.rnd.gl.createBuffer();

    this.rnd.gl.bindBuffer(this.rnd.gl.ARRAY_BUFFER, this.vbuf);
    this.rnd.gl.bufferData(this.rnd.gl.ARRAY_BUFFER, new Float32Array(vert_array), this.rnd.gl.STATIC_DRAW);

    this.rnd.gl.vertexAttribPointer(0, 3, this.rnd.gl.FLOAT, false, 24, 0);
    this.rnd.gl.enableVertexAttribArray(0);
    this.rnd.gl.vertexAttribPointer(1, 3, this.rnd.gl.FLOAT, false, 24, 12);
    this.rnd.gl.enableVertexAttribArray(1);

    if (ind != null && ind.length != 0) {
      this.ibuf = this.rnd.gl.createBuffer();
      this.rnd.gl.bindBuffer(this.rnd.gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
      this.rnd.gl.bufferData(this.rnd.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ind), this.rnd.gl.STATIC_DRAW);
      this.numOfElements = ind.length;
    } else {
      this.numOfElements = vert.length;
    }

    this.type = type;
  } // End of 'constructor' function

  draw(world) {
    if (world == undefined)
      world = new mat4();
    let w = world;
    let wnormal = w.transpose(w.inverse());
    let wvp = w.mul(this.rnd.camera.matVP);
    wnormal = wnormal.transpose();
    let loc;

    if (this.rnd.shader.id == null) {
      return;
    } else {
      this.rnd.shader.apply();
    }

    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "MatrWVP")) != -1)
      this.rnd.gl.uniformMatrix4fv(loc, false, new Float32Array(wvp.toArray()));
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "MatrW")) != -1)
      this.rnd.gl.uniformMatrix4fv(loc, false, new Float32Array(w.toArray()));
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "MatrWInv")) != -1)
      this.rnd.gl.uniformMatrix4fv(loc, false, new Float32Array(wnormal.toArray()));
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "Time")) != -1)
      this.rnd.gl.uniform1f(loc, this.rnd.timer.globalTime);

    this.rnd.gl.bindBuffer(this.rnd.gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
    this.rnd.gl.drawElements(this.type, this.numOfElements, this.rnd.gl.UNSIGNED_SHORT, 0);
  } // End of 'draw' function

  free() {
    if (this.va != null) {
      this.rnd.gl.bindVertexArray(this.va);
      this.rnd.gl.bindBuffer(this.rnd.gl.ARRAY_BUFFER, this.vbuf);
      this.rnd.gl.deleteBuffer(1, this.vbuf);
      this.rnd.gl.deleteVertexArray(1, this.va);
    }
    if (this.ibuf != null) {
      this.rnd.gl.deleteBuffer(1, this.ibuf);
    }
  } // End of 'free' function

  autoNormals(vert, ind) {
    /* Set all vertex normals to zero */
    for (let i = 0; i < vert.length; i++) {
      vert[i].norm = vec3(0, 0, 0);
    }
    
    /* Eval normal for every facet */
    for (let i = 0; i < ind.length; i += 3) {
      let n0 = ind[i], n1 = ind[i + 1], n2 = ind[i + 2];
      let p0 = vert[n0].pos;
      let p1 = vert[n1].pos;
      let p2 = vert[n2].pos;
      let p1_sub_p0 = p1.sub(p0);
      let p2_sub_p0 = p2.sub(p0);
      let crs = p1_sub_p0.cross(p2_sub_p0);
      let n = crs.normalize();
    
      vert[n0].norm = vert[n0].norm.add(n);
      vert[n1].norm = vert[n1].norm.add(n);
      vert[n2].norm = vert[n2].norm.add(n);
    }
    
    /* Normalize all vertex normals */
    for (let i = 0; i < vert.length; i++) {
      vert[i].n = vert[i].norm.normalize();
    }
  } // End of 'autoNormals' function
} // end of '_primitives' class

export function primitive(...args) {
  return new _primitive(...args);
} // end of 'primitive' function

/* END OF 'primitives.js' FILE */