class NeuralBackground {
    constructor() {
        this.canvas = document.getElementById("neuro");
        this.devicePixelRatio = Math.min(window.devicePixelRatio, 2);
        this.pointer = { x: 0, y: 0, tX: 0, tY: 0 };
        this.uniforms = null;
        this.gl = null;
        this.isMobile = this.detectMobile();
        
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    }

    init() {
        // En móviles, usar un fallback más simple
        if (this.isMobile) {
            this.canvas.style.display = 'none';
            this.createMobileFallback();
            return;
        }
        
        this.gl = this.initShader();
        if (!this.gl) {
            this.createMobileFallback();
            return;
        }
        
        this.setupEvents();
        this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
        this.render();
    }

    createMobileFallback() {
        // Crear un fondo alternativo para móviles
        const fallback = document.createElement('div');
        fallback.className = 'mobile-background-fallback';
        fallback.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            z-index: -1;
        `;
        this.canvas.parentNode.insertBefore(fallback, this.canvas);
    }

    initShader() {
        const gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
        if (!gl) {
            console.warn("WebGL no soportado");
            return null;
        }

        const vertexShader = this.createShader(gl, document.getElementById("vertShader").innerHTML, gl.VERTEX_SHADER);
        const fragmentShader = this.createShader(gl, document.getElementById("fragShader").innerHTML, gl.FRAGMENT_SHADER);
        
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
