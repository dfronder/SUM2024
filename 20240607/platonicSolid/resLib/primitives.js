/*
 * FILE NAME   : primitives.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 11.06.2024
 * PURPOSE     : OpenGL primitives and vertices java script library file.
 */

import {vec3, mat4} from "../lib.js";

class _vertex {
  constructor(x, y, z) {
    this.p = vec3(x, y, z);
    this.n = vec3();
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
    

    if (vert != undefined && noofv != 0)
    {
      rnd.gl.bindVertexArray(this.va);
    
      this.vbuf = rnd.gl.createBuffer();
      rnd.gl.bindBuffer(rnd.gl.ARRAY_BUFFER, this.vbuf);
      rnd.gl.bufferData(rnd.gl.ARRAY_BUFFER, new Float32Array(vert), rnd.gl.STATIC_DRAW);
    
      rnd.gl.vertexAttribPointer(0, 3, rnd.gl.FLOAT, false, 24, 0);
      rnd.gl.vertexAttribPointer(1, 3, rnd.gl.FLOAT, false, 24, 12);
    
      rnd.gl.enableVertexAttribArray(0);
      rnd.gl.enableVertexAttribArray(1);
    }
    
    if (ind != undefined && noofi != 0) {
      this.ibuf = rnd.gl.createBuffer();
      rnd.gl.bindBuffer(rnd.gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
      rnd.gl.bufferData(rnd.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(ind), rnd.gl.STATIC_DRAW);
      this.numOfElements = noofi;
    } else {
      this.numOfElements = noofv;
    }
    
    this.type = type;
    this.trans = new mat4();

    if (ind != undefined) {
      this.autoNormals();
    }
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

    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "MatrWVP")) != -1) {
      this.rnd.gl.uniformMatrix4fv(loc, false, new Float32Array(wvp.toArray()));
    }
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "MatrWInv")) != -1) {
      this.rnd.gl.uniformMatrix4fv(loc, false, new Float32Array(wnormal.toArray()));
    }
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "MatrW")) != -1) {
      this.rnd.gl.uniformMatrix4fv(loc, false, new Float32Array(w.toArray()));
    }
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "Time")) != -1) {
      this.rnd.gl.uniform1f(loc, this.rnd.timer.globalTime);
    }
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "CamLoc")) != -1) {
      this.rnd.gl.uniform3fv(loc, new Float32Array(this.rnd.camera.loc.toArray()));
    }
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "CamRight")) != -1) {
      this.rnd.gl.uniform3fv(loc, new Float32Array(this.rnd.camera.right.toArray()));
    }
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "CamUp")) != -1) {
      this.rnd.gl.uniform3fv(loc, new Float32Array(this.rnd.camera.up.toArray()));
    }
    if ((loc = this.rnd.gl.getUniformLocation(this.rnd.shader.id, "CamDir")) != -1) {
      this.rnd.gl.uniform3fv(loc, new Float32Array(this.rnd.camera.dir.toArray()));
    }

    this.rnd.gl.bindVertexArray(this.vs);
    this.rnd.gl.bindBuffer(this.rnd.gl.ARRAY_BUFFER, this.vbuf);
    if (this.ibuf == 0) {
      this.rnd.gl.drawArrays(this.type, 0, this.numOfElements);
    } else {
      this.rnd.gl.bindBuffer(this.rnd.gl.ELEMENT_ARRAY_BUFFER, this.ibuf);
      this.rnd.gl.drawElements(this.type, this.numOfElements, this.rnd.gl.UNSIGNED_INT, 0);
    }
  } // End of 'draw' function

  free() {
    if (this.va != 0) {
      this.rnd.gl.bindVertexArray(this.va);
      this.rnd.gl.bindBuffer(rnd.gl.ARRAY_BUFFER, 0);
      this.rnd.gl.deleteBuffer(1, this.va);
      this.rnd.gl.deleteVertexArray(1, this.va);
    }
    if (this.ibuf != 0) {
      this.rnd.gl.deleteBuffer(1, this.ibuf);
    }
  } // End of 'free' function

  autoNormals() {
    /* Set all vertex normals to zero */
    for (let i = 0; i < this.noofv; i++) {
      this.vert[i].n = vec3(0, 0, 0);
    }
  
    /* Eval normal for every facet */
    for (let i = 0; i < this.noofi; i += 3) {
      let n0 = this.ind[i], n1 = this.ind[i + 1], n2 = this.ind[i + 2];
      let p0 = this.vert[n0].p;
      let p1 = this.vert[n1].p;
      let p2 = this.vert[n2].p;
      let n = p1.sub(p0).cross(p2.sub(p0)).normalize();
  
      this.vert[n0].n = this.vert[n0].n.add(n);
      this.vert[n1].n = this.vert[n1].n.add(n);
      this.vert[n2].n = this.vert[n2].n.add(n);
    }
  
    /* Normalize all vertex normals */
    for (let i = 0; i < this.noofv; i++) {
      this.vert[i].n = this.vert[i].n.normalize();
    }
  }
} // End of '_primitive' clas

export function primitive(...args) {
  return new _primitive(...args);
}  // End of 'primitive' function

/* END OF 'primitives.js' FILE */