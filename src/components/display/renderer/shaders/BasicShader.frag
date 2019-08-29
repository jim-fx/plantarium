precision highp float;
precision highp int;

uniform sampler2D tMap;

varying vec3 vNormal;
varying vec2 vUv;

void main() {

    vec3 tex = texture2D(tMap, vUv).rgb;

    vec3 normal = normalize(vNormal);
    float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));


    gl_FragColor.rgb = tex * (vec3(0.308, 0.712, 0.5) * 0.9) + lighting * 0.3;

}