class NeuralBackground {
    constructor() {
        this.canvas = document.getElementById("neuro");
        this.devicePixelRatio = Math.min(window.devicePixelRatio, 2);
        this.pointer = { x: 0, y: 0, tX: 0, tY: 0 };
        this.uniforms = null;
        this.gl = null;
            
        this.init();
    }

    init() {
        this.gl = this.initShader();
        if (!this.gl) return;
        
        this.setupEvents();
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
        this.render();
    }

    initShader() {
        const gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        if (!gl) {
            console.warn("WebGL no soportado");
            return null;
        }

        const vertexShader = this.createShader(gl, this.getVertexShaderSource(), gl.VERTEX_SHADER);
        const fragmentShader = this.createShader(gl, this.getFragmentShaderSource(), gl.FRAGMENT_SHADER);
        
        if (!vertexShader || !fragmentShader) return null;

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Error linking program:", gl.getProgramInfoLog(program));
            return null;
        }

        this.uniforms = this.getUniforms(gl, program);
        this.setupGeometry(gl, program);
        gl.useProgram(program);

        return gl;
    }

    getVertexShaderSource() {
        return `
            precision mediump float;
            varying vec2 vUv;
            attribute vec2 a_position;
            
            void main() {
                vUv = 0.5 * (a_position + 1.0);
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;
    }

    getFragmentShaderSource() {
        return `
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
        `;
    }

    createShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader compile error:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    getUniforms(gl, program) {
        const uniforms = {};
        const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            const uniformName = gl.getActiveUniform(program, i).name;
            uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
        }
        return uniforms;
    }

    setupGeometry(gl, program) {
        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    }

    setupEvents() {
        const updatePointer = (x, y) => {
            this.pointer.tX = x;
            this.pointer.tY = y;
        };

        window.addEventListener("pointermove", (e) => updatePointer(e.clientX, e.clientY));
        window.addEventListener("touchmove", (e) => {
            e.preventDefault();
            updatePointer(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
    }

    resizeCanvas() {
        const { canvas, gl, devicePixelRatio } = this;
        canvas.width = window.innerWidth * devicePixelRatio;
        canvas.height = window.innerHeight * devicePixelRatio;
        
        if (gl && this.uniforms) {
            gl.uniform1f(this.uniforms.u_ratio, canvas.width / canvas.height);
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
    }

    render = () => {
        if (!this.gl || !this.uniforms) return;

        // Smooth pointer movement
        this.pointer.x += (this.pointer.tX - this.pointer.x) * 0.5;
        this.pointer.y += (this.pointer.tY - this.pointer.y) * 0.5;

        this.gl.uniform1f(this.uniforms.u_time, performance.now());
        this.gl.uniform2f(this.uniforms.u_pointer_position, 
            this.pointer.x / window.innerWidth, 
            1 - this.pointer.y / window.innerHeight
        );

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(this.render);
    }
}