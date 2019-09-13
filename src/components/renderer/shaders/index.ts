import GroundShaderFrag from "./GroundShader.frag";
import GroundShaderVert from "./GroundShader.vert";
const GroundShader = {
  fragment: GroundShaderFrag,
  vertex: GroundShaderVert
};

import BasicShaderFrag from "./BasicShader.frag";
import BasicShaderVert from "./BasicShader.vert";
const BasicShader = {
  fragment: BasicShaderFrag,
  vertex: BasicShaderVert
};

import InstanceShaderFrag from "./InstanceShader.frag";
import InstanceShaderVert from "./InstanceShader.vert";
const InstanceShader = {
  fragment: InstanceShaderFrag,
  vertex: InstanceShaderVert
};

export { GroundShader, BasicShader, InstanceShader };
