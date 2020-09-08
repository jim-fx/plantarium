import { Texture, Program, OGLRenderingContext } from 'ogl-typescript';

const textureCache: { [key: string]: Texture } = {};
const shaderCache: { [key: string]: Program } = {};

const loadShader = (
  gl: OGLRenderingContext,
  {
    shader,
    uniforms,
  }: { shader: { vertex: string; fragment: string }; uniforms: {} },
): Program => {
  if (shaderCache[name]) return shaderCache[name];

  const { vertex, fragment } = shader;

  shaderCache[name] = new Program(gl, {
    vertex,
    fragment,
    uniforms,
  });
  return shaderCache[name];
};

const loadTexture = (
  gl: OGLRenderingContext,
  src: string,
  options = {},
): Texture => {
  if (textureCache[src]) return textureCache[src];
  const texture = new Texture(gl, options);
  const image = new Image();
  textureCache[src] = texture;
  image.onload = () => {
    texture.image = image;
  };
  image.src = src;
  return texture;
};

export default {
  shader: loadShader,
  texture: loadTexture,
};
