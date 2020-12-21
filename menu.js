
const hamburger = document.querySelector('.hamburger--js');

hamburger.addEventListener('click', () => {
  

  const nav = document.querySelector('.navigation__all--js');
  nav.classList.toggle('navigation__all--open');
})