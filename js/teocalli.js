// ========================================
// GSAP Hero Animations
// ========================================
if (typeof gsap !== "undefined") {
    var heroParticles = document.getElementById("hero-particles");
    if (heroParticles) {
        for (var i = 0; i < 60; i++) {
            var particle = document.createElement("div");
            particle.classList.add("particle");
            heroParticles.appendChild(particle);
            gsap.set(particle, {
                x: gsap.utils.random(0, window.innerWidth),
                y: gsap.utils.random(0, window.innerHeight),
                scale: gsap.utils.random(0.3, 1.5),
                opacity: gsap.utils.random(0.3, 0.8)
            });
            gsap.to(particle, {
                y: "+=" + gsap.utils.random(-150, -50),
                x: "+=" + gsap.utils.random(-30, 30),
                opacity: 0,
                duration: gsap.utils.random(3, 6),
                repeat: -1,
                delay: gsap.utils.random(0, 5)
            });
        }
    }

    gsap.fromTo(".hero .title, .hero .subtitle, .hero .hero-top-text, .hero .hero-highlight",
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 1.2, stagger: 0.2, ease: "power3.inOut", delay: 0.2 }
    );
    gsap.fromTo(".hero .hero-tlaloc-img",
        { clipPath: "inset(100% 0 0 0)", scale: 1.1 },
        { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 1.5, ease: "power3.inOut", delay: 0.5 }
    );
    gsap.fromTo(".hero .hero-buttons, .hero .hero-stats",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power2.out", delay: 1.2 }
    );
    gsap.fromTo(".logo",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1, ease: "power2.out" }
    );
}

