precision highp float;
float pointSize = 0.02;
varying float distToCamera;
void main() {
    vec2 uv = gl_PointCoord.xy;

    float dist = 2.0 - distToCamera;
    
    float circle = pointSize*dist> length(uv - 0.5)?0.8:0.0;

    float xMask =min(abs(uv.x-0.5),abs(uv.y-0.5));

    circle = xMask>0.003?0.0:circle;

    gl_FragColor.rgb = vec3(0.0, 0.0, 0.0);
    gl_FragColor.a = circle;
}