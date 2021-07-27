function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return x * x + y * y + z * z;
}
function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return x * x + y * y + z * z;
}
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
function inverse(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
}
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x * x + y * y + z * z;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2];
  let bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
function scaleRotateMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z) / w;
  return out;
}
function transformQuat(out, a, q) {
  let x = a[0], y = a[1], z = a[2];
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  let uvx = qy * z - qz * y;
  let uvy = qz * x - qx * z;
  let uvz = qx * y - qy * x;
  let uuvx = qy * uvz - qz * uvy;
  let uuvy = qz * uvx - qx * uvz;
  let uuvz = qx * uvy - qy * uvx;
  let w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
const angle = function() {
  const tempA = [0, 0, 0];
  const tempB = [0, 0, 0];
  return function(a, b) {
    copy(tempA, a);
    copy(tempB, b);
    normalize(tempA, tempA);
    normalize(tempB, tempB);
    let cosine = dot(tempA, tempB);
    if (cosine > 1) {
      return 0;
    } else if (cosine < -1) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  };
}();
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
class Vec3 extends Array {
  constructor(x = 0, y = x, z = x) {
    super(x, y, z);
    return this;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  set x(v) {
    this[0] = v;
  }
  set y(v) {
    this[1] = v;
  }
  set z(v) {
    this[2] = v;
  }
  set(x, y = x, z = x) {
    if (x.length)
      return this.copy(x);
    set(this, x, y, z);
    return this;
  }
  copy(v) {
    copy(this, v);
    return this;
  }
  add(va, vb) {
    if (vb)
      add(this, va, vb);
    else
      add(this, this, va);
    return this;
  }
  sub(va, vb) {
    if (vb)
      subtract(this, va, vb);
    else
      subtract(this, this, va);
    return this;
  }
  multiply(v) {
    if (v.length)
      multiply(this, this, v);
    else
      scale(this, this, v);
    return this;
  }
  divide(v) {
    if (v.length)
      divide(this, this, v);
    else
      scale(this, this, 1 / v);
    return this;
  }
  inverse(v = this) {
    inverse(this, v);
    return this;
  }
  len() {
    return length(this);
  }
  distance(v) {
    if (v)
      return distance(this, v);
    else
      return length(this);
  }
  squaredLen() {
    return squaredLength(this);
  }
  squaredDistance(v) {
    if (v)
      return squaredDistance(this, v);
    else
      return squaredLength(this);
  }
  negate(v = this) {
    negate(this, v);
    return this;
  }
  cross(va, vb) {
    if (vb)
      cross(this, va, vb);
    else
      cross(this, this, va);
    return this;
  }
  scale(v) {
    scale(this, this, v);
    return this;
  }
  normalize() {
    normalize(this, this);
    return this;
  }
  dot(v) {
    return dot(this, v);
  }
  equals(v) {
    return exactEquals(this, v);
  }
  applyMatrix4(mat4) {
    transformMat4(this, this, mat4);
    return this;
  }
  scaleRotateMatrix4(mat4) {
    scaleRotateMat4(this, this, mat4);
    return this;
  }
  applyQuaternion(q) {
    transformQuat(this, this, q);
    return this;
  }
  angle(v) {
    return angle(this, v);
  }
  lerp(v, t) {
    lerp(this, this, v, t);
    return this;
  }
  clone() {
    return new Vec3(this[0], this[1], this[2]);
  }
  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    return this;
  }
  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    return a;
  }
  transformDirection(mat4) {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    this[0] = mat4[0] * x + mat4[4] * y + mat4[8] * z;
    this[1] = mat4[1] * x + mat4[5] * y + mat4[9] * z;
    this[2] = mat4[2] * x + mat4[6] * y + mat4[10] * z;
    return this.normalize();
  }
}
const tempVec3 = new Vec3();
let ID = 1;
let ATTR_ID = 1;
let isBoundsWarned = false;
class Geometry {
  constructor(gl, attributes = {}) {
    if (!gl.canvas)
      console.error("gl not passed as first argument to Geometry");
    this.gl = gl;
    this.attributes = attributes;
    this.id = ID++;
    this.VAOs = {};
    this.drawRange = {start: 0, count: 0};
    this.instancedCount = 0;
    this.gl.renderer.bindVertexArray(null);
    this.gl.renderer.currentGeometry = null;
    this.glState = this.gl.renderer.state;
    for (let key in attributes) {
      this.addAttribute(key, attributes[key]);
    }
  }
  addAttribute(key, attr) {
    this.attributes[key] = attr;
    attr.id = ATTR_ID++;
    attr.size = attr.size || 1;
    attr.type = attr.type || (attr.data.constructor === Float32Array ? this.gl.FLOAT : attr.data.constructor === Uint16Array ? this.gl.UNSIGNED_SHORT : this.gl.UNSIGNED_INT);
    attr.target = key === "index" ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
    attr.normalized = attr.normalized || false;
    attr.stride = attr.stride || 0;
    attr.offset = attr.offset || 0;
    attr.count = attr.count || (attr.stride ? attr.data.byteLength / attr.stride : attr.data.length / attr.size);
    attr.divisor = attr.instanced || 0;
    attr.needsUpdate = false;
    if (!attr.buffer) {
      attr.buffer = this.gl.createBuffer();
      this.updateAttribute(attr);
    }
    if (attr.divisor) {
      this.isInstanced = true;
      if (this.instancedCount && this.instancedCount !== attr.count * attr.divisor) {
        console.warn("geometry has multiple instanced buffers of different length");
        return this.instancedCount = Math.min(this.instancedCount, attr.count * attr.divisor);
      }
      this.instancedCount = attr.count * attr.divisor;
    } else if (key === "index") {
      this.drawRange.count = attr.count;
    } else if (!this.attributes.index) {
      this.drawRange.count = Math.max(this.drawRange.count, attr.count);
    }
  }
  updateAttribute(attr) {
    if (this.glState.boundBuffer !== attr.buffer) {
      this.gl.bindBuffer(attr.target, attr.buffer);
      this.glState.boundBuffer = attr.buffer;
    }
    this.gl.bufferData(attr.target, attr.data, this.gl.STATIC_DRAW);
    attr.needsUpdate = false;
  }
  setIndex(value) {
    this.addAttribute("index", value);
  }
  setDrawRange(start, count) {
    this.drawRange.start = start;
    this.drawRange.count = count;
  }
  setInstancedCount(value) {
    this.instancedCount = value;
  }
  createVAO(program) {
    this.VAOs[program.attributeOrder] = this.gl.renderer.createVertexArray();
    this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
    this.bindAttributes(program);
  }
  bindAttributes(program) {
    program.attributeLocations.forEach((location, {name, type}) => {
      if (!this.attributes[name]) {
        console.warn(`active attribute ${name} not being supplied`);
        return;
      }
      const attr = this.attributes[name];
      this.gl.bindBuffer(attr.target, attr.buffer);
      this.glState.boundBuffer = attr.buffer;
      let numLoc = 1;
      if (type === 35674)
        numLoc = 2;
      if (type === 35675)
        numLoc = 3;
      if (type === 35676)
        numLoc = 4;
      const size = attr.size / numLoc;
      const stride = numLoc === 1 ? 0 : numLoc * numLoc * numLoc;
      const offset = numLoc === 1 ? 0 : numLoc * numLoc;
      for (let i = 0; i < numLoc; i++) {
        this.gl.vertexAttribPointer(location + i, size, attr.type, attr.normalized, attr.stride + stride, attr.offset + i * offset);
        this.gl.enableVertexAttribArray(location + i);
        this.gl.renderer.vertexAttribDivisor(location + i, attr.divisor);
      }
    });
    if (this.attributes.index)
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer);
  }
  draw({program, mode = this.gl.TRIANGLES}) {
    if (this.gl.renderer.currentGeometry !== `${this.id}_${program.attributeOrder}`) {
      if (!this.VAOs[program.attributeOrder])
        this.createVAO(program);
      this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
      this.gl.renderer.currentGeometry = `${this.id}_${program.attributeOrder}`;
    }
    program.attributeLocations.forEach((location, {name}) => {
      const attr = this.attributes[name];
      if (attr.needsUpdate)
        this.updateAttribute(attr);
    });
    if (this.isInstanced) {
      if (this.attributes.index) {
        this.gl.renderer.drawElementsInstanced(mode, this.drawRange.count, this.attributes.index.type, this.attributes.index.offset + this.drawRange.start * 2, this.instancedCount);
      } else {
        this.gl.renderer.drawArraysInstanced(mode, this.drawRange.start, this.drawRange.count, this.instancedCount);
      }
    } else {
      if (this.attributes.index) {
        this.gl.drawElements(mode, this.drawRange.count, this.attributes.index.type, this.attributes.index.offset + this.drawRange.start * 2);
      } else {
        this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
      }
    }
  }
  getPosition() {
    const attr = this.attributes.position;
    if (attr.data)
      return attr;
    if (isBoundsWarned)
      return;
    console.warn("No position buffer data found to compute bounds");
    return isBoundsWarned = true;
  }
  computeBoundingBox(attr) {
    if (!attr)
      attr = this.getPosition();
    const array = attr.data;
    const offset = attr.offset || 0;
    const stride = attr.stride || attr.size;
    if (!this.bounds) {
      this.bounds = {
        min: new Vec3(),
        max: new Vec3(),
        center: new Vec3(),
        scale: new Vec3(),
        radius: Infinity
      };
    }
    const min = this.bounds.min;
    const max = this.bounds.max;
    const center = this.bounds.center;
    const scale2 = this.bounds.scale;
    min.set(Infinity);
    max.set(-Infinity);
    for (let i = offset, l = array.length; i < l; i += stride) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];
      min.x = Math.min(x, min.x);
      min.y = Math.min(y, min.y);
      min.z = Math.min(z, min.z);
      max.x = Math.max(x, max.x);
      max.y = Math.max(y, max.y);
      max.z = Math.max(z, max.z);
    }
    scale2.sub(max, min);
    center.add(min, max).divide(2);
  }
  computeBoundingSphere(attr) {
    if (!attr)
      attr = this.getPosition();
    const array = attr.data;
    const offset = attr.offset || 0;
    const stride = attr.stride || attr.size;
    if (!this.bounds)
      this.computeBoundingBox(attr);
    let maxRadiusSq = 0;
    for (let i = offset, l = array.length; i < l; i += stride) {
      tempVec3.fromArray(array, i);
      maxRadiusSq = Math.max(maxRadiusSq, this.bounds.center.squaredDistance(tempVec3));
    }
    this.bounds.radius = Math.sqrt(maxRadiusSq);
  }
  remove() {
    for (let key in this.VAOs) {
      this.gl.renderer.deleteVertexArray(this.VAOs[key]);
      delete this.VAOs[key];
    }
    for (let key in this.attributes) {
      this.gl.deleteBuffer(this.attributes[key].buffer);
      delete this.attributes[key];
    }
  }
}
let ID$1 = 1;
const arrayCacheF32 = {};
class Program {
  constructor(gl, {
    vertex: vertex2,
    fragment: fragment2,
    uniforms = {},
    transparent = false,
    cullFace = gl.BACK,
    frontFace = gl.CCW,
    depthTest = true,
    depthWrite = true,
    depthFunc = gl.LESS
  } = {}) {
    if (!gl.canvas)
      console.error("gl not passed as fist argument to Program");
    this.gl = gl;
    this.uniforms = uniforms;
    this.id = ID$1++;
    if (!vertex2)
      console.warn("vertex shader not supplied");
    if (!fragment2)
      console.warn("fragment shader not supplied");
    this.transparent = transparent;
    this.cullFace = cullFace;
    this.frontFace = frontFace;
    this.depthTest = depthTest;
    this.depthWrite = depthWrite;
    this.depthFunc = depthFunc;
    this.blendFunc = {};
    this.blendEquation = {};
    if (this.transparent && !this.blendFunc.src) {
      if (this.gl.renderer.premultipliedAlpha)
        this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
      else
        this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertex2);
    gl.compileShader(vertexShader);
    if (gl.getShaderInfoLog(vertexShader) !== "") {
      console.warn(`${gl.getShaderInfoLog(vertexShader)}
Vertex Shader
${addLineNumbers(vertex2)}`);
    }
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragment2);
    gl.compileShader(fragmentShader);
    if (gl.getShaderInfoLog(fragmentShader) !== "") {
      console.warn(`${gl.getShaderInfoLog(fragmentShader)}
Fragment Shader
${addLineNumbers(fragment2)}`);
    }
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      return console.warn(gl.getProgramInfoLog(this.program));
    }
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    this.uniformLocations = new Map();
    let numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let uIndex = 0; uIndex < numUniforms; uIndex++) {
      let uniform = gl.getActiveUniform(this.program, uIndex);
      this.uniformLocations.set(uniform, gl.getUniformLocation(this.program, uniform.name));
      const split = uniform.name.match(/(\w+)/g);
      uniform.uniformName = split[0];
      if (split.length === 3) {
        uniform.isStructArray = true;
        uniform.structIndex = Number(split[1]);
        uniform.structProperty = split[2];
      } else if (split.length === 2 && isNaN(Number(split[1]))) {
        uniform.isStruct = true;
        uniform.structProperty = split[1];
      }
    }
    this.attributeLocations = new Map();
    const locations = [];
    const numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
    for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
      const attribute = gl.getActiveAttrib(this.program, aIndex);
      const location = gl.getAttribLocation(this.program, attribute.name);
      locations[location] = attribute.name;
      this.attributeLocations.set(attribute, location);
    }
    this.attributeOrder = locations.join("");
  }
  setBlendFunc(src, dst, srcAlpha, dstAlpha) {
    this.blendFunc.src = src;
    this.blendFunc.dst = dst;
    this.blendFunc.srcAlpha = srcAlpha;
    this.blendFunc.dstAlpha = dstAlpha;
    if (src)
      this.transparent = true;
  }
  setBlendEquation(modeRGB, modeAlpha) {
    this.blendEquation.modeRGB = modeRGB;
    this.blendEquation.modeAlpha = modeAlpha;
  }
  applyState() {
    if (this.depthTest)
      this.gl.renderer.enable(this.gl.DEPTH_TEST);
    else
      this.gl.renderer.disable(this.gl.DEPTH_TEST);
    if (this.cullFace)
      this.gl.renderer.enable(this.gl.CULL_FACE);
    else
      this.gl.renderer.disable(this.gl.CULL_FACE);
    if (this.blendFunc.src)
      this.gl.renderer.enable(this.gl.BLEND);
    else
      this.gl.renderer.disable(this.gl.BLEND);
    if (this.cullFace)
      this.gl.renderer.setCullFace(this.cullFace);
    this.gl.renderer.setFrontFace(this.frontFace);
    this.gl.renderer.setDepthMask(this.depthWrite);
    this.gl.renderer.setDepthFunc(this.depthFunc);
    if (this.blendFunc.src)
      this.gl.renderer.setBlendFunc(this.blendFunc.src, this.blendFunc.dst, this.blendFunc.srcAlpha, this.blendFunc.dstAlpha);
    this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB, this.blendEquation.modeAlpha);
  }
  use({flipFaces = false} = {}) {
    let textureUnit = -1;
    const programActive = this.gl.renderer.currentProgram === this.id;
    if (!programActive) {
      this.gl.useProgram(this.program);
      this.gl.renderer.currentProgram = this.id;
    }
    this.uniformLocations.forEach((location, activeUniform) => {
      let name = activeUniform.uniformName;
      let uniform = this.uniforms[name];
      if (activeUniform.isStruct) {
        uniform = uniform[activeUniform.structProperty];
        name += `.${activeUniform.structProperty}`;
      }
      if (activeUniform.isStructArray) {
        uniform = uniform[activeUniform.structIndex][activeUniform.structProperty];
        name += `[${activeUniform.structIndex}].${activeUniform.structProperty}`;
      }
      if (!uniform) {
        return warn(`Active uniform ${name} has not been supplied`);
      }
      if (uniform && uniform.value === void 0) {
        return warn(`${name} uniform is missing a value parameter`);
      }
      if (uniform.value.texture) {
        textureUnit = textureUnit + 1;
        uniform.value.update(textureUnit);
        return setUniform(this.gl, activeUniform.type, location, textureUnit);
      }
      if (uniform.value.length && uniform.value[0].texture) {
        const textureUnits = [];
        uniform.value.forEach((value) => {
          textureUnit = textureUnit + 1;
          value.update(textureUnit);
          textureUnits.push(textureUnit);
        });
        return setUniform(this.gl, activeUniform.type, location, textureUnits);
      }
      setUniform(this.gl, activeUniform.type, location, uniform.value);
    });
    this.applyState();
    if (flipFaces)
      this.gl.renderer.setFrontFace(this.frontFace === this.gl.CCW ? this.gl.CW : this.gl.CCW);
  }
  remove() {
    this.gl.deleteProgram(this.program);
  }
}
function setUniform(gl, type, location, value) {
  value = value.length ? flatten(value) : value;
  const setValue = gl.renderer.state.uniformLocations.get(location);
  if (value.length) {
    if (setValue === void 0 || setValue.length !== value.length) {
      gl.renderer.state.uniformLocations.set(location, value.slice(0));
    } else {
      if (arraysEqual(setValue, value))
        return;
      setValue.set ? setValue.set(value) : setArray(setValue, value);
      gl.renderer.state.uniformLocations.set(location, setValue);
    }
  } else {
    if (setValue === value)
      return;
    gl.renderer.state.uniformLocations.set(location, value);
  }
  switch (type) {
    case 5126:
      return value.length ? gl.uniform1fv(location, value) : gl.uniform1f(location, value);
    case 35664:
      return gl.uniform2fv(location, value);
    case 35665:
      return gl.uniform3fv(location, value);
    case 35666:
      return gl.uniform4fv(location, value);
    case 35670:
    case 5124:
    case 35678:
    case 35680:
      return value.length ? gl.uniform1iv(location, value) : gl.uniform1i(location, value);
    case 35671:
    case 35667:
      return gl.uniform2iv(location, value);
    case 35672:
    case 35668:
      return gl.uniform3iv(location, value);
    case 35673:
    case 35669:
      return gl.uniform4iv(location, value);
    case 35674:
      return gl.uniformMatrix2fv(location, false, value);
    case 35675:
      return gl.uniformMatrix3fv(location, false, value);
    case 35676:
      return gl.uniformMatrix4fv(location, false, value);
  }
}
function addLineNumbers(string) {
  let lines = string.split("\n");
  for (let i = 0; i < lines.length; i++) {
    lines[i] = i + 1 + ": " + lines[i];
  }
  return lines.join("\n");
}
function flatten(a) {
  const arrayLen = a.length;
  const valueLen = a[0].length;
  if (valueLen === void 0)
    return a;
  const length2 = arrayLen * valueLen;
  let value = arrayCacheF32[length2];
  if (!value)
    arrayCacheF32[length2] = value = new Float32Array(length2);
  for (let i = 0; i < arrayLen; i++)
    value.set(a[i], i * valueLen);
  return value;
}
function arraysEqual(a, b) {
  if (a.length !== b.length)
    return false;
  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i])
      return false;
  }
  return true;
}
function setArray(a, b) {
  for (let i = 0, l = a.length; i < l; i++) {
    a[i] = b[i];
  }
}
let warnCount = 0;
function warn(message) {
  if (warnCount > 100)
    return;
  console.warn(message);
  warnCount++;
  if (warnCount > 100)
    console.warn("More than 100 program warnings - stopping logs.");
}
const tempVec3$1 = new Vec3();
let ID$2 = 1;
class Renderer {
  constructor({
    canvas = document.createElement("canvas"),
    width = 300,
    height = 150,
    dpr = 1,
    alpha = false,
    depth = true,
    stencil = false,
    antialias = false,
    premultipliedAlpha = false,
    preserveDrawingBuffer = false,
    powerPreference = "default",
    autoClear = true,
    webgl = 2
  } = {}) {
    const attributes = {alpha, depth, stencil, antialias, premultipliedAlpha, preserveDrawingBuffer, powerPreference};
    this.dpr = dpr;
    this.alpha = alpha;
    this.color = true;
    this.depth = depth;
    this.stencil = stencil;
    this.premultipliedAlpha = premultipliedAlpha;
    this.autoClear = autoClear;
    this.id = ID$2++;
    if (webgl === 2)
      this.gl = canvas.getContext("webgl2", attributes);
    this.isWebgl2 = !!this.gl;
    if (!this.gl) {
      this.gl = canvas.getContext("webgl", attributes) || canvas.getContext("experimental-webgl", attributes);
    }
    if (!this.gl)
      console.error("unable to create webgl context");
    this.gl.renderer = this;
    this.setSize(width, height);
    this.state = {};
    this.state.blendFunc = {src: this.gl.ONE, dst: this.gl.ZERO};
    this.state.blendEquation = {modeRGB: this.gl.FUNC_ADD};
    this.state.cullFace = null;
    this.state.frontFace = this.gl.CCW;
    this.state.depthMask = true;
    this.state.depthFunc = this.gl.LESS;
    this.state.premultiplyAlpha = false;
    this.state.flipY = false;
    this.state.unpackAlignment = 4;
    this.state.framebuffer = null;
    this.state.viewport = {width: null, height: null};
    this.state.textureUnits = [];
    this.state.activeTextureUnit = 0;
    this.state.boundBuffer = null;
    this.state.uniformLocations = new Map();
    this.extensions = {};
    if (this.isWebgl2) {
      this.getExtension("EXT_color_buffer_float");
      this.getExtension("OES_texture_float_linear");
    } else {
      this.getExtension("OES_texture_float");
      this.getExtension("OES_texture_float_linear");
      this.getExtension("OES_texture_half_float");
      this.getExtension("OES_texture_half_float_linear");
      this.getExtension("OES_element_index_uint");
      this.getExtension("OES_standard_derivatives");
      this.getExtension("EXT_sRGB");
      this.getExtension("WEBGL_depth_texture");
      this.getExtension("WEBGL_draw_buffers");
    }
    this.vertexAttribDivisor = this.getExtension("ANGLE_instanced_arrays", "vertexAttribDivisor", "vertexAttribDivisorANGLE");
    this.drawArraysInstanced = this.getExtension("ANGLE_instanced_arrays", "drawArraysInstanced", "drawArraysInstancedANGLE");
    this.drawElementsInstanced = this.getExtension("ANGLE_instanced_arrays", "drawElementsInstanced", "drawElementsInstancedANGLE");
    this.createVertexArray = this.getExtension("OES_vertex_array_object", "createVertexArray", "createVertexArrayOES");
    this.bindVertexArray = this.getExtension("OES_vertex_array_object", "bindVertexArray", "bindVertexArrayOES");
    this.deleteVertexArray = this.getExtension("OES_vertex_array_object", "deleteVertexArray", "deleteVertexArrayOES");
    this.drawBuffers = this.getExtension("WEBGL_draw_buffers", "drawBuffers", "drawBuffersWEBGL");
    this.parameters = {};
    this.parameters.maxTextureUnits = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    this.parameters.maxAnisotropy = this.getExtension("EXT_texture_filter_anisotropic") ? this.gl.getParameter(this.getExtension("EXT_texture_filter_anisotropic").MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
  }
  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.gl.canvas.width = width * this.dpr;
    this.gl.canvas.height = height * this.dpr;
    Object.assign(this.gl.canvas.style, {
      width: width + "px",
      height: height + "px"
    });
  }
  setViewport(width, height) {
    if (this.state.viewport.width === width && this.state.viewport.height === height)
      return;
    this.state.viewport.width = width;
    this.state.viewport.height = height;
    this.gl.viewport(0, 0, width, height);
  }
  enable(id) {
    if (this.state[id] === true)
      return;
    this.gl.enable(id);
    this.state[id] = true;
  }
  disable(id) {
    if (this.state[id] === false)
      return;
    this.gl.disable(id);
    this.state[id] = false;
  }
  setBlendFunc(src, dst, srcAlpha, dstAlpha) {
    if (this.state.blendFunc.src === src && this.state.blendFunc.dst === dst && this.state.blendFunc.srcAlpha === srcAlpha && this.state.blendFunc.dstAlpha === dstAlpha)
      return;
    this.state.blendFunc.src = src;
    this.state.blendFunc.dst = dst;
    this.state.blendFunc.srcAlpha = srcAlpha;
    this.state.blendFunc.dstAlpha = dstAlpha;
    if (srcAlpha !== void 0)
      this.gl.blendFuncSeparate(src, dst, srcAlpha, dstAlpha);
    else
      this.gl.blendFunc(src, dst);
  }
  setBlendEquation(modeRGB, modeAlpha) {
    modeRGB = modeRGB || this.gl.FUNC_ADD;
    if (this.state.blendEquation.modeRGB === modeRGB && this.state.blendEquation.modeAlpha === modeAlpha)
      return;
    this.state.blendEquation.modeRGB = modeRGB;
    this.state.blendEquation.modeAlpha = modeAlpha;
    if (modeAlpha !== void 0)
      this.gl.blendEquationSeparate(modeRGB, modeAlpha);
    else
      this.gl.blendEquation(modeRGB);
  }
  setCullFace(value) {
    if (this.state.cullFace === value)
      return;
    this.state.cullFace = value;
    this.gl.cullFace(value);
  }
  setFrontFace(value) {
    if (this.state.frontFace === value)
      return;
    this.state.frontFace = value;
    this.gl.frontFace(value);
  }
  setDepthMask(value) {
    if (this.state.depthMask === value)
      return;
    this.state.depthMask = value;
    this.gl.depthMask(value);
  }
  setDepthFunc(value) {
    if (this.state.depthFunc === value)
      return;
    this.state.depthFunc = value;
    this.gl.depthFunc(value);
  }
  activeTexture(value) {
    if (this.state.activeTextureUnit === value)
      return;
    this.state.activeTextureUnit = value;
    this.gl.activeTexture(this.gl.TEXTURE0 + value);
  }
  bindFramebuffer({target = this.gl.FRAMEBUFFER, buffer = null} = {}) {
    if (this.state.framebuffer === buffer)
      return;
    this.state.framebuffer = buffer;
    this.gl.bindFramebuffer(target, buffer);
  }
  getExtension(extension, webgl2Func, extFunc) {
    if (webgl2Func && this.gl[webgl2Func])
      return this.gl[webgl2Func].bind(this.gl);
    if (!this.extensions[extension]) {
      this.extensions[extension] = this.gl.getExtension(extension);
    }
    if (!webgl2Func)
      return this.extensions[extension];
    if (!this.extensions[extension])
      return null;
    return this.extensions[extension][extFunc].bind(this.extensions[extension]);
  }
  sortOpaque(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    } else if (a.program.id !== b.program.id) {
      return a.program.id - b.program.id;
    } else if (a.zDepth !== b.zDepth) {
      return a.zDepth - b.zDepth;
    } else {
      return b.id - a.id;
    }
  }
  sortTransparent(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    }
    if (a.zDepth !== b.zDepth) {
      return b.zDepth - a.zDepth;
    } else {
      return b.id - a.id;
    }
  }
  sortUI(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    } else if (a.program.id !== b.program.id) {
      return a.program.id - b.program.id;
    } else {
      return b.id - a.id;
    }
  }
  getRenderList({scene, camera, frustumCull, sort}) {
    let renderList = [];
    if (camera && frustumCull)
      camera.updateFrustum();
    scene.traverse((node) => {
      if (!node.visible)
        return true;
      if (!node.draw)
        return;
      if (frustumCull && node.frustumCulled && camera) {
        if (!camera.frustumIntersectsMesh(node))
          return;
      }
      renderList.push(node);
    });
    if (sort) {
      const opaque = [];
      const transparent = [];
      const ui = [];
      renderList.forEach((node) => {
        if (!node.program.transparent) {
          opaque.push(node);
        } else if (node.program.depthTest) {
          transparent.push(node);
        } else {
          ui.push(node);
        }
        node.zDepth = 0;
        if (node.renderOrder !== 0 || !node.program.depthTest || !camera)
          return;
        node.worldMatrix.getTranslation(tempVec3$1);
        tempVec3$1.applyMatrix4(camera.projectionViewMatrix);
        node.zDepth = tempVec3$1.z;
      });
      opaque.sort(this.sortOpaque);
      transparent.sort(this.sortTransparent);
      ui.sort(this.sortUI);
      renderList = opaque.concat(transparent, ui);
    }
    return renderList;
  }
  render({scene, camera, target = null, update = true, sort = true, frustumCull = true, clear}) {
    if (target === null) {
      this.bindFramebuffer();
      this.setViewport(this.width * this.dpr, this.height * this.dpr);
    } else {
      this.bindFramebuffer(target);
      this.setViewport(target.width, target.height);
    }
    if (clear || this.autoClear && clear !== false) {
      if (this.depth && (!target || target.depth)) {
        this.enable(this.gl.DEPTH_TEST);
        this.setDepthMask(true);
      }
      this.gl.clear((this.color ? this.gl.COLOR_BUFFER_BIT : 0) | (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0) | (this.stencil ? this.gl.STENCIL_BUFFER_BIT : 0));
    }
    if (update)
      scene.updateMatrixWorld();
    if (camera)
      camera.updateMatrixWorld();
    const renderList = this.getRenderList({scene, camera, frustumCull, sort});
    renderList.forEach((node) => {
      node.draw({camera});
    });
  }
}
function copy$1(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function set$1(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
function normalize$1(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len = x * x + y * y + z * z + w * w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
function dot$1(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
function multiply$1(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
function rotateX(out, a, rad) {
  rad *= 0.5;
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
function rotateY(out, a, rad) {
  rad *= 0.5;
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let by = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
function rotateZ(out, a, rad) {
  rad *= 0.5;
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bz = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
function slerp(out, a, b, t) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];
  let omega, cosom, sinom, scale0, scale1;
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1 - cosom > 1e-6) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
function invert(out, a) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let dot2 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  let invDot = dot2 ? 1 / dot2 : 0;
  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
function fromMat3(out, m) {
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;
  if (fTrace > 0) {
    fRoot = Math.sqrt(fTrace + 1);
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    let i = 0;
    if (m[4] > m[0])
      i = 1;
    if (m[8] > m[i * 3 + i])
      i = 2;
    let j = (i + 1) % 3;
    let k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }
  return out;
}
function fromEuler(out, euler, order = "YXZ") {
  let sx = Math.sin(euler[0] * 0.5);
  let cx = Math.cos(euler[0] * 0.5);
  let sy = Math.sin(euler[1] * 0.5);
  let cy = Math.cos(euler[1] * 0.5);
  let sz = Math.sin(euler[2] * 0.5);
  let cz = Math.cos(euler[2] * 0.5);
  if (order === "XYZ") {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === "YXZ") {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === "ZXY") {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === "ZYX") {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === "YZX") {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === "XZY") {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  }
  return out;
}
const copy$2 = copy$1;
const set$2 = set$1;
const dot$2 = dot$1;
const normalize$2 = normalize$1;
class Quat extends Array {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super(x, y, z, w);
    this.onChange = () => {
    };
    return this;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  get w() {
    return this[3];
  }
  set x(v) {
    this[0] = v;
    this.onChange();
  }
  set y(v) {
    this[1] = v;
    this.onChange();
  }
  set z(v) {
    this[2] = v;
    this.onChange();
  }
  set w(v) {
    this[3] = v;
    this.onChange();
  }
  identity() {
    identity(this);
    this.onChange();
    return this;
  }
  set(x, y, z, w) {
    if (x.length)
      return this.copy(x);
    set$2(this, x, y, z, w);
    this.onChange();
    return this;
  }
  rotateX(a) {
    rotateX(this, this, a);
    this.onChange();
    return this;
  }
  rotateY(a) {
    rotateY(this, this, a);
    this.onChange();
    return this;
  }
  rotateZ(a) {
    rotateZ(this, this, a);
    this.onChange();
    return this;
  }
  inverse(q = this) {
    invert(this, q);
    this.onChange();
    return this;
  }
  conjugate(q = this) {
    conjugate(this, q);
    this.onChange();
    return this;
  }
  copy(q) {
    copy$2(this, q);
    this.onChange();
    return this;
  }
  normalize(q = this) {
    normalize$2(this, q);
    this.onChange();
    return this;
  }
  multiply(qA, qB) {
    if (qB) {
      multiply$1(this, qA, qB);
    } else {
      multiply$1(this, this, qA);
    }
    this.onChange();
    return this;
  }
  dot(v) {
    return dot$2(this, v);
  }
  fromMatrix3(matrix3) {
    fromMat3(this, matrix3);
    this.onChange();
    return this;
  }
  fromEuler(euler) {
    fromEuler(this, euler, euler.order);
    return this;
  }
  fromAxisAngle(axis, a) {
    setAxisAngle(this, axis, a);
    return this;
  }
  slerp(q, t) {
    slerp(this, this, q, t);
    return this;
  }
  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    this[3] = a[o + 3];
    return this;
  }
  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    a[o + 3] = this[3];
    return a;
  }
}
const EPSILON = 1e-6;
function copy$3(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function set$3(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
function identity$1(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function invert$1(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
function determinant(a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
function multiply$2(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
function translate(out, a, v) {
  let x = v[0], y = v[1], z = v[2];
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
}
function scale$1(out, a, v) {
  let x = v[0], y = v[1], z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function rotate(out, a, rad, axis) {
  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.hypot(x, y, z);
  let s, c, t;
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  let b00, b01, b02;
  let b10, b11, b12;
  let b20, b21, b22;
  if (Math.abs(len) < EPSILON) {
    return null;
  }
  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;
  if (a !== out) {
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
function getScaling(out, mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
function getMaxScaleOnAxis(mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  const x = m11 * m11 + m12 * m12 + m13 * m13;
  const y = m21 * m21 + m22 * m22 + m23 * m23;
  const z = m31 * m31 + m32 * m32 + m33 * m33;
  return Math.sqrt(Math.max(x, y, z));
}
const getRotation = function() {
  const temp = [0, 0, 0];
  return function(out, mat) {
    let scaling = temp;
    getScaling(scaling, mat);
    let is1 = 1 / scaling[0];
    let is2 = 1 / scaling[1];
    let is3 = 1 / scaling[2];
    let sm11 = mat[0] * is1;
    let sm12 = mat[1] * is2;
    let sm13 = mat[2] * is3;
    let sm21 = mat[4] * is1;
    let sm22 = mat[5] * is2;
    let sm23 = mat[6] * is3;
    let sm31 = mat[8] * is1;
    let sm32 = mat[9] * is2;
    let sm33 = mat[10] * is3;
    let trace = sm11 + sm22 + sm33;
    let S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }
    return out;
  };
}();
function fromRotationTranslationScale(out, q, v, s) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  let sx = s[0];
  let sy = s[1];
  let sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
function fromQuat(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function perspective(out, fovy, aspect, near, far) {
  let f = 1 / Math.tan(fovy / 2);
  let nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
  return out;
}
function ortho(out, left, right, bottom, top, near, far) {
  let lr = 1 / (left - right);
  let bt = 1 / (bottom - top);
  let nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
function targetTo(out, eye, target, up) {
  let eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
  let z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
  let len = z0 * z0 + z1 * z1 + z2 * z2;
  if (len === 0) {
    z2 = 1;
  } else {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }
  let x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;
  if (len === 0) {
    if (upz) {
      upx += 1e-6;
    } else if (upy) {
      upz += 1e-6;
    } else {
      upy += 1e-6;
    }
    x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
  }
  len = 1 / Math.sqrt(len);
  x0 *= len;
  x1 *= len;
  x2 *= len;
  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
class Mat4 extends Array {
  constructor(m00 = 1, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 1, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 1, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 1) {
    super(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    return this;
  }
  get x() {
    return this[12];
  }
  get y() {
    return this[13];
  }
  get z() {
    return this[14];
  }
  get w() {
    return this[15];
  }
  set x(v) {
    this[12] = v;
  }
  set y(v) {
    this[13] = v;
  }
  set z(v) {
    this[14] = v;
  }
  set w(v) {
    this[15] = v;
  }
  set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    if (m00.length)
      return this.copy(m00);
    set$3(this, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    return this;
  }
  translate(v, m = this) {
    translate(this, m, v);
    return this;
  }
  rotate(v, axis, m = this) {
    rotate(this, m, v, axis);
    return this;
  }
  scale(v, m = this) {
    scale$1(this, m, typeof v === "number" ? [v, v, v] : v);
    return this;
  }
  multiply(ma, mb) {
    if (mb) {
      multiply$2(this, ma, mb);
    } else {
      multiply$2(this, this, ma);
    }
    return this;
  }
  identity() {
    identity$1(this);
    return this;
  }
  copy(m) {
    copy$3(this, m);
    return this;
  }
  fromPerspective({fov, aspect, near, far} = {}) {
    perspective(this, fov, aspect, near, far);
    return this;
  }
  fromOrthogonal({left, right, bottom, top, near, far}) {
    ortho(this, left, right, bottom, top, near, far);
    return this;
  }
  fromQuaternion(q) {
    fromQuat(this, q);
    return this;
  }
  setPosition(v) {
    this.x = v[0];
    this.y = v[1];
    this.z = v[2];
    return this;
  }
  inverse(m = this) {
    invert$1(this, m);
    return this;
  }
  compose(q, pos, scale2) {
    fromRotationTranslationScale(this, q, pos, scale2);
    return this;
  }
  getRotation(q) {
    getRotation(q, this);
    return this;
  }
  getTranslation(pos) {
    getTranslation(pos, this);
    return this;
  }
  getScaling(scale2) {
    getScaling(scale2, this);
    return this;
  }
  getMaxScaleOnAxis() {
    return getMaxScaleOnAxis(this);
  }
  lookAt(eye, target, up) {
    targetTo(this, eye, target, up);
    return this;
  }
  determinant() {
    return determinant(this);
  }
  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    this[3] = a[o + 3];
    this[4] = a[o + 4];
    this[5] = a[o + 5];
    this[6] = a[o + 6];
    this[7] = a[o + 7];
    this[8] = a[o + 8];
    this[9] = a[o + 9];
    this[10] = a[o + 10];
    this[11] = a[o + 11];
    this[12] = a[o + 12];
    this[13] = a[o + 13];
    this[14] = a[o + 14];
    this[15] = a[o + 15];
    return this;
  }
  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    a[o + 3] = this[3];
    a[o + 4] = this[4];
    a[o + 5] = this[5];
    a[o + 6] = this[6];
    a[o + 7] = this[7];
    a[o + 8] = this[8];
    a[o + 9] = this[9];
    a[o + 10] = this[10];
    a[o + 11] = this[11];
    a[o + 12] = this[12];
    a[o + 13] = this[13];
    a[o + 14] = this[14];
    a[o + 15] = this[15];
    return a;
  }
}
function fromRotationMatrix(out, m, order = "YXZ") {
  if (order === "XYZ") {
    out[1] = Math.asin(Math.min(Math.max(m[8], -1), 1));
    if (Math.abs(m[8]) < 0.99999) {
      out[0] = Math.atan2(-m[9], m[10]);
      out[2] = Math.atan2(-m[4], m[0]);
    } else {
      out[0] = Math.atan2(m[6], m[5]);
      out[2] = 0;
    }
  } else if (order === "YXZ") {
    out[0] = Math.asin(-Math.min(Math.max(m[9], -1), 1));
    if (Math.abs(m[9]) < 0.99999) {
      out[1] = Math.atan2(m[8], m[10]);
      out[2] = Math.atan2(m[1], m[5]);
    } else {
      out[1] = Math.atan2(-m[2], m[0]);
      out[2] = 0;
    }
  } else if (order === "ZXY") {
    out[0] = Math.asin(Math.min(Math.max(m[6], -1), 1));
    if (Math.abs(m[6]) < 0.99999) {
      out[1] = Math.atan2(-m[2], m[10]);
      out[2] = Math.atan2(-m[4], m[5]);
    } else {
      out[1] = 0;
      out[2] = Math.atan2(m[1], m[0]);
    }
  } else if (order === "ZYX") {
    out[1] = Math.asin(-Math.min(Math.max(m[2], -1), 1));
    if (Math.abs(m[2]) < 0.99999) {
      out[0] = Math.atan2(m[6], m[10]);
      out[2] = Math.atan2(m[1], m[0]);
    } else {
      out[0] = 0;
      out[2] = Math.atan2(-m[4], m[5]);
    }
  } else if (order === "YZX") {
    out[2] = Math.asin(Math.min(Math.max(m[1], -1), 1));
    if (Math.abs(m[1]) < 0.99999) {
      out[0] = Math.atan2(-m[9], m[5]);
      out[1] = Math.atan2(-m[2], m[0]);
    } else {
      out[0] = 0;
      out[1] = Math.atan2(m[8], m[10]);
    }
  } else if (order === "XZY") {
    out[2] = Math.asin(-Math.min(Math.max(m[4], -1), 1));
    if (Math.abs(m[4]) < 0.99999) {
      out[0] = Math.atan2(m[6], m[5]);
      out[1] = Math.atan2(m[8], m[0]);
    } else {
      out[0] = Math.atan2(-m[9], m[10]);
      out[1] = 0;
    }
  }
  return out;
}
const tmpMat4 = new Mat4();
class Euler extends Array {
  constructor(x = 0, y = x, z = x, order = "YXZ") {
    super(x, y, z);
    this.order = order;
    this.onChange = () => {
    };
    return this;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  set x(v) {
    this[0] = v;
    this.onChange();
  }
  set y(v) {
    this[1] = v;
    this.onChange();
  }
  set z(v) {
    this[2] = v;
    this.onChange();
  }
  set(x, y = x, z = x) {
    if (x.length)
      return this.copy(x);
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this.onChange();
    return this;
  }
  copy(v) {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    this.onChange();
    return this;
  }
  reorder(order) {
    this.order = order;
    this.onChange();
    return this;
  }
  fromRotationMatrix(m, order = this.order) {
    fromRotationMatrix(this, m, order);
    return this;
  }
  fromQuaternion(q, order = this.order) {
    tmpMat4.fromQuaternion(q);
    return this.fromRotationMatrix(tmpMat4, order);
  }
  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    return a;
  }
}
class Transform {
  constructor() {
    this.parent = null;
    this.children = [];
    this.visible = true;
    this.matrix = new Mat4();
    this.worldMatrix = new Mat4();
    this.matrixAutoUpdate = true;
    this.position = new Vec3();
    this.quaternion = new Quat();
    this.scale = new Vec3(1);
    this.rotation = new Euler();
    this.up = new Vec3(0, 1, 0);
    this.rotation.onChange = () => this.quaternion.fromEuler(this.rotation);
    this.quaternion.onChange = () => this.rotation.fromQuaternion(this.quaternion);
  }
  setParent(parent, notifyParent = true) {
    if (this.parent && parent !== this.parent)
      this.parent.removeChild(this, false);
    this.parent = parent;
    if (notifyParent && parent)
      parent.addChild(this, false);
  }
  addChild(child, notifyChild = true) {
    if (!~this.children.indexOf(child))
      this.children.push(child);
    if (notifyChild)
      child.setParent(this, false);
  }
  removeChild(child, notifyChild = true) {
    if (!!~this.children.indexOf(child))
      this.children.splice(this.children.indexOf(child), 1);
    if (notifyChild)
      child.setParent(null, false);
  }
  updateMatrixWorld(force) {
    if (this.matrixAutoUpdate)
      this.updateMatrix();
    if (this.worldMatrixNeedsUpdate || force) {
      if (this.parent === null)
        this.worldMatrix.copy(this.matrix);
      else
        this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix);
      this.worldMatrixNeedsUpdate = false;
      force = true;
    }
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].updateMatrixWorld(force);
    }
  }
  updateMatrix() {
    this.matrix.compose(this.quaternion, this.position, this.scale);
    this.worldMatrixNeedsUpdate = true;
  }
  traverse(callback) {
    if (callback(this))
      return;
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].traverse(callback);
    }
  }
  decompose() {
    this.matrix.getTranslation(this.position);
    this.matrix.getRotation(this.quaternion);
    this.matrix.getScaling(this.scale);
    this.rotation.fromQuaternion(this.quaternion);
  }
  lookAt(target, invert2 = false) {
    if (invert2)
      this.matrix.lookAt(this.position, target, this.up);
    else
      this.matrix.lookAt(target, this.position, this.up);
    this.matrix.getRotation(this.quaternion);
    this.rotation.fromQuaternion(this.quaternion);
  }
}
const tempMat4 = new Mat4();
const tempVec3a = new Vec3();
const tempVec3b = new Vec3();
class Camera extends Transform {
  constructor(gl, {near = 0.1, far = 100, fov = 45, aspect = 1, left, right, bottom, top, zoom = 1} = {}) {
    super();
    Object.assign(this, {near, far, fov, aspect, left, right, bottom, top, zoom});
    this.projectionMatrix = new Mat4();
    this.viewMatrix = new Mat4();
    this.projectionViewMatrix = new Mat4();
    this.worldPosition = new Vec3();
    this.type = left || right ? "orthographic" : "perspective";
    if (this.type === "orthographic")
      this.orthographic();
    else
      this.perspective();
  }
  perspective({near = this.near, far = this.far, fov = this.fov, aspect = this.aspect} = {}) {
    Object.assign(this, {near, far, fov, aspect});
    this.projectionMatrix.fromPerspective({fov: fov * (Math.PI / 180), aspect, near, far});
    this.type = "perspective";
    return this;
  }
  orthographic({
    near = this.near,
    far = this.far,
    left = this.left,
    right = this.right,
    bottom = this.bottom,
    top = this.top,
    zoom = this.zoom
  } = {}) {
    Object.assign(this, {near, far, left, right, bottom, top, zoom});
    left /= zoom;
    right /= zoom;
    bottom /= zoom;
    top /= zoom;
    this.projectionMatrix.fromOrthogonal({left, right, bottom, top, near, far});
    this.type = "orthographic";
    return this;
  }
  updateMatrixWorld() {
    super.updateMatrixWorld();
    this.viewMatrix.inverse(this.worldMatrix);
    this.worldMatrix.getTranslation(this.worldPosition);
    this.projectionViewMatrix.multiply(this.projectionMatrix, this.viewMatrix);
    return this;
  }
  lookAt(target) {
    super.lookAt(target, true);
    return this;
  }
  project(v) {
    v.applyMatrix4(this.viewMatrix);
    v.applyMatrix4(this.projectionMatrix);
    return this;
  }
  unproject(v) {
    v.applyMatrix4(tempMat4.inverse(this.projectionMatrix));
    v.applyMatrix4(this.worldMatrix);
    return this;
  }
  updateFrustum() {
    if (!this.frustum) {
      this.frustum = [new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()];
    }
    const m = this.projectionViewMatrix;
    this.frustum[0].set(m[3] - m[0], m[7] - m[4], m[11] - m[8]).constant = m[15] - m[12];
    this.frustum[1].set(m[3] + m[0], m[7] + m[4], m[11] + m[8]).constant = m[15] + m[12];
    this.frustum[2].set(m[3] + m[1], m[7] + m[5], m[11] + m[9]).constant = m[15] + m[13];
    this.frustum[3].set(m[3] - m[1], m[7] - m[5], m[11] - m[9]).constant = m[15] - m[13];
    this.frustum[4].set(m[3] - m[2], m[7] - m[6], m[11] - m[10]).constant = m[15] - m[14];
    this.frustum[5].set(m[3] + m[2], m[7] + m[6], m[11] + m[10]).constant = m[15] + m[14];
    for (let i = 0; i < 6; i++) {
      const invLen = 1 / this.frustum[i].distance();
      this.frustum[i].multiply(invLen);
      this.frustum[i].constant *= invLen;
    }
  }
  frustumIntersectsMesh(node) {
    if (!node.geometry.attributes.position)
      return true;
    if (!node.geometry.bounds || node.geometry.bounds.radius === Infinity)
      node.geometry.computeBoundingSphere();
    if (!node.geometry.bounds)
      return true;
    const center = tempVec3a;
    center.copy(node.geometry.bounds.center);
    center.applyMatrix4(node.worldMatrix);
    const radius = node.geometry.bounds.radius * node.worldMatrix.getMaxScaleOnAxis();
    return this.frustumIntersectsSphere(center, radius);
  }
  frustumIntersectsSphere(center, radius) {
    const normal = tempVec3b;
    for (let i = 0; i < 6; i++) {
      const plane = this.frustum[i];
      const distance2 = normal.copy(plane).dot(center) + plane.constant;
      if (distance2 < -radius)
        return false;
    }
    return true;
  }
}
function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}
function fromQuat$1(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}
function copy$4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
function set$4(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
function identity$2(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
function invert$2(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];
  let b01 = a22 * a11 - a12 * a21;
  let b11 = -a22 * a10 + a12 * a20;
  let b21 = a21 * a10 - a11 * a20;
  let det = a00 * b01 + a01 * b11 + a02 * b21;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
function multiply$3(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];
  let b00 = b[0], b01 = b[1], b02 = b[2];
  let b10 = b[3], b11 = b[4], b12 = b[5];
  let b20 = b[6], b21 = b[7], b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
function translate$1(out, a, v) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
function rotate$1(out, a, rad) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
function scale$2(out, a, v) {
  let x = v[0], y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
function normalFromMat4(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}
class Mat3 extends Array {
  constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
    super(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    return this;
  }
  set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    if (m00.length)
      return this.copy(m00);
    set$4(this, m00, m01, m02, m10, m11, m12, m20, m21, m22);
    return this;
  }
  translate(v, m = this) {
    translate$1(this, m, v);
    return this;
  }
  rotate(v, m = this) {
    rotate$1(this, m, v);
    return this;
  }
  scale(v, m = this) {
    scale$2(this, m, v);
    return this;
  }
  multiply(ma, mb) {
    if (mb) {
      multiply$3(this, ma, mb);
    } else {
      multiply$3(this, this, ma);
    }
    return this;
  }
  identity() {
    identity$2(this);
    return this;
  }
  copy(m) {
    copy$4(this, m);
    return this;
  }
  fromMatrix4(m) {
    fromMat4(this, m);
    return this;
  }
  fromQuaternion(q) {
    fromQuat$1(this, q);
    return this;
  }
  fromBasis(vec3a, vec3b, vec3c) {
    this.set(vec3a[0], vec3a[1], vec3a[2], vec3b[0], vec3b[1], vec3b[2], vec3c[0], vec3c[1], vec3c[2]);
    return this;
  }
  inverse(m = this) {
    invert$2(this, m);
    return this;
  }
  getNormalMatrix(m) {
    normalFromMat4(this, m);
    return this;
  }
}
let ID$3 = 0;
class Mesh extends Transform {
  constructor(gl, {geometry, program, mode = gl.TRIANGLES, frustumCulled = true, renderOrder = 0} = {}) {
    super();
    if (!gl.canvas)
      console.error("gl not passed as first argument to Mesh");
    this.gl = gl;
    this.id = ID$3++;
    this.geometry = geometry;
    this.program = program;
    this.mode = mode;
    this.frustumCulled = frustumCulled;
    this.renderOrder = renderOrder;
    this.modelViewMatrix = new Mat4();
    this.normalMatrix = new Mat3();
    this.beforeRenderCallbacks = [];
    this.afterRenderCallbacks = [];
  }
  onBeforeRender(f) {
    this.beforeRenderCallbacks.push(f);
    return this;
  }
  onAfterRender(f) {
    this.afterRenderCallbacks.push(f);
    return this;
  }
  draw({camera} = {}) {
    this.beforeRenderCallbacks.forEach((f) => f && f({mesh: this, camera}));
    if (camera) {
      if (!this.program.uniforms.modelMatrix) {
        Object.assign(this.program.uniforms, {
          modelMatrix: {value: null},
          viewMatrix: {value: null},
          modelViewMatrix: {value: null},
          normalMatrix: {value: null},
          projectionMatrix: {value: null},
          cameraPosition: {value: null}
        });
      }
      this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
      this.program.uniforms.cameraPosition.value = camera.worldPosition;
      this.program.uniforms.viewMatrix.value = camera.viewMatrix;
      this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);
      this.normalMatrix.getNormalMatrix(this.modelViewMatrix);
      this.program.uniforms.modelMatrix.value = this.worldMatrix;
      this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
      this.program.uniforms.normalMatrix.value = this.normalMatrix;
    }
    let flipFaces = this.program.cullFace && this.worldMatrix.determinant() < 0;
    this.program.use({flipFaces});
    this.geometry.draw({mode: this.mode, program: this.program});
    this.afterRenderCallbacks.forEach((f) => f && f({mesh: this, camera}));
  }
}
const emptyPixel = new Uint8Array(4);
function isPowerOf2(value) {
  return (value & value - 1) === 0;
}
let ID$4 = 1;
class Texture {
  constructor(gl, {
    image,
    target = gl.TEXTURE_2D,
    type = gl.UNSIGNED_BYTE,
    format = gl.RGBA,
    internalFormat = format,
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    generateMipmaps = true,
    minFilter = generateMipmaps ? gl.NEAREST_MIPMAP_LINEAR : gl.LINEAR,
    magFilter = gl.LINEAR,
    premultiplyAlpha = false,
    unpackAlignment = 4,
    flipY = target == gl.TEXTURE_2D ? true : false,
    anisotropy = 0,
    level = 0,
    width,
    height = width
  } = {}) {
    this.gl = gl;
    this.id = ID$4++;
    this.image = image;
    this.target = target;
    this.type = type;
    this.format = format;
    this.internalFormat = internalFormat;
    this.minFilter = minFilter;
    this.magFilter = magFilter;
    this.wrapS = wrapS;
    this.wrapT = wrapT;
    this.generateMipmaps = generateMipmaps;
    this.premultiplyAlpha = premultiplyAlpha;
    this.unpackAlignment = unpackAlignment;
    this.flipY = flipY;
    this.anisotropy = Math.min(anisotropy, this.gl.renderer.parameters.maxAnisotropy);
    this.level = level;
    this.width = width;
    this.height = height;
    this.texture = this.gl.createTexture();
    this.store = {
      image: null
    };
    this.glState = this.gl.renderer.state;
    this.state = {};
    this.state.minFilter = this.gl.NEAREST_MIPMAP_LINEAR;
    this.state.magFilter = this.gl.LINEAR;
    this.state.wrapS = this.gl.REPEAT;
    this.state.wrapT = this.gl.REPEAT;
    this.state.anisotropy = 0;
  }
  bind() {
    if (this.glState.textureUnits[this.glState.activeTextureUnit] === this.id)
      return;
    this.gl.bindTexture(this.target, this.texture);
    this.glState.textureUnits[this.glState.activeTextureUnit] = this.id;
  }
  update(textureUnit = 0) {
    const needsUpdate = !(this.image === this.store.image && !this.needsUpdate);
    if (needsUpdate || this.glState.textureUnits[textureUnit] !== this.id) {
      this.gl.renderer.activeTexture(textureUnit);
      this.bind();
    }
    if (!needsUpdate)
      return;
    this.needsUpdate = false;
    if (this.flipY !== this.glState.flipY) {
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
      this.glState.flipY = this.flipY;
    }
    if (this.premultiplyAlpha !== this.glState.premultiplyAlpha) {
      this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
      this.glState.premultiplyAlpha = this.premultiplyAlpha;
    }
    if (this.unpackAlignment !== this.glState.unpackAlignment) {
      this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, this.unpackAlignment);
      this.glState.unpackAlignment = this.unpackAlignment;
    }
    if (this.minFilter !== this.state.minFilter) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.minFilter);
      this.state.minFilter = this.minFilter;
    }
    if (this.magFilter !== this.state.magFilter) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.magFilter);
      this.state.magFilter = this.magFilter;
    }
    if (this.wrapS !== this.state.wrapS) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.wrapS);
      this.state.wrapS = this.wrapS;
    }
    if (this.wrapT !== this.state.wrapT) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.wrapT);
      this.state.wrapT = this.wrapT;
    }
    if (this.anisotropy && this.anisotropy !== this.state.anisotropy) {
      this.gl.texParameterf(this.target, this.gl.renderer.getExtension("EXT_texture_filter_anisotropic").TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropy);
      this.state.anisotropy = this.anisotropy;
    }
    if (this.image) {
      if (this.image.width) {
        this.width = this.image.width;
        this.height = this.image.height;
      }
      if (this.target === this.gl.TEXTURE_CUBE_MAP) {
        for (let i = 0; i < 6; i++) {
          this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.level, this.internalFormat, this.format, this.type, this.image[i]);
        }
      } else if (ArrayBuffer.isView(this.image)) {
        this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.image);
      } else if (this.image.isCompressedTexture) {
        for (let level = 0; level < this.image.length; level++) {
          this.gl.compressedTexImage2D(this.target, level, this.internalFormat, this.image[level].width, this.image[level].height, 0, this.image[level].data);
        }
      } else {
        this.gl.texImage2D(this.target, this.level, this.internalFormat, this.format, this.type, this.image);
      }
      if (this.generateMipmaps) {
        if (!this.gl.renderer.isWebgl2 && (!isPowerOf2(this.image.width) || !isPowerOf2(this.image.height))) {
          this.generateMipmaps = false;
          this.wrapS = this.wrapT = this.gl.CLAMP_TO_EDGE;
          this.minFilter = this.gl.LINEAR;
        } else {
          this.gl.generateMipmap(this.target);
        }
      }
      this.onUpdate && this.onUpdate();
    } else {
      if (this.target === this.gl.TEXTURE_CUBE_MAP) {
        for (let i = 0; i < 6; i++) {
          this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
        }
      } else if (this.width) {
        this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, null);
      } else {
        this.gl.texImage2D(this.target, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
      }
    }
    this.store.image = this.image;
  }
}
class RenderTarget {
  constructor(gl, {
    width = gl.canvas.width,
    height = gl.canvas.height,
    target = gl.FRAMEBUFFER,
    color = 1,
    depth = true,
    stencil = false,
    depthTexture = false,
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    minFilter = gl.LINEAR,
    magFilter = minFilter,
    type = gl.UNSIGNED_BYTE,
    format = gl.RGBA,
    internalFormat = format,
    unpackAlignment,
    premultiplyAlpha
  } = {}) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.buffer = this.gl.createFramebuffer();
    this.target = target;
    this.gl.bindFramebuffer(this.target, this.buffer);
    this.textures = [];
    const drawBuffers = [];
    for (let i = 0; i < color; i++) {
      this.textures.push(new Texture(gl, {
        width,
        height,
        wrapS,
        wrapT,
        minFilter,
        magFilter,
        type,
        format,
        internalFormat,
        unpackAlignment,
        premultiplyAlpha,
        flipY: false,
        generateMipmaps: false
      }));
      this.textures[i].update();
      this.gl.framebufferTexture2D(this.target, this.gl.COLOR_ATTACHMENT0 + i, this.gl.TEXTURE_2D, this.textures[i].texture, 0);
      drawBuffers.push(this.gl.COLOR_ATTACHMENT0 + i);
    }
    if (drawBuffers.length > 1)
      this.gl.renderer.drawBuffers(drawBuffers);
    this.texture = this.textures[0];
    if (depthTexture && (this.gl.renderer.isWebgl2 || this.gl.renderer.getExtension("WEBGL_depth_texture"))) {
      this.depthTexture = new Texture(gl, {
        width,
        height,
        minFilter: this.gl.NEAREST,
        magFilter: this.gl.NEAREST,
        format: this.gl.DEPTH_COMPONENT,
        internalFormat: gl.renderer.isWebgl2 ? this.gl.DEPTH_COMPONENT16 : this.gl.DEPTH_COMPONENT,
        type: this.gl.UNSIGNED_INT
      });
      this.depthTexture.update();
      this.gl.framebufferTexture2D(this.target, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture.texture, 0);
    } else {
      if (depth && !stencil) {
        this.depthBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
        this.gl.framebufferRenderbuffer(this.target, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthBuffer);
      }
      if (stencil && !depth) {
        this.stencilBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.stencilBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.STENCIL_INDEX8, width, height);
        this.gl.framebufferRenderbuffer(this.target, this.gl.STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, this.stencilBuffer);
      }
      if (depth && stencil) {
        this.depthStencilBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthStencilBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_STENCIL, width, height);
        this.gl.framebufferRenderbuffer(this.target, this.gl.DEPTH_STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, this.depthStencilBuffer);
      }
    }
    this.gl.bindFramebuffer(this.target, null);
  }
}
const NAMES = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
  fuchsia: "#ff00ff",
  cyan: "#00ffff",
  yellow: "#ffff00",
  orange: "#ff8000"
};
function hexToRGB(hex) {
  if (hex.length === 4)
    hex = hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!rgb)
    console.warn(`Unable to convert hex string ${hex} to rgb values`);
  return [parseInt(rgb[1], 16) / 255, parseInt(rgb[2], 16) / 255, parseInt(rgb[3], 16) / 255];
}
function numberToRGB(num) {
  num = parseInt(num);
  return [(num >> 16 & 255) / 255, (num >> 8 & 255) / 255, (num & 255) / 255];
}
function parseColor(color) {
  if (color === void 0)
    return [0, 0, 0];
  if (arguments.length === 3)
    return arguments;
  if (!isNaN(color))
    return numberToRGB(color);
  if (color[0] === "#")
    return hexToRGB(color);
  if (NAMES[color.toLowerCase()])
    return hexToRGB(NAMES[color.toLowerCase()]);
  console.warn("Color format not recognised");
  return [0, 0, 0];
}
class Color extends Array {
  constructor(color) {
    if (Array.isArray(color))
      return super(...color);
    return super(...parseColor(...arguments));
  }
  get r() {
    return this[0];
  }
  get g() {
    return this[1];
  }
  get b() {
    return this[2];
  }
  set r(v) {
    this[0] = v;
  }
  set g(v) {
    this[1] = v;
  }
  set b(v) {
    this[2] = v;
  }
  set(color) {
    if (Array.isArray(color))
      return this.copy(color);
    return this.copy(parseColor(...arguments));
  }
  copy(v) {
    this[0] = v[0];
    this[1] = v[1];
    this[2] = v[2];
    return this;
  }
}
function copy$5(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
function set$5(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
function add$1(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
function subtract$1(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
function multiply$4(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
function divide$1(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}
function scale$3(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
function distance$1(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
}
function squaredDistance$1(a, b) {
  var x = b[0] - a[0], y = b[1] - a[1];
  return x * x + y * y;
}
function length$1(a) {
  var x = a[0], y = a[1];
  return Math.sqrt(x * x + y * y);
}
function squaredLength$1(a) {
  var x = a[0], y = a[1];
  return x * x + y * y;
}
function negate$1(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
function inverse$1(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  return out;
}
function normalize$3(out, a) {
  var x = a[0], y = a[1];
  var len = x * x + y * y;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}
function dot$3(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
function cross$1(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}
function lerp$1(out, a, b, t) {
  var ax = a[0], ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
function transformMat3(out, a, m) {
  var x = a[0], y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
function transformMat4$1(out, a, m) {
  let x = a[0];
  let y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}
function exactEquals$1(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
class Vec2 extends Array {
  constructor(x = 0, y = x) {
    super(x, y);
    return this;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  set x(v) {
    this[0] = v;
  }
  set y(v) {
    this[1] = v;
  }
  set(x, y = x) {
    if (x.length)
      return this.copy(x);
    set$5(this, x, y);
    return this;
  }
  copy(v) {
    copy$5(this, v);
    return this;
  }
  add(va, vb) {
    if (vb)
      add$1(this, va, vb);
    else
      add$1(this, this, va);
    return this;
  }
  sub(va, vb) {
    if (vb)
      subtract$1(this, va, vb);
    else
      subtract$1(this, this, va);
    return this;
  }
  multiply(v) {
    if (v.length)
      multiply$4(this, this, v);
    else
      scale$3(this, this, v);
    return this;
  }
  divide(v) {
    if (v.length)
      divide$1(this, this, v);
    else
      scale$3(this, this, 1 / v);
    return this;
  }
  inverse(v = this) {
    inverse$1(this, v);
    return this;
  }
  len() {
    return length$1(this);
  }
  distance(v) {
    if (v)
      return distance$1(this, v);
    else
      return length$1(this);
  }
  squaredLen() {
    return this.squaredDistance();
  }
  squaredDistance(v) {
    if (v)
      return squaredDistance$1(this, v);
    else
      return squaredLength$1(this);
  }
  negate(v = this) {
    negate$1(this, v);
    return this;
  }
  cross(va, vb) {
    if (vb)
      return cross$1(va, vb);
    return cross$1(this, va);
  }
  scale(v) {
    scale$3(this, this, v);
    return this;
  }
  normalize() {
    normalize$3(this, this);
    return this;
  }
  dot(v) {
    return dot$3(this, v);
  }
  equals(v) {
    return exactEquals$1(this, v);
  }
  applyMatrix3(mat3) {
    transformMat3(this, this, mat3);
    return this;
  }
  applyMatrix4(mat4) {
    transformMat4$1(this, this, mat4);
    return this;
  }
  lerp(v, a) {
    lerp$1(this, this, v, a);
  }
  clone() {
    return new Vec2(this[0], this[1]);
  }
  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    return this;
  }
  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    return a;
  }
}
class Vec4 extends Array {
  constructor(x = 0, y = x, z = x, w = x) {
    super(x, y, z, w);
    return this;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  get w() {
    return this[3];
  }
  set x(v) {
    this[0] = v;
  }
  set y(v) {
    this[1] = v;
  }
  set z(v) {
    this[2] = v;
  }
  set w(v) {
    this[3] = v;
  }
  set(x, y, z, w) {
    if (x.length)
      return this.copy(x);
    set$1(this, x, y, z, w);
    return this;
  }
  copy(v) {
    copy$1(this, v);
    return this;
  }
  normalize() {
    normalize$1(this, this);
    return this;
  }
  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    this[3] = a[o + 3];
    return this;
  }
  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    a[o + 3] = this[3];
    return a;
  }
}
class Plane extends Geometry {
  constructor(gl, {width = 1, height = 1, widthSegments = 1, heightSegments = 1, attributes = {}} = {}) {
    const wSegs = widthSegments;
    const hSegs = heightSegments;
    const num = (wSegs + 1) * (hSegs + 1);
    const numIndices = wSegs * hSegs * 6;
    const position = new Float32Array(num * 3);
    const normal = new Float32Array(num * 3);
    const uv = new Float32Array(num * 2);
    const index = num > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
    Plane.buildPlane(position, normal, uv, index, width, height, 0, wSegs, hSegs);
    Object.assign(attributes, {
      position: {size: 3, data: position},
      normal: {size: 3, data: normal},
      uv: {size: 2, data: uv},
      index: {data: index}
    });
    super(gl, attributes);
  }
  static buildPlane(position, normal, uv, index, width, height, depth, wSegs, hSegs, u = 0, v = 1, w = 2, uDir = 1, vDir = -1, i = 0, ii = 0) {
    const io = i;
    const segW = width / wSegs;
    const segH = height / hSegs;
    for (let iy = 0; iy <= hSegs; iy++) {
      let y = iy * segH - height / 2;
      for (let ix = 0; ix <= wSegs; ix++, i++) {
        let x = ix * segW - width / 2;
        position[i * 3 + u] = x * uDir;
        position[i * 3 + v] = y * vDir;
        position[i * 3 + w] = depth / 2;
        normal[i * 3 + u] = 0;
        normal[i * 3 + v] = 0;
        normal[i * 3 + w] = depth >= 0 ? 1 : -1;
        uv[i * 2] = ix / wSegs;
        uv[i * 2 + 1] = 1 - iy / hSegs;
        if (iy === hSegs || ix === wSegs)
          continue;
        let a = io + ix + iy * (wSegs + 1);
        let b = io + ix + (iy + 1) * (wSegs + 1);
        let c = io + ix + (iy + 1) * (wSegs + 1) + 1;
        let d = io + ix + iy * (wSegs + 1) + 1;
        index[ii * 6] = a;
        index[ii * 6 + 1] = b;
        index[ii * 6 + 2] = d;
        index[ii * 6 + 3] = b;
        index[ii * 6 + 4] = c;
        index[ii * 6 + 5] = d;
        ii++;
      }
    }
  }
}
class Box extends Geometry {
  constructor(gl, {width = 1, height = 1, depth = 1, widthSegments = 1, heightSegments = 1, depthSegments = 1, attributes = {}} = {}) {
    const wSegs = widthSegments;
    const hSegs = heightSegments;
    const dSegs = depthSegments;
    const num = (wSegs + 1) * (hSegs + 1) * 2 + (wSegs + 1) * (dSegs + 1) * 2 + (hSegs + 1) * (dSegs + 1) * 2;
    const numIndices = (wSegs * hSegs * 2 + wSegs * dSegs * 2 + hSegs * dSegs * 2) * 6;
    const position = new Float32Array(num * 3);
    const normal = new Float32Array(num * 3);
    const uv = new Float32Array(num * 2);
    const index = num > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
    let i = 0;
    let ii = 0;
    Plane.buildPlane(position, normal, uv, index, depth, height, width, dSegs, hSegs, 2, 1, 0, -1, -1, i, ii);
    i += (dSegs + 1) * (hSegs + 1);
    ii += dSegs * hSegs;
    Plane.buildPlane(position, normal, uv, index, depth, height, -width, dSegs, hSegs, 2, 1, 0, 1, -1, i, ii);
    i += (dSegs + 1) * (hSegs + 1);
    ii += dSegs * hSegs;
    Plane.buildPlane(position, normal, uv, index, width, depth, height, dSegs, wSegs, 0, 2, 1, 1, 1, i, ii);
    i += (wSegs + 1) * (dSegs + 1);
    ii += wSegs * dSegs;
    Plane.buildPlane(position, normal, uv, index, width, depth, -height, dSegs, wSegs, 0, 2, 1, 1, -1, i, ii);
    i += (wSegs + 1) * (dSegs + 1);
    ii += wSegs * dSegs;
    Plane.buildPlane(position, normal, uv, index, width, height, -depth, wSegs, hSegs, 0, 1, 2, -1, -1, i, ii);
    i += (wSegs + 1) * (hSegs + 1);
    ii += wSegs * hSegs;
    Plane.buildPlane(position, normal, uv, index, width, height, depth, wSegs, hSegs, 0, 1, 2, 1, -1, i, ii);
    Object.assign(attributes, {
      position: {size: 3, data: position},
      normal: {size: 3, data: normal},
      uv: {size: 2, data: uv},
      index: {data: index}
    });
    super(gl, attributes);
  }
}
class Sphere extends Geometry {
  constructor(gl, {
    radius = 0.5,
    widthSegments = 16,
    heightSegments = Math.ceil(widthSegments * 0.5),
    phiStart = 0,
    phiLength = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI,
    attributes = {}
  } = {}) {
    const wSegs = widthSegments;
    const hSegs = heightSegments;
    const pStart = phiStart;
    const pLength = phiLength;
    const tStart = thetaStart;
    const tLength = thetaLength;
    const num = (wSegs + 1) * (hSegs + 1);
    const numIndices = wSegs * hSegs * 6;
    const position = new Float32Array(num * 3);
    const normal = new Float32Array(num * 3);
    const uv = new Float32Array(num * 2);
    const index = num > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
    let i = 0;
    let iv = 0;
    let ii = 0;
    let te = tStart + tLength;
    const grid = [];
    let n = new Vec3();
    for (let iy = 0; iy <= hSegs; iy++) {
      let vRow = [];
      let v = iy / hSegs;
      for (let ix = 0; ix <= wSegs; ix++, i++) {
        let u = ix / wSegs;
        let x = -radius * Math.cos(pStart + u * pLength) * Math.sin(tStart + v * tLength);
        let y = radius * Math.cos(tStart + v * tLength);
        let z = radius * Math.sin(pStart + u * pLength) * Math.sin(tStart + v * tLength);
        position[i * 3] = x;
        position[i * 3 + 1] = y;
        position[i * 3 + 2] = z;
        n.set(x, y, z).normalize();
        normal[i * 3] = n.x;
        normal[i * 3 + 1] = n.y;
        normal[i * 3 + 2] = n.z;
        uv[i * 2] = u;
        uv[i * 2 + 1] = 1 - v;
        vRow.push(iv++);
      }
      grid.push(vRow);
    }
    for (let iy = 0; iy < hSegs; iy++) {
      for (let ix = 0; ix < wSegs; ix++) {
        let a = grid[iy][ix + 1];
        let b = grid[iy][ix];
        let c = grid[iy + 1][ix];
        let d = grid[iy + 1][ix + 1];
        if (iy !== 0 || tStart > 0) {
          index[ii * 3] = a;
          index[ii * 3 + 1] = b;
          index[ii * 3 + 2] = d;
          ii++;
        }
        if (iy !== hSegs - 1 || te < Math.PI) {
          index[ii * 3] = b;
          index[ii * 3 + 1] = c;
          index[ii * 3 + 2] = d;
          ii++;
        }
      }
    }
    Object.assign(attributes, {
      position: {size: 3, data: position},
      normal: {size: 3, data: normal},
      uv: {size: 2, data: uv},
      index: {data: index}
    });
    super(gl, attributes);
  }
}
class Cylinder extends Geometry {
  constructor(gl, {
    radiusTop = 0.5,
    radiusBottom = 0.5,
    height = 1,
    radialSegments = 8,
    heightSegments = 1,
    openEnded = false,
    thetaStart = 0,
    thetaLength = Math.PI * 2,
    attributes = {}
  } = {}) {
    const rSegs = radialSegments;
    const hSegs = heightSegments;
    const tStart = thetaStart;
    const tLength = thetaLength;
    const numCaps = openEnded ? 0 : radiusBottom && radiusTop ? 2 : 1;
    const num = (rSegs + 1) * (hSegs + 1 + numCaps) + numCaps;
    const numIndices = rSegs * hSegs * 6 + numCaps * rSegs * 3;
    const position = new Float32Array(num * 3);
    const normal = new Float32Array(num * 3);
    const uv = new Float32Array(num * 2);
    const index = num > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
    let i = 0;
    let ii = 0;
    const indexArray = [];
    addHeight();
    if (!openEnded) {
      if (radiusTop)
        addCap(true);
      if (radiusBottom)
        addCap(false);
    }
    function addHeight() {
      let x, y;
      const n = new Vec3();
      const slope = (radiusBottom - radiusTop) / height;
      for (y = 0; y <= hSegs; y++) {
        const indexRow = [];
        const v = y / hSegs;
        const r = v * (radiusBottom - radiusTop) + radiusTop;
        for (x = 0; x <= rSegs; x++) {
          const u = x / rSegs;
          const theta = u * tLength + tStart;
          const sinTheta = Math.sin(theta);
          const cosTheta = Math.cos(theta);
          position.set([r * sinTheta, (0.5 - v) * height, r * cosTheta], i * 3);
          n.set(sinTheta, slope, cosTheta).normalize();
          normal.set([n.x, n.y, n.z], i * 3);
          uv.set([u, 1 - v], i * 2);
          indexRow.push(i++);
        }
        indexArray.push(indexRow);
      }
      for (x = 0; x < rSegs; x++) {
        for (y = 0; y < hSegs; y++) {
          const a = indexArray[y][x];
          const b = indexArray[y + 1][x];
          const c = indexArray[y + 1][x + 1];
          const d = indexArray[y][x + 1];
          index.set([a, b, d, b, c, d], ii * 3);
          ii += 2;
        }
      }
    }
    function addCap(isTop) {
      let x;
      const r = isTop === true ? radiusTop : radiusBottom;
      const sign = isTop === true ? 1 : -1;
      const centerIndex = i;
      position.set([0, 0.5 * height * sign, 0], i * 3);
      normal.set([0, sign, 0], i * 3);
      uv.set([0.5, 0.5], i * 2);
      i++;
      for (x = 0; x <= rSegs; x++) {
        const u = x / rSegs;
        const theta = u * tLength + tStart;
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        position.set([r * sinTheta, 0.5 * height * sign, r * cosTheta], i * 3);
        normal.set([0, sign, 0], i * 3);
        uv.set([cosTheta * 0.5 + 0.5, sinTheta * 0.5 * sign + 0.5], i * 2);
        i++;
      }
      for (x = 0; x < rSegs; x++) {
        const j = centerIndex + x + 1;
        if (isTop) {
          index.set([j, j + 1, centerIndex], ii * 3);
        } else {
          index.set([j + 1, j, centerIndex], ii * 3);
        }
        ii++;
      }
    }
    Object.assign(attributes, {
      position: {size: 3, data: position},
      normal: {size: 3, data: normal},
      uv: {size: 2, data: uv},
      index: {data: index}
    });
    super(gl, attributes);
  }
}
class Triangle extends Geometry {
  constructor(gl, {attributes = {}} = {}) {
    Object.assign(attributes, {
      position: {size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3])},
      uv: {size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2])}
    });
    super(gl, attributes);
  }
}
class Torus extends Geometry {
  constructor(gl, {radius = 0.5, tube = 0.2, radialSegments = 8, tubularSegments = 6, arc = Math.PI * 2, attributes = {}} = {}) {
    const num = (radialSegments + 1) * (tubularSegments + 1);
    const numIndices = radialSegments * tubularSegments * 6;
    const vertices = new Float32Array(num * 3);
    const normals = new Float32Array(num * 3);
    const uvs = new Float32Array(num * 2);
    const indices = num > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
    const center = new Vec3();
    const vertex2 = new Vec3();
    const normal = new Vec3();
    let idx = 0;
    for (let j = 0; j <= radialSegments; j++) {
      for (let i = 0; i <= tubularSegments; i++, idx++) {
        const u = i / tubularSegments * arc;
        const v = j / radialSegments * Math.PI * 2;
        vertex2.x = (radius + tube * Math.cos(v)) * Math.cos(u);
        vertex2.y = (radius + tube * Math.cos(v)) * Math.sin(u);
        vertex2.z = tube * Math.sin(v);
        vertices.set([vertex2.x, vertex2.y, vertex2.z], idx * 3);
        center.x = radius * Math.cos(u);
        center.y = radius * Math.sin(u);
        normal.sub(vertex2, center).normalize();
        normals.set([normal.x, normal.y, normal.z], idx * 3);
        uvs.set([i / tubularSegments, j / radialSegments], idx * 2);
      }
    }
    idx = 0;
    for (let j = 1; j <= radialSegments; j++) {
      for (let i = 1; i <= tubularSegments; i++, idx++) {
        const a = (tubularSegments + 1) * j + i - 1;
        const b = (tubularSegments + 1) * (j - 1) + i - 1;
        const c = (tubularSegments + 1) * (j - 1) + i;
        const d = (tubularSegments + 1) * j + i;
        indices.set([a, b, d, b, c, d], idx * 6);
      }
    }
    Object.assign(attributes, {
      position: {size: 3, data: vertices},
      normal: {size: 3, data: normals},
      uv: {size: 2, data: uvs},
      index: {data: indices}
    });
    super(gl, attributes);
  }
}
const STATE = {NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, DOLLY_PAN: 3};
const tempVec3$2 = new Vec3();
const tempVec2a = new Vec2();
const tempVec2b = new Vec2();
function Orbit(object, {
  element = document,
  enabled = true,
  target = new Vec3(),
  ease = 0.25,
  inertia = 0.85,
  enableRotate = true,
  rotateSpeed = 0.1,
  autoRotate = false,
  autoRotateSpeed = 1,
  enableZoom = true,
  zoomSpeed = 1,
  enablePan = true,
  panSpeed = 0.1,
  minPolarAngle = 0,
  maxPolarAngle = Math.PI,
  minAzimuthAngle = -Infinity,
  maxAzimuthAngle = Infinity,
  minDistance = 0,
  maxDistance = Infinity
} = {}) {
  this.enabled = enabled;
  this.target = target;
  ease = ease || 1;
  inertia = inertia || 0;
  this.minDistance = minDistance;
  this.maxDistance = maxDistance;
  const sphericalDelta = {radius: 1, phi: 0, theta: 0};
  const sphericalTarget = {radius: 1, phi: 0, theta: 0};
  const spherical = {radius: 1, phi: 0, theta: 0};
  const panDelta = new Vec3();
  const offset = new Vec3();
  offset.copy(object.position).sub(this.target);
  spherical.radius = sphericalTarget.radius = offset.distance();
  spherical.theta = sphericalTarget.theta = Math.atan2(offset.x, offset.z);
  spherical.phi = sphericalTarget.phi = Math.acos(Math.min(Math.max(offset.y / sphericalTarget.radius, -1), 1));
  this.offset = offset;
  this.update = () => {
    if (autoRotate) {
      handleAutoRotate();
    }
    sphericalTarget.radius *= sphericalDelta.radius;
    sphericalTarget.theta += sphericalDelta.theta;
    sphericalTarget.phi += sphericalDelta.phi;
    sphericalTarget.theta = Math.max(minAzimuthAngle, Math.min(maxAzimuthAngle, sphericalTarget.theta));
    sphericalTarget.phi = Math.max(minPolarAngle, Math.min(maxPolarAngle, sphericalTarget.phi));
    sphericalTarget.radius = Math.max(this.minDistance, Math.min(this.maxDistance, sphericalTarget.radius));
    spherical.phi += (sphericalTarget.phi - spherical.phi) * ease;
    spherical.theta += (sphericalTarget.theta - spherical.theta) * ease;
    spherical.radius += (sphericalTarget.radius - spherical.radius) * ease;
    this.target.add(panDelta);
    let sinPhiRadius = spherical.radius * Math.sin(Math.max(1e-6, spherical.phi));
    offset.x = sinPhiRadius * Math.sin(spherical.theta);
    offset.y = spherical.radius * Math.cos(spherical.phi);
    offset.z = sinPhiRadius * Math.cos(spherical.theta);
    object.position.copy(this.target).add(offset);
    object.lookAt(this.target);
    sphericalDelta.theta *= inertia;
    sphericalDelta.phi *= inertia;
    panDelta.multiply(inertia);
    sphericalDelta.radius = 1;
  };
  this.forcePosition = () => {
    offset.copy(object.position).sub(this.target);
    spherical.radius = sphericalTarget.radius = offset.distance();
    spherical.theta = sphericalTarget.theta = Math.atan2(offset.x, offset.z);
    spherical.phi = sphericalTarget.phi = Math.acos(Math.min(Math.max(offset.y / sphericalTarget.radius, -1), 1));
    object.lookAt(this.target);
  };
  const rotateStart = new Vec2();
  const panStart = new Vec2();
  const dollyStart = new Vec2();
  let state = STATE.NONE;
  this.mouseButtons = {ORBIT: 0, ZOOM: 1, PAN: 2};
  function getZoomScale() {
    return Math.pow(0.95, zoomSpeed);
  }
  function panLeft(distance2, m) {
    tempVec3$2.set(m[0], m[1], m[2]);
    tempVec3$2.multiply(-distance2);
    panDelta.add(tempVec3$2);
  }
  function panUp(distance2, m) {
    tempVec3$2.set(m[4], m[5], m[6]);
    tempVec3$2.multiply(distance2);
    panDelta.add(tempVec3$2);
  }
  const pan = (deltaX, deltaY) => {
    let el = element === document ? document.body : element;
    tempVec3$2.copy(object.position).sub(this.target);
    let targetDistance = tempVec3$2.distance();
    targetDistance *= Math.tan((object.fov || 45) / 2 * Math.PI / 180);
    panLeft(2 * deltaX * targetDistance / el.clientHeight, object.matrix);
    panUp(2 * deltaY * targetDistance / el.clientHeight, object.matrix);
  };
  function dolly(dollyScale) {
    sphericalDelta.radius /= dollyScale;
  }
  function handleAutoRotate() {
    const angle2 = 2 * Math.PI / 60 / 60 * autoRotateSpeed;
    sphericalDelta.theta -= angle2;
  }
  function handleMoveRotate(x, y) {
    tempVec2a.set(x, y);
    tempVec2b.sub(tempVec2a, rotateStart).multiply(rotateSpeed);
    let el = element === document ? document.body : element;
    sphericalDelta.theta -= 2 * Math.PI * tempVec2b.x / el.clientHeight;
    sphericalDelta.phi -= 2 * Math.PI * tempVec2b.y / el.clientHeight;
    rotateStart.copy(tempVec2a);
  }
  function handleMouseMoveDolly(e) {
    tempVec2a.set(e.clientX, e.clientY);
    tempVec2b.sub(tempVec2a, dollyStart);
    if (tempVec2b.y > 0) {
      dolly(getZoomScale());
    } else if (tempVec2b.y < 0) {
      dolly(1 / getZoomScale());
    }
    dollyStart.copy(tempVec2a);
  }
  function handleMovePan(x, y) {
    tempVec2a.set(x, y);
    tempVec2b.sub(tempVec2a, panStart).multiply(panSpeed);
    pan(tempVec2b.x, tempVec2b.y);
    panStart.copy(tempVec2a);
  }
  function handleTouchStartDollyPan(e) {
    if (enableZoom) {
      let dx = e.touches[0].pageX - e.touches[1].pageX;
      let dy = e.touches[0].pageY - e.touches[1].pageY;
      let distance2 = Math.sqrt(dx * dx + dy * dy);
      dollyStart.set(0, distance2);
    }
    if (enablePan) {
      let x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
      let y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
      panStart.set(x, y);
    }
  }
  function handleTouchMoveDollyPan(e) {
    if (enableZoom) {
      let dx = e.touches[0].pageX - e.touches[1].pageX;
      let dy = e.touches[0].pageY - e.touches[1].pageY;
      let distance2 = Math.sqrt(dx * dx + dy * dy);
      tempVec2a.set(0, distance2);
      tempVec2b.set(0, Math.pow(tempVec2a.y / dollyStart.y, zoomSpeed));
      dolly(tempVec2b.y);
      dollyStart.copy(tempVec2a);
    }
    if (enablePan) {
      let x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
      let y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
      handleMovePan(x, y);
    }
  }
  const onMouseDown = (e) => {
    if (!this.enabled)
      return;
    switch (e.button) {
      case this.mouseButtons.ORBIT:
        if (enableRotate === false)
          return;
        rotateStart.set(e.clientX, e.clientY);
        state = STATE.ROTATE;
        break;
      case this.mouseButtons.ZOOM:
        if (enableZoom === false)
          return;
        dollyStart.set(e.clientX, e.clientY);
        state = STATE.DOLLY;
        break;
      case this.mouseButtons.PAN:
        if (enablePan === false)
          return;
        panStart.set(e.clientX, e.clientY);
        state = STATE.PAN;
        break;
    }
    if (state !== STATE.NONE) {
      window.addEventListener("mousemove", onMouseMove, false);
      window.addEventListener("mouseup", onMouseUp, false);
    }
  };
  const onMouseMove = (e) => {
    if (!this.enabled)
      return;
    switch (state) {
      case STATE.ROTATE:
        if (enableRotate === false)
          return;
        handleMoveRotate(e.clientX, e.clientY);
        break;
      case STATE.DOLLY:
        if (enableZoom === false)
          return;
        handleMouseMoveDolly(e);
        break;
      case STATE.PAN:
        if (enablePan === false)
          return;
        handleMovePan(e.clientX, e.clientY);
        break;
    }
  };
  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove, false);
    window.removeEventListener("mouseup", onMouseUp, false);
    state = STATE.NONE;
  };
  const onMouseWheel = (e) => {
    if (!this.enabled || !enableZoom || state !== STATE.NONE && state !== STATE.ROTATE)
      return;
    e.stopPropagation();
    e.preventDefault();
    if (e.deltaY < 0) {
      dolly(1 / getZoomScale());
    } else if (e.deltaY > 0) {
      dolly(getZoomScale());
    }
  };
  const onTouchStart = (e) => {
    if (!this.enabled)
      return;
    e.preventDefault();
    switch (e.touches.length) {
      case 1:
        if (enableRotate === false)
          return;
        rotateStart.set(e.touches[0].pageX, e.touches[0].pageY);
        state = STATE.ROTATE;
        break;
      case 2:
        if (enableZoom === false && enablePan === false)
          return;
        handleTouchStartDollyPan(e);
        state = STATE.DOLLY_PAN;
        break;
      default:
        state = STATE.NONE;
    }
  };
  const onTouchMove = (e) => {
    if (!this.enabled)
      return;
    e.preventDefault();
    e.stopPropagation();
    switch (e.touches.length) {
      case 1:
        if (enableRotate === false)
          return;
        handleMoveRotate(e.touches[0].pageX, e.touches[0].pageY);
        break;
      case 2:
        if (enableZoom === false && enablePan === false)
          return;
        handleTouchMoveDollyPan(e);
        break;
      default:
        state = STATE.NONE;
    }
  };
  const onTouchEnd = () => {
    if (!this.enabled)
      return;
    state = STATE.NONE;
  };
  const onContextMenu = (e) => {
    if (!this.enabled)
      return;
    e.preventDefault();
  };
  function addHandlers() {
    element.addEventListener("contextmenu", onContextMenu, false);
    element.addEventListener("mousedown", onMouseDown, false);
    element.addEventListener("wheel", onMouseWheel, {passive: false});
    element.addEventListener("touchstart", onTouchStart, {passive: false});
    element.addEventListener("touchend", onTouchEnd, false);
    element.addEventListener("touchmove", onTouchMove, {passive: false});
  }
  this.remove = function() {
    element.removeEventListener("contextmenu", onContextMenu);
    element.removeEventListener("mousedown", onMouseDown);
    element.removeEventListener("wheel", onMouseWheel);
    element.removeEventListener("touchstart", onTouchStart);
    element.removeEventListener("touchend", onTouchEnd);
    element.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };
  addHandlers();
}
const tempVec2a$1 = new Vec2();
const tempVec2b$1 = new Vec2();
const tempVec2c = new Vec2();
const tempVec3a$1 = new Vec3();
const tempVec3b$1 = new Vec3();
const tempVec3c = new Vec3();
const tempVec3d = new Vec3();
const tempVec3e = new Vec3();
const tempVec3f = new Vec3();
const tempVec3g = new Vec3();
const tempVec3h = new Vec3();
const tempVec3i = new Vec3();
const tempVec3j = new Vec3();
const tempVec3k = new Vec3();
const tempMat4$1 = new Mat4();
class Raycast {
  constructor() {
    this.origin = new Vec3();
    this.direction = new Vec3();
  }
  castMouse(camera, mouse = [0, 0]) {
    if (camera.type === "orthographic") {
      const {left, right, bottom, top, zoom} = camera;
      const x = left / zoom + (right - left) / zoom * (mouse[0] * 0.5 + 0.5);
      const y = bottom / zoom + (top - bottom) / zoom * (mouse[1] * 0.5 + 0.5);
      this.origin.set(x, y, 0);
      this.origin.applyMatrix4(camera.worldMatrix);
      this.direction.x = -camera.worldMatrix[8];
      this.direction.y = -camera.worldMatrix[9];
      this.direction.z = -camera.worldMatrix[10];
    } else {
      camera.worldMatrix.getTranslation(this.origin);
      this.direction.set(mouse[0], mouse[1], 0.5);
      camera.unproject(this.direction);
      this.direction.sub(this.origin).normalize();
    }
  }
  intersectBounds(meshes, {maxDistance, output = []} = {}) {
    if (!Array.isArray(meshes))
      meshes = [meshes];
    const invWorldMat4 = tempMat4$1;
    const origin = tempVec3a$1;
    const direction = tempVec3b$1;
    const hits = output;
    hits.length = 0;
    meshes.forEach((mesh) => {
      if (!mesh.geometry.bounds || mesh.geometry.bounds.radius === Infinity)
        mesh.geometry.computeBoundingSphere();
      const bounds = mesh.geometry.bounds;
      invWorldMat4.inverse(mesh.worldMatrix);
      let localMaxDistance;
      if (maxDistance) {
        direction.copy(this.direction).scaleRotateMatrix4(invWorldMat4);
        localMaxDistance = maxDistance * direction.len();
      }
      origin.copy(this.origin).applyMatrix4(invWorldMat4);
      direction.copy(this.direction).transformDirection(invWorldMat4);
      if (maxDistance) {
        if (origin.distance(bounds.center) - bounds.radius > localMaxDistance)
          return;
      }
      let localDistance = 0;
      if (mesh.geometry.raycast === "sphere") {
        if (origin.distance(bounds.center) > bounds.radius) {
          localDistance = this.intersectSphere(bounds, origin, direction);
          if (!localDistance)
            return;
        }
      } else {
        if (origin.x < bounds.min.x || origin.x > bounds.max.x || origin.y < bounds.min.y || origin.y > bounds.max.y || origin.z < bounds.min.z || origin.z > bounds.max.z) {
          localDistance = this.intersectBox(bounds, origin, direction);
          if (!localDistance)
            return;
        }
      }
      if (maxDistance && localDistance > localMaxDistance)
        return;
      if (!mesh.hit)
        mesh.hit = {localPoint: new Vec3(), point: new Vec3()};
      mesh.hit.localPoint.copy(direction).multiply(localDistance).add(origin);
      mesh.hit.point.copy(mesh.hit.localPoint).applyMatrix4(mesh.worldMatrix);
      mesh.hit.distance = mesh.hit.point.distance(this.origin);
      hits.push(mesh);
    });
    hits.sort((a, b) => a.hit.distance - b.hit.distance);
    return hits;
  }
  intersectMeshes(meshes, {cullFace = true, maxDistance, includeUV = true, includeNormal = true, output = []} = {}) {
    const hits = this.intersectBounds(meshes, {maxDistance, output});
    if (!hits.length)
      return hits;
    const invWorldMat4 = tempMat4$1;
    const origin = tempVec3a$1;
    const direction = tempVec3b$1;
    const a = tempVec3c;
    const b = tempVec3d;
    const c = tempVec3e;
    const closestFaceNormal = tempVec3f;
    const faceNormal = tempVec3g;
    const barycoord = tempVec3h;
    const uvA = tempVec2a$1;
    const uvB = tempVec2b$1;
    const uvC = tempVec2c;
    for (let i = hits.length - 1; i >= 0; i--) {
      const mesh = hits[i];
      invWorldMat4.inverse(mesh.worldMatrix);
      let localMaxDistance;
      if (maxDistance) {
        direction.copy(this.direction).scaleRotateMatrix4(invWorldMat4);
        localMaxDistance = maxDistance * direction.len();
      }
      origin.copy(this.origin).applyMatrix4(invWorldMat4);
      direction.copy(this.direction).transformDirection(invWorldMat4);
      let localDistance = 0;
      let closestA, closestB, closestC;
      const geometry = mesh.geometry;
      const attributes = geometry.attributes;
      const index = attributes.index;
      const start = Math.max(0, geometry.drawRange.start);
      const end = Math.min(index ? index.count : attributes.position.count, geometry.drawRange.start + geometry.drawRange.count);
      for (let j = start; j < end; j += 3) {
        const ai = index ? index.data[j] : j;
        const bi = index ? index.data[j + 1] : j + 1;
        const ci = index ? index.data[j + 2] : j + 2;
        a.fromArray(attributes.position.data, ai * 3);
        b.fromArray(attributes.position.data, bi * 3);
        c.fromArray(attributes.position.data, ci * 3);
        const distance2 = this.intersectTriangle(a, b, c, cullFace, origin, direction, faceNormal);
        if (!distance2)
          continue;
        if (maxDistance && distance2 > localMaxDistance)
          continue;
        if (!localDistance || distance2 < localDistance) {
          localDistance = distance2;
          closestA = ai;
          closestB = bi;
          closestC = ci;
          closestFaceNormal.copy(faceNormal);
        }
      }
      if (!localDistance)
        hits.splice(i, 1);
      mesh.hit.localPoint.copy(direction).multiply(localDistance).add(origin);
      mesh.hit.point.copy(mesh.hit.localPoint).applyMatrix4(mesh.worldMatrix);
      mesh.hit.distance = mesh.hit.point.distance(this.origin);
      if (!mesh.hit.faceNormal) {
        mesh.hit.localFaceNormal = new Vec3();
        mesh.hit.faceNormal = new Vec3();
        mesh.hit.uv = new Vec2();
        mesh.hit.localNormal = new Vec3();
        mesh.hit.normal = new Vec3();
      }
      mesh.hit.localFaceNormal.copy(closestFaceNormal);
      mesh.hit.faceNormal.copy(mesh.hit.localFaceNormal).transformDirection(mesh.worldMatrix);
      if (includeUV || includeNormal) {
        a.fromArray(attributes.position.data, closestA * 3);
        b.fromArray(attributes.position.data, closestB * 3);
        c.fromArray(attributes.position.data, closestC * 3);
        this.getBarycoord(mesh.hit.localPoint, a, b, c, barycoord);
      }
      if (includeUV && attributes.uv) {
        uvA.fromArray(attributes.uv.data, closestA * 2);
        uvB.fromArray(attributes.uv.data, closestB * 2);
        uvC.fromArray(attributes.uv.data, closestC * 2);
        mesh.hit.uv.set(uvA.x * barycoord.x + uvB.x * barycoord.y + uvC.x * barycoord.z, uvA.y * barycoord.x + uvB.y * barycoord.y + uvC.y * barycoord.z);
      }
      if (includeNormal && attributes.normal) {
        a.fromArray(attributes.normal.data, closestA * 3);
        b.fromArray(attributes.normal.data, closestB * 3);
        c.fromArray(attributes.normal.data, closestC * 3);
        mesh.hit.localNormal.set(a.x * barycoord.x + b.x * barycoord.y + c.x * barycoord.z, a.y * barycoord.x + b.y * barycoord.y + c.y * barycoord.z, a.z * barycoord.x + b.z * barycoord.y + c.z * barycoord.z);
        mesh.hit.normal.copy(mesh.hit.localNormal).transformDirection(mesh.worldMatrix);
      }
    }
    hits.sort((a2, b2) => a2.hit.distance - b2.hit.distance);
    return hits;
  }
  intersectSphere(sphere, origin = this.origin, direction = this.direction) {
    const ray = tempVec3c;
    ray.sub(sphere.center, origin);
    const tca = ray.dot(direction);
    const d2 = ray.dot(ray) - tca * tca;
    const radius2 = sphere.radius * sphere.radius;
    if (d2 > radius2)
      return 0;
    const thc = Math.sqrt(radius2 - d2);
    const t0 = tca - thc;
    const t1 = tca + thc;
    if (t0 < 0 && t1 < 0)
      return 0;
    if (t0 < 0)
      return t1;
    return t0;
  }
  intersectBox(box, origin = this.origin, direction = this.direction) {
    let tmin, tmax, tYmin, tYmax, tZmin, tZmax;
    const invdirx = 1 / direction.x;
    const invdiry = 1 / direction.y;
    const invdirz = 1 / direction.z;
    const min = box.min;
    const max = box.max;
    tmin = ((invdirx >= 0 ? min.x : max.x) - origin.x) * invdirx;
    tmax = ((invdirx >= 0 ? max.x : min.x) - origin.x) * invdirx;
    tYmin = ((invdiry >= 0 ? min.y : max.y) - origin.y) * invdiry;
    tYmax = ((invdiry >= 0 ? max.y : min.y) - origin.y) * invdiry;
    if (tmin > tYmax || tYmin > tmax)
      return 0;
    if (tYmin > tmin)
      tmin = tYmin;
    if (tYmax < tmax)
      tmax = tYmax;
    tZmin = ((invdirz >= 0 ? min.z : max.z) - origin.z) * invdirz;
    tZmax = ((invdirz >= 0 ? max.z : min.z) - origin.z) * invdirz;
    if (tmin > tZmax || tZmin > tmax)
      return 0;
    if (tZmin > tmin)
      tmin = tZmin;
    if (tZmax < tmax)
      tmax = tZmax;
    if (tmax < 0)
      return 0;
    return tmin >= 0 ? tmin : tmax;
  }
  intersectTriangle(a, b, c, backfaceCulling = true, origin = this.origin, direction = this.direction, normal = tempVec3g) {
    const edge1 = tempVec3h;
    const edge2 = tempVec3i;
    const diff = tempVec3j;
    edge1.sub(b, a);
    edge2.sub(c, a);
    normal.cross(edge1, edge2);
    let DdN = direction.dot(normal);
    if (!DdN)
      return 0;
    let sign;
    if (DdN > 0) {
      if (backfaceCulling)
        return 0;
      sign = 1;
    } else {
      sign = -1;
      DdN = -DdN;
    }
    diff.sub(origin, a);
    let DdQxE2 = sign * direction.dot(edge2.cross(diff, edge2));
    if (DdQxE2 < 0)
      return 0;
    let DdE1xQ = sign * direction.dot(edge1.cross(diff));
    if (DdE1xQ < 0)
      return 0;
    if (DdQxE2 + DdE1xQ > DdN)
      return 0;
    let QdN = -sign * diff.dot(normal);
    if (QdN < 0)
      return 0;
    return QdN / DdN;
  }
  getBarycoord(point, a, b, c, target = tempVec3h) {
    const v0 = tempVec3i;
    const v1 = tempVec3j;
    const v2 = tempVec3k;
    v0.sub(c, a);
    v1.sub(b, a);
    v2.sub(point, a);
    const dot00 = v0.dot(v0);
    const dot01 = v0.dot(v1);
    const dot02 = v0.dot(v2);
    const dot11 = v1.dot(v1);
    const dot12 = v1.dot(v2);
    const denom = dot00 * dot11 - dot01 * dot01;
    if (denom === 0)
      return target.set(-2, -1, -1);
    const invDenom = 1 / denom;
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    return target.set(1 - u - v, v, u);
  }
}
const CATMULLROM = "catmullrom";
const CUBICBEZIER = "cubicbezier";
const QUADRATICBEZIER = "quadraticbezier";
const _a0 = new Vec3(), _a1 = new Vec3(), _a2 = new Vec3(), _a3 = new Vec3();
function getCtrlPoint(points, i, a = 0.168, b = 0.168) {
  if (i < 1) {
    _a0.sub(points[1], points[0]).scale(a).add(points[0]);
  } else {
    _a0.sub(points[i + 1], points[i - 1]).scale(a).add(points[i]);
  }
  if (i > points.length - 3) {
    const last = points.length - 1;
    _a1.sub(points[last - 1], points[last]).scale(b).add(points[last]);
  } else {
    _a1.sub(points[i], points[i + 2]).scale(b).add(points[i + 1]);
  }
  return [_a0.clone(), _a1.clone()];
}
function getQuadraticBezierPoint(t, p0, c0, p1) {
  const k = 1 - t;
  _a0.copy(p0).scale(k ** 2);
  _a1.copy(c0).scale(2 * k * t);
  _a2.copy(p1).scale(t ** 2);
  const ret = new Vec3();
  ret.add(_a0, _a1).add(_a2);
  return ret;
}
function getCubicBezierPoint(t, p0, c0, c1, p1) {
  const k = 1 - t;
  _a0.copy(p0).scale(k ** 3);
  _a1.copy(c0).scale(3 * k ** 2 * t);
  _a2.copy(c1).scale(3 * k * t ** 2);
  _a3.copy(p1).scale(t ** 3);
  const ret = new Vec3();
  ret.add(_a0, _a1).add(_a2).add(_a3);
  return ret;
}
class Curve {
  constructor({points = [new Vec3(0, 0, 0), new Vec3(0, 1, 0), new Vec3(1, 1, 0), new Vec3(1, 0, 0)], divisions = 12, type = CATMULLROM} = {}) {
    this.points = points;
    this.divisions = divisions;
    this.type = type;
  }
  _getQuadraticBezierPoints(divisions = this.divisions) {
    const points = [];
    const count = this.points.length;
    if (count < 3) {
      console.warn("Not enough points provided.");
      return [];
    }
    const p0 = this.points[0];
    let c0 = this.points[1], p1 = this.points[2];
    for (let i = 0; i <= divisions; i++) {
      const p = getQuadraticBezierPoint(i / divisions, p0, c0, p1);
      points.push(p);
    }
    let offset = 3;
    while (count - offset > 0) {
      p0.copy(p1);
      c0 = p1.scale(2).sub(c0);
      p1 = this.points[offset];
      for (let i = 1; i <= divisions; i++) {
        const p = getQuadraticBezierPoint(i / divisions, p0, c0, p1);
        points.push(p);
      }
      offset++;
    }
    return points;
  }
  _getCubicBezierPoints(divisions = this.divisions) {
    const points = [];
    const count = this.points.length;
    if (count < 4) {
      console.warn("Not enough points provided.");
      return [];
    }
    let p0 = this.points[0], c0 = this.points[1], c1 = this.points[2], p1 = this.points[3];
    for (let i = 0; i <= divisions; i++) {
      const p = getCubicBezierPoint(i / divisions, p0, c0, c1, p1);
      points.push(p);
    }
    let offset = 4;
    while (count - offset > 1) {
      p0.copy(p1);
      c0 = p1.scale(2).sub(c1);
      c1 = this.points[offset];
      p1 = this.points[offset + 1];
      for (let i = 1; i <= divisions; i++) {
        const p = getCubicBezierPoint(i / divisions, p0, c0, c1, p1);
        points.push(p);
      }
      offset += 2;
    }
    return points;
  }
  _getCatmullRomPoints(divisions = this.divisions, a = 0.168, b = 0.168) {
    const points = [];
    const count = this.points.length;
    if (count <= 2) {
      return this.points;
    }
    let p0;
    this.points.forEach((p, i) => {
      if (i === 0) {
        p0 = p;
      } else {
        const [c0, c1] = getCtrlPoint(this.points, i - 1, a, b);
        const c = new Curve({
          points: [p0, c0, c1, p],
          type: CUBICBEZIER
        });
        points.pop();
        points.push(...c.getPoints(divisions));
        p0 = p;
      }
    });
    return points;
  }
  getPoints(divisions = this.divisions, a = 0.168, b = 0.168) {
    const type = this.type;
    if (type === QUADRATICBEZIER) {
      return this._getQuadraticBezierPoints(divisions);
    }
    if (type === CUBICBEZIER) {
      return this._getCubicBezierPoints(divisions);
    }
    if (type === CATMULLROM) {
      return this._getCatmullRomPoints(divisions, a, b);
    }
    return this.points;
  }
}
Curve.CATMULLROM = CATMULLROM;
Curve.CUBICBEZIER = CUBICBEZIER;
Curve.QUADRATICBEZIER = QUADRATICBEZIER;
class Post {
  constructor(gl, {
    width,
    height,
    dpr,
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    minFilter = gl.LINEAR,
    magFilter = gl.LINEAR,
    geometry = new Triangle(gl),
    targetOnly = null
  } = {}) {
    this.gl = gl;
    this.options = {wrapS, wrapT, minFilter, magFilter};
    this.passes = [];
    this.geometry = geometry;
    this.uniform = {value: null};
    this.targetOnly = targetOnly;
    const fbo = this.fbo = {
      read: null,
      write: null,
      swap: () => {
        let temp = fbo.read;
        fbo.read = fbo.write;
        fbo.write = temp;
      }
    };
    this.resize({width, height, dpr});
  }
  addPass({vertex: vertex2 = defaultVertex, fragment: fragment2 = defaultFragment, uniforms = {}, textureUniform = "tMap", enabled = true} = {}) {
    uniforms[textureUniform] = {value: this.fbo.read.texture};
    const program = new Program(this.gl, {vertex: vertex2, fragment: fragment2, uniforms});
    const mesh = new Mesh(this.gl, {geometry: this.geometry, program});
    const pass = {
      mesh,
      program,
      uniforms,
      enabled,
      textureUniform
    };
    this.passes.push(pass);
    return pass;
  }
  resize({width, height, dpr} = {}) {
    if (dpr)
      this.dpr = dpr;
    if (width) {
      this.width = width;
      this.height = height || width;
    }
    dpr = this.dpr || this.gl.renderer.dpr;
    width = Math.floor((this.width || this.gl.renderer.width) * dpr);
    height = Math.floor((this.height || this.gl.renderer.height) * dpr);
    this.options.width = width;
    this.options.height = height;
    this.fbo.read = new RenderTarget(this.gl, this.options);
    this.fbo.write = new RenderTarget(this.gl, this.options);
  }
  render({scene, camera, texture, target = null, update = true, sort = true, frustumCull = true}) {
    const enabledPasses = this.passes.filter((pass) => pass.enabled);
    if (!texture) {
      this.gl.renderer.render({
        scene,
        camera,
        target: enabledPasses.length || !target && this.targetOnly ? this.fbo.write : target,
        update,
        sort,
        frustumCull
      });
      this.fbo.swap();
    }
    enabledPasses.forEach((pass, i) => {
      pass.mesh.program.uniforms[pass.textureUniform].value = !i && texture ? texture : this.fbo.read.texture;
      this.gl.renderer.render({
        scene: pass.mesh,
        target: i === enabledPasses.length - 1 && (target || !this.targetOnly) ? target : this.fbo.write,
        clear: true
      });
      this.fbo.swap();
    });
    this.uniform.value = this.fbo.read.texture;
  }
}
const defaultVertex = `
    attribute vec2 uv;
    attribute vec2 position;

    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;
const defaultFragment = `
    precision highp float;

    uniform sampler2D tMap;
    varying vec2 vUv;

    void main() {
        gl_FragColor = texture2D(tMap, vUv);
    }
`;
const prevPos = new Vec3();
const prevRot = new Quat();
const prevScl = new Vec3();
const nextPos = new Vec3();
const nextRot = new Quat();
const nextScl = new Vec3();
class Animation {
  constructor({objects, data}) {
    this.objects = objects;
    this.data = data;
    this.elapsed = 0;
    this.weight = 1;
    this.duration = data.frames.length - 1;
  }
  update(totalWeight = 1, isSet) {
    const weight = isSet ? 1 : this.weight / totalWeight;
    const elapsed = this.elapsed % this.duration;
    const floorFrame = Math.floor(elapsed);
    const blend = elapsed - floorFrame;
    const prevKey = this.data.frames[floorFrame];
    const nextKey = this.data.frames[(floorFrame + 1) % this.duration];
    this.objects.forEach((object, i) => {
      prevPos.fromArray(prevKey.position, i * 3);
      prevRot.fromArray(prevKey.quaternion, i * 4);
      prevScl.fromArray(prevKey.scale, i * 3);
      nextPos.fromArray(nextKey.position, i * 3);
      nextRot.fromArray(nextKey.quaternion, i * 4);
      nextScl.fromArray(nextKey.scale, i * 3);
      prevPos.lerp(nextPos, blend);
      prevRot.slerp(nextRot, blend);
      prevScl.lerp(nextScl, blend);
      object.position.lerp(prevPos, weight);
      object.quaternion.slerp(prevRot, weight);
      object.scale.lerp(prevScl, weight);
    });
  }
}
const tempMat4$2 = new Mat4();
class Skin extends Mesh {
  constructor(gl, {rig, geometry, program, mode = gl.TRIANGLES} = {}) {
    super(gl, {geometry, program, mode});
    this.createBones(rig);
    this.createBoneTexture();
    this.animations = [];
    Object.assign(this.program.uniforms, {
      boneTexture: {value: this.boneTexture},
      boneTextureSize: {value: this.boneTextureSize}
    });
  }
  createBones(rig) {
    this.root = new Transform();
    this.bones = [];
    if (!rig.bones || !rig.bones.length)
      return;
    for (let i = 0; i < rig.bones.length; i++) {
      const bone = new Transform();
      bone.position.fromArray(rig.bindPose.position, i * 3);
      bone.quaternion.fromArray(rig.bindPose.quaternion, i * 4);
      bone.scale.fromArray(rig.bindPose.scale, i * 3);
      this.bones.push(bone);
    }
    rig.bones.forEach((data, i) => {
      this.bones[i].name = data.name;
      if (data.parent === -1)
        return this.bones[i].setParent(this.root);
      this.bones[i].setParent(this.bones[data.parent]);
    });
    this.root.updateMatrixWorld(true);
    this.bones.forEach((bone) => {
      bone.bindInverse = new Mat4(...bone.worldMatrix).inverse();
    });
  }
  createBoneTexture() {
    if (!this.bones.length)
      return;
    const size = Math.max(4, Math.pow(2, Math.ceil(Math.log(Math.sqrt(this.bones.length * 4)) / Math.LN2)));
    this.boneMatrices = new Float32Array(size * size * 4);
    this.boneTextureSize = size;
    this.boneTexture = new Texture(this.gl, {
      image: this.boneMatrices,
      generateMipmaps: false,
      type: this.gl.FLOAT,
      internalFormat: this.gl.renderer.isWebgl2 ? this.gl.RGBA32F : this.gl.RGBA,
      minFilter: this.gl.NEAREST,
      magFilter: this.gl.NEAREST,
      flipY: false,
      width: size
    });
  }
  addAnimation(data) {
    const animation = new Animation({objects: this.bones, data});
    this.animations.push(animation);
    return animation;
  }
  update() {
    let total = 0;
    this.animations.forEach((animation) => total += animation.weight);
    this.animations.forEach((animation, i) => {
      animation.update(total, i === 0);
    });
  }
  draw({camera} = {}) {
    this.root.updateMatrixWorld(true);
    this.bones.forEach((bone, i) => {
      tempMat4$2.multiply(bone.worldMatrix, bone.bindInverse);
      this.boneMatrices.set(tempMat4$2, i * 16);
    });
    if (this.boneTexture)
      this.boneTexture.needsUpdate = true;
    super.draw({camera});
  }
}
function Text({
  font,
  text,
  width = Infinity,
  align = "left",
  size = 1,
  letterSpacing = 0,
  lineHeight = 1.4,
  wordSpacing = 0,
  wordBreak = false
}) {
  const _this = this;
  let glyphs, buffers;
  let baseline, scale2;
  const newline = /\n/;
  const whitespace = /\s/;
  {
    parseFont();
    createGeometry();
  }
  function parseFont() {
    glyphs = {};
    font.chars.forEach((d) => glyphs[d.char] = d);
  }
  function createGeometry() {
    font.common.lineHeight;
    baseline = font.common.base;
    scale2 = size / baseline;
    let chars = text.replace(/[ \n]/g, "");
    let numChars = chars.length;
    buffers = {
      position: new Float32Array(numChars * 4 * 3),
      uv: new Float32Array(numChars * 4 * 2),
      id: new Float32Array(numChars * 4),
      index: new Uint16Array(numChars * 6)
    };
    for (let i = 0; i < numChars; i++) {
      buffers.id[i] = i;
      buffers.index.set([i * 4, i * 4 + 2, i * 4 + 1, i * 4 + 1, i * 4 + 2, i * 4 + 3], i * 6);
    }
    layout();
  }
  function layout() {
    const lines = [];
    let cursor = 0;
    let wordCursor = 0;
    let wordWidth = 0;
    let line = newLine();
    function newLine() {
      const line2 = {
        width: 0,
        glyphs: []
      };
      lines.push(line2);
      wordCursor = cursor;
      wordWidth = 0;
      return line2;
    }
    let maxTimes = 100;
    let count = 0;
    while (cursor < text.length && count < maxTimes) {
      count++;
      const char = text[cursor];
      if (!line.width && whitespace.test(char)) {
        cursor++;
        wordCursor = cursor;
        wordWidth = 0;
        continue;
      }
      if (newline.test(char)) {
        cursor++;
        line = newLine();
        continue;
      }
      const glyph = glyphs[char] || glyphs[" "];
      if (line.glyphs.length) {
        const prevGlyph = line.glyphs[line.glyphs.length - 1][0];
        let kern = getKernPairOffset(glyph.id, prevGlyph.id) * scale2;
        line.width += kern;
        wordWidth += kern;
      }
      line.glyphs.push([glyph, line.width]);
      let advance = 0;
      if (whitespace.test(char)) {
        wordCursor = cursor;
        wordWidth = 0;
        advance += wordSpacing * size;
      } else {
        advance += letterSpacing * size;
      }
      advance += glyph.xadvance * scale2;
      line.width += advance;
      wordWidth += advance;
      if (line.width > width) {
        if (wordBreak && line.glyphs.length > 1) {
          line.width -= advance;
          line.glyphs.pop();
          line = newLine();
          continue;
        } else if (!wordBreak && wordWidth !== line.width) {
          let numGlyphs = cursor - wordCursor + 1;
          line.glyphs.splice(-numGlyphs, numGlyphs);
          cursor = wordCursor;
          line.width -= wordWidth;
          line = newLine();
          continue;
        }
      }
      cursor++;
      count = 0;
    }
    if (!line.width)
      lines.pop();
    populateBuffers(lines);
  }
  function populateBuffers(lines) {
    const texW = font.common.scaleW;
    const texH = font.common.scaleH;
    let y = 0.07 * size;
    let j = 0;
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      let line = lines[lineIndex];
      for (let i = 0; i < line.glyphs.length; i++) {
        const glyph = line.glyphs[i][0];
        let x = line.glyphs[i][1];
        if (align === "center") {
          x -= line.width * 0.5;
        } else if (align === "right") {
          x -= line.width;
        }
        if (whitespace.test(glyph.char))
          continue;
        x += glyph.xoffset * scale2;
        y -= glyph.yoffset * scale2;
        let w = glyph.width * scale2;
        let h = glyph.height * scale2;
        buffers.position.set([x, y - h, 0, x, y, 0, x + w, y - h, 0, x + w, y, 0], j * 4 * 3);
        let u = glyph.x / texW;
        let uw = glyph.width / texW;
        let v = 1 - glyph.y / texH;
        let vh = glyph.height / texH;
        buffers.uv.set([u, v - vh, u, v, u + uw, v - vh, u + uw, v], j * 4 * 2);
        y += glyph.yoffset * scale2;
        j++;
      }
      y -= size * lineHeight;
    }
    _this.buffers = buffers;
    _this.numLines = lines.length;
    _this.height = _this.numLines * size * lineHeight;
    _this.width = Math.max(...lines.map((line) => line.width));
  }
  function getKernPairOffset(id1, id2) {
    for (let i = 0; i < font.kernings.length; i++) {
      let k = font.kernings[i];
      if (k.first < id1)
        continue;
      if (k.second < id2)
        continue;
      if (k.first > id1)
        return 0;
      if (k.first === id1 && k.second > id2)
        return 0;
      return k.amount;
    }
    return 0;
  }
  this.resize = function(options) {
    ({width} = options);
    layout();
  };
  this.update = function(options) {
    ({text} = options);
    createGeometry();
  };
}
const vertex = `
    precision highp float;
    precision highp int;

    attribute vec3 position;
    attribute vec3 normal;

    uniform mat3 normalMatrix;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    varying vec3 vNormal;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const fragment = `
    precision highp float;
    precision highp int;

    varying vec3 vNormal;

    void main() {
        gl_FragColor.rgb = normalize(vNormal);
        gl_FragColor.a = 1.0;
    }
`;
function NormalProgram(gl) {
  return new Program(gl, {
    vertex,
    fragment,
    cullFace: null
  });
}
class Flowmap {
  constructor(gl, {
    size = 128,
    falloff = 0.3,
    alpha = 1,
    dissipation = 0.98,
    type
  } = {}) {
    const _this = this;
    this.gl = gl;
    this.uniform = {value: null};
    this.mask = {
      read: null,
      write: null,
      swap: () => {
        let temp = _this.mask.read;
        _this.mask.read = _this.mask.write;
        _this.mask.write = temp;
        _this.uniform.value = _this.mask.read.texture;
      }
    };
    {
      createFBOs();
      this.aspect = 1;
      this.mouse = new Vec2();
      this.velocity = new Vec2();
      this.mesh = initProgram();
    }
    function createFBOs() {
      if (!type)
        type = gl.HALF_FLOAT || gl.renderer.extensions["OES_texture_half_float"].HALF_FLOAT_OES;
      let minFilter = (() => {
        if (gl.renderer.isWebgl2)
          return gl.LINEAR;
        if (gl.renderer.extensions[`OES_texture_${type === gl.FLOAT ? "" : "half_"}float_linear`])
          return gl.LINEAR;
        return gl.NEAREST;
      })();
      const options = {
        width: size,
        height: size,
        type,
        format: gl.RGBA,
        internalFormat: gl.renderer.isWebgl2 ? type === gl.FLOAT ? gl.RGBA32F : gl.RGBA16F : gl.RGBA,
        minFilter,
        depth: false
      };
      _this.mask.read = new RenderTarget(gl, options);
      _this.mask.write = new RenderTarget(gl, options);
      _this.mask.swap();
    }
    function initProgram() {
      return new Mesh(gl, {
        geometry: new Triangle(gl),
        program: new Program(gl, {
          vertex: vertex$1,
          fragment: fragment$1,
          uniforms: {
            tMap: _this.uniform,
            uFalloff: {value: falloff * 0.5},
            uAlpha: {value: alpha},
            uDissipation: {value: dissipation},
            uAspect: {value: 1},
            uMouse: {value: _this.mouse},
            uVelocity: {value: _this.velocity}
          },
          depthTest: false
        })
      });
    }
  }
  update() {
    this.mesh.program.uniforms.uAspect.value = this.aspect;
    this.gl.renderer.render({
      scene: this.mesh,
      target: this.mask.write,
      clear: false
    });
    this.mask.swap();
  }
}
const vertex$1 = `
    attribute vec2 uv;
    attribute vec2 position;

    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;
const fragment$1 = `
    precision highp float;

    uniform sampler2D tMap;

    uniform float uFalloff;
    uniform float uAlpha;
    uniform float uDissipation;
    
    uniform float uAspect;
    uniform vec2 uMouse;
    uniform vec2 uVelocity;

    varying vec2 vUv;

    void main() {
        vec4 color = texture2D(tMap, vUv) * uDissipation;

        vec2 cursor = vUv - uMouse;
        cursor.x *= uAspect;

        vec3 stamp = vec3(uVelocity * vec2(1, -1), 1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0));
        float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;

        color.rgb = mix(color.rgb, stamp, vec3(falloff));

        gl_FragColor = color;
    }
`;
class GPGPU {
  constructor(gl, {
    data = new Float32Array(16),
    geometry = new Triangle(gl),
    type
  }) {
    this.gl = gl;
    const initialData = data;
    this.passes = [];
    this.geometry = geometry;
    this.dataLength = initialData.length / 4;
    this.size = Math.pow(2, Math.ceil(Math.log(Math.ceil(Math.sqrt(this.dataLength))) / Math.LN2));
    this.coords = new Float32Array(this.dataLength * 2);
    for (let i = 0; i < this.dataLength; i++) {
      const x = i % this.size / this.size;
      const y = Math.floor(i / this.size) / this.size;
      this.coords.set([x, y], i * 2);
    }
    const floatArray = (() => {
      if (initialData.length === this.size * this.size * 4) {
        return initialData;
      } else {
        const a = new Float32Array(this.size * this.size * 4);
        a.set(initialData);
        return a;
      }
    })();
    this.uniform = {
      value: new Texture(gl, {
        image: floatArray,
        target: gl.TEXTURE_2D,
        type: gl.FLOAT,
        format: gl.RGBA,
        internalFormat: gl.renderer.isWebgl2 ? gl.RGBA32F : gl.RGBA,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
        generateMipmaps: false,
        minFilter: gl.NEAREST,
        magFilter: gl.NEAREST,
        width: this.size,
        flipY: false
      })
    };
    const options = {
      width: this.size,
      height: this.size,
      type: type || gl.HALF_FLOAT || gl.renderer.extensions["OES_texture_half_float"].HALF_FLOAT_OES,
      format: gl.RGBA,
      internalFormat: gl.renderer.isWebgl2 ? type === gl.FLOAT ? gl.RGBA32F : gl.RGBA16F : gl.RGBA,
      minFilter: gl.NEAREST,
      depth: false,
      unpackAlignment: 1
    };
    this.fbo = {
      read: new RenderTarget(gl, options),
      write: new RenderTarget(gl, options),
      swap: () => {
        let temp = this.fbo.read;
        this.fbo.read = this.fbo.write;
        this.fbo.write = temp;
        this.uniform.value = this.fbo.read.texture;
      }
    };
  }
  addPass({vertex: vertex2 = defaultVertex$1, fragment: fragment2 = defaultFragment$1, uniforms = {}, textureUniform = "tMap", enabled = true} = {}) {
    uniforms[textureUniform] = this.uniform;
    const program = new Program(this.gl, {vertex: vertex2, fragment: fragment2, uniforms});
    const mesh = new Mesh(this.gl, {geometry: this.geometry, program});
    const pass = {
      mesh,
      program,
      uniforms,
      enabled,
      textureUniform
    };
    this.passes.push(pass);
    return pass;
  }
  render() {
    const enabledPasses = this.passes.filter((pass) => pass.enabled);
    enabledPasses.forEach((pass, i) => {
      this.gl.renderer.render({
        scene: pass.mesh,
        target: this.fbo.write,
        clear: false
      });
      this.fbo.swap();
    });
  }
}
const defaultVertex$1 = `
    attribute vec2 uv;
    attribute vec2 position;

    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
    }
`;
const defaultFragment$1 = `
    precision highp float;

    uniform sampler2D tMap;
    varying vec2 vUv;

    void main() {
        gl_FragColor = texture2D(tMap, vUv);
    }
`;
const tmp = new Vec3();
class Polyline {
  constructor(gl, {
    points,
    vertex: vertex2 = defaultVertex$2,
    fragment: fragment2 = defaultFragment$2,
    uniforms = {},
    attributes = {}
  }) {
    this.gl = gl;
    this.points = points;
    this.count = points.length;
    this.position = new Float32Array(this.count * 3 * 2);
    this.prev = new Float32Array(this.count * 3 * 2);
    this.next = new Float32Array(this.count * 3 * 2);
    const side = new Float32Array(this.count * 1 * 2);
    const uv = new Float32Array(this.count * 2 * 2);
    const index = new Uint16Array((this.count - 1) * 3 * 2);
    for (let i = 0; i < this.count; i++) {
      side.set([-1, 1], i * 2);
      const v = i / (this.count - 1);
      uv.set([0, v, 1, v], i * 4);
      if (i === this.count - 1)
        continue;
      const ind = i * 2;
      index.set([ind + 0, ind + 1, ind + 2], (ind + 0) * 3);
      index.set([ind + 2, ind + 1, ind + 3], (ind + 1) * 3);
    }
    const geometry = this.geometry = new Geometry(gl, Object.assign(attributes, {
      position: {size: 3, data: this.position},
      prev: {size: 3, data: this.prev},
      next: {size: 3, data: this.next},
      side: {size: 1, data: side},
      uv: {size: 2, data: uv},
      index: {size: 1, data: index}
    }));
    this.updateGeometry();
    if (!uniforms.uResolution)
      this.resolution = uniforms.uResolution = {value: new Vec2()};
    if (!uniforms.uDPR)
      this.dpr = uniforms.uDPR = {value: 1};
    if (!uniforms.uThickness)
      this.thickness = uniforms.uThickness = {value: 1};
    if (!uniforms.uColor)
      this.color = uniforms.uColor = {value: new Color("#000")};
    if (!uniforms.uMiter)
      this.miter = uniforms.uMiter = {value: 1};
    this.resize();
    const program = this.program = new Program(gl, {
      vertex: vertex2,
      fragment: fragment2,
      uniforms
    });
    this.mesh = new Mesh(gl, {geometry, program});
  }
  updateGeometry() {
    this.points.forEach((p, i) => {
      p.toArray(this.position, i * 3 * 2);
      p.toArray(this.position, i * 3 * 2 + 3);
      if (!i) {
        tmp.copy(p).sub(this.points[i + 1]).add(p);
        tmp.toArray(this.prev, i * 3 * 2);
        tmp.toArray(this.prev, i * 3 * 2 + 3);
      } else {
        p.toArray(this.next, (i - 1) * 3 * 2);
        p.toArray(this.next, (i - 1) * 3 * 2 + 3);
      }
      if (i === this.points.length - 1) {
        tmp.copy(p).sub(this.points[i - 1]).add(p);
        tmp.toArray(this.next, i * 3 * 2);
        tmp.toArray(this.next, i * 3 * 2 + 3);
      } else {
        p.toArray(this.prev, (i + 1) * 3 * 2);
        p.toArray(this.prev, (i + 1) * 3 * 2 + 3);
      }
    });
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.prev.needsUpdate = true;
    this.geometry.attributes.next.needsUpdate = true;
  }
  resize() {
    if (this.resolution)
      this.resolution.value.set(this.gl.canvas.width, this.gl.canvas.height);
    if (this.dpr)
      this.dpr.value = this.gl.renderer.dpr;
  }
}
const defaultVertex$2 = `
    precision highp float;

    attribute vec3 position;
    attribute vec3 next;
    attribute vec3 prev;
    attribute vec2 uv;
    attribute float side;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform vec2 uResolution;
    uniform float uDPR;
    uniform float uThickness;
    uniform float uMiter;

    varying vec2 vUv;

    vec4 getPosition() {
        mat4 mvp = projectionMatrix * modelViewMatrix;
        vec4 current = mvp * vec4(position, 1);
        vec4 nextPos = mvp * vec4(next, 1);
        vec4 prevPos = mvp * vec4(prev, 1);

        vec2 aspect = vec2(uResolution.x / uResolution.y, 1);    
        vec2 currentScreen = current.xy / current.w * aspect;
        vec2 nextScreen = nextPos.xy / nextPos.w * aspect;
        vec2 prevScreen = prevPos.xy / prevPos.w * aspect;
    
        vec2 dir1 = normalize(currentScreen - prevScreen);
        vec2 dir2 = normalize(nextScreen - currentScreen);
        vec2 dir = normalize(dir1 + dir2);
    
        vec2 normal = vec2(-dir.y, dir.x);
        normal /= mix(1.0, max(0.3, dot(normal, vec2(-dir1.y, dir1.x))), uMiter);
        normal /= aspect;

        float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
        float pixelWidth = current.w * pixelWidthRatio;
        normal *= pixelWidth * uThickness;
        current.xy -= normal * side;
    
        return current;
    }

    void main() {
        vUv = uv;
        gl_Position = getPosition();
    }
`;
const defaultFragment$2 = `
    precision highp float;

    uniform vec3 uColor;
    
    varying vec2 vUv;

    void main() {
        gl_FragColor.rgb = uColor;
        gl_FragColor.a = 1.0;
    }
`;
class Shadow {
  constructor(gl, {light = new Camera(gl), width = 1024, height = width}) {
    this.gl = gl;
    this.light = light;
    this.target = new RenderTarget(gl, {width, height});
    this.depthProgram = new Program(gl, {
      vertex: defaultVertex$3,
      fragment: defaultFragment$3,
      cullFace: null
    });
    this.castMeshes = [];
  }
  add({
    mesh,
    receive = true,
    cast = true,
    vertex: vertex2 = defaultVertex$3,
    fragment: fragment2 = defaultFragment$3,
    uniformProjection = "shadowProjectionMatrix",
    uniformView = "shadowViewMatrix",
    uniformTexture = "tShadow"
  }) {
    if (receive && !mesh.program.uniforms[uniformProjection]) {
      mesh.program.uniforms[uniformProjection] = {value: this.light.projectionMatrix};
      mesh.program.uniforms[uniformView] = {value: this.light.viewMatrix};
      mesh.program.uniforms[uniformTexture] = {value: this.target.texture};
    }
    if (!cast)
      return;
    this.castMeshes.push(mesh);
    mesh.colorProgram = mesh.program;
    if (mesh.depthProgram)
      return;
    if (vertex2 === defaultVertex$3 && fragment2 === defaultFragment$3) {
      mesh.depthProgram = this.depthProgram;
      return;
    }
    mesh.depthProgram = new Program(this.gl, {
      vertex: vertex2,
      fragment: fragment2,
      cullFace: null
    });
  }
  render({scene}) {
    scene.traverse((node) => {
      if (!node.draw)
        return;
      if (!!~this.castMeshes.indexOf(node)) {
        node.program = node.depthProgram;
      } else {
        node.isForceVisibility = node.visible;
        node.visible = false;
      }
    });
    this.gl.renderer.render({
      scene,
      camera: this.light,
      target: this.target
    });
    scene.traverse((node) => {
      if (!node.draw)
        return;
      if (!!~this.castMeshes.indexOf(node)) {
        node.program = node.colorProgram;
      } else {
        node.visible = node.isForceVisibility;
      }
    });
  }
}
const defaultVertex$3 = `
    attribute vec3 position;
    attribute vec2 uv;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const defaultFragment$3 = `
    precision highp float;

    vec4 packRGBA (float v) {
        vec4 pack = fract(vec4(1.0, 255.0, 65025.0, 16581375.0) * v);
        pack -= pack.yzww * vec2(1.0 / 255.0, 0.0).xxxy;
        return pack;
    }

    void main() {
        gl_FragColor = packRGBA(gl_FragCoord.z);
    }
`;
class KTXTexture extends Texture {
  constructor(gl, {buffer, wrapS = gl.CLAMP_TO_EDGE, wrapT = gl.CLAMP_TO_EDGE, anisotropy = 0, minFilter, magFilter} = {}) {
    super(gl, {
      generateMipmaps: false,
      wrapS,
      wrapT,
      anisotropy,
      minFilter,
      magFilter
    });
    if (buffer)
      return this.parseBuffer(buffer);
  }
  parseBuffer(buffer) {
    const ktx = new KhronosTextureContainer(buffer);
    ktx.mipmaps.isCompressedTexture = true;
    this.image = ktx.mipmaps;
    this.internalFormat = ktx.glInternalFormat;
    if (ktx.numberOfMipmapLevels > 1) {
      if (this.minFilter === this.gl.LINEAR)
        this.minFilter = this.gl.NEAREST_MIPMAP_LINEAR;
    } else {
      if (this.minFilter === this.gl.NEAREST_MIPMAP_LINEAR)
        this.minFilter = this.gl.LINEAR;
    }
  }
}
function KhronosTextureContainer(buffer) {
  const idCheck = [171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10];
  const id = new Uint8Array(buffer, 0, 12);
  for (let i = 0; i < id.length; i++)
    if (id[i] !== idCheck[i])
      return console.error("File missing KTX identifier");
  const size = Uint32Array.BYTES_PER_ELEMENT;
  const head = new DataView(buffer, 12, 13 * size);
  const littleEndian = head.getUint32(0, true) === 67305985;
  const glType = head.getUint32(1 * size, littleEndian);
  if (glType !== 0)
    return console.warn("only compressed formats currently supported");
  this.glInternalFormat = head.getUint32(4 * size, littleEndian);
  let width = head.getUint32(6 * size, littleEndian);
  let height = head.getUint32(7 * size, littleEndian);
  this.numberOfFaces = head.getUint32(10 * size, littleEndian);
  this.numberOfMipmapLevels = Math.max(1, head.getUint32(11 * size, littleEndian));
  const bytesOfKeyValueData = head.getUint32(12 * size, littleEndian);
  this.mipmaps = [];
  let offset = 12 + 13 * 4 + bytesOfKeyValueData;
  for (let level = 0; level < this.numberOfMipmapLevels; level++) {
    const levelSize = new Int32Array(buffer, offset, 1)[0];
    offset += 4;
    for (let face = 0; face < this.numberOfFaces; face++) {
      const data = new Uint8Array(buffer, offset, levelSize);
      this.mipmaps.push({data, width, height});
      offset += levelSize;
      offset += 3 - (levelSize + 3) % 4;
    }
    width = width >> 1;
    height = height >> 1;
  }
}
let cache = {};
const supportedExtensions = [];
class TextureLoader {
  static load(gl, {
    src,
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    anisotropy = 0,
    format = gl.RGBA,
    internalFormat = format,
    generateMipmaps = true,
    minFilter = generateMipmaps ? gl.NEAREST_MIPMAP_LINEAR : gl.LINEAR,
    magFilter = gl.LINEAR,
    premultiplyAlpha = false,
    unpackAlignment = 4,
    flipY = true
  } = {}) {
    const support = this.getSupportedExtensions(gl);
    let ext = "none";
    if (typeof src === "string") {
      ext = src.split(".").pop().split("?")[0].toLowerCase();
    }
    if (typeof src === "object") {
      for (const prop in src) {
        if (support.includes(prop.toLowerCase())) {
          ext = prop.toLowerCase();
          src = src[prop];
          break;
        }
      }
    }
    const cacheID = src + wrapS + wrapT + anisotropy + format + internalFormat + generateMipmaps + minFilter + magFilter + premultiplyAlpha + unpackAlignment + flipY + gl.renderer.id;
    if (cache[cacheID])
      return cache[cacheID];
    let texture;
    switch (ext) {
      case "ktx":
      case "pvrtc":
      case "s3tc":
      case "etc":
      case "etc1":
      case "astc":
        texture = new KTXTexture(gl, {
          src,
          wrapS,
          wrapT,
          anisotropy,
          minFilter,
          magFilter
        });
        texture.loaded = this.loadKTX(src, texture);
        break;
      case "webp":
      case "jpg":
      case "jpeg":
      case "png":
        texture = new Texture(gl, {
          wrapS,
          wrapT,
          anisotropy,
          format,
          internalFormat,
          generateMipmaps,
          minFilter,
          magFilter,
          premultiplyAlpha,
          unpackAlignment,
          flipY
        });
        texture.loaded = this.loadImage(gl, src, texture);
        break;
      default:
        console.warn("No supported format supplied");
        texture = new Texture(gl);
    }
    texture.ext = ext;
    cache[cacheID] = texture;
    return texture;
  }
  static getSupportedExtensions(gl) {
    if (supportedExtensions.length)
      return supportedExtensions;
    const extensions = {
      pvrtc: gl.renderer.getExtension("WEBGL_compressed_texture_pvrtc") || gl.renderer.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
      s3tc: gl.renderer.getExtension("WEBGL_compressed_texture_s3tc") || gl.renderer.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || gl.renderer.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc"),
      etc: gl.renderer.getExtension("WEBGL_compressed_texture_etc"),
      etc1: gl.renderer.getExtension("WEBGL_compressed_texture_etc1"),
      astc: gl.renderer.getExtension("WEBGL_compressed_texture_astc")
    };
    for (const ext in extensions)
      if (extensions[ext])
        supportedExtensions.push(ext);
    if (detectWebP)
      supportedExtensions.push("webp");
    supportedExtensions.push("png", "jpg");
    return supportedExtensions;
  }
  static loadKTX(src, texture) {
    return fetch(src).then((res) => res.arrayBuffer()).then((buffer) => texture.parseBuffer(buffer));
  }
  static loadImage(gl, src, texture) {
    return decodeImage(src).then((imgBmp) => {
      if (!powerOfTwo(imgBmp.width) || !powerOfTwo(imgBmp.height)) {
        if (texture.generateMipmaps)
          texture.generateMipmaps = false;
        if (texture.minFilter === gl.NEAREST_MIPMAP_LINEAR)
          texture.minFilter = gl.LINEAR;
        if (texture.wrapS === gl.REPEAT)
          texture.wrapS = texture.wrapT = gl.CLAMP_TO_EDGE;
      }
      texture.image = imgBmp;
      texture.onUpdate = () => {
        if (imgBmp.close)
          imgBmp.close();
        texture.onUpdate = null;
      };
      return imgBmp;
    });
  }
  static clearCache() {
    cache = {};
  }
}
function detectWebP() {
  return document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") == 0;
}
function powerOfTwo(value) {
  return Math.log2(value) % 1 === 0;
}
function decodeImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "";
    img.src = src;
    const isChrome = navigator.userAgent.toLowerCase().includes("chrome");
    if (!!window.createImageBitmap && isChrome) {
      img.onload = () => {
        createImageBitmap(img, {
          imageOrientation: "flipY",
          premultiplyAlpha: "none"
        }).then((imgBmp) => {
          resolve(imgBmp);
        });
      };
    } else {
      img.onload = () => resolve(img);
    }
  });
}
const tmpVec3A = new Vec3();
const tmpVec3B = new Vec3();
const tmpVec3C = new Vec3();
const tmpVec3D = new Vec3();
const tmpQuatA = new Quat();
const tmpQuatB = new Quat();
const tmpQuatC = new Quat();
const tmpQuatD = new Quat();
class GLTFAnimation {
  constructor(data, weight = 1) {
    this.data = data;
    this.elapsed = 0;
    this.weight = weight;
    this.loop = true;
    this.startTime = data.reduce((a, {times}) => Math.min(a, times[0]), Infinity);
    this.endTime = data.reduce((a, {times}) => Math.max(a, times[times.length - 1]), 0);
    this.duration = this.endTime - this.startTime;
  }
  update(totalWeight = 1, isSet) {
    const weight = isSet ? 1 : this.weight / totalWeight;
    const elapsed = (this.loop ? this.elapsed % this.duration : Math.min(this.elapsed, this.duration - 1e-3)) + this.startTime;
    this.data.forEach(({node, transform, interpolation, times, values}) => {
      const prevIndex = Math.max(1, times.findIndex((t) => t > elapsed)) - 1;
      const nextIndex = prevIndex + 1;
      let alpha = (elapsed - times[prevIndex]) / (times[nextIndex] - times[prevIndex]);
      if (interpolation === "STEP")
        alpha = 0;
      let prevVal = tmpVec3A;
      let prevTan = tmpVec3B;
      let nextTan = tmpVec3C;
      let nextVal = tmpVec3D;
      let size = 3;
      if (transform === "quaternion") {
        prevVal = tmpQuatA;
        prevTan = tmpQuatB;
        nextTan = tmpQuatC;
        nextVal = tmpQuatD;
        size = 4;
      }
      if (interpolation === "CUBICSPLINE") {
        prevVal.fromArray(values, prevIndex * size * 3 + size * 1);
        prevTan.fromArray(values, prevIndex * size * 3 + size * 2);
        nextTan.fromArray(values, nextIndex * size * 3 + size * 0);
        nextVal.fromArray(values, nextIndex * size * 3 + size * 1);
        prevVal = this.cubicSplineInterpolate(alpha, prevVal, prevTan, nextTan, nextVal);
        if (size === 4)
          prevVal.normalize();
      } else {
        prevVal.fromArray(values, prevIndex * size);
        nextVal.fromArray(values, nextIndex * size);
        if (size === 4)
          prevVal.slerp(nextVal, alpha);
        else
          prevVal.lerp(nextVal, alpha);
      }
      if (size === 4)
        node[transform].slerp(prevVal, weight);
      else
        node[transform].lerp(prevVal, weight);
    });
  }
  cubicSplineInterpolate(t, prevVal, prevTan, nextTan, nextVal) {
    const t2 = t * t;
    const t3 = t2 * t;
    const s2 = 3 * t2 - 2 * t3;
    const s3 = t3 - t2;
    const s0 = 1 - s2;
    const s1 = s3 - t2 + t;
    for (let i = 0; i < prevVal.length; i++) {
      prevVal[i] = s0 * prevVal[i] + s1 * (1 - t) * prevTan[i] + s2 * nextVal[i] + s3 * t * nextTan[i];
    }
    return prevVal;
  }
}
const tempMat4$3 = new Mat4();
const identity$3 = new Mat4();
class GLTFSkin extends Mesh {
  constructor(gl, {skeleton, geometry, program, mode = gl.TRIANGLES} = {}) {
    super(gl, {geometry, program, mode});
    this.skeleton = skeleton;
    this.program = program;
    this.createBoneTexture();
    this.animations = [];
  }
  createBoneTexture() {
    if (!this.skeleton.joints.length)
      return;
    const size = Math.max(4, Math.pow(2, Math.ceil(Math.log(Math.sqrt(this.skeleton.joints.length * 4)) / Math.LN2)));
    this.boneMatrices = new Float32Array(size * size * 4);
    this.boneTextureSize = size;
    this.boneTexture = new Texture(this.gl, {
      image: this.boneMatrices,
      generateMipmaps: false,
      type: this.gl.FLOAT,
      internalFormat: this.gl.renderer.isWebgl2 ? this.gl.RGBA32F : this.gl.RGBA,
      minFilter: this.gl.NEAREST,
      magFilter: this.gl.NEAREST,
      flipY: false,
      width: size
    });
  }
  updateUniforms() {
    this.skeleton.joints.forEach((bone, i) => {
      tempMat4$3.multiply(bone.worldMatrix, bone.bindInverse);
      this.boneMatrices.set(tempMat4$3, i * 16);
    });
    if (this.boneTexture)
      this.boneTexture.needsUpdate = true;
  }
  draw({camera} = {}) {
    if (!this.program.uniforms.boneTexture) {
      Object.assign(this.program.uniforms, {
        boneTexture: {value: this.boneTexture},
        boneTextureSize: {value: this.boneTextureSize}
      });
    }
    this.updateUniforms();
    const _worldMatrix = this.worldMatrix;
    this.worldMatrix = identity$3;
    super.draw({camera});
    this.worldMatrix = _worldMatrix;
  }
}
const TYPE_ARRAY = {
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array,
  "image/jpeg": Uint8Array,
  "image/png": Uint8Array
};
const TYPE_SIZE = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
};
const ATTRIBUTES = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv2",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
};
const TRANSFORMS = {
  translation: "position",
  rotation: "quaternion",
  scale: "scale"
};
class GLTFLoader {
  static async load(gl, src) {
    const dir = src.split("/").slice(0, -1).join("/") + "/";
    const desc = await this.parseDesc(src);
    return await this.parse(gl, desc, dir);
  }
  static async parse(gl, desc, dir) {
    if (desc.asset === void 0 || desc.asset.version[0] < 2)
      console.warn("Only GLTF >=2.0 supported. Attempting to parse.");
    const buffers = await this.loadBuffers(desc, dir);
    gl.renderer.bindVertexArray(null);
    const bufferViews = this.parseBufferViews(gl, desc, buffers);
    const images = this.parseImages(gl, desc, dir, bufferViews);
    const textures = this.parseTextures(gl, desc, images);
    const materials = this.parseMaterials(gl, desc, textures);
    const skins = this.parseSkins(gl, desc, bufferViews);
    const meshes = this.parseMeshes(gl, desc, bufferViews, materials, skins);
    const nodes = this.parseNodes(gl, desc, meshes, skins);
    this.populateSkins(skins, nodes);
    const animations = this.parseAnimations(gl, desc, nodes, bufferViews);
    const scenes = this.parseScenes(desc, nodes);
    const scene = scenes[desc.scene];
    for (let i = nodes.length; i >= 0; i--)
      if (!nodes[i])
        nodes.splice(i, 1);
    return {
      json: desc,
      buffers,
      bufferViews,
      images,
      textures,
      materials,
      meshes,
      nodes,
      animations,
      scenes,
      scene
    };
  }
  static async parseDesc(src) {
    if (!src.match(/\.glb/)) {
      return await fetch(src).then((res) => res.json());
    } else {
      return await fetch(src).then((res) => res.arrayBuffer()).then((glb) => this.unpackGLB(glb));
    }
  }
  static unpackGLB(glb) {
    const header = new Uint32Array(glb, 0, 3);
    if (header[0] !== 1179937895) {
      throw new Error("Invalid glTF asset.");
    } else if (header[1] !== 2) {
      throw new Error(`Unsupported glTF binary version, "${header[1]}".`);
    }
    const jsonChunkHeader = new Uint32Array(glb, 12, 2);
    const jsonByteOffset = 20;
    const jsonByteLength = jsonChunkHeader[0];
    if (jsonChunkHeader[1] !== 1313821514) {
      throw new Error("Unexpected GLB layout.");
    }
    const jsonText = new TextDecoder().decode(glb.slice(jsonByteOffset, jsonByteOffset + jsonByteLength));
    const json = JSON.parse(jsonText);
    if (jsonByteOffset + jsonByteLength === glb.byteLength)
      return json;
    const binaryChunkHeader = new Uint32Array(glb, jsonByteOffset + jsonByteLength, 2);
    if (binaryChunkHeader[1] !== 5130562) {
      throw new Error("Unexpected GLB layout.");
    }
    const binaryByteOffset = jsonByteOffset + jsonByteLength + 8;
    const binaryByteLength = binaryChunkHeader[0];
    const binary = glb.slice(binaryByteOffset, binaryByteOffset + binaryByteLength);
    json.buffers[0].binary = binary;
    return json;
  }
  static resolveURI(uri, dir) {
    if (typeof uri !== "string" || uri === "")
      return "";
    if (/^https?:\/\//i.test(dir) && /^\//.test(uri)) {
      dir = dir.replace(/(^https?:\/\/[^\/]+).*/i, "$1");
    }
    if (/^(https?:)?\/\//i.test(uri))
      return uri;
    if (/^data:.*,.*$/i.test(uri))
      return uri;
    if (/^blob:.*$/i.test(uri))
      return uri;
    return dir + uri;
  }
  static async loadBuffers(desc, dir) {
    if (!desc.buffers)
      return null;
    return await Promise.all(desc.buffers.map((buffer) => {
      if (buffer.binary)
        return buffer.binary;
      const uri = this.resolveURI(buffer.uri, dir);
      return fetch(uri).then((res) => res.arrayBuffer());
    }));
  }
  static parseBufferViews(gl, desc, buffers) {
    if (!desc.bufferViews)
      return null;
    const bufferViews = desc.bufferViews.map((o) => Object.assign({}, o));
    desc.meshes && desc.meshes.forEach(({primitives}) => {
      primitives.forEach(({attributes, indices}) => {
        for (let attr in attributes)
          bufferViews[desc.accessors[attributes[attr]].bufferView].isAttribute = true;
        if (indices === void 0)
          return;
        bufferViews[desc.accessors[indices].bufferView].isAttribute = true;
        bufferViews[desc.accessors[indices].bufferView].target = gl.ELEMENT_ARRAY_BUFFER;
      });
    });
    desc.accessors.forEach(({bufferView: i, componentType}) => {
      bufferViews[i].componentType = componentType;
    });
    desc.images && desc.images.forEach(({uri, bufferView: i, mimeType}) => {
      if (i === void 0)
        return;
      bufferViews[i].mimeType = mimeType;
    });
    bufferViews.forEach(({
      buffer: bufferIndex,
      byteOffset = 0,
      byteLength,
      byteStride,
      target = gl.ARRAY_BUFFER,
      name,
      extensions,
      extras,
      componentType,
      mimeType,
      isAttribute
    }, i) => {
      const TypeArray = TYPE_ARRAY[componentType || mimeType];
      const elementBytes = TypeArray.BYTES_PER_ELEMENT;
      const data = new TypeArray(buffers[bufferIndex], byteOffset, byteLength / elementBytes);
      bufferViews[i].data = data;
      bufferViews[i].originalBuffer = buffers[bufferIndex];
      if (!isAttribute)
        return;
      const buffer = gl.createBuffer();
      gl.bindBuffer(target, buffer);
      gl.renderer.state.boundBuffer = buffer;
      gl.bufferData(target, data, gl.STATIC_DRAW);
      bufferViews[i].buffer = buffer;
    });
    return bufferViews;
  }
  static parseImages(gl, desc, dir, bufferViews) {
    if (!desc.images)
      return null;
    return desc.images.map(({uri, bufferView: bufferViewIndex, mimeType, name}) => {
      const image = new Image();
      image.name = name;
      if (uri) {
        image.src = this.resolveURI(uri, dir);
      } else if (bufferViewIndex !== void 0) {
        const {data} = bufferViews[bufferViewIndex];
        const blob = new Blob([data], {type: mimeType});
        image.src = URL.createObjectURL(blob);
      }
      image.ready = new Promise((res) => {
        image.onload = () => res();
      });
      return image;
    });
  }
  static parseTextures(gl, desc, images) {
    if (!desc.textures)
      return null;
    return desc.textures.map(({sampler: samplerIndex, source: sourceIndex, name, extensions, extras}) => {
      const options = {
        flipY: false,
        wrapS: gl.REPEAT,
        wrapT: gl.REPEAT
      };
      const sampler = samplerIndex !== void 0 ? desc.samplers[samplerIndex] : null;
      if (sampler) {
        ["magFilter", "minFilter", "wrapS", "wrapT"].forEach((prop) => {
          if (sampler[prop])
            options[prop] = sampler[prop];
        });
      }
      const texture = new Texture(gl, options);
      texture.name = name;
      const image = images[sourceIndex];
      image.ready.then(() => texture.image = image);
      return texture;
    });
  }
  static parseMaterials(gl, desc, textures) {
    if (!desc.materials)
      return null;
    return desc.materials.map(({
      name,
      extensions,
      extras,
      pbrMetallicRoughness = {},
      normalTexture,
      occlusionTexture,
      emissiveTexture,
      emissiveFactor = [0, 0, 0],
      alphaMode = "OPAQUE",
      alphaCutoff = 0.5,
      doubleSided = false
    }) => {
      const {
        baseColorFactor = [1, 1, 1, 1],
        baseColorTexture,
        metallicFactor = 1,
        roughnessFactor = 1,
        metallicRoughnessTexture
      } = pbrMetallicRoughness;
      if (baseColorTexture) {
        baseColorTexture.texture = textures[baseColorTexture.index];
      }
      if (normalTexture) {
        normalTexture.texture = textures[normalTexture.index];
      }
      if (metallicRoughnessTexture) {
        metallicRoughnessTexture.texture = textures[metallicRoughnessTexture.index];
      }
      if (occlusionTexture) {
        occlusionTexture.texture = textures[occlusionTexture.index];
      }
      if (emissiveTexture) {
        emissiveTexture.texture = textures[emissiveTexture.index];
      }
      return {
        name,
        baseColorFactor,
        baseColorTexture,
        metallicFactor,
        roughnessFactor,
        metallicRoughnessTexture,
        normalTexture,
        occlusionTexture,
        emissiveTexture,
        emissiveFactor,
        alphaMode,
        alphaCutoff,
        doubleSided
      };
    });
  }
  static parseSkins(gl, desc, bufferViews) {
    if (!desc.skins)
      return null;
    return desc.skins.map(({
      inverseBindMatrices,
      skeleton,
      joints
    }) => {
      return {
        inverseBindMatrices: this.parseAccessor(inverseBindMatrices, desc, bufferViews),
        skeleton,
        joints
      };
    });
  }
  static parseMeshes(gl, desc, bufferViews, materials, skins) {
    if (!desc.meshes)
      return null;
    return desc.meshes.map(({
      primitives,
      weights,
      name,
      extensions,
      extras
    }, meshIndex) => {
      let numInstances = 0;
      let skinIndex = false;
      desc.nodes && desc.nodes.forEach(({mesh, skin}) => {
        if (mesh === meshIndex) {
          numInstances++;
          if (skin !== void 0)
            skinIndex = skin;
        }
      });
      primitives = this.parsePrimitives(gl, primitives, desc, bufferViews, materials, numInstances).map(({geometry, program, mode}) => {
        const mesh = typeof skinIndex === "number" ? new GLTFSkin(gl, {skeleton: skins[skinIndex], geometry, program, mode}) : new Mesh(gl, {geometry, program, mode});
        mesh.name = name;
        if (mesh.geometry.isInstanced) {
          mesh.numInstances = numInstances;
          mesh.frustumCulled = false;
        }
        return mesh;
      });
      return {
        primitives,
        weights,
        name
      };
    });
  }
  static parsePrimitives(gl, primitives, desc, bufferViews, materials, numInstances) {
    return primitives.map(({
      attributes,
      indices,
      material: materialIndex,
      mode = 4,
      targets,
      extensions,
      extras
    }) => {
      const geometry = new Geometry(gl);
      for (let attr in attributes) {
        geometry.addAttribute(ATTRIBUTES[attr], this.parseAccessor(attributes[attr], desc, bufferViews));
      }
      if (indices !== void 0) {
        geometry.addAttribute("index", this.parseAccessor(indices, desc, bufferViews));
      }
      if (numInstances > 1) {
        geometry.addAttribute("instanceMatrix", {
          instanced: 1,
          size: 16,
          data: new Float32Array(numInstances * 16)
        });
      }
      const program = new NormalProgram(gl);
      if (materialIndex !== void 0) {
        program.gltfMaterial = materials[materialIndex];
      }
      return {
        geometry,
        program,
        mode
      };
    });
  }
  static parseAccessor(index, desc, bufferViews) {
    const {
      bufferView: bufferViewIndex,
      byteOffset = 0,
      componentType,
      normalized = false,
      count,
      type,
      min,
      max,
      sparse
    } = desc.accessors[index];
    const {
      data,
      originalBuffer,
      buffer,
      byteOffset: bufferByteOffset = 0,
      byteStride = 0,
      target
    } = bufferViews[bufferViewIndex];
    const size = TYPE_SIZE[type];
    const TypeArray = TYPE_ARRAY[componentType];
    const elementBytes = data.BYTES_PER_ELEMENT;
    const componentStride = byteStride / elementBytes;
    const isInterleaved = !!byteStride && componentStride !== size;
    const newData = isInterleaved ? data : new TypeArray(originalBuffer, byteOffset + bufferByteOffset, count * size);
    return {
      data: newData,
      size,
      type: componentType,
      normalized,
      buffer,
      stride: byteStride,
      offset: byteOffset,
      count,
      min,
      max
    };
  }
  static parseNodes(gl, desc, meshes, skins) {
    if (!desc.nodes)
      return null;
    const nodes = desc.nodes.map(({
      camera,
      children,
      skin: skinIndex,
      matrix,
      mesh: meshIndex,
      rotation,
      scale: scale2,
      translation,
      weights,
      name,
      extensions,
      extras
    }) => {
      const node = new Transform();
      if (name)
        node.name = name;
      if (matrix) {
        node.matrix.copy(matrix);
        node.decompose();
      } else {
        if (rotation)
          node.quaternion.copy(rotation);
        if (scale2)
          node.scale.copy(scale2);
        if (translation)
          node.position.copy(translation);
        node.updateMatrix();
      }
      let isInstanced = false;
      let isFirstInstance = true;
      if (meshIndex !== void 0) {
        meshes[meshIndex].primitives.forEach((mesh) => {
          if (mesh.geometry.isInstanced) {
            isInstanced = true;
            if (!mesh.instanceCount) {
              mesh.instanceCount = 0;
            } else {
              isFirstInstance = false;
            }
            node.matrix.toArray(mesh.geometry.attributes.instanceMatrix.data, mesh.instanceCount * 16);
            mesh.instanceCount++;
            if (mesh.instanceCount === mesh.numInstances) {
              delete mesh.numInstances;
              delete mesh.instanceCount;
              mesh.geometry.attributes.instanceMatrix.needsUpdate = true;
            }
          }
          if (isInstanced) {
            if (isFirstInstance)
              mesh.setParent(node);
          } else {
            mesh.setParent(node);
          }
        });
      }
      if (isInstanced) {
        if (!isFirstInstance)
          return null;
        node.matrix.identity();
        node.decompose();
      }
      return node;
    });
    desc.nodes.forEach(({children = []}, i) => {
      children.forEach((childIndex) => {
        if (!nodes[childIndex])
          return;
        nodes[childIndex].setParent(nodes[i]);
      });
    });
    return nodes;
  }
  static populateSkins(skins, nodes) {
    if (!skins)
      return;
    skins.forEach((skin) => {
      skin.joints = skin.joints.map((i, index) => {
        const joint = nodes[i];
        joint.bindInverse = new Mat4(...skin.inverseBindMatrices.data.slice(index * 16, (index + 1) * 16));
        return joint;
      });
      if (skin.skeleton)
        skin.skeleton = nodes[skin.skeleton];
    });
  }
  static parseAnimations(gl, desc, nodes, bufferViews) {
    if (!desc.animations)
      return null;
    return desc.animations.map(({
      channels,
      samplers,
      name
    }) => {
      const data = channels.map(({
        sampler: samplerIndex,
        target
      }) => {
        const {
          input: inputIndex,
          interpolation = "LINEAR",
          output: outputIndex
        } = samplers[samplerIndex];
        const {
          node: nodeIndex,
          path
        } = target;
        const node = nodes[nodeIndex];
        const transform = TRANSFORMS[path];
        const times = this.parseAccessor(inputIndex, desc, bufferViews).data;
        const values = this.parseAccessor(outputIndex, desc, bufferViews).data;
        return {
          node,
          transform,
          interpolation,
          times,
          values
        };
      });
      return {
        name,
        animation: new GLTFAnimation(data)
      };
    });
  }
  static parseScenes(desc, nodes) {
    if (!desc.scenes)
      return null;
    return desc.scenes.map(({
      nodes: nodesIndices = [],
      name,
      extensions,
      extras
    }) => {
      return nodesIndices.reduce((map, i) => {
        if (nodes[i])
          map.push(nodes[i]);
        return map;
      }, []);
    });
  }
}
export {Animation, Box, Camera, Color, Curve, Cylinder, Euler, Flowmap, GLTFLoader, GLTFSkin, GPGPU, Geometry, KTXTexture, Mat3, Mat4, Mesh, NormalProgram, Orbit, Plane, Polyline, Post, Program, Quat, Raycast, RenderTarget, Renderer, Shadow, Skin, Sphere, Text, Texture, TextureLoader, Torus, Transform, Triangle, Vec2, Vec3, Vec4};
export default null;
