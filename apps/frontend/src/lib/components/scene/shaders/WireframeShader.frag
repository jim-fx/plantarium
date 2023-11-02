precision highp float;
precision highp int;

varying float vDepth;
uniform float maxDepth;

void main(){
    float v = vDepth/maxDepth;
    gl_FragColor=vec4(v,v,0.5,.9);
}
