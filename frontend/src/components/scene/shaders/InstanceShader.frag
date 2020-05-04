precision highp float;
precision highp int;

varying vec3 vNormal;

void main() {

    vec3 normal = normalize(vNormal);

    float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));

    gl_FragColor.rgb = (vec3(0.308, 0.712, 0.5) + lighting * 0.5)-0.5;

    gl_FragColor.a = 1.0;

}