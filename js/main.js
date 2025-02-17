import { setThemeFromLocalStorage, saveThemeToLocalStorage } from './theme.js';
import { renderAboutMeText } from './aboutMe.js';
import { renderTabs } from './tabs.js';
import { aboutDescribe, tabsTitle } from './lang.js';
import { fetchRepositoriesData } from './fetch.js';
import { renderBestProjects } from './bestProject.js';
import './scroll.js';

export let lang;

document.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector('body');
  const themeToggler = document.querySelector('.theme-toggle');
  const themeTogglerSun = document.querySelector('.toggler-theme-sun');
  const themeTogglerMoon = document.querySelector('.toggler-theme-moon');
  const footerElement = document.querySelector('footer p');

  const EN = document.querySelector('#EN');
  const PL = document.querySelector('#PL');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  setThemeFromLocalStorage(body, themeTogglerSun, themeTogglerMoon);

  themeToggler.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    themeTogglerSun.classList.toggle('active');
    themeTogglerMoon.classList.toggle('active');

    const theme = body.classList.contains('light-theme')
      ? 'light-theme'
      : 'dark-theme';
    saveThemeToLocalStorage(theme);
  });

  lang = 'EN';
  renderAboutMeText(lang, aboutDescribe);
  renderTabs(lang, tabsTitle);

  if (EN) {
    EN.addEventListener('click', function (event) {
      event.preventDefault();
      lang = 'EN';
      body.classList.remove('lang-pl');
      renderAboutMeText(lang, aboutDescribe);
      renderTabs(lang, tabsTitle);
      renderBestProjects(lang);
    });
  }

  if (PL) {
    PL.addEventListener('click', function (event) {
      event.preventDefault();
      lang = 'PL';
      body.classList.add('lang-pl');
      renderAboutMeText(lang, aboutDescribe);
      renderTabs(lang, tabsTitle);
      renderBestProjects(lang);
    });
  }

  footerElement.style.textAlign = 'center';
  footerElement.textContent = '© theBart ' + currentYear;
});

document.addEventListener('DOMContentLoaded', async () => {
  await fetchRepositoriesData();
  renderBestProjects(lang);
});
