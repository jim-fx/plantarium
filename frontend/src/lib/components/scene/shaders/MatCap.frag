#version 300 es
precision highp float;
#define varying in
#define texture2D texture
#define gl_FragColor FragColor
out vec4 FragColor;
precision highp float;
uniform sampler2D tMap;
varying vec4 vMVPos;
vec3 normals(vec3 pos) {
  vec3 fdx = dFdx(pos);
  vec3 fdy = dFdy(pos);
  return normalize(cross(fdx, fdy));
}
vec2 matcap(vec3 eye, vec3 normal) {
  vec3 reflected = reflect(eye, normal);
  float m = 2.8284271247461903 * sqrt(reflected.z + 1.0);
  return reflected.xy / m + 0.5;
}
void main() {
  vec3 normal = normals(vMVPos.xyz);
  // We're using the matcap to add some shininess to the model
  vec3 mat = texture2D(tMap, matcap(normalize(vMVPos.xyz), normal)).rgb;
  
  gl_FragColor.rgb = mat;
  gl_FragColor.a = 1.0;
}
