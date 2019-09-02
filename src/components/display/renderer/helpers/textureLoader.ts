import { Texture } from "ogl";
const textureCache: any = {};
export default function loadTexture(src: string, gl: WebGL2RenderingContext, generateMipmaps = true) {
  if (textureCache[src]) return textureCache[src];
  const texture = new Texture(gl, { generateMipmaps });
  const image = new Image();
  textureCache[src] = texture;
  image.onload = () => {
    texture.image = image;
  };
  image.src = src;
  return texture;
}
