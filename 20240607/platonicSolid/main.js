/*
 * FILE NAME   : main.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 11.06.2024
 * PURPOSE     : Main java script file.
 */

import * as dc from "./lib.js";
let areas = [document.getElementById("myCan"), document.getElementById("myCan2")];

window.addEventListener("load", () => {
  for (const s of areas) {
    let canvas = s;
    let rnd = dc.anim(canvas);
    rnd.shader = rnd.shaderCreate("default");
    let vert = [dc.vertex(), dc.vertex(), dc.vertex(), dc.vertex()];
    let ind = [];
  
    vert[0].p = dc.vec3(0, 0, 0);
    vert[1].p = dc.vec3(10, 0, 0);
    vert[2].p = dc.vec3(0, 10, 0);
    vert[3].p = dc.vec3(10, 10, 0);
  
    ind[0] = 0;
    ind[1] = 1;
    ind[2] = 2;
  
    ind[3] = 2;
    ind[4] = 1;
    ind[5] = 3;
  
    let prim = rnd.primCreate(rnd.gl.TRIANGLES, vert, 4, ind, 6);

    const draw = () => {
      prim.draw();

      // drawing
      rnd.render();
  
      // timer response
      rnd.timer.response();
  
      // animation register
      window.requestAnimationFrame(draw);
    };
    draw();
  }
});

/* END OF 'main.js' FILE */