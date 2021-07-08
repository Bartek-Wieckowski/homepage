const navigationBar = document.querySelector(".nav__menu--js");
const hamburger = document.querySelector(".nav__toggle--js");
const allMenuLinks = document.querySelectorAll(".nav__item");

// create function - show navigation after click hamburger

const showMenu = function () {
  navigationBar.classList.toggle("show-menu");
  hamburger.classList.toggle("toggle");
};

hamburger.addEventListener("click", showMenu);

// closing the hamburger menu after clicking a link
allMenuLinks.forEach((link) =>
  link.addEventListener("click", () => {
    navigationBar.classList.remove("show-menu");
    hamburger.classList.remove("toggle");
  })
);
