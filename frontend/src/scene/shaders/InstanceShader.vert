precision highp float;
precision highp int;
attribute vec2 uv;
attribute vec3 position;
// Add instanced attributes just like any attribute

attribute vec3 offset;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

void main(){
	vUv=uv;
	
	// copy position so that we can modify the instances
	vec3 pos=position;
	
	pos+=offset;
	
	gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}