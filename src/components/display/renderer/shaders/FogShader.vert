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