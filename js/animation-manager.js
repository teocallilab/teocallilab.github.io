class AnimationManager {
    constructor() {
        this.initAnimations();
    }

    initAnimations() {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero animations
        const heroTl = gsap.timeline();
        heroTl.to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
              .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
              .to('.btn-primary', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

        // Section title animation
        gsap.to('.section-title', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.cursos-section',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Section description animation
        gsap.to('.section-description', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.section-description',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        // Info sections animations
        gsap.to('.info-section, .support-section, .registration-section', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.info-section',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        // Cards animation with stagger
        gsap.to('.curso-card', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.cursos-container',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        // Instructors section animations
        gsap.to('.instructores-section .section-title', {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.instructores-section',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        gsap.to('.instructor-card', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.instructores-container',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        this.setupCardInteractions();
        this.setupInstructorInteractions();
    }

    setupInstructorInteractions() {
        const instructorCards = document.querySelectorAll('.instructor-card');
        
        instructorCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { 
                    scale: 1.02, 
                    duration: 0.3, 
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { 
                    scale: 1, 
                    duration: 0.3, 
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });
        });
    }

    setupCardInteractions() {
        const cards = document.querySelectorAll('.curso-card');
        
        cards.forEach(card => {
            let isHovering = false;
            const button = card.querySelector('.btn-secondary');
            
            card.addEventListener('mouseenter', (e) => {
                // No hacer hover en la tarjeta si estamos sobre el botón
                if (e.target.closest('.btn-secondary')) return;
                
                if (isHovering) return;
                isHovering = true;
                
                gsap.to(card, { 
                    scale: 1.02, 
                    duration: 0.3, 
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });
            
            card.addEventListener('mouseleave', (e) => {
                // Solo resetear si realmente salimos de la tarjeta
                if (e.relatedTarget && card.contains(e.relatedTarget)) return;
                
                if (!isHovering) return;
                isHovering = false;
                
                gsap.to(card, { 
                    scale: 1, 
                    duration: 0.3, 
                    ease: 'power2.out',
                    overwrite: 'auto'
                });
            });
            
            // Prevenir que el hover de la tarjeta interfiera con el botón
            if (button) {
                button.addEventListener('mouseenter', (e) => {
                    e.stopPropagation();
                });
                
                button.addEventListener('mouseleave', (e) => {
                    e.stopPropagation();
                });
            }
            
            card.addEventListener('click', (e) => {
                // Prevenir navegación si es un botón
                if (e.target.classList.contains('btn-secondary')) return;
                
                gsap.to(card, {
                    scale: 0.98,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut',
                    overwrite: 'auto'
                });
            });
        });
    }
}