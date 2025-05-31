const btn = document.querySelector('.btn-animated');

		btn.addEventListener('mousedown', () => {
			gsap.to(btn, { scale: 0.95, duration: 0.1 });
		});

		btn.addEventListener('mouseup', () => {
			gsap.to(btn, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.3)' });
		});