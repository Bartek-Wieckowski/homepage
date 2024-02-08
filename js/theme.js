export function setThemeFromLocalStorage(
  body,
  themeTogglerSun,
  themeTogglerMoon
) {
  const theme = localStorage.getItem('theme');
  if (theme === 'light-theme') {
    body.classList.add('light-theme');
    themeTogglerSun.classList.add('active');
  } else {
    body.classList.remove('light-theme');
    themeTogglerMoon.classList.add('active');
  }
}

export function saveThemeToLocalStorage(theme) {
  localStorage.setItem('theme', theme);
}
