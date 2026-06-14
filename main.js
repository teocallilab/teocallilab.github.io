// =========================================================================
// ── REPARACIÓN DE EMERGENCIA: ACORDEÓN Y MENÚ ────────────────────────────
// =========================================================================
(function() {
    const initInteractivity = () => {
        // ACORDEÓN
        const headers = document.querySelectorAll('.accordion-header');
        headers.forEach(header => {
            // Usamos un nombre de función en lugar de arrow function para evitar problemas con 'this'
            header.onclick = function(e) {
                e.preventDefault(); 
                
                const item = this.parentElement;
                const content = this.nextElementSibling;
                const isActive = item.classList.contains('active');

                // Cierra los demás
                document.querySelectorAll('.accordion-item').forEach(i => {
                    i.classList.remove('active');
                    const c = i.querySelector('.accordion-content');
                    if (c) c.style.maxHeight = null;
                });

                // Abre este
                if (!isActive) {
                    item.classList.add('active');
                    if (content) content.style.maxHeight = content.scrollHeight + "px";
                }
            };
        });

        // MENÚ (Solo si existe)
        const menuBtn = document.getElementById('menu-btn') || document.querySelector('.menu-toggle');
        const navOverlay = document.getElementById('nav-overlay');
        if (menuBtn && navOverlay) {
            menuBtn.onclick = (e) => { e.preventDefault(); navOverlay.classList.add('active'); };
            const closeBtn = document.getElementById('close-menu');
            if (closeBtn) closeBtn.onclick = (e) => { e.preventDefault(); navOverlay.classList.remove('active'); };
        }
    };

    // Lanzar apenas cargue el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInteractivity);
    } else {
        initInteractivity();
    }
})();


