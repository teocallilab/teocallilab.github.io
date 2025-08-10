precision mediump float;
varying vec2 vUv;
uniform float u_time;
uniform float u_ratio;
uniform vec2 u_pointer_position;

const int ITERATIONS = 12;
const float SCALE_FACTOR = 1.15;
const vec3 BRAND_COLOR = vec3(0.67, 0.07, 0.13);

vec2 rotate(vec2 uv, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, s, -s, c) * uv;
}

float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.0);
    vec2 res = vec2(0.0);
    float scale = 8.0;
    
    for (int j = 0; j < ITERATIONS; j++) {
        uv = rotate(uv, 1.0);
        sine_acc = rotate(sine_acc, 1.0);
        vec2 layer = uv * scale + float(j) + sine_acc - t;
        sine_acc += sin(layer);
        res += (0.5 + 0.5 * cos(layer)) / scale;
        scale *= SCALE_FACTOR - 0.07 * p;
    }
    return res.x + res.y;
}

void main() {
    vec2 uv = 0.5 * vUv;
    uv.x *= u_ratio;
    
    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float p = clamp(length(pointer), 0.0, 1.0);
    p = 0.3 * (1.0 - p) * (1.0 - p);
    
    float noise = neuro_shape(uv, u_time * 0.0008, p);
    noise = 0.8 * noise * noise * noise;
    noise += pow(noise, 12.0);
    noise = max(0.0, noise - 0.7);
    noise *= (1.0 - length(vUv - 0.5));
    
    // Efecto más sutil y menos brillante
    vec3 color = mix(BRAND_COLOR * 0.4, vec3(0.8), noise * 0.15) * noise;
    
    gl_FragColor = vec4(color, noise * 0.3);
}