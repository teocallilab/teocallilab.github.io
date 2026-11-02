// =========================================================================
// ── TEOCALLI LAB SCHOOL - MAIN INTERACTIVITY & THREE.JS SHADER FRACTAL ──
// =========================================================================

(function() {
    const initInteractivity = () => {
        // --- ACORDEÓN ---
        const headers = document.querySelectorAll('.accordion-header');
        headers.forEach(header => {
            header.onclick = function(e) {
                e.preventDefault(); 
                const item = this.parentElement;
                const content = this.nextElementSibling;
                const isActive = item.classList.contains('active');

                document.querySelectorAll('.accordion-item').forEach(i => {
                    i.classList.remove('active');
                    const c = i.querySelector('.accordion-content');
                    if (c) c.style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    if (content) content.style.maxHeight = content.scrollHeight + "px";
                }
            };
        });

        // --- MENÚ OVERLAY ---
        const menuBtn = document.querySelector('.hamburger');
        const menuCheckbox = document.getElementById('menu-checkbox');
        const closeBtn = document.getElementById('close-menu');
        const navOverlay = document.getElementById('nav-overlay');
        const navLinks = document.querySelectorAll('.nav-links a');

        if (menuBtn && navOverlay) {
            const toggleMenu = (e) => {
                if (e && e.target.tagName !== 'INPUT') e.preventDefault();
                navOverlay.classList.toggle('active');
                if (menuCheckbox && !navOverlay.classList.contains('active')) {
                    menuCheckbox.checked = false;
                }
            };
            menuBtn.addEventListener('click', toggleMenu);
            if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
            navLinks.forEach(link => link.addEventListener('click', () => navOverlay.classList.remove('active')));
        }

        // --- COOKIE BANNER ---
        const cookieBanner = document.getElementById('cookie-banner');
        const btnAcceptCookies = document.getElementById('accept-cookies');

        if (cookieBanner && btnAcceptCookies) {
            // Verificar si el usuario ya aceptó las cookies previamente
            if (localStorage.getItem('cookies_accepted') === 'true') {
                cookieBanner.style.display = 'none';
            }

            btnAcceptCookies.addEventListener('click', () => {
                cookieBanner.style.display = 'none';
                localStorage.setItem('cookies_accepted', 'true');
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInteractivity);
    } else {
        initInteractivity();
    }
})();

// --- 1. CONFIGURACIÓN BASE DE THREE.JS ---
const container = document.getElementById('canvas-container');
if (container && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- 2. PALETAS ORIGINALES DEL INICIO DEL CÓDIGO (Tonos cálidos, dorados, turquesa, rojos y verdes de LogColor) ---
    const palettes = [
        // 0. Hero: fondo crema cálido + rojo, naranja y dorado
        { bg: new THREE.Color("#f5f0e8"), c1: new THREE.Color("#F5C842"), c2: new THREE.Color("#E8651A"), c3: new THREE.Color("#C0271A") },
        
        // 1. Analítica: fondo claro + turquesa, verde oscuro y verde lima
        { bg: new THREE.Color("#eef4f0"), c1: new THREE.Color("#2A9BA8"), c2: new THREE.Color("#2D6B35"), c3: new THREE.Color("#7AB334") },
        
        // 2. Propósito: fondo cálido + dorado, naranja y verde lima
        { bg: new THREE.Color("#f7f2e8"), c1: new THREE.Color("#F5C842"), c2: new THREE.Color("#E8651A"), c3: new THREE.Color("#7AB334") },
        
        // 3. CTA: fondo neutro + turquesa, verde lima y verde oscuro
        { bg: new THREE.Color("#edf4f4"), c1: new THREE.Color("#2A9BA8"), c2: new THREE.Color("#7AB334"), c3: new THREE.Color("#2D6B35") },
        
        // 4. Cursos: fondo crema + naranja, rojo y dorado vibrante
        { bg: new THREE.Color("#f5eeea"), c1: new THREE.Color("#E8651A"), c2: new THREE.Color("#C0271A"), c3: new THREE.Color("#F5C842") },
        
        // 5. Equipo: fondo claro + verde lima, turquesa y dorado
        { bg: new THREE.Color("#eef5ee"), c1: new THREE.Color("#7AB334"), c2: new THREE.Color("#2A9BA8"), c3: new THREE.Color("#F5C842") },
        
        // 6. Metodología: fondo suave + dorado, verde oscuro y naranja
        { bg: new THREE.Color("#f5f0e0"), c1: new THREE.Color("#F5C842"), c2: new THREE.Color("#2D6B35"), c3: new THREE.Color("#E8651A") },
        
        // 7. FAQ / Footer: fondo cálido + rojo, turquesa y dorado
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

    // --- 3. SHADER FRACTAL DE JULIA ---
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
            
            vec2 c = vec2(0.4 * cos(u_time * 0.3), 0.6 * sin(u_time * 0.3));
            
            float maxIter = 100.0;
            float iter = 0.0;
            
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
                float wave1 = 0.5 + 0.5 * cos(3.0 + t * 25.0);
                float wave2 = 0.5 + 0.5 * cos(3.0 + t * 25.0 + 0.6);
                float wave3 = 0.5 + 0.5 * cos(3.0 + t * 25.0 + 1.0);
                
                vec3 paletteColor = mix(u_color1, u_color2, wave1);
                paletteColor = mix(paletteColor, u_color3, wave2);
                col = paletteColor;
            }
            
            vec3 finalColor = mix(u_bg, col, 0.75); 
            finalColor = pow(finalColor, vec3(1.1)); 
            
            gl_FragColor = vec4(finalColor, 1.0);   
        }
    `;

    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    // --- 4. OBSERVADOR DE SCROLL ---
    const observerOptions = { root: null, threshold: 0.35 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                
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

    document.querySelectorAll('section, footer').forEach(el => observer.observe(el));

    // --- 5. RENDER Y ANIMACIÓN ---
    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        uniforms.u_time.value = clock.getElapsedTime();

        const targetPalette = palettes[currentPaletteIndex];
        const lerpSpeed = 0.06; 

        uniforms.u_bg.value.lerp(targetPalette.bg, lerpSpeed);
        uniforms.u_color1.value.lerp(targetPalette.c1, lerpSpeed);
        uniforms.u_color2.value.lerp(targetPalette.c2, lerpSpeed);
        uniforms.u_color3.value.lerp(targetPalette.c3, lerpSpeed);

        renderer.render(scene, camera);
    }
    animate();
}

// --- 6. ANIMACIONES GSAP (Preloader + Hero + Scroll) ---
window.addEventListener('load', () => {
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger, SplitText);

        document.fonts.ready.then(() => {
            // Check if we are on a page with hero-title (e.g., index.html)
            if (!document.querySelector('.hero-title')) {
                document.body.classList.remove('loading');
                const pl = document.getElementById('preloader');
                if (pl) pl.style.display = 'none';
                return; // Skip the rest of the animations
            }

            gsap.set(['.hero-eyebrow', '.hero-title', '.hero-description', '.hero-highlight'], { autoAlpha: 0 });
            gsap.set('.hero-title', { autoAlpha: 1, visibility: 'visible' });

            const titleSplit = new SplitText(".hero-title", { type: "lines, words, chars" });
            const count = { val: 0 };
            const counterElement = document.getElementById("counter");
            const masterTl = gsap.timeline();

            masterTl
                .to(".preloader-logo", { autoAlpha: 1, duration: 0.8, ease: "power2.out" })
                .to(count, {
                    val: 100,
                    roundProps: "val",
                    duration: 2,
                    ease: "power3.inOut",
                    onUpdate: () => { if (counterElement) counterElement.innerText = count.val + "%"; }
                })
                .to("#preloader", { yPercent: -100, duration: 1.2, ease: "expo.inOut" })
                .add(() => { document.body.classList.remove("loading"); })
                .fromTo('.hero-eyebrow', { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, "-=0.8")
                .fromTo(titleSplit.chars, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.02 }, "-=0.6")
                .fromTo(['.hero-description', '.hero-highlight'], { y: 15, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.15 }, "-=0.5");

            document.querySelectorAll('.section-heading, h2.iv').forEach(h => {
                const split = new SplitText(h, { type: 'words' });
                gsap.fromTo(split.words, { x: -40, autoAlpha: 0 }, {
                    x: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05,
                    scrollTrigger: { trigger: h, start: 'top 85%', toggleActions: 'play none none reset' }
                });
            });

            document.querySelectorAll('.manifesto-title, .cta-title').forEach(el => {
                SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: (self) => {
                    gsap.fromTo(self.lines, { y: 100, autoAlpha: 0 }, {
                        y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.1,
                        scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reset' }
                    });
                }});
            });

            gsap.utils.toArray('section p, .tags, .d2, .course-row, .team-card, .methodology-row, .accordion-item').forEach(el => {
                gsap.fromTo(el, { y: 30, autoAlpha: 0 }, {
                    y: 0, autoAlpha: 1, duration: 0.8,
                    scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reset' }
                });
            });
        });
    }
});
