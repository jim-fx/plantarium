precision highp float;
precision highp int;

attribute vec2 uv;
attribute vec3 position;
attribute float depth;

varying float vDepth;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

void main(){
    vDepth = depth;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
}
