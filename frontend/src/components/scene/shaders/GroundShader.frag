precision highp float;
precision highp int;

uniform float uTime;
uniform sampler2D tMap;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
uniform float texScale;

varying vec2 vUv;
varying vec4 vMVPos;
varying vec3 vPos;

void main() {
    vec3 tex = texture2D(tMap, vUv*texScale).rgb;
    
    // add the fog relative to the distance from the camera
    float dist = length(vMVPos);
    float fog = smoothstep(uFogNear, uFogFar, dist);
    tex = mix(tex, uFogColor, fog);
    
    // add some fog along the height of each tree to simulate low-lying fog 
    tex = mix(tex, uFogColor, smoothstep(0.3, -1.2, vPos.y)); 
    
    gl_FragColor.rgb = tex;
}