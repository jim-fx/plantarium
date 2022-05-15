import { Program, Texture } from "ogl-typescript";
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

export const GroundShader = {
  fragment: GroundShaderFrag,
  vertex: GroundShaderVert
};

export const BasicShader = {
  fragment: BasicShaderFrag,
  vertex: BasicShaderVert
};

export const InstanceShader = {
  fragment: InstanceShaderFrag,
  vertex: InstanceShaderVert
};

export const WireFrameShader = {
  fragment: WireFrameFrag,
  vertex: WireFrameVert
};

export const ParticleShader = {
  fragment: ParticleFrag,
  vertex: ParticleVert
};

export const MatCapShader = (gl: WebGL2RenderingContext) => {
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
    cullFace: null,
  });
}

export const NormalShader = (gl: WebGL2RenderingContext) => {
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
    cullFace: null,
  });
}
