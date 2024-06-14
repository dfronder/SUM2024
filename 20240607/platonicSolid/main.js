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

    const prim = rnd.primCreateTetrahedron();

    const draw = () => {
      // count rotation matrices
      let matx = dc.mat4().rotateX(30 * rnd.timer.globalTime);
      let maty = dc.mat4().rotateY(30 * rnd.timer.globalTime);
      let matz = dc.mat4().rotateZ(30 * rnd.timer.globalTime);

      // drawing
      rnd.render();
      prim.draw(matx.mul(maty.mul(matz)));

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

    const prim = rnd.primCreateCube();

    const draw = () => {
      // count rotation matrices
      let matx = dc.mat4().rotateX(30 * rnd.timer.globalTime);
      let maty = dc.mat4().rotateY(30 * rnd.timer.globalTime);
      let matz = dc.mat4().rotateZ(30 * rnd.timer.globalTime);

      // drawing
      rnd.render();
      prim.draw(matx.mul(maty.mul(matz)));

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

    const prim = rnd.primCreateOctahedron();

    const draw = () => {
      // count rotation matrices
      let matx = dc.mat4().rotateX(30 * rnd.timer.globalTime);
      let maty = dc.mat4().rotateY(30 * rnd.timer.globalTime);
      let matz = dc.mat4().rotateZ(30 * rnd.timer.globalTime);

      // drawing
      rnd.render();
      prim.draw(matx.mul(maty.mul(matz)));

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