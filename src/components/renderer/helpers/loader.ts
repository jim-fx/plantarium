import { Texture, Program } from "ogl";
import * as shaders from "../shaders";

const textureCache: any = {};
const shaderCache: any = {};
let gl: WebGL2RenderingContext;

interface Loader {
  shader: ShaderLoader;
  texture: TextureLoader;
  setGl: (gl: WebGL2RenderingContext) => void;
}

interface TextureLoader {
  (src: string, options: any): Texture;
}

interface ShaderLoader {
  (src: string, options: any): Program;
}

const textureLoader: TextureLoader = <TextureLoader>function(src: string, options: any = {}): Texture {
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

const shaderLoader: ShaderLoader = <ShaderLoader>function(name: string, uniforms: any = {}): Program {
  if (shaderCache[name]) return shaderCache[name];

  if (name in shaders) {
    const shader = new Program(gl, {
      vertex: shaders[name].vertex,
      fragment: shaders[name].fragment,
      uniforms
    });
    shaderCache[name] = shader;
    return shader;
  } else {
    console.error("cant load shader " + name);
  }
};

const exp: Loader = {
  texture: textureLoader,
  shader: shaderLoader,
  setGl: (_gl: WebGL2RenderingContext) => {
    gl = _gl;
  }
};

export default exp;
