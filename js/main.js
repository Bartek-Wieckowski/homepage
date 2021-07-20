const navigationBar = document.querySelector(".nav__menu--js");
const hamburger = document.querySelector(".nav__toggle--js");
const allMenuLinks = document.querySelectorAll(".nav__item");
const allTitles = document.querySelectorAll(".section__title");
const allSubtitles = document.querySelectorAll(".section__subtitle");
const sections = document.querySelectorAll(".section[id]");
const nav = document.querySelector(".nav");

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

// hover fade animation in navigation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector(".nav__logo");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

// active link when we scroll in page
function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 100;
    sectionId = current.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.add("active-link");
    } else {
      document
        .querySelector(".nav__menu a[href*=" + sectionId + "]")
        .classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

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
    const tabs1 = document.querySelector(".repo__tab--1");
    const tabs2 = document.querySelector(".repo__tab--2");
    const tabs3 = document.querySelector(".repo__tab--3");

    for (let repo of res) {
      const { description, homepage, html_url, name } = repo;
      let template = document.createElement("article");
      template.setAttribute("class", "project");
      template.innerHTML = `
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
          <p class="project__grid"><span class="project__label">demo:</span><span><a target="_blank" rel="noopener noreferrer" href="${homepage}"
                      title="${name} - demo" class="project__link">&lt;see_here&gt;</a></span></p>
          <p class="project__grid"><span class="project__label">github:</span><span><a target="_blank" rel="noopener noreferrer" href="${html_url}"
                      title="${name} - code" class="project__link">&lt;source_code&gt;</a></span></p>
      </div>
    </article>`;

      let template2 = document.createElement("article");
      template2.setAttribute("class", "project");
      template2.innerHTML = `
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
          <p class="project__grid"><span class="project__label">demo:</span><span><a target="_blank" rel="noopener noreferrer" href="${homepage}"
                      title="${name} - demo" class="project__link">&lt;see_here&gt;</a></span></p>
          <p class="project__grid"><span class="project__label">github:</span><span><a target="_blank" rel="noopener noreferrer" href="${html_url}"
                      title="${name} - code" class="project__link">&lt;source_code&gt;</a></span></p>
      </div>
    </article>`;
      let template3 = document.createElement("article");
      template3.setAttribute("class", "project");
      template3.innerHTML = `
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
          <p class="project__grid"><span class="project__label">demo:</span><span><a target="_blank" rel="noopener noreferrer" href="${homepage}"
                      title="${name} - demo" class="project__link">&lt;see_here&gt;</a></span></p>
          <p class="project__grid"><span class="project__label">github:</span><span><a target="_blank" rel="noopener noreferrer" href="${html_url}"
                      title="${name} - code" class="project__link">&lt;source_code&gt;</a></span></p>
      </div>
    </article>`;

      const optionsOne = function () {
        if (description === "Website") {
          container.appendChild(template);
        } else if (description !== "Website") {
          template2.remove(template2);
          template3.remove(template3);
        }
      };
      tabs1.addEventListener("click", optionsOne);

      const optionsTwo = function () {
        if (description === "JavaScript") {
          container.appendChild(template2);
        } else if (description !== "JavaScript") {
          template.remove(template);
          template3.remove(template3);
        }
      };
      tabs2.addEventListener("click", optionsTwo);

      const optionsThree = function () {
        if (description === "Another") {
          container.appendChild(template3);
        } else if (description !== "Another") {
          template.remove(template);
          template2.remove(template2);
        }
      };
      tabs3.addEventListener("click", optionsThree);
    }
  })

  .catch((e) => console.log(e));

const tabs = document.querySelectorAll(".repo__tab");
const tabsContainer = document.querySelector(".repo__tab-container");

// used event delegation

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".repo__tab");

  //   guard clauses
  if (!clicked) return;
  // remove active classes
  tabs.forEach((t) => t.classList.remove("repo__tab--active"));
  // active tab
  clicked.classList.add("repo__tab--active");
});
