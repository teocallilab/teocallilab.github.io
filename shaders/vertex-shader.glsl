precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;

void main() {
    vUv = 0.5 * (a_position + 1.0);
    gl_Position = vec4(a_position, 0.0, 1.0);
}