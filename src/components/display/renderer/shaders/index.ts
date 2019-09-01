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

import WireFrameFrag from "./WireFrame.frag";
import WireFrameVert from "./WireFrame.vert";

const WireFrameShader = {
  fragment: WireFrameFrag,
  vertex: WireFrameVert
};

import InstanceShaderFrag from "./InstanceShader.frag";
import InstanceShaderVert from "./InstanceShader.vert";

const InstanceShader = {
  fragment: InstanceShaderFrag,
  vertex: InstanceShaderVert
};

export { FogShader, BasicShader, WireFrameShader, InstanceShader };
