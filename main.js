const navigationBar = document.querySelector(".nav__menu--js");
const hamburger = document.querySelector(".nav__toggle--js");

// create function - show navigation after click hamburger

const showMenu = function () {
  navigationBar.classList.toggle("show-menu");
  hamburger.classList.toggle("toggle");
};

hamburger.addEventListener("click", showMenu);
