/*
 * FILE NAME   : primitives.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 08.06.2024
 * PURPOSE     : OpenGL primitives java script library file.
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
  constructor(type, vert, noofv, ind, noofi) {
    this.va = 0
    this.vbuf = 0;
    this.ibuf = 0;
    this.va = window.anim.gl.createVertexArray();
    
    if (vert != null && noofv != 0)
    {
      window.anim.gl.bindVertexArray(this.va);
    
      this.vbuf = window.anim.gl.createBuffer();
      window.anim.gl.bindBuffer(window.anim.gl.ARRAY_BUFFER, this.vbuf);
      window.anim.gl.bufferData(window.anim.gl.ARRAY_BUFFER, new Float32Array(vert), window.anim.gl.STATIC_DRAW);
    
      window.anim.gl.vertexAttribPointer(0, 3, window.anim.gl.FLOAT, false, 3 * 4, 0);
      window.anim.gl.vertexAttribPointer(1, 3, window.anim.gl.FLOAT, false, 3 * 4, 3 * 4);
    
      window.anim.gl.enableVertexAttribArray(0);
      window.anim.gl.enableVertexAttribArray(1);
    }
    
    if (ind != null && noofi != 0) {
      this.ibuf = window.anim.gl.createBuffer();
      window.anim.gl.bindBuffer(window.anim.gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
      window.anim.gl.bufferData(window.anim.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(ind), window.anim.gl.STATIC_DRAW);
      this.numOfElements = noofi;
    } else {
      this.numOfElements = noofv;
    }
    
    this.type = type;
    this.trans = new mat4();
  } // End of 'constructor' function

  draw(world) {
    let w = this.trans.mul(world);
    let wnormal = w.transpose(w.inverse());
    let wvp = w.mul(window.anim.camera.matVP);
    let loc;
  
    window.anim.gl.useProgram(window.anim.shader.id);
    /*
    if ((loc = window.anim.gl.getUniformLocation(window.anim.shader.id, "MatrWVP")) != -1)
      window.anim.gl.uniformMatrix4fv(loc, 1, false, wvp.toArray());
    if ((loc = window.anim.gl.getUniformLocation(window.anim.shader.id, "MatrWInv")) != -1)
      window.anim.gl.uniformMatrix4fv(loc, 1, false, wnormal.toArray());
    if ((loc = window.anim.gl.getUniformLocation(window.anim.shader.id, "MatrW")) != -1)
      window.anim.gl.uniformMatrix4fv(loc, 1, false, w.toArray());
    if ((loc = window.anim.gl.getUniformLocation(window.anim.shader.id, "Time")) != -1)
      window.anim.gl.uniform1f(loc, window.anim.timer.globalTime);
    if ((loc = window.anim.gl.getUniformLocation(window.anim.shader.id, "CamLoc")) != -1)
      window.anim.gl.uniform3fv(loc, 1, window.anim.camera.loc.toArray());
    if ((loc = window.anim.gl.getUniformLocation(window.anim.shader.id, "CamRight")) != -1)
      window.anim.gl.uniform3fv(loc, 1, window.anim.camera.right.toArray());
    if ((loc = window.anim.gl.getUniformLocation(window.anim.shader.id, "CamUp")) != -1)
      window.anim.gl.uniform3fv(loc, 1, window.anim.camera.up.toArray());
    if ((loc = window.anim.gl.getUniformLocation(window.anim.shader.id, "CamDir")) != -1)
      window.anim.gl.uniform3fv(loc, 1, window.anim.camera.dir.toArray());
    */
    window.anim.gl.bindVertexArray(this.vs);
    if (this.ibuf == 0) {
      window.anim.gl.drawArrays(this.type, 0, this.numOfElements);
    } else {
      window.anim.gl.bindBuffer(window.anim.gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
      window.anim.gl.drawElements(this.type, this.numOfElements, window.anim.gl.UNSIGNED_INT, null);
    }
  } // End of 'draw' function

  free() {
    if (this.va != 0) {
      window.anim.gl.bindVertexArray(this.va);
      window.anim.gl.bindBuffer(window.anim.gl.ARRAY_BUFFER, 0);
      window.anim.gl.deleteBuffer(1, this.va);
      window.anim.gl.deleteVertexArray(1, this.va);
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