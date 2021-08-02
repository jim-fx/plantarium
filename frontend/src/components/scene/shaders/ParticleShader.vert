attribute vec3 position;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
void main() {

    // modelMatrix is one of the automatically attached uniforms when using the Mesh class
    vec4 mPos = modelMatrix * vec4(position, 1.0);
    
    // get the model view position so that we can scale the points off into the distance
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = 300.0 / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
}