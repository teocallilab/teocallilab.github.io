function updateParallax() {
  const scrollY = window.scrollY;

  const card = document.getElementById('cardParallax');
  if (card) {
    const offsetTop = card.offsetTop;
    const yOffset = (scrollY - offsetTop) * 0.3;
    card.style.backgroundPosition = `center ${yOffset}px`;
  }

  const valor = document.getElementById('valorParallax');
  if (valor) {
    const offsetTop = valor.offsetTop;
    const yOffset = (scrollY - offsetTop) * 0.3;
    valor.style.backgroundPosition = `center ${yOffset}px`;
  }
}

window.addEventListener('scroll', updateParallax);
window.addEventListener('resize', updateParallax);
