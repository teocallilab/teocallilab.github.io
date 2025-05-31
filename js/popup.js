const openButtons = document.querySelectorAll('[data-popup-target]');
		const closeButtons = document.querySelectorAll('.popup-close');

		openButtons.forEach(button => {
			const popupId = button.getAttribute('data-popup-target');
			const popup = document.getElementById(popupId);

			button.addEventListener('click', () => {
			popup.style.display = 'flex';
			});
		});

		closeButtons.forEach(button => {
			button.addEventListener('click', () => {
			const popup = button.closest('.popup-overlay');
			popup.style.display = 'none';
			});
		});

		window.addEventListener('click', e => {
			if (e.target.classList.contains('popup-overlay')) {
			e.target.style.display = 'none';
			}
		});