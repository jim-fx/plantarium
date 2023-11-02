precision highp float;
precision highp int;

varying vec3 vNormal;
varying vec2 vUv;

void main(){
    
    vec3 normal=vNormal;
    
    float v = normal.z;
    
    gl_FragColor.rgb=vec3(v,v,v);
    gl_FragColor.rgb=normal;
    // gl_FragColor.rgb=vec3(vUv.x,vUv.y,vNormal.x);
    
    gl_FragColor.a=1.0;
    
}