// ========================================
// ScrollTrigger Animations
// ========================================
function initScrollAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. Reveal Wipe para titulos
    var titleSelectors = ".brutal-title, .meth-main-title, .meth-title, .section-heading, .why-heading, .outcome-title, .enroll-card-title, .courses-heading, .statement-heading, .team-brutal-name";

    document.querySelectorAll(titleSelectors).forEach(function (el) {
        if (el.closest(".hero")) return;
        
        // Find a safe trigger (the element itself or its parent card)
        var triggerEl = el.closest(".brutal-card") || el;
        
        gsap.fromTo(el,
            { clipPath: "inset(0 100% 0 0)" },
            {
                clipPath: "inset(0 0% 0 0)",
                duration: 1.0,
                ease: "power3.inOut",
                clearProps: "all",
                scrollTrigger: {
                    trigger: triggerEl,
                    start: "top 95%", // Trigger slightly earlier to ensure it fires
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // 2. Word-by-Word Build para parrafos
    function splitWords(element) {
        if (element.dataset.split === "done") return;
        element.dataset.split = "done";
        var walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        var textNodes = [];
        var node;
        while ((node = walker.nextNode())) {
            if (node.nodeValue.trim() !== "") textNodes.push(node);
        }
        textNodes.forEach(function (textNode) {
            var words = textNode.nodeValue.split(/(\s+)/);
            var frag = document.createDocumentFragment();
            words.forEach(function (w) {
                if (/^\s+$/.test(w)) {
                    frag.appendChild(document.createTextNode(w));
                } else {
                    var span = document.createElement("span");
                    span.className = "gsap-word";
                    span.style.display = "inline-block";
                    span.textContent = w;
                    frag.appendChild(span);
                }
            });
            textNode.parentNode.replaceChild(frag, textNode);
        });
    }

    var paraSelectors = ".why-text, .meth-desc, .outcome-desc, .enroll-card-text, .brutal-desc, .statement-sub, .syllabus-text, .team-brutal-bio, .team-brutal-role, .testi-content p";

    document.querySelectorAll(paraSelectors).forEach(function (p) {
        if (p.closest(".hero")) return;
        splitWords(p);
        var wordSpans = p.querySelectorAll(".gsap-word");
        if (wordSpans.length === 0) return;
        
        var triggerEl = p.closest(".brutal-card") || p;
        
        gsap.fromTo(wordSpans, 
            { opacity: 0, y: 15 },
            {
                opacity: 1, y: 0,
                duration: 0.5,
                stagger: 0.02,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: triggerEl,
                    start: "top 95%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // 3. Reveal Wipe for Section Images (Bottom to Top)
    var imgSelectors = ".why-image, .team-brutal-image img, .meth-mascot-img, .code-editor-wrapper";
    document.querySelectorAll(imgSelectors).forEach(function(el) {
        if (el.closest(".hero")) return;
        gsap.fromTo(el,
            { clipPath: "inset(100% 0 0 0)", scale: 1.1 },
            {
                clipPath: "inset(0% 0 0 0)",
                scale: 1,
                duration: 1.5,
                ease: "power3.inOut",
                clearProps: "all",
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    
    // 4. Animacion para Bullets y Cards menores
    var bulletSelectors = ".syllabus-brutal-list li, .enroll-card-features li, .outcome-item, .accordion-item, .team-brutal-pill, .meth-card, .testi-carousel";
    document.querySelectorAll(bulletSelectors).forEach(function(el) {
        var triggerEl = el.closest(".brutal-card") || el.closest(".courses-container") || el;
        gsap.fromTo(el, 
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0,
                duration: 0.6,
                ease: "power2.out",
                clearProps: "all", // <- This prevents GSAP from overriding CSS hover effects
                scrollTrigger: {
                    trigger: triggerEl,
                    start: "top 95%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // porque bloqueaban la animacion CSS original (hover).
    // Solo animamos los contenedores principales si es necesario.

    ScrollTrigger.refresh();
}

window.addEventListener("load", initScrollAnimations);

// ========================================
// FAQ Accordion & Mobile Menu & Testimonials
// ========================================
document.querySelectorAll(".accordion-header").forEach(function (button) {
    button.addEventListener("click", function () {
        var item = button.parentElement;
        var content = button.nextElementSibling;
        document.querySelectorAll(".accordion-item").forEach(function (other) {
            if (other !== item) {
                other.classList.remove("active");
                other.querySelector(".accordion-content").style.maxHeight = null;
            }
        });
        item.classList.toggle("active");
        content.style.maxHeight = item.classList.contains("active") ? content.scrollHeight + "px" : null;
    });
});

var openMenuBtn = document.getElementById("openMenuBtn"), closeMenuBtn = document.getElementById("closeMenuBtn"), mobileMenu = document.getElementById("mobileMenu");
if (openMenuBtn && closeMenuBtn && mobileMenu) {
    openMenuBtn.addEventListener("click", function () { mobileMenu.classList.add("active"); document.body.style.overflow = "hidden"; });
    function closeMenu() { mobileMenu.classList.remove("active"); document.body.style.overflow = ""; }
    closeMenuBtn.addEventListener("click", closeMenu);
    document.querySelectorAll(".mobile-link").forEach(function (link) { link.addEventListener("click", closeMenu); });
    mobileMenu.addEventListener("click", function (e) { if (e.target === mobileMenu) closeMenu(); });
}

var currentTesti = 0;
function moveTesti(action) {
    var track = document.getElementById("testi-track"), dots = document.querySelectorAll(".testi-dot");
    if (!track || dots.length === 0) return;
    var total = dots.length;
    if (action === "next") currentTesti = (currentTesti + 1) % total;
    else if (action === "prev") currentTesti = (currentTesti - 1 + total) % total;
    else if (typeof action === "number") currentTesti = action;
    track.style.transform = "translateX(-" + (currentTesti * 100) + "%)";
    dots.forEach(function (dot, i) { dot.classList.toggle("active", i === currentTesti); });
}



// ========================================
// Cookie Banner
// ========================================
document.addEventListener("DOMContentLoaded", function() {
    var cookieBanner = document.getElementById("cookie-banner");
    var acceptBtn = document.getElementById("accept-cookies");

    // Siempre aparece al recargar, solo se oculta al hacer clic en esta sesión
    if (cookieBanner && acceptBtn) {
        acceptBtn.addEventListener("click", function() {
            cookieBanner.style.display = "none";
        });
    }
});
