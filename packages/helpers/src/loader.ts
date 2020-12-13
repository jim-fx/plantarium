import { Texture, Program, OGLRenderingContext } from 'ogl-typescript';

const textureCache: { [key: string]: Texture } = {};
const shaderCache: { [key: string]: Program } = {};

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
  texture: loadTexture,
};
