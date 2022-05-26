import { Program, Texture, type OGLRenderingContext } from "ogl-typescript";
import BasicShaderFrag from "./BasicShader.frag";
import BasicShaderVert from "./BasicShader.vert";
import GroundShaderFrag from "./GroundShader.frag";
import GroundShaderVert from "./GroundShader.vert";
import InstanceShaderFrag from "./InstanceShader.frag";
import InstanceShaderVert from "./InstanceShader.vert";
import MatCapFrag from "./MatCap.frag";
import MatCapVert from "./MatCap.vert";
import ParticleFrag from "./ParticleShader.frag";
import ParticleVert from "./ParticleShader.vert";
import WireFrameFrag from "./WireframeShader.frag";
import WireFrameVert from "./WireframeShader.vert";
import NormalFrag from "./NormalShader.frag";
import NormalVert from "./NormalShader.vert";

import GridFrag from "./GridShader.frag";
import GridVert from "./GridShader.vert";

import DebugFrag from "./DebugShader.frag";
import DebugVert from "./DebugShader.vert";

export const GroundShader = {
  fragment: GroundShaderFrag,
  vertex: GroundShaderVert
};


export const DebugShader = (gl: OGLRenderingContext) => new Program(gl, {
  fragment: DebugFrag,
  vertex: DebugVert,
  cullFace: gl.NONE
});

export const BasicShader = (gl: OGLRenderingContext) => new Program(gl, {
  fragment: BasicShaderFrag,
  vertex: BasicShaderVert,
  cullFace: gl.NONE
});

export const InstanceShader = {
  fragment: InstanceShaderFrag,
  vertex: InstanceShaderVert
};

export const WireFrameShader = (gl: OGLRenderingContext) => new Program(gl, {
  fragment: WireFrameFrag,
  vertex: WireFrameVert,
  uniforms: {
    maxDepth: { value: 1 }
  },
  depthTest: false
});

export const ParticleShader = {
  fragment: ParticleFrag,
  vertex: ParticleVert
};

export const GridShader = (gl: OGLRenderingContext) => {
  return new Program(gl, {
    vertex: GridVert,
    fragment: GridFrag,
  })
}

export const MatCapShader = (gl: OGLRenderingContext) => {
  const texture = new Texture(gl);
  const img = new Image();
  img.onload = () => (texture.image = img);
  img.src = 'assets/matcap_green.jpg';
  return new Program(gl, {
    vertex: MatCapVert,
    fragment: MatCapFrag,
    uniforms: {
      tMap: { value: texture },
    },
    cullFace: gl.NONE
  });
}

export const NormalShader = (gl: OGLRenderingContext) => {
  const texture = new Texture(gl);
  const img = new Image();
  img.onload = () => (texture.image = img);
  img.src = 'assets/matcap_green.jpg';
  return new Program(gl, {
    vertex: NormalVert,
    fragment: NormalFrag,
    uniforms: {
      tMap: { value: texture },
    },
    cullFace: gl.NONE
  });
}
