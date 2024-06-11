/*
 * FILE NAME   : primitives.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 11.06.2024
 * PURPOSE     : OpenGL primitives and vertices java script library file.
 */

import {vec3, mat4} from "../lib.js";

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
  constructor(rnd, type, vert, noofv, ind, noofi) {
    this.rnd = rnd;
    this.va = 0
    this.vbuf = 0;
    this.ibuf = 0;
    this.va = rnd.gl.createVertexArray();
    
    if (vert != null && noofv != 0)
    {
      rnd.gl.bindVertexArray(this.va);
    
      this.vbuf = rnd.gl.createBuffer();
      rnd.gl.bindBuffer(rnd.gl.ARRAY_BUFFER, this.vbuf);
      rnd.gl.bufferData(rnd.gl.ARRAY_BUFFER, new Float32Array(vert), rnd.gl.STATIC_DRAW);
    
      rnd.gl.vertexAttribPointer(0, 3, rnd.gl.FLOAT, false, 3 * 4, 0);
      rnd.gl.vertexAttribPointer(1, 3, rnd.gl.FLOAT, false, 3 * 4, 3 * 4);
    
      rnd.gl.enableVertexAttribArray(0);
      rnd.gl.enableVertexAttribArray(1);
    }
    
    if (ind != null && noofi != 0) {
      this.ibuf = rnd.gl.createBuffer();
      rnd.gl.bindBuffer(rnd.gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
      rnd.gl.bufferData(rnd.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(ind), rnd.gl.STATIC_DRAW);
      this.numOfElements = noofi;
    } else {
      this.numOfElements = noofv;
    }
    
    this.type = type;
    this.trans = new mat4();
  } // End of 'constructor' function

  draw(world) {
    if (world == undefined) {
       world = new mat4();
    }
    let w = this.trans.mul(world);
    let wnormal = w.transpose(w.inverse());
    let wvp = w.mul(this.rnd.camera.matVP);
    let loc;
    
    if (this.rnd.shader.id == null) {
      return;
    }
    this.rnd.shader.apply();

    if ((loc = rnd.gl.getUniformLocation(this.rnd.shader.id, "MatrWVP")) != -1) {
      rnd.gl.uniformMatrix4fv(loc, false, wvp.toArray(), 0);
    }
    if ((loc = rnd.gl.getUniformLocation(this.rnd.shader.id, "MatrWInv")) != -1) {
      rnd.gl.uniformMatrix4fv(loc, false, wnormal.toArray(), 16);
    }
    if ((loc = rnd.gl.getUniformLocation(this.rnd.shader.id, "MatrW")) != -1) {
      rnd.gl.uniformMatrix4fv(loc, false, w.toArray(), 16);
    }
    if ((loc = rnd.gl.getUniformLocation(this.rnd.shader.id, "Time")) != -1) {
      rnd.gl.uniform1f(loc, this.rnd.timer.globalTime, 4);
    }
    if ((loc = rnd.gl.getUniformLocation(this.rnd.shader.id, "CamLoc")) != -1) {
      rnd.gl.uniform3fv(loc, this.rnd.camera.loc.toArray(), 12);
    }
    if ((loc = rnd.gl.getUniformLocation(this.rnd.shader.id, "CamRight")) != -1) {
      rnd.gl.uniform3fv(loc, this.rnd.camera.right.toArray(), 12);
    }
    if ((loc = rnd.gl.getUniformLocation(this.rnd.shader.id, "CamUp")) != -1) {
      rnd.gl.uniform3fv(loc, this.rnd.camera.up.toArray(), 12);
    }
    if ((loc = rnd.gl.getUniformLocation(this.rnd.shader.id, "CamDir")) != -1) {
      rnd.gl.uniform3fv(loc, this.rnd.camera.dir.toArray(), 12);
    }

    rnd.gl.bindVertexArray(this.vs);
    if (this.ibuf == 0) {
      rnd.gl.drawArrays(this.type, 0, this.numOfElements);
    } else {
      rnd.gl.bindBuffer(this.rnd.gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
      rnd.gl.drawElements(this.type, this.numOfElements, this.rnd.gl.UNSIGNED_INT, null);
    }
  } // End of 'draw' function

  free() {
    if (this.va != 0) {
      rnd.gl.bindVertexArray(this.va);
      rnd.gl.bindBuffer(rnd.gl.ARRAY_BUFFER, 0);
      rnd.gl.deleteBuffer(1, this.va);
      rnd.gl.deleteVertexArray(1, this.va);
    }
    if (this.ibuf != 0) {
      window.gl.deleteBuffer(1, this.ibuf);
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
      let n = p1.sub(p0).cross(p2.sub(p0)).normalize();
  
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