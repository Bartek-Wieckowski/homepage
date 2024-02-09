const tabsSection = document.querySelector('.tabs-wrapper');
const scrollArrow = document.querySelector('.scroll-arrow');

function checkScrollPosition() {
  const tabsSectionPosition = tabsSection.getBoundingClientRect().top;

  if (tabsSectionPosition < 200) {
    scrollArrow.classList.add('visible');
  } else {
    scrollArrow.classList.remove('visible');
  }
}

function scrollToTabsSection() {
  const scrollToPosition = tabsSection.offsetTop - 100;
  window.scrollTo({
    top: scrollToPosition,
    behavior: 'smooth',
  });
}

window.addEventListener('scroll', checkScrollPosition);
scrollArrow.addEventListener('click', scrollToTabsSection);
