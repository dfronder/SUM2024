/*
 * FILE NAME   : primitives.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 13.06.2024
 * PURPOSE     : OpenGL primitives and vertices java script library file.
 */

import {vec3, mat4} from "../lib.js";

class _vertex {
  constructor(pos, norm) {
    if (pos == undefined) {
      this.p = vec3(0, 0, 0);
    } else {
      this.p = pos;
    }
    if (norm == undefined) {
      this.n = vec3(0, 0, 0);
    } else {
      this.n = norm;
    }
  } // End of 'constructor' function
} // End of '_vertex' class

export function vertex(...args) {
  return new _vertex(...args);
} // End of 'vertex' function

class _primitive {
  constructor(rnd, type, vert, noofv, ind, noofi) {
    this.rnd = rnd;
    this.va = undefined;
    this.vbuf = undefined;
    this.ibuf = undefined;
    this.va = rnd.gl.createVertexArray();
    let vert_array = [];
    let i = 0;

    if (ind != undefined && noofi != 0)
      this.autoNormals(vert, noofv, ind, noofi);

    for (let v of vert) {
      vert_array[i++] = v.p.x;
      vert_array[i++] = v.p.y;
      vert_array[i++] = v.p.z;
      vert_array[i++] = v.n.x;
      vert_array[i++] = v.n.y;
      vert_array[i++] = v.n.z;
    }

    rnd.gl.bindVertexArray(this.va);

    if (vert != undefined && noofv != 0)
    {
      this.vbuf = rnd.gl.createBuffer();
      rnd.gl.bindBuffer(rnd.gl.ARRAY_BUFFER, this.vbuf);
      rnd.gl.bufferData(rnd.gl.ARRAY_BUFFER, new Float32Array(vert_array), rnd.gl.STATIC_DRAW);
    
      rnd.gl.vertexAttribPointer(0, 3, rnd.gl.FLOAT, false, 24, 0);
      rnd.gl.vertexAttribPointer(1, 3, rnd.gl.FLOAT, false, 24, 12);

     rnd.gl.enableVertexAttribArray(0);
     rnd.gl.enableVertexAttribArray(1);
    }

    if (ind != undefined && noofi != 0) {
      this.ibuf = rnd.gl.createBuffer();
      rnd.gl.bindBuffer(rnd.gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
      rnd.gl.bufferData(rnd.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ind), rnd.gl.STATIC_DRAW);
      this.numOfElements = noofi;
    } else {
      this.numOfElements = noofv;
    }

    this.type = type;
    this.trans = new mat4();
  } // End of 'constructor' function

  draw(world) {
    if (world == undefined)
       world = new mat4();
    let w = this.trans.mul(world);
    let wnormal = w.transpose(w.inverse());
    let wvp = w.mul(this.rnd.camera.matVP);
    let loc;

    if (this.rnd.shader.id == undefined) {
      return;
    } else {
      this.rnd.shader.apply();
    }

    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "MatrWVP")) != -1)
      this.rnd.gl.uniformMatrix4fv(loc, false, new Float32Array(wvp.toArray()));
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "MatrWInv")) != -1)
      this.rnd.gl.uniformMatrix4fv(loc, false, new Float32Array(wnormal.toArray()));
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "Time")) != -1)
      this.rnd.gl.uniform1f(loc, this.rnd.timer.globalTime);

    this.rnd.gl.bindVertexArray(this.va);
    this.rnd.gl.bindBuffer(this.rnd.gl.ARRAY_BUFFER, this.vbuf);
    if (this.ibuf == null) {
      this.rnd.gl.drawArrays(this.type, 0, this.numOfElements);
    } else {
      this.rnd.gl.bindBuffer(this.rnd.gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
      this.rnd.gl.drawElements(this.type, this.numOfElements, this.rnd.gl.UNSIGNED_SHORT, 0);
    }
  } // End of 'draw' function

  free() {
    if (this.va != null) {
      this.rnd.gl.bindVertexArray(this.va);
      this.rnd.gl.bindBuffer(rnd.gl.ARRAY_BUFFER, 0);
      this.rnd.gl.deleteBuffer(1, this.va);
      this.rnd.gl.deleteVertexArray(1, this.va);
    }
    if (this.ibuf != null) {
      this.rnd.gl.deleteBuffer(1, this.ibuf);
    }
  } // End of 'free' function

  autoNormals(vert, noofv, ind, noofi) {
    /* Set all vertex normals to zero */
    for (let i = 0; i < noofv; i++) {
      vert[i].n = vec3(0, 0, 0);
    }
  
    /* Eval normal for every facet */
    for (let i = 0; i < noofi; i += 3) {
      let n0 = ind[i], n1 = ind[i + 1], n2 = ind[i + 2];
      let p0 = vert[n0].p;
      let p1 = vert[n1].p;
      let p2 = vert[n2].p;
      let p1_sub_p0 = p1.sub(p0);
      let p2_sub_p0 = p2.sub(p0);
      let crs = p1_sub_p0.cross(p2_sub_p0);
      let n = crs.normalize();
  
      vert[n0].n = vert[n0].n.add(n);
      vert[n1].n = vert[n1].n.add(n);
      vert[n2].n = vert[n2].n.add(n);
    }
  
    /* Normalize all vertex normals */
    for (let i = 0; i < noofv; i++) {
      vert[i].n = vert[i].n.normalize();
    }
  }
} // End of '_primitive' clas

export function primitive(...args) {
  return new _primitive(...args);
}  // End of 'primitive' function

/* END OF 'primitives.js' FILE */