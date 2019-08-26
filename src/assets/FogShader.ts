const vertex: string = `
    precision highp float;
    precision highp int;

    attribute vec2 uv;
    attribute vec3 position;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;

    varying vec2 vUv;
    varying vec4 vMVPos;
    varying vec3 vPos;

    void main() {
        vUv = uv;
        
        // copy position so that we can modify the instances
        vec3 pos = position;
        
        // pass scaled object position to fragment to add low-lying fog
        vPos = pos;
        
        // pass model view position to fragment shader to get distance from camera 
        vMVPos = modelViewMatrix * vec4(pos, 1.0);
        
        gl_Position = projectionMatrix * vMVPos;
    }
`;

const fragment: string = `
    precision highp float;
    precision highp int;

    uniform float uTime;
    uniform sampler2D tMap;
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;

    varying vec2 vUv;
    varying vec4 vMVPos;
    varying vec3 vPos;

    void main() {
        vec3 tex = texture2D(tMap, vUv).rgb;
        
        // add the fog relative to the distance from the camera
        float dist = length(vMVPos);
        float fog = smoothstep(uFogNear, uFogFar, dist);
        tex = mix(tex, uFogColor, fog);
        
        // add some fog along the height of each tree to simulate low-lying fog 
        tex = mix(tex, uFogColor, smoothstep(0.3, -1.2, vPos.y)); 
        
        gl_FragColor.rgb = tex;
        gl_FragColor.a = 1.0;
    }
`;

export default { vertex, fragment };
