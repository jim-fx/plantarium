precision highp float;
float pointSize = 0.01;
void main() {
    vec2 uv = gl_PointCoord.xy;
    
    float circle = smoothstep(pointSize, pointSize-0.0001, length(uv - 0.5))*0.5;
    
    gl_FragColor.rgb = vec3(0.0, 0.0, 0.0);
    gl_FragColor.a = circle;
}