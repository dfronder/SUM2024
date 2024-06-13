/*
 * FILE NAME   : main.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 13.06.2024
 * PURPOSE     : Main java script file.
 */

import * as dc from "./lib.js";
let areas = [document.getElementById("myCan"), 
             document.getElementById("myCan2"), 
             document.getElementById("myCan3"), 
             document.getElementById("myCan4"), 
             document.getElementById("myCan5")];

function main() {
  // 'myCan'
  window.addEventListener("load", () => {
    let canvas = areas[0];
    let rnd = dc.anim(canvas);
    rnd.shader = rnd.shaderCreate("default");
    let vert = [dc.vertex(dc.vec3(0, 0, 0)), dc.vertex(dc.vec3(2, 0, 0)), dc.vertex(dc.vec3(0, 2, 0)), dc.vertex(dc.vec3(2, 2, 0))];
    let ind = [0, 1, 2, 2, 1, 3];
    let matr = dc.mat4();

    let prim = rnd.primCreate(rnd.gl.TRIANGLE, vert, 4, ind, 6);

    const draw = () => {
      // drawing
      rnd.render();
      prim.draw(matr.rotateY(rnd.timer.globalTime));
    
      // timer response
      rnd.timer.response();
  
      // animation register
      window.requestAnimationFrame(draw);
    };
    draw();
  });  
  // 'myCan2'
  window.addEventListener("load", () => {
    let canvas = areas[1];
    let rnd = dc.anim(canvas);
    rnd.shader = rnd.shaderCreate("default");
  
    const draw = () => {
      // drawing
      rnd.render();

      // timer response
      rnd.timer.response();
  
      // animation register
      window.requestAnimationFrame(draw);
    };
    draw();
  });  
  // 'myCan3'
  window.addEventListener("load", () => {
    let canvas = areas[2];
    let rnd = dc.anim(canvas);
    rnd.shader = rnd.shaderCreate("default");
  
    const draw = () => {
      // drawing
      rnd.render();
    
      // timer response
      rnd.timer.response();
  
      // animation register
      window.requestAnimationFrame(draw);
    };
    draw();
  });  
  // 'myCan4'
  window.addEventListener("load", () => {
    let canvas = areas[3];
    let rnd = dc.anim(canvas);
    rnd.shader = rnd.shaderCreate("default");
  
    const draw = () => {
      // drawing
      rnd.render();
    
      // timer response
      rnd.timer.response();
  
      // animation register
      window.requestAnimationFrame(draw);
    };
    draw();
  });  
  // 'myCan5'
  window.addEventListener("load", () => {
    let canvas = areas[4];
    let rnd = dc.anim(canvas);
    rnd.shader = rnd.shaderCreate("default");
  
    const draw = () => {
      // drawing
      rnd.render();
    
      // timer response
      rnd.timer.response();
  
      // animation register
      window.requestAnimationFrame(draw);
    };
    draw();
  });
} // End of 'main' function

main();

/* END OF 'main.js' FILE */