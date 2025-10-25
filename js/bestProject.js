import { fetchRepositoriesData } from "./fetch.js";

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
      name: "HC Wrocław",
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

const previewTexts = {
  EN: {
    label: "preview:",
    link: "watch_preview",
    demoLabel: "site:",
    demoLink: "visit_site",
  },
  PL: {
    label: "zwiastun:",
    link: "zobacz_zwiastun",
    demoLabel: "strona:",
    demoLink: "odwiedź_stronę",
  },
};

// Universal function to get video for any project
async function getProjectVideo(projectName, projectType = "personal") {
  // Clean project name for file naming
  const cleanName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  // Detect if mobile or desktop based on current viewport size
  const isMobile = window.innerWidth < 768;
  const deviceSuffix = isMobile ? "-mobile" : "-desktop";

  // Check for common video formats
  const videoFormats = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];

  // Determine folder based on project type
  const folder = projectType === "paid" ? "paid-projects" : "personal-projects";

  // First try device-specific video
  for (const format of videoFormats) {
    const videoPath = `videos/${folder}/${cleanName}${deviceSuffix}.${format}`;

    try {
      const response = await fetch(videoPath, { method: "HEAD" });
      if (response.ok) {
        return videoPath;
      }
    } catch (error) {
      continue;
    }
  }

  // If device-specific video not found, try generic video
  for (const format of videoFormats) {
    const videoPath = `videos/${folder}/${cleanName}.${format}`;

    try {
      const response = await fetch(videoPath, { method: "HEAD" });
      if (response.ok) {
        return videoPath;
      }
    } catch (error) {
      continue;
    }
  }

  return null; // No video found
}

// Function to refresh video in modal when orientation changes
async function refreshModalVideo() {
  const modal = document.querySelector(".video-modal");
  if (!modal) return;

  const video = modal.querySelector(".video-modal-video");
  const projectName = modal.querySelector(".video-modal-title").textContent;

  if (!video || !projectName) return;

  // Determine project type based on current tab
  const activeTab = document.querySelector(".main-projects-tabs li.active");
  const isPaidProject =
    (activeTab && activeTab.textContent.includes("Commercial")) ||
    (activeTab && activeTab.textContent.includes("Komercyjne"));
  const projectType = isPaidProject ? "paid" : "personal";

  // Get new video for current device
  const newVideoSrc = await getProjectVideo(projectName, projectType);

  if (newVideoSrc && newVideoSrc !== video.src) {
    video.src = newVideoSrc;
    video.load(); // Reload video with new source

    // Reposition modal for new aspect ratio
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

async function displayPaidProject(project, lang = "EN") {
  // Get video for this project (paid type)
  const videoSrc = await getProjectVideo(project.name, "paid");
  const hasVideo = videoSrc !== null;

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
        <span class="project-label">${previewTexts[lang].demoLabel}</span>
        <span><a target="_blank" rel="noopener noreferrer" href="${
          project.demo
        }" 
          title="${project.name} - live site" class="project-link">&lt;${
    previewTexts[lang].demoLink
  }&gt;</a></span>
      </p>
      <p class="project-grid" style="${
        !hasVideo ? "opacity: 0; visibility: hidden" : ""
      }">
        <span class="project-label">${previewTexts[lang].label}</span>
        <span><a href="javascript:;" 
          title="${
            project.name
          } - preview" class="project-link project-preview-link" 
          data-video="${videoSrc || ""}" data-project="${project.name}">&lt;${
    previewTexts[lang].link
  }&gt;</a></span>
      </p>
    </div>
  `;
  return template;
}

async function displayPersonalProject(repo, lang = "EN") {
  const { description, homepage, html_url, name } = repo;

  // Get video for this project (personal type)
  let videoSrc = await getProjectVideo(name, "personal");
  let hasVideo = videoSrc !== null;

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
       <p class="project-grid"><span class="project-label">github:</span><span><a target="_blank" rel="noopener noreferrer" href="${html_url}"
        title="${name} - code" class="project-link">&lt;source_code&gt;</a></span></p>
      <p class="project-grid" style="${
        homepage === "" ? "opacity: 0; visibility: hidden" : ""
      }"><span class="project-label">${
    previewTexts[lang].demoLabel
  }</span><span><a target="_blank" rel="noopener noreferrer" href="${homepage}"
        title="${name} - live site" class="project-link">&lt;${
    previewTexts[lang].demoLink
  }&gt;</a></span></p>
      <p class="project-grid" style="${
        !hasVideo ? "opacity: 0; visibility: hidden" : ""
      }"><span class="project-label">${
    previewTexts[lang].label
  }</span><span><a href="javascript:;" 
        title="${name} - preview" class="project-link project-preview-link" 
        data-video="${videoSrc}" data-project="${name}">&lt;${
    previewTexts[lang].link
  }&gt;</a></span></p>
     
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
        const slide = await displayPaidProject(project, lang);
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

        for (const repo of filteredRepos) {
          const slide = await displayPersonalProject(repo, lang);
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
    })();
  }
}

// Modal functionality
function createVideoModal() {
  const isMobile = window.innerWidth < 768;
  const modal = document.createElement("div");
  modal.className = "video-modal";

  // Always show close button on mobile, never on desktop
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
        <video class="video-modal-video" controls autoplay muted loop>
          <source src="" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  `;
  return modal;
}

