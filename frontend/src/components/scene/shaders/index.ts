import { Program, Texture } from "ogl";
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

const GroundShader = {
  fragment: GroundShaderFrag,
  vertex: GroundShaderVert
};

const BasicShader = {
  fragment: BasicShaderFrag,
  vertex: BasicShaderVert
};

const InstanceShader = {
  fragment: InstanceShaderFrag,
  vertex: InstanceShaderVert
};

const WireFrameShader = {
  fragment: WireFrameFrag,
  vertex: WireFrameVert
};
const ParticleShader = {
  fragment: ParticleFrag,
  vertex: ParticleVert
};


export const MatCapShader = (gl:WebGL2RenderingContext) => {
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

export { GroundShader, BasicShader, InstanceShader, WireFrameShader, ParticleShader };

