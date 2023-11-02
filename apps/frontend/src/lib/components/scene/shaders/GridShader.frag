precision highp float;
precision highp int;

varying float vDepth;
uniform float maxDepth;

void main(){
  float c = 0.7;
  gl_FragColor.rgb=vec3(c,c,c);
  gl_FragColor.a = 0.7;
}
