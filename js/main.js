import { setThemeFromLocalStorage, saveThemeToLocalStorage } from './theme.js';
import { renderAboutMeText } from './aboutMe.js';
import { renderTabs } from './tabs.js';
import { aboutDescribe, tabsTitle } from './lang.js';

document.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector('body');
  const themeToggler = document.querySelector('.theme-toggle');
  const themeTogglerSun = document.querySelector('.toggler-theme-sun');
  const themeTogglerMoon = document.querySelector('.toggler-theme-moon');

  const EN = document.querySelector('#EN');
  const PL = document.querySelector('#PL');

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

  let lang = 'EN';
  renderAboutMeText(lang, aboutDescribe);
  renderTabs(lang, tabsTitle);

  if (EN) {
    EN.addEventListener('click', function (event) {
      event.preventDefault();
      lang = 'EN';
      renderAboutMeText(lang, aboutDescribe);
      renderTabs(lang, tabsTitle);
    });
  }

  if (PL) {
    PL.addEventListener('click', function (event) {
      event.preventDefault();
      lang = 'PL';
      renderAboutMeText(lang, aboutDescribe);
      renderTabs(lang, tabsTitle);
    });
  }
});
