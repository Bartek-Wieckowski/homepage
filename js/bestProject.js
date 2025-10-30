import { fetchRepositoriesData } from "./fetch.js";
import { projectLabels } from "./lang.js";

const videoCache = new Map();

const paidProjects = {
  EN: [
    {
      name: "Out Studio",
      demo: "https://out-studio.vercel.app",
    },
    {
      name: "Rarraba",
      demo: "https://rarraba.vercel.app",
    },
    {
      name: "Roark",
      demo: "https://www.roarkstudio.pl",
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
      demo: "https://halcyon.net",
    },
    {
      name: "Misja Perfekcja",
      demo: "https://misjaperfekcja.pl",
    },
  ],
  PL: [
    {
      name: "Out Studio",
      demo: "https://out-studio.vercel.app",
    },
    {
      name: "Rarraba",
      demo: "https://rarraba.vercel.app",
    },
    {
      name: "Roark",
      demo: "https://www.roarkstudio.pl/pl",
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
      demo: "https://halcyon.net",
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

export async function getProjectVideo(
  projectName,
  projectType = "personal",
  bypassCache = false
) {
  const cleanName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const isMobile = window.innerWidth < 768;
  const deviceSuffix = isMobile ? "-mobile" : "-desktop";

  if (!bypassCache) {
    const cacheKey = `${projectName}-${projectType}-${deviceSuffix}`;
    if (videoCache.has(cacheKey)) {
      return videoCache.get(cacheKey);
    }
  }

  const videoFormats = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];
  const folder = projectType === "paid" ? "paid-projects" : "personal-projects";
  const cacheKey = `${projectName}-${projectType}-${deviceSuffix}`;

  for (const format of videoFormats) {
    const videoPath = `videos/${folder}/${cleanName}${deviceSuffix}.${format}`;

    try {
      const response = await fetch(videoPath, { method: "HEAD" });
      if (response.ok) {
        if (!bypassCache) {
          videoCache.set(cacheKey, videoPath);
        }
        return videoPath;
      }
    } catch (error) {
      continue;
    }
  }

  for (const format of videoFormats) {
    const videoPath = `videos/${folder}/${cleanName}.${format}`;

    try {
      const response = await fetch(videoPath, { method: "HEAD" });
      if (response.ok) {
        if (!bypassCache) {
          videoCache.set(cacheKey, videoPath);
        }
        return videoPath;
      }
    } catch (error) {
      continue;
    }
  }

  if (!bypassCache) {
    videoCache.set(cacheKey, null);
  }
  return null;
}

async function refreshModalVideo() {
  const modal = document.querySelector(".video-modal");
  if (!modal) return;

  const video = modal.querySelector(".video-modal-video");
  const projectName = modal.querySelector(".video-modal-title").textContent;

  if (!video || !projectName) return;

  const activeTab = document.querySelector(".main-projects-tabs li.active");
  const isPaidProject =
    (activeTab && activeTab.textContent.includes("Commercial")) ||
    (activeTab && activeTab.textContent.includes("Komercyjne"));
  const projectType = isPaidProject ? "paid" : "personal";

  const newVideoSrc = await getProjectVideo(projectName, projectType, true);

  if (newVideoSrc && newVideoSrc !== video.src) {
    video.src = newVideoSrc;
    video.load();

    const modalContent = modal.querySelector(".video-modal-content");
    const modalRect = modalContent.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth < 768;

    let left, top;

    if (isMobile) {
      left = (viewportWidth - modalRect.width) / 2;
      top = Math.min(
        parseInt(modal.style.top) || 100,
        viewportHeight - modalRect.height - 20
      );
      if (top < 20) top = 20;
    } else {
      left = parseInt(modal.style.left) || 100;
      top = parseInt(modal.style.top) || 100;
    }

    modal.style.left = left + "px";
    modal.style.top = top + "px";
  }
}

function createLoader() {
  const loader = document.createElement("div");
  loader.className = "projects-loader";
  loader.innerHTML = `
    <div class="projects-loader-spinner"></div>
  `;
  return loader;
}

function displayPaidProject(project, lang = "EN") {
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
        <span class="project-label">${projectLabels[lang].project}</span>
        <span class="project-name">${project.name}</span>
      </h3>
      <p class="project-grid">
        <span class="project-label">${projectLabels[lang].demo}</span>
        <span><a target="_blank" rel="noopener noreferrer" href="${project.demo}" 
          title="${project.name} - live site" class="project-link">&lt;${projectLabels[lang].visitSite}&gt;</a></span>
      </p>
    </div>
  `;

  getProjectVideo(project.name, "paid").then((videoSrc) => {
    if (videoSrc) {
      const previewHTML = `<p class="project-grid project-preview-grid">
        <span class="project-label">${projectLabels[lang].preview}</span>
        <span><a href="javascript:;" 
          title="${project.name} - preview" class="project-link project-preview-link" 
          data-video="${videoSrc}" data-project="${project.name}">&lt;${projectLabels[lang].watchPreview}&gt;</a></span>
      </p>`;

      const projectContent = template.querySelector(".project-content");
      if (projectContent) {
        const previewDiv = document.createElement("div");
        previewDiv.innerHTML = previewHTML;
        projectContent.appendChild(previewDiv.firstChild);
      }
    }
  });

  return template;
}

function displayPersonalProject(repo, lang = "EN") {
  const { description, homepage, html_url, name, topics = [] } = repo;

  const topicsHTML =
    topics && topics.length > 0
      ? `<p class="project-grid project-topics-grid project-topics-grid-tech">
        <span class="project-label">${projectLabels[lang].technologies}</span>
        <span class="project-topics">
          ${topics
            .map((topic) => `<span class="project-topic">${topic}</span>`)
            .join("")}
        </span>
      </p>`
      : "";

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
        <span class="project-label">${projectLabels[lang].project}</span><span class="project-name">${name}</span>
      </h3>
      <p class="project-grid"><span class="project-label">${projectLabels[lang].description}</span><span class="project-label--description">${description}</span></p>
      ${topicsHTML}
       <p class="project-grid"><span class="project-label">github:</span><span><a target="_blank" rel="noopener noreferrer" href="${html_url}"
        title="${name} - code" class="project-link">&lt;${projectLabels[lang].sourceCode}&gt;</a></span></p>
    </div>
  `;

  Promise.all([
    getProjectVideo(name, "personal"),
    Promise.resolve(homepage),
  ]).then(([videoSrc, homePage]) => {
    const projectContent = template.querySelector(".project-content");
    if (!projectContent) return;

    const allGrids = projectContent.querySelectorAll(".project-grid");
    const githubLine = allGrids[allGrids.length - 1];
    if (!githubLine) return;

    if (homePage && homePage !== "") {
      const demoHTML = `<p class="project-grid">
        <span class="project-label">${projectLabels[lang].demo}</span>
        <span><a target="_blank" rel="noopener noreferrer" href="${homePage}"
          title="${name} - live site" class="project-link">&lt;${projectLabels[lang].visitSite}&gt;</a></span>
      </p>`;

      const demoDiv = document.createElement("div");
      demoDiv.innerHTML = demoHTML;
      projectContent.insertBefore(demoDiv.firstChild, githubLine.nextSibling);
    }

    if (videoSrc) {
      const previewHTML = `<p class="project-grid project-preview-grid">
        <span class="project-label">${projectLabels[lang].preview}</span>
        <span><a href="javascript:;" 
          title="${name} - preview" class="project-link project-preview-link" 
          data-video="${videoSrc}" data-project="${name}">&lt;${projectLabels[lang].watchPreview}&gt;</a></span>
      </p>`;

      const previewDiv = document.createElement("div");
      previewDiv.innerHTML = previewHTML;
      projectContent.appendChild(previewDiv.firstChild);
    }
  });

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

async function activateProjectTab(index, lang) {
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
    setTimeout(async () => {
      contentContainer.innerHTML = "";

      const swiperContainer = document.createElement("div");
      swiperContainer.className = "swiper main-projects-swiper";
      const swiperWrapper = document.createElement("div");
      swiperWrapper.className = "swiper-wrapper";
      const swiperPagination = document.createElement("div");
      swiperPagination.className = "swiper-pagination";

      for (const project of paidProjects[lang]) {
        const slide = displayPaidProject(project, lang);
        swiperWrapper.appendChild(slide);
      }
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
    setTimeout(async () => {
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

        for (const repo of filteredRepos) {
          const slide = displayPersonalProject(repo, lang);
          swiperWrapper.appendChild(slide);
        }
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
    }, 300);
  }
}

function createVideoModal() {
  const isMobile = window.innerWidth < 768;
  const modal = document.createElement("div");
  modal.className = "video-modal";

  const closeButton = isMobile
    ? `<button class="video-modal-close" aria-label="Close modal">&times;</button>`
    : "";

  modal.innerHTML = `
    <div class="video-modal-content">
      <div class="video-modal-header">
        <h3 class="video-modal-title"></h3>
        ${closeButton}
      </div>
      <div class="video-modal-body">
        <video class="video-modal-video" autoplay muted loop playsinline>
          <source src="" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  `;
  return modal;
}

function showVideoModal(videoSrc, projectName, mouseX, mouseY) {
  const existingModal = document.querySelector(".video-modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modal = createVideoModal();
  document.body.appendChild(modal);

  const video = modal.querySelector(".video-modal-video");
  const title = modal.querySelector(".video-modal-title");

  title.textContent = projectName;

  video.innerHTML = `
    <source src="${videoSrc}" type="video/mp4">
    Your browser does not support the video tag.
  `;
  video.src = videoSrc;

  // Set playback rate to 2x
  video.playbackRate = 2;

  video.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });

  video.setAttribute("disablePictureInPicture", "true");

  const modalContent = modal.querySelector(".video-modal-content");
  const modalRect = modalContent.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isMobile = window.innerWidth < 768;

  let left, top;

  if (isMobile) {
    left = (viewportWidth - modalRect.width) / 2;
    top = Math.min(
      mouseY - modalRect.height - 20,
      viewportHeight - modalRect.height - 20
    );

    if (top < 20) {
      top = 20;
    }
  } else {
    left = mouseX + 20;
    top = mouseY - 20;

    if (left + modalRect.width > viewportWidth) {
      left = mouseX - modalRect.width - 20;
    }
    if (top + modalRect.height > viewportHeight) {
      top = mouseY - modalRect.height - 20;
    }
    if (left < 0) left = 20;
    if (top < 0) top = 20;
  }

  modal.style.left = left + "px";
  modal.style.top = top + "px";

  setTimeout(() => {
    modal.classList.add("show");
  }, 10);

  const closeBtn = modal.querySelector(".video-modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeCurrentModal();
    });
  }

  if (isMobile) {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeCurrentModal();
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);
  }
}

