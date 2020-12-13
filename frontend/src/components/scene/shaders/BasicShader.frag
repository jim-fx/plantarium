precision highp float;
precision highp int;

varying vec3 vNormal;
varying vec2 vUv;

void main(){
    
    vec3 normal=normalize(vNormal);
    
    float lighting=dot(normal,normalize(vec3(-.3,.8,.6)));
    
    gl_FragColor.rgb=(vec3(.308*vUv.x,.712,.5)+lighting*.5)-.25;
    // gl_FragColor.rgb=vec3(vUv.x,vUv.y,vNormal.x);
    
    gl_FragColor.a=1.;
    
}