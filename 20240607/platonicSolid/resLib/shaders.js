/*
 * FILE NAME   : shaders.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 08.06.2024
 * PURPOSE     : OpenGL shaders java script library file.
 */

class _shader {
  async _init(name) {
    this.name = name;
    this.id = null;
    this.shaders =
    [
       {
         id: null,
         type: window.gl.VERTEX_SHADER,
         name: "vert",
         src: "",
       },
       {
        id: null,
        type: window.gl.FRAGMENT_SHADER,
        name: "frag",
        src: "",
      }
    ];
    for (const s of this.shaders) {
      let response = await fetch(`bin/shaders/${name}/${s.name}.glsl`);
      let src = await response.text();
      if (typeof src == "string" && src != "")
        s.src = src;
    }
    // recompile shaders
    this.updateShadersSource();
  } // End of '_init' function                    
  updateShadersSource() { 
    this.shaders[0].id = null;
    this.shaders[1].id = null;
    this.id = null;
    if (this.shaders[0].src == "" || this.shaders[1].src == "")
      return;
    this.shaders.forEach(s => {
      s.id = window.gl.createShader(s.type);
      window.gl.shaderSource(s.id, s.src);
      window.gl.compileShader(s.id);
      if (!window.gl.getShaderParameter(s.id, window.gl.COMPILE_STATUS)) {
        let buf = window.gl.getShaderInfoLog(s.id);
        console.log(`Shader ${this.name}/${s.name} compile fail: ${buf}`);
      }                                            
    });             
    this.id = window.gl.createProgram();
    this.shaders.forEach(s => {
      if (s.id != null)
        window.gl.attachShader(this.id, s.id);
    });
    window.gl.linkProgram(prg);
    if (!window.gl.getProgramParameter(prg, window.gl.LINK_STATUS)) {
      let buf = window.gl.getProgramInfoLog(prg);
      console.log(`Shader program ${this.name} link fail: ${buf}`);
    }                                            
    this.updateShaderData();    
  } // End of 'updateShadersSource' function
  updateShaderData() {
    // Shader attributes
    this.attrs = {};
    const countAttrs = window.gl.getProgramParameter(this.id, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < countAttrs; i++) {
      const info = window.gl.getActiveAttrib(this.id, i);
      this.attrs[info.name] = {
        name: info.name,
        type: info.type,
        size: info.size,
        loc: window.gl.getAttribLocation(this.id, info.name),
      };
    }
 
    // Shader uniforms
    this.uniforms = {};
    const countUniforms = window.gl.getProgramParameter(this.id, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < countUniforms; i++) {
      const info = window.gl.getActiveUniform(this.id, i);
      this.uniforms[info.name] = {
        name: info.name,
        type: info.type,
        size: info.size,
        loc: window.gl.getUniformLocation(this.id, info.name),
      };
    }
 
    // Shader uniform blocks
    this.uniformBlocks = {};
    const countUniformBlocks = window.gl.getProgramParameter(this.id, window.gl.ACTIVE_UNIFORM_BLOCKS);
    for (let i = 0; i < countUniformBlocks; i++) {
      const block_name = window.gl.getActiveUniformBlockName(this.id, i);
      const index = window.gl.getActiveUniformBlockIndex(this.id, block_name);
      this.uniformBlocks[block_name] = {
        name: block_name,
        index: index,
        size: window.gl.getActiveUniformBlockParameter(this.id, idx, window.gl.UNIFORM_BLOCK_DATA_SIZE),
        bind: window.gl.getActiveUniformBlockParameter(this.id, idx, window.gl.UNIFORM_BLOCK_BINDING),
      };
    }
  } // End of 'updateShaderData' function
  constructor(name) {
    this._init(name)
  } // End of 'constructor' function
  apply() {
    if (this.id != null)
      window.gl.useProgram(this.id);
  } // End of 'apply' function
} // End of '_shader' class

export function shader(name) {
  return new _shader(name);
} // End of 'shader' function

// let src = document.getElementById("shdVertSrc").value;
// shd.shaders[0].src = src;
// shd.updateShadersSource();

/* END OF 'shaders.js' FILE */