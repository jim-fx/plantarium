import FogShaderFrag from "./FogShader.frag";
import FogShaderVert from "./FogShader.vert";

const FogShader = {
  fragment: FogShaderFrag,
  vertex: FogShaderVert
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

export { FogShader, BasicShader, InstanceShader };
