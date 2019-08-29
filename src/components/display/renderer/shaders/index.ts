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

export { FogShader, BasicShader, WireFrameShader };
