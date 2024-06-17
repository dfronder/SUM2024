/*
 * FILE NAME   : mylib.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 17.06.2024
 * PURPOSE     : Julia Fractal java script file.
 */

import {timer} from "./timer.js";  

class _anim {
  constructor() {
    this.timer = new timer();
    this.canvas = 0;
    this.gl = 0;
    this.timeLoc = 0;
    this.mouseLoc = 0;
    this.prg = 0;
    this.scale = 2.0;
    this.movementX = 0;
    this.movementY = 0;
    this.X = 0;
    this.Y = 0;
  } // End of 'constructor' function

  initGL() {
    this.canvas = document.getElementById("myCan");
    this.gl = this.canvas.getContext("webgl2");
    this.gl.clearColor(0.30, 0.47, 0.8, 1);
    
    // Shader creation
    let vs_txt =
    `#version 300 es
    precision highp float;
    in vec3 InPosition;
      
    out vec2 DrawPos;
    uniform float Time;
    
    void main( void )
    {
      gl_Position = vec4(InPosition, 1);
      DrawPos = InPosition.xy;
    }
    `;
    let fs_txt =
    `#version 300 es
    precision highp float;
    out vec4 OutColor;
    
    in vec2 DrawPos;
    uniform float Time;
    uniform vec3 Mouse;
    
    #define X_MOVEMENT Mouse.x
    #define Y_MOVEMENT Mouse.y
    #define WHEEL_MOVEMENT Mouse.z

    float xMov = 0.0;
    float yMov = 0.0;

    void main( void )
    {
      xMov += X_MOVEMENT;
      yMov += Y_MOVEMENT;
      float coef = WHEEL_MOVEMENT;
      vec2 Z = DrawPos * 2.0 + vec2(0.0, 0.0);
      vec2 Z0 = Z, C = vec2(0.35 + 0.05 * sin(Time * 1.30), 0.35 + 0.05 * sin(Time * 0.8));
      int n = 0;
      
      while (n < 255 && length(Z) < 2.0)
      {
        Z = vec2(Z.x * Z.x - Z.y * Z.y, 2.0 * Z.x * Z.y) + C;
        n++;
      }
      
      OutColor = vec4(DrawPos, 0, 1) * 0.5 + 0.5;
      OutColor.g = float(n) / 255.0;
      OutColor = vec4(float(n) * 30.0 / 1000.0, float(n) * 8.0 / 1000.0, float(n) * (15.0 + 17.0 * abs(sin(Time))) / 1000.0, 1);
    }
    `;
    let
      vs = this.loadShader(this.gl.VERTEX_SHADER, vs_txt),
      fs = this.loadShader(this.gl.FRAGMENT_SHADER, fs_txt);
    this.prg = this.gl.createProgram();
    this.gl.attachShader(this.prg, vs);
    this.gl.attachShader(this.prg, fs);
    this.gl.linkProgram(this.prg);
    if (!this.gl.getProgramParameter(this.prg, this.gl.LINK_STATUS)) {
      let buf = this.gl.getProgramInfoLog(this.prg);
      console.log('Shader program link fail: ' + buf);
    }                                            
 
    // Vertex buffer creation
    const size = 1;
    const vertexes = [-size, size, 0, -size, -size, 0, size, size, 0, size, -size, 0];
    const posLoc = this.gl.getAttribLocation(this.prg, "InPosition");
    let vertexArray = this.gl.createVertexArray();
    this.gl.bindVertexArray(vertexArray);
    let vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexes), this.gl.STATIC_DRAW);
    if (posLoc != -1) {
      this.gl.vertexAttribPointer(posLoc, 3, this.gl.FLOAT, false, 0, 0);
      this.gl.enableVertexAttribArray(posLoc);
    }
   
    // Uniform data
    this.timeLoc = this.gl.getUniformLocation(this.prg, "Time");
    this.mouseLoc = this.gl.getUniformLocation(this.prg, "Mouse");
  
    this.gl.useProgram(this.prg);
  }  // End of 'initGL' function               

  loadShader(shaderType, shaderSource) {
    const shader = this.gl.createShader(shaderType);
    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      let buf = this.gl.getShaderInfoLog(shader);
      console.log('Shader compile fail: ' + buf);
    }                                            
    return shader;
  } // End of 'loadShader' function

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    if (this.timeLoc != -1)
      this.gl.uniform1f(this.timeLoc, this.timer.pauseTime);
    if (this.mouseLoc != -1) {
      this.gl.uniform3fv(this.mouseLoc, new Float32Array([this.X, this.Y, this.scale]));
    }
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  } // End of 'render' function
} // End of '_anim' class

export function anim(...args) {
  return new _anim(...args);
} // End of 'anim' function

window.addEventListener('keydown', (event) => {
  if (event.key == 'p' || event.key == 'P') {
    window.anim.timer.isPause = !window.anim.timer.isPause;
  }
});

window.addEventListener("wheel", (event) => {
  event.preventDefault;

  window.anim.scale += event.deltaY / 2000.0;
});

document.addEventListener('mousemove', (event) => {
  if (event.buttons == 1) {
    let rect = window.anim.canvas.getBoundingClientRect();
    window.anim.movementX = event.clientX - rect.left;
    window.anim.movementY = event.clientY - rect.top;
    window.anim.X -= window.anim.X / 10000.0 - window.anim.movementX / 10000.0;
    window.anim.Y += window.anim.Y / 10000.0 - window.anim.movementY / 10000.0;
  }
});

/* END OF 'mylib.js' FILE */