import { Texture, Program } from 'ogl';

const textureCache: any = {};
const shaderCache: any = {};

const loadShader = (
  gl: WebGL2RenderingContext,
  {
    shader,
    uniforms,
  }: { shader: { vertex: string; fragment: string }; uniforms: any },
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
  gl: WebGL2RenderingContext,
  src: string,
  options: any = {},
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
