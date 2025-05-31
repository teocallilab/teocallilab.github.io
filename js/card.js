document.addEventListener("DOMContentLoaded", function() {
	const cards = document.querySelectorAll('.card');

	cards.forEach((card) => {
		const cardBg = card.querySelector('.card-bg');
		const cardText = card.querySelector('.card-text');
		const cardInner = card.querySelector('.card-inner');

		card.addEventListener('mouseenter', () => {
		gsap.to(cardBg, { 
			duration: 0.25,
			width: "110%",
			height: "110%",
			ease: "power3.out",
		});
		gsap.to(cardInner, {
			duration: 0.15,
			opacity: 1,
			ease: "power4.on",
		});
		});

		card.addEventListener('mouseleave', () => {
		gsap.to(cardBg, { 
			duration: 0.3,
			width: "100%",
			height: "100%",
		});
		gsap.to(cardInner, { 
			duration: 0.4,
			opacity: 0,
		});
		});
	});
	});