function addPreviewEventListeners() {
  let hoverTimeout;
  let closeTimeout;
  const isMobile = window.innerWidth < 768;

  if (!isMobile) {
    document.addEventListener(
      "mouseenter",
      (e) => {
        if (e.target?.classList?.contains("project-preview-link")) {
          clearTimeout(closeTimeout);

          const videoSrc = e.target.getAttribute("data-video");
          const projectName = e.target.getAttribute("data-project");

          hoverTimeout = setTimeout(() => {
            showVideoModal(videoSrc, projectName, e.clientX, e.clientY);
          }, 200);
        }
      },
      true
    );

    document.addEventListener(
      "mouseleave",
      (e) => {
        if (e.target?.classList?.contains("project-preview-link")) {
          clearTimeout(hoverTimeout);

          closeTimeout = setTimeout(() => {
            closeCurrentModal();
          }, 500);
        }
      },
      true
    );

    document.addEventListener(
      "mouseenter",
      (e) => {
        if (e.target && e.target.closest && e.target.closest(".video-modal")) {
          clearTimeout(closeTimeout);
        }
      },
      true
    );

    document.addEventListener(
      "mouseleave",
      (e) => {
        if (e.target && e.target.closest && e.target.closest(".video-modal")) {
          closeTimeout = setTimeout(() => {
            closeCurrentModal();
          }, 300);
        }
      },
      true
    );

    document.addEventListener(
      "mousemove",
      (e) => {
        if (e.target && e.target.closest && e.target.closest(".video-modal")) {
          clearTimeout(closeTimeout);
        }
      },
      true
    );
  }

  if (isMobile) {
    document.addEventListener(
      "click",
      (e) => {
        if (e.target?.classList?.contains("project-preview-link")) {
          e.preventDefault();

          const videoSrc = e.target.getAttribute("data-video");
          const projectName = e.target.getAttribute("data-project");

          showVideoModal(videoSrc, projectName, e.clientX, e.clientY);
        }
      },
      true
    );
  }
}

function closeCurrentModal() {
  const modal = document.querySelector(".video-modal");
  if (modal) {
    modal.classList.remove("show");
    const video = modal.querySelector(".video-modal-video");
    if (video && video.pause) {
      video.pause();
      video.currentTime = 0;
    }
    setTimeout(() => {
      modal.remove();
    }, 300);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addPreviewEventListeners);
} else {
  addPreviewEventListeners();
}

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    refreshModalVideo();
  }, 300); // Debounce resize events
});
