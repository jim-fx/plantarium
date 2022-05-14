precision highp float;

varying vec3 vNormal;
varying vec4 vMVPos;

uniform sampler2D tMap;

vec2 matcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt(reflected.z + 1.0);
  return reflected.xy / m + 0.5;
}

void main() {
    vec3 normal = normalize(vNormal*0.1);
    float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));

    vec3 mat = texture2D(tMap, matcap(normalize(vMVPos.xyz), normal)).rgb;

    gl_FragColor.rgb = mat;
    gl_FragColor.a = 1.0;
}
