import { Program, Texture } from 'ogl-typescript';

export const wireframe = (gl) =>
  new Program(gl, {
    vertex: `attribute vec3 position;
            attribute vec3 normal;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform mat3 normalMatrix;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
`,
    fragment: `
    precision highp float;
    varying vec3 vNormal;
    void main() {
        gl_FragColor.rgb = vec3(0.0, 0.0, 0.0);
        gl_FragColor.a = 0.5;
    }
  `,
    depthTest: false,
    transparent: true,
  });

export const text = (gl) =>
  new Program(gl, {
    vertex: `#version 300 es
    #define attribute in
    #define varying out
    attribute vec2 uv;
    attribute vec3 position;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    varying vec2 vUv;
    void main() {
        vUv = uv;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,
    fragment: `#version 300 es
    precision highp float;
    #define varying in
    #define texture2D texture
    #define gl_FragColor FragColor
    out vec4 FragColor;
    uniform sampler2D tMap;
    varying vec2 vUv;
    void main() {
        vec3 tex = texture2D(tMap, vUv).rgb;
        float signedDist = max(min(tex.r, tex.g), min(max(tex.r, tex.g), tex.b)) - 0.5;
        float d = fwidth(signedDist);
        float alpha = smoothstep(-d, d, signedDist);
        if (alpha < 0.01) discard;
        gl_FragColor.rgb = vec3(0.0);
        gl_FragColor.a = alpha;
    }
  `,
    depthTest: false,
    transparent: true,
  });

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
    vertex: `precision highp float;
precision highp int;

attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vUv = uv;

    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}      `,
    fragment: `
    precision highp float;
    precision highp int;

    varying vec3 vNormal;
    varying vec2 vUv;

    void main(){

      vec3 normal=normalize(vNormal);

      float lighting=dot(normal, normalize(vec3(-.3, .8, .6)));

      gl_FragColor.rgb = (vec3(.308 * vUv.x, .712, .5) + lighting * .5) - .25;
      // gl_FragColor.rgb=vec3(vUv.x,vUv.y,vNormal.x);

      gl_FragColor.a = 1.;

    }
    `,
    uniforms: {
      tMap: { value: texture },
    },
    cullFace: null,
  });
};

export const test = (gl) =>
  new Program(gl, {
    vertex: /* glsl */ `
                attribute vec3 position;
                attribute vec3 normal;
                uniform mat3 normalMatrix;
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
                varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,

    fragment: /* glsl */ `
                precision highp float;
                varying vec3 vNormal;
  void main() {
    gl_FragColor.rgb = vNormal;
    gl_FragColor.a = 1.0;
  }
  `,
    cullFace: null,
  })


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
  } `,
    fragment: `
      precision highp float;
      float pointSize = 0.2;
  void main() {
          vec2 uv = gl_PointCoord.xy;
          
          float circle = smoothstep(pointSize, pointSize - 0.02, length(uv - 0.5)) * 0.6;

    gl_FragColor.rgb = vec3(0.0, 0.0, 0.0);
    gl_FragColor.a = circle;
  } `,
    transparent: true,
    depthTest: false,
  });


export const NormalShader = (gl) => {
  const texture = new Texture(gl);
  const img = new Image();
  img.onload = () => (texture.image = img);
  img.src = 'matcap_green.jpg';
  return new Program(gl, {
    vertex: `attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec4 vMVPos;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vMVPos = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  } `,
    fragment: `precision highp float;

varying vec3 vNormal;
varying vec4 vMVPos;

uniform sampler2D tMap;

vec2 matcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt(reflected.z + 1.0);
    return reflected.xy / m + 0.5;
  }

  void main() {
    vec3 normal = normalize(vNormal);
    float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));

    vec3 mat = texture2D(tMap, matcap(normalize(vMVPos.xyz), normal * 0.9)).rgb;

    gl_FragColor.rgb = mat;
    gl_FragColor.a = 1.0;
  } `,
    uniforms: {
      tMap: { value: texture },
    },
    cullFace: null,
  });
}

export const Lines = {
  vertex: `attribute vec3 position;
                attribute vec3 normal;
                uniform mat3 normalMatrix;
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
  fragment: `precision highp float;
                varying vec3 vNormal;
                void main() {
                    gl_FragColor.rgb = normalize(vNormal);
                    gl_FragColor.a = 1.0;
                }`
}
