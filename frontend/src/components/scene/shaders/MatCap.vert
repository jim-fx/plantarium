#version 300 es
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