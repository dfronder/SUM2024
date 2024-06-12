/*
 * FILE NAME   : main.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 11.06.2024
 * PURPOSE     : Main java script file.
 */

import * as dc from "./lib.js";
let areas = [document.getElementById("myCan"), 
             document.getElementById("myCan2"), 
             document.getElementById("myCan3"), 
             document.getElementById("myCan4"), 
             document.getElementById("myCan5")];

window.addEventListener("load", () => {
  for (const s of areas) {
    let canvas = s;
    let rnd = dc.anim(canvas);
    rnd.shader = rnd.shaderCreate("default");
    let vert = [dc.vertex(0, 0, 0), dc.vertex(10, 0, 0), dc.vertex(0, 10, 0), dc.vertex(10, 10, 0)];
    let ind = [0, 1, 2, 2, 1, 3];

//    let prim = rnd.primCreate(rnd.gl.TRIANGLES, vert, 4, ind, 6);
    let prim = rnd.primCreateCube();

    const draw = () => {
      // drawing
      rnd.render();
      prim.draw(dc.mat4().rotateY(rnd.timer.globalTime));
  
      // timer response
      rnd.timer.response();
  
      // animation register
      window.requestAnimationFrame(draw);
    };
    draw();
  }
});

/* END OF 'main.js' FILE */