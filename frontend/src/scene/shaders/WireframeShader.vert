precision highp float;
precision highp int;

attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

void main(){
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    
    mat4 projViewModel=projection*view*model;
    
    //into clip space
    vec4 currentProjected=projViewModel*vec4(position,1.);
    
    //into NDC space [-1 .. 1]
    vec2 currentScreen=currentProjected.xy/currentProjected.w;
    
    //correct for aspect ratio (screenWidth / screenHeight)
    currentScreen.x*=aspect;
    
    //normal of line (B - A)
    vec2 dir=normalize(nextScreen-currentScreen);
    vec2 normal=vec2(-dir.y,dir.x);
    
    //extrude from center & correct aspect ratio
    normal*=thickness/2.;
    normal.x/=aspect;
    
    //offset by the direction of this point in the pair (-1 or 1)
    vec4 offset=vec4(normal*direction,0.,0.);
    gl_Position=currentProjected+offset;
}