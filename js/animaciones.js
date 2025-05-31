// animaciones.js
gsap.registerPlugin(ScrollTrigger);

const card = document.querySelector('#cardParallax');
if (card) {
  gsap.fromTo(card,
    { yPercent: 15, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
}
// Anima cada sección completa
gsap.utils.toArray('.anim-section').forEach(section => {
  gsap.to(section, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  const elements = Array.from(section.querySelectorAll('.anim-content > *'))
  .filter(el => !el.classList.contains('card-info') && el.id !== 'cardParallax');
  gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.15,
    delay: 0.2,
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });
});


