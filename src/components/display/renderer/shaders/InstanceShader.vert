precision highp float;
precision highp int;
attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;

attribute vec3 offset;
attribute vec3 scale;
attribute vec3 rotation;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

mat4 rotationX( in float angle ) {
	return mat4(	1.0,		0,			0,			0,
			 		0, 	cos(angle),	-sin(angle),		0,
					0, 	sin(angle),	 cos(angle),		0,
					0, 			0,			  0, 		1);
}

mat4 rotationY( in float angle ) {
	return mat4(	cos(angle),		0,		sin(angle),	0,
			 				0,		1.0,			 0,	0,
					-sin(angle),	0,		cos(angle),	0,
							0, 		0,				0,	1);
}

mat4 rotationZ( in float angle ) {
	return mat4(	cos(angle),		-sin(angle),	0,	0,
			 		sin(angle),		cos(angle),		0,	0,
							0,				0,		1,	0,
							0,				0,		0,	1);
}

void main() {
    vUv = uv;

    vNormal = normalize(normalMatrix * normal);

    // copy position so that we can modify the instances
    vec4 pos = vec4(position.xyz, 1.0);

    pos = pos * rotationY(rotation.y);

    vec3 rotated = vec3(pos.x, pos.y, pos.z);

    rotated *= scale;

    rotated += offset;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(rotated, 1.0);
}