// --- 1. CONFIGURACIÓN BASE DE THREE.JS ---
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // --- 2. PALETAS  ---

        const palettes = [
            // 0. Hero: fondo crema cálido + rojo y dorado del logo
            { bg: new THREE.Color("#f5f0e8"), c1: new THREE.Color("#F5C842"), c2: new THREE.Color("#E8651A"), c3: new THREE.Color("#C0271A") },
            // 1. Analítica: fondo claro + verde oscuro y turquesa
            { bg: new THREE.Color("#eef4f0"), c1: new THREE.Color("#2A9BA8"), c2: new THREE.Color("#2D6B35"), c3: new THREE.Color("#7AB334") },
            // 2. Propósito: fondo cálido + naranja y amarillo
            { bg: new THREE.Color("#f7f2e8"), c1: new THREE.Color("#F5C842"), c2: new THREE.Color("#E8651A"), c3: new THREE.Color("#7AB334") },
            // 3. CTA: fondo neutro + turquesa y verde
            { bg: new THREE.Color("#edf4f4"), c1: new THREE.Color("#2A9BA8"), c2: new THREE.Color("#7AB334"), c3: new THREE.Color("#2D6B35") },
            // 4. Cursos: fondo crema + rojo y naranja vibrante
            { bg: new THREE.Color("#f5eeea"), c1: new THREE.Color("#E8651A"), c2: new THREE.Color("#C0271A"), c3: new THREE.Color("#F5C842") },
            // 5. Equipo: fondo claro + verde lima y turquesa
            { bg: new THREE.Color("#eef5ee"), c1: new THREE.Color("#7AB334"), c2: new THREE.Color("#2A9BA8"), c3: new THREE.Color("#F5C842") },
            // 6. Metodología: fondo suave + dorado y verde oscuro
            { bg: new THREE.Color("#f5f0e0"), c1: new THREE.Color("#F5C842"), c2: new THREE.Color("#2D6B35"), c3: new THREE.Color("#E8651A") },
            // 7. FAQ/Footer: fondo cálido + todos los colores del logo
            { bg: new THREE.Color("#f2ece4"), c1: new THREE.Color("#C0271A"), c2: new THREE.Color("#2A9BA8"), c3: new THREE.Color("#F5C842") }
        ];
        let currentPaletteIndex = 0;

        const uniforms = {
            u_time: { value: 0.0 },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            u_bg: { value: palettes[0].bg.clone() },
            u_color1: { value: palettes[0].c1.clone() },
            u_color2: { value: palettes[0].c2.clone() },
            u_color3: { value: palettes[0].c3.clone() }
        };

        // --- 3. SHADER: EL FRACTAL DE JULIA (Adaptado a tonos claros) ---
        const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`;

        const fragmentShader = `
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec3 u_bg;
            uniform vec3 u_color1;
            uniform vec3 u_color2;
            uniform vec3 u_color3;

            void main() {
                float zoom = 1.0;
                vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / (u_resolution.y * zoom) + vec2(-0.9, 0.0);
                vec2 z = uv;
                
                // Movimiento oscilante del fractal
                vec2 c = vec2(0.4 * cos(u_time * 0.3), 0.6 * sin(u_time * 0.3));
                
                float maxIter = 100.0;
                float iter = 0.0;
                
                // Cálculo de iteraciones
                for (float i = 0.0; i < 100.0; i++) {
                    if (iter >= maxIter) break;
                    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                    if (dot(z, z) > 4.0) {
                        iter = i;
                        break;
                    }
                }
                
                vec3 col = u_bg; 
                
                if (iter < maxIter) {
                    float t = iter / maxIter;
                    // Generación de bandas de color orgánicas
                    float wave1 = 0.5 + 0.5 * cos(3.0 + t * 25.0);
                    float wave2 = 0.5 + 0.5 * cos(3.0 + t * 25.0 + 0.6);
                    float wave3 = 0.5 + 0.5 * cos(3.0 + t * 25.0 + 1.0);
                    
                    vec3 paletteColor = mix(u_color1, u_color2, wave1);
                    paletteColor = mix(paletteColor, u_color3, wave2);
                    col = paletteColor;
                }
                
                // IMPORTANTE: Mezclamos el fractal con el color de fondo (u_bg) al 40%
                // Esto hace que se vea como una "marca de agua" y la tipografía negra resalte perfecto.
                // En lugar de mezclar al 45%, mezclamos al 25% para que sea una marca de agua muy delicada
                vec3 finalColor = mix(u_bg, col, 0.75); 
                
                // Aplicamos un contraste suave para que los oscuros sean más profundos
                finalColor = pow(finalColor, vec3(1.1)); 
                
                gl_FragColor = vec4(finalColor, 1.0);   
            }
        `;

        const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        scene.add(mesh);

        // --- 4. OBSERVADOR DE SCROLL (Cambio de Paletas) ---
        const observerOptions = { root: null, threshold: 0.35 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    
                    // Asignamos una paleta distinta a cada sección
                    if (entry.target.classList.contains('hero-section')) currentPaletteIndex = 0;
                    else if (id === 'seccion-analitica') currentPaletteIndex = 1;
                    else if (id === 'seccion-proposito') currentPaletteIndex = 2;
                    else if (id === 'seccion-cta') currentPaletteIndex = 3;
                    else if (id === 'seccion-cursos') currentPaletteIndex = 4;
                    else if (id === 'seccion-marquee' || id === 'seccion-equipo') currentPaletteIndex = 5;
                    else if (id === 'seccion-metodologia') currentPaletteIndex = 6;
                    else if (id === 'seccion-faq' || id === 'seccion-footer') currentPaletteIndex = 7; 
                }
            });
        }, observerOptions);

        // Observar todas las secciones para que el color cambie
        document.querySelectorAll('section, footer').forEach(el => observer.observe(el));

        // --- 5. RENDER Y ANIMACIÓN DE COLORES ---
        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
        });

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            uniforms.u_time.value = clock.getElapsedTime();

            // Interpolar (cambiar suavemente) hacia la paleta de la sección actual
            const targetPalette = palettes[currentPaletteIndex];
            const lerpSpeed = 0.06; 

            uniforms.u_bg.value.lerp(targetPalette.bg, lerpSpeed);
            uniforms.u_color1.value.lerp(targetPalette.c1, lerpSpeed);
            uniforms.u_color2.value.lerp(targetPalette.c2, lerpSpeed);
            uniforms.u_color3.value.lerp(targetPalette.c3, lerpSpeed);

            renderer.render(scene, camera);
        }
        animate();

        // --- 6. INTERFAZ (Menú, FAQ, Cookies) ---
        document.addEventListener('DOMContentLoaded', () => {
            // Lógica del Menú Overlay
            const menuBtn = document.querySelector('.menu-btn');
            const closeBtn = document.getElementById('close-menu');
            const navOverlay = document.getElementById('nav-overlay');
            

            if (menuBtn && navOverlay) {
                const toggleMenu = (e) => {
                    if(e) e.preventDefault();
                    navOverlay.classList.toggle('active');
                };
                menuBtn.addEventListener('click', toggleMenu);
                if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
                navLinks.forEach(link => link.addEventListener('click', toggleMenu));
            }

            // Lógica del Acordeón (FAQ)
            const accordionHeaders = document.querySelectorAll('.accordion-header');
            accordionHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const item = header.parentElement;
                    const content = header.nextElementSibling;
                    const isActive = item.classList.contains('active');

                    document.querySelectorAll('.accordion-item').forEach(otherItem => {
                        otherItem.classList.remove('active');
                        if (otherItem.querySelector('.accordion-content')) {
                            otherItem.querySelector('.accordion-content').style.maxHeight = null;
                        }
                    });

                    if (!isActive) {
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
            });

// --- INTEGRACIÓN GSAP PROTEGIDA ---
window.addEventListener('load', () => {
    console.log("GSAP Iniciando..."); // Verifica en consola si esto aparece
    
    // Aseguramos que los plugins estén registrados
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, SplitText);

        // Bloque de animaciones (el código que te pasé antes)
        // ... (todo el código GSAP) ...
        
        console.log("Animaciones cargadas correctamente.");
    } else {
        console.error("GSAP no cargó. Revisa el orden de los scripts en tu HTML.");
    }
});

    // 2. SECCIONES: Títulos y Contenido (ScrollTrigger)
    // Usamos ScrollTrigger.batch para optimizar y evitar saturar el hilo principal
    const sections = document.querySelectorAll('section, .content-section');
    
    sections.forEach(section => {
        const heading = section.querySelector('.section-heading, h2.iv');
        if (heading) {
            const split = new SplitText(heading, { type: 'words' });
            gsap.from(split.words, {
                x: -40, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.05,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    toggleActions: 'play none none reset'
                }
            });
        }
    });

    // 3. ANIMACIÓN GENÉRICA (Fade-up para elementos secundarios)
    gsap.utils.toArray('.tags, .d2, .course-row, .team-card').forEach(el => {
        gsap.from(el, {
            autoAlpha: 0, y: 30, duration: 0.8, ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none reset'
            }
        });
    });
});



// =========================================================================
// 1. LÓGICA DE INTERACTIVIDAD (MENÚ Y ACORDEÓN) - Se ejecuta rápido
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // MENÚ
    const menuBtn = document.getElementById('menu-btn') || document.querySelector('.menu-toggle');
    const closeBtn = document.getElementById('close-menu');
    const navOverlay = document.getElementById('nav-overlay');

    if (menuBtn && navOverlay) {
        menuBtn.addEventListener('click', (e) => { e.preventDefault(); navOverlay.classList.add('active'); });
        if (closeBtn) closeBtn.addEventListener('click', (e) => { e.preventDefault(); navOverlay.classList.remove('active'); });
    }

    // ACORDEÓN (Corrección de selección)
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const content = this.nextElementSibling;
            const isActive = item.classList.contains('active');

            // Cierra otros
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                const c = i.querySelector('.accordion-content');
                if (c) c.style.maxHeight = null;
            });

            // Abre este
            if (!isActive) {
                item.classList.add('active');
                if (content) content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});

// =========================================================================
// ── 2. ANIMACIONES GSAP (Preloader + Hero + Scroll) - Window Load
// =========================================================================
window.addEventListener('load', () => {
    // Registro de plugins
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Esperar fuentes para evitar saltos de texto
    document.fonts.ready.then(() => {
        
        // --- LIMPIEZA INICIAL ---
        gsap.set(['.hero-eyebrow', '.hero-title', '.hero-description', '.hero-highlight'], { autoAlpha: 0 });
        gsap.set('.hero-title', { autoAlpha: 1, visibility: 'visible' });

        const titleSplit = new SplitText(".hero-title", { type: "lines, words, chars" });
        const count = { val: 0 };
        const counterElement = document.getElementById("counter");
        const masterTl = gsap.timeline();

        // --- MASTER TIMELINE ---
        masterTl
            // 1. Logo
            .to(".preloader-logo", { autoAlpha: 1, duration: 0.8, ease: "power2.out" })
            // 2. Contador
            .to(count, {
                val: 100,
                roundProps: "val",
                duration: 2,
                ease: "power3.inOut",
                onUpdate: () => { if (counterElement) counterElement.innerText = count.val + "%"; }
            })
            // 3. Salida preloader
            .to("#preloader", { yPercent: -100, duration: 1.2, ease: "expo.inOut" })
            .add(() => { document.body.classList.remove("loading"); })
            
            // 4. Hero Animation
            .fromTo('.hero-eyebrow', { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.8")
            .fromTo(titleSplit.chars, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.02 }, "-=0.6")
            .fromTo(['.hero-description', '.hero-highlight'], { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.15 }, "-=0.5");

        // --- ANIMACIONES DE SCROLL ---
        // Títulos (Words)
        document.querySelectorAll('.section-heading, h2.iv').forEach(h => {
            const split = new SplitText(h, { type: 'words' });
            gsap.fromTo(split.words, { x: -40, autoAlpha: 0 }, {
                x: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05,
                scrollTrigger: { trigger: h, start: 'top 85%', toggleActions: 'play none none reset' }
            });
        });

        // Máscaras (Lines)
        document.querySelectorAll('.manifesto-title, .cta-title').forEach(el => {
            SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: (self) => {
                gsap.fromTo(self.lines, { y: 100, autoAlpha: 0 }, {
                    y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.1,
                    scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reset' }
                });
            }});
        });

        // Elementos genéricos
        gsap.utils.toArray('section p, .tags, .d2, .course-row, .team-card, .methodology-row, .accordion-item').forEach(el => {
            gsap.fromTo(el, { y: 30, autoAlpha: 0 }, {
                y: 0, autoAlpha: 1, duration: 0.8,
                scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reset' }
            });
        });
    });
});