function showVideoModal(videoSrc, projectName, mouseX, mouseY) {
  // Remove existing modal if any
  const existingModal = document.querySelector(".video-modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modal = createVideoModal();
  document.body.appendChild(modal);

  // Set video source and project name
  const video = modal.querySelector(".video-modal-video");
  const title = modal.querySelector(".video-modal-title");

  title.textContent = projectName;

  // Set video source (local files only)
  video.innerHTML = `
    <source src="${videoSrc}" type="video/mp4">
    Your browser does not support the video tag.
  `;
  video.src = videoSrc;

  // Position modal near mouse cursor
  const modalContent = modal.querySelector(".video-modal-content");
  const modalRect = modalContent.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isMobile = window.innerWidth < 768;

  let left, top;

  if (isMobile) {
    // Mobile: center the modal and position it higher to avoid bottom cutoff
    left = (viewportWidth - modalRect.width) / 2;
    top = Math.min(
      mouseY - modalRect.height - 20,
      viewportHeight - modalRect.height - 20
    );

    // Ensure modal is not too high
    if (top < 20) {
      top = 20;
    }
  } else {
    // Desktop: position near cursor
    left = mouseX + 20;
    top = mouseY - 20;

    // Adjust if modal would go off screen
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

  // Show modal with animation
  setTimeout(() => {
    modal.classList.add("show");
  }, 10);

  // Add close button functionality for mobile
  const closeBtn = modal.querySelector(".video-modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeCurrentModal();
    });
  }

  // Add Escape key functionality for mobile
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

// Add event listeners for preview links
function addPreviewEventListeners() {
  let hoverTimeout;
  let closeTimeout;
  const isMobile = window.innerWidth < 768;

  // Desktop hover behavior
  if (!isMobile) {
    document.addEventListener(
      "mouseenter",
      (e) => {
        if (e.target.classList.contains("project-preview-link")) {
          clearTimeout(closeTimeout);

          const videoSrc = e.target.getAttribute("data-video");
          const projectName = e.target.getAttribute("data-project");

          // Add small delay to prevent accidental opening
          hoverTimeout = setTimeout(() => {
            showVideoModal(videoSrc, projectName, e.clientX, e.clientY);
          }, 200);
        }
      },
      true
    );

    // Desktop hover out behavior
    document.addEventListener(
      "mouseleave",
      (e) => {
        if (e.target.classList.contains("project-preview-link")) {
          clearTimeout(hoverTimeout);

          // Close modal after a short delay
          closeTimeout = setTimeout(() => {
            closeCurrentModal();
          }, 500);
        }
      },
      true
    );

    // Keep modal open when hovering over it (desktop)
    document.addEventListener(
      "mouseenter",
      (e) => {
        if (e.target.closest(".video-modal")) {
          clearTimeout(closeTimeout);
        }
      },
      true
    );

    // Close modal when leaving modal area (desktop)
    document.addEventListener(
      "mouseleave",
      (e) => {
        if (e.target.closest(".video-modal")) {
          closeTimeout = setTimeout(() => {
            closeCurrentModal();
          }, 300);
        }
      },
      true
    );

    // Additional safety: prevent modal from closing when moving within modal
    document.addEventListener(
      "mousemove",
      (e) => {
        if (e.target.closest(".video-modal")) {
          clearTimeout(closeTimeout);
        }
      },
      true
    );
  }

  // Mobile click behavior
  if (isMobile) {
    document.addEventListener(
      "click",
      (e) => {
        if (e.target.classList.contains("project-preview-link")) {
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

// Initialize preview functionality when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addPreviewEventListeners);
} else {
  addPreviewEventListeners();
}

// Add resize listener to refresh video when orientation changes
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    refreshModalVideo();
  }, 300); // Debounce resize events
});
