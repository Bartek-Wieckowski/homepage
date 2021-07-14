const navigationBar = document.querySelector(".nav__menu--js");
const hamburger = document.querySelector(".nav__toggle--js");
const allMenuLinks = document.querySelectorAll(".nav__item");
const allTitles = document.querySelectorAll(".section__title");
const allSubtitles = document.querySelectorAll(".section__subtitle");

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

//revealing elements on scroll
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allTitles.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});
allSubtitles.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});
// connect to github repositories

fetch("https://api.github.com/users/bartek-wieckowski/repos?sort=create")
  .then((res) => res.json())
  .then((res) => {
    const container = document.querySelector(".portfolio__container--js");
    for (let repo of res) {
      const { description, homepage, html__url, name } = repo;
      const template = `<article class="project">
      <div class="project__window">
          <span class="project__circle project__circle--red"></span>
          <span class="project__circle project__circle--yellow"></span>
          <span class="project__circle project__circle--green"></span>
      </div>
      <div class="project__content">
          <i class='bx bxl-github project__icon'></i>
          <h3 class="project__grid project__title">
              <span class="project__label">project:</span><span>${name}</span>
          </h3>
          <p class="project__grid"><span class="project__label">description:</span><span
                  class="project__label--description">${description}</span>
          </p>
          <p class="project__grid"><span class="project__label">demo:</span><span><a href="${homepage}"
                      title="${name} - demo" class="project__link">&lt;see_here&gt;</a></span></p>
          <p class="project__grid"><span class="project__label">github:</span><span><a href="${html__url}"
                      title="${name} - code" class="project__link">&lt;source_code&gt;</a></span></p>
      </div>
  </article>`;

      container.innerHTML += template;
    }
  })
  .catch((e) => console.log(e));
