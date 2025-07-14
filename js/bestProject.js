import { fetchRepositoriesData } from "./fetch.js";

const paidProjects = {
  EN: [
    {
      name: "Roark",
      demo: "https://roark-lac.vercel.app",
    },
    {
      name: "Arsthanea",
      demo: "https://arsthanea.vercel.app",
    },
    {
      name: "HC Wroclaw",
      demo: "https://hcwroclaw.com",
    },
    {
      name: "Halcyon",
      demo: "https://halcyon-virid.vercel.app",
    },
    {
      name: "Misja Perfekcja",
      demo: "https://misjaperfekcja.pl",
    },
  ],
  PL: [
    {
      name: "Roark",
      demo: "https://roark-lac.vercel.app",
    },
    {
      name: "Arsthanea",
      demo: "https://arsthanea.vercel.app",
    },
    {
      name: "HC Wrocław",
      demo: "https://hcwroclaw.com",
    },
    {
      name: "Halcyon",
      demo: "https://halcyon-virid.vercel.app",
    },
    {
      name: "Misja Perfekcja",
      demo: "https://misjaperfekcja.pl",
    },
  ],
};

const projectTabs = {
  EN: ["Commercial Projects", "Personal Projects"],
  PL: ["Projekty Komercyjne", "Projekty Własne"],
};

function createLoader() {
  const loader = document.createElement("div");
  loader.className = "projects-loader";
  loader.innerHTML = `
    <div class="projects-loader-spinner"></div>
  `;
  return loader;
}

function displayPaidProject(project) {
  const template = document.createElement("article");
  template.setAttribute("class", "project swiper-slide");
  template.innerHTML = `
    <div class="project-window">
      <span class="project-circle project-circle--red" aria-hidden="true"></span>
      <span class="project-circle project-circle--yellow" aria-hidden="true"></span>
      <span class="project-circle project-circle--green" aria-hidden="true"></span>
    </div>
    <div class="project-content">
      <i class='bx bx-briefcase project-icon'></i>
      <h3 class="project-grid project-title">
        <span class="project-label">project:</span>
        <span class="project-name">${project.name}</span>
      </h3>
      <p class="project-grid">
        <span class="project-label">demo:</span>
        <span><a target="_blank" rel="noopener noreferrer" href="${project.demo}" 
          title="${project.name} - demo" class="project-link">&lt;see_here&gt;</a></span>
      </p>
    </div>
  `;
  return template;
}

function displayPersonalProject(repo) {
  const { description, homepage, html_url, name } = repo;
  let template = document.createElement("article");
  template.setAttribute("class", "project swiper-slide");
  template.innerHTML = `
    <div class="project-window">
      <span class="project-circle project-circle--red" aria-hidden="true"></span>
      <span class="project-circle project-circle--yellow" aria-hidden="true"></span>
      <span class="project-circle project-circle--green" aria-hidden="true"></span>
    </div>
    <div class="project-content">
      <i class='bx bxl-github project-icon'></i>
      <h3 class="project-grid project-title">
        <span class="project-label">project:</span><span class="project-name">${name}</span>
      </h3>
      <p class="project-grid"><span class="project-label">description:</span><span class="project-label--description">${description}</span></p>
      <p class="project-grid" style="${
        homepage === "" ? "opacity: 0; visibility: hidden" : ""
      }"><span class="project-label">demo:</span><span><a target="_blank" rel="noopener noreferrer" href="${homepage}"
        title="${name} - demo" class="project-link">&lt;see_here&gt;</a></span></p>
      <p class="project-grid"><span class="project-label">github:</span><span><a target="_blank" rel="noopener noreferrer" href="${html_url}"
        title="${name} - code" class="project-link">&lt;source_code&gt;</a></span></p>
    </div>
  `;
  return template;
}

export function renderBestProjects(lang = "EN") {
  const tabsContainer = document.querySelector(".main-projects-tabs");
  const contentContainer = document.querySelector(".main-projects-content");

  tabsContainer.innerHTML = "";
  contentContainer.innerHTML = "";

  projectTabs[lang].forEach((tabName, index) => {
    const li = document.createElement("li");
    li.textContent = tabName;
    li.setAttribute("role", "tab");
    li.setAttribute("tabindex", "0");

    if (index === 0) {
      li.classList.add("active");
      activateProjectTab(index, lang);
    }

    li.addEventListener("click", () => activateProjectTab(index, lang));
    li.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        activateProjectTab(index, lang);
      }
    });

    tabsContainer.appendChild(li);
  });
}

function activateProjectTab(index, lang) {
  const tabs = document.querySelectorAll(".main-projects-tabs li");
  const contentContainer = document.querySelector(".main-projects-content");

  if (tabs.length > 0) {
    tabs.forEach((tab) => tab.classList.remove("active"));
    if (tabs[index]) {
      tabs[index].classList.add("active");
    }
  }

  contentContainer.innerHTML = "";
  const loader = createLoader();
  contentContainer.appendChild(loader);

  if (index === 0) {
    setTimeout(() => {
      contentContainer.innerHTML = "";

      const swiperContainer = document.createElement("div");
      swiperContainer.className = "swiper main-projects-swiper";
      const swiperWrapper = document.createElement("div");
      swiperWrapper.className = "swiper-wrapper";
      const swiperPagination = document.createElement("div");
      swiperPagination.className = "swiper-pagination";

      paidProjects[lang].forEach((project) => {
        const slide = displayPaidProject(project);
        swiperWrapper.appendChild(slide);
      });
      swiperContainer.appendChild(swiperWrapper);
      swiperContainer.appendChild(swiperPagination);
      contentContainer.appendChild(swiperContainer);

      if (typeof Swiper !== "undefined") {
        setTimeout(() => {
          new Swiper(".main-projects-swiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: false,
            centeredSlides: false,
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
              dynamicBullets: true,
            },
            breakpoints: {
              576: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              968: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
            },
          });
        }, 100);
      }
    }, 300);
  } else {
    (async () => {
      try {
        const repositoriesData = await fetchRepositoriesData();

        if (!repositoriesData || !Array.isArray(repositoriesData)) {
          console.error("No repositories data available");
          contentContainer.appendChild(loader);
          return;
        }

        const filteredRepos = repositoriesData.filter(
          (repo) =>
            repo.description &&
            repo.description.toLowerCase().includes("mainproject")
        );

        if (filteredRepos.length === 0) {
          contentContainer.appendChild(loader);
          return;
        }

        contentContainer.innerHTML = "";

        const swiperContainer = document.createElement("div");
        swiperContainer.className = "swiper main-projects-swiper";
        const swiperWrapper = document.createElement("div");
        swiperWrapper.className = "swiper-wrapper";
        const swiperPagination = document.createElement("div");
        swiperPagination.className = "swiper-pagination";

        filteredRepos.forEach((repo) => {
          const slide = displayPersonalProject(repo);
          swiperWrapper.appendChild(slide);
        });
        swiperContainer.appendChild(swiperWrapper);
        swiperContainer.appendChild(swiperPagination);
        contentContainer.appendChild(swiperContainer);

        if (typeof Swiper !== "undefined") {
          setTimeout(() => {
            new Swiper(".main-projects-swiper", {
              slidesPerView: 1,
              spaceBetween: 30,
              loop: false,
              centeredSlides: false,
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
                dynamicBullets: true,
              },
              breakpoints: {
                576: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                968: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
              },
            });
          }, 100);
        }
      } catch (error) {
        console.error("Error loading personal projects:", error);
        contentContainer.appendChild(loader);
      }
    })();
  }
}
