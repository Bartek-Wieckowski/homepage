function renderAboutMeHeader(lang) {
  const header = document.createElement('h2');
  header.textContent = lang === 'EN' ? 'About' : 'O mnie';
  return header;
}

export function renderAboutMeText(lang, aboutDescribe) {
  const wrapper = document.querySelector('.me-about-wrapper');
  wrapper.innerHTML = '';

  const header = renderAboutMeHeader(lang);
  wrapper.appendChild(header);

  aboutDescribe[lang].forEach((desc, index, array) => {
    const p = document.createElement('p');
    p.textContent = desc;

    if (index === array.length - 1) {
      const icon = document.createElement('i');
      icon.classList.add('bx', 'bx-redo');
      icon.setAttribute('role', 'tab');
      icon.setAttribute('tabindex', '0');
      p.appendChild(icon);

      const scrollToTabsSection = () => {
        const tabsSection = document.querySelector('.main-projects');
        if (tabsSection) {
          tabsSection.scrollIntoView({ behavior: 'smooth' });
        }
      };

      icon.addEventListener('click', scrollToTabsSection);

      icon.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          scrollToTabsSection();
        }
      });
    }
    wrapper.appendChild(p);
  });
}
