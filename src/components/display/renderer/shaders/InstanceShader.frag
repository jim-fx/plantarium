precision highp float;
precision highp int;

uniform sampler2D tMap;

varying vec3 vNormal;
varying vec2 vUv;

void main() {

    vec3 normal = normalize(vNormal);

    float lighting = dot(normal, vec3(-0.3, 0.8, 0.6))* 0.2;

    gl_FragColor.rgb = vec3(0.308, 0.712, 0.5) * 5.0 * lighting;

}