import { Program, Texture } from '../ogl.js';

export const blue = (gl) =>
  new Program(gl, {
    vertex: `attribute vec3 position;
            attribute vec3 normal;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform mat3 normalMatrix;
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
`,
    fragment: `
    precision highp float;
    varying vec3 vNormal;
    void main() {
        vec3 normal = normalize(vNormal);
        float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
        gl_FragColor.rgb = vec3(0.2, 0.8, 1.0) + lighting * 0.1;
        gl_FragColor.a = 1.0;
    }
  `,
  });

export const green = (gl) => {
  const texture = new Texture(gl);
  const img = new Image();
  img.onload = () => (texture.image = img);
  img.src = 'matcap_green.jpg';
  return new Program(gl, {
    vertex: `#version 300 es
      #define attribute in
      #define varying out
      attribute vec3 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      varying vec4 vMVPos;
      void main() {
        vMVPos = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * vMVPos;
      }
      `,
    fragment: `#version 300 es
      precision highp float;
      #define varying in
      #define texture2D texture
      #define gl_FragColor FragColor
      out vec4 FragColor;
      precision highp float;
      uniform sampler2D tMap;
      varying vec4 vMVPos;
      vec3 normals(vec3 pos) {
        vec3 fdx = dFdx(pos);
        vec3 fdy = dFdy(pos);
        return normalize(cross(fdx, fdy));
      }
      vec2 matcap(vec3 eye, vec3 normal) {
        vec3 reflected = reflect(eye, normal);
        float m = 2.8284271247461903 * sqrt(reflected.z + 1.0);
        return reflected.xy / m + 0.5;
      }
      void main() {
        vec3 normal = normals(vMVPos.xyz);
        // We're using the matcap to add some shininess to the model
        vec3 mat = texture2D(tMap, matcap(normalize(vMVPos.xyz), normal)).rgb;
        
        gl_FragColor.rgb = mat;
        gl_FragColor.a = 1.0;
      }
      
      `,
    uniforms: {
      tMap: { value: texture },
    },
    cullFace: null,
  });
};

export const particle = (gl) =>
  new Program(gl, {
    vertex: `
      attribute vec3 position;
      uniform mat4 modelMatrix;
      uniform mat4 viewMatrix;
      uniform mat4 projectionMatrix;
      void main() {
      
          // modelMatrix is one of the automatically attached uniforms when using the Mesh class
          vec4 mPos = modelMatrix * vec4(position, 1.0);
         
          // get the model view position so that we can scale the points off into the distance
          vec4 mvPos = viewMatrix * mPos;
          gl_PointSize = 300.0 / length(mvPos.xyz);
          gl_Position = projectionMatrix * mvPos;
      }`,
    fragment: `
      precision highp float;
      float pointSize = 0.2;
      void main() {
          vec2 uv = gl_PointCoord.xy;
          
          float circle = smoothstep(pointSize, pointSize-0.02, length(uv - 0.5))*0.6;
          
          gl_FragColor.rgb = vec3(0.0, 0.0, 0.0);
          gl_FragColor.a = circle;
      }`,
    transparent: true,
    depthTest: false,
  });
