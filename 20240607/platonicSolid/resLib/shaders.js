/*
 * FILE NAME   : shaders.js
 * PROGRAMMER  : DC6
 * LAST UPDATE : 11.06.2024
 * PURPOSE     : OpenGL shaders java script library file.
 */
  
class _shader {
  async _init(rnd, name) {
    this.rnd = rnd;
    this.name = name;
    this.id = null;
    this.shaders =
    [
      {
        id: null,
        type: this.rnd.gl.FRAGMENT_SHADER,
        name: "frag",
        src: "",
      },
      {
        id: null,
        type: this.rnd.gl.VERTEX_SHADER,
        name: "vert",
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
    for (const s of this.shaders) {
      s.id = this.rnd.gl.createShader(s.type);
      this.rnd.gl.shaderSource(s.id, s.src);
      this.rnd.gl.compileShader(s.id);
      if (!this.rnd.gl.getShaderParameter(s.id, this.rnd.gl.COMPILE_STATUS)) {
        let buf = this.rnd.gl.getShaderInfoLog(s.id);
        console.log(`Shader ${this.name}/${s.name} compile fail: ${buf}`);
      }                                            
    };             
    this.id = this.rnd.gl.createProgram();
    this.shaders.forEach(s => {
      if (s.id != null)
        this.rnd.gl.attachShader(this.id, s.id);
    });
    this.rnd.gl.linkProgram(this.id);
    if (!this.rnd.gl.getProgramParameter(this.id, this.rnd.gl.LINK_STATUS)) {
      let buf = this.rnd.gl.getProgramInfoLog(this.id);
      console.log(`Shader program ${this.name} link fail: ${buf}`);
    }                                            
    this.updateShaderData();    
  } // End of 'updateShadersSource' function
  updateShaderData() {
    // Shader attributes
    this.attrs = {};
    const countAttrs = this.rnd.gl.getProgramParameter(this.id, this.rnd.gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < countAttrs; i++) {
      const info = this.rnd.gl.getActiveAttrib(this.id, i);
      this.attrs[info.name] = {
        name: info.name,
        type: info.type,
        size: info.size,
        loc: this.rnd.gl.getAttribLocation(this.id, info.name),
      };
    }
 
    // Shader uniforms
    this.uniforms = {};
    const countUniforms = this.rnd.gl.getProgramParameter(this.id, this.rnd.gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < countUniforms; i++) {
      const info = this.rnd.gl.getActiveUniform(this.id, i);
      this.uniforms[info.name] = {
        name: info.name,
        type: info.type,
        size: info.size,
        loc: this.rnd.gl.getUniformLocation(this.id, info.name),
      };
    }
 
    // Shader uniform blocks
    this.uniformBlocks = {};
    const countUniformBlocks = this.rnd.gl.getProgramParameter(this.id, this.rnd.gl.ACTIVE_UNIFORM_BLOCKS);
    for (let i = 0; i < countUniformBlocks; i++) {
      const block_name = this.rnd.gl.getActiveUniformBlockName(this.id, i);
      const index = this.rnd.gl.getActiveUniformBlockIndex(this.id, block_name);
      this.uniformBlocks[block_name] = {
        name: block_name,
        index: index,
        size: this.rnd.gl.getActiveUniformBlockParameter(this.id, idx, this.rnd.gl.UNIFORM_BLOCK_DATA_SIZE),
        bind: this.rnd.gl.getActiveUniformBlockParameter(this.id, idx, this.rnd.gl.UNIFORM_BLOCK_BINDING),
      };
    }
  } // End of 'updateShaderData' function
  constructor(rnd, name) {
    this._init(rnd, name)
  } // End of 'constructor' function
  apply() {
    if (this.id != null)
      this.rnd.gl.useProgram(this.id);
  } // End of 'apply' function
} // End of '_shader' class

export function shader(...args) {
  return new _shader(...args);
} // End of 'shader' function

/* END OF 'shaders.js' FILE */