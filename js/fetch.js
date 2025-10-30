import { projectLabels } from "./lang.js";

let repositoriesData;
let isFetchingRepositories = false;
let currentLang = "EN";

async function fetchRepositoriesData() {
  if (repositoriesData) {
    return repositoriesData;
  }

  const cacheKey = "github_repos_data";
  const cacheTimestamp = "github_repos_timestamp";
  const cachedData = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(cacheTimestamp);

  if (cachedData && cachedTime) {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (now - parseInt(cachedTime) < oneHour) {
      repositoriesData = JSON.parse(cachedData);
      return repositoriesData;
    }
  }

  if (isFetchingRepositories) {
    while (isFetchingRepositories) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return repositoriesData;
  }

  try {
    isFetchingRepositories = true;
    const response = await fetch(
      "https://api.github.com/users/bartek-wieckowski/repos?sort=create"
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    repositoriesData = await response.json();

    localStorage.setItem(cacheKey, JSON.stringify(repositoriesData));
    localStorage.setItem(cacheTimestamp, Date.now().toString());

    return repositoriesData;
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw error;
  } finally {
    isFetchingRepositories = false;
  }
}

function filterAndDisplayRepositories(category, target, lang = "EN") {
  currentLang = lang;

  if (!repositoriesData || !Array.isArray(repositoriesData)) {
    console.error("Repositories data not available yet");
    return;
  }

  const filteredRepos = repositoriesData.filter(
    (repo) =>
      repo.description &&
      repo.description.toLowerCase().includes(category.toLowerCase())
  );
  displayRepositories(filteredRepos, target, lang);
}

function displayRepositories(repos, target, lang = "EN") {
  const container = document.querySelector(`.${target}`);
  if (!container) return;

  const labels = projectLabels[lang];

  repos.forEach((repo) => {
    const { description, homepage, html_url, name, topics = [] } = repo;

    const topicsHTML =
      topics && topics.length > 0
        ? `<p class="project-grid project-topics-grid">
          <span class="project-label">${labels.technologies}</span>
          <span class="project-topics">
            ${topics
              .map((topic) => `<span class="project-topic">${topic}</span>`)
              .join("")}
          </span>
        </p>`
        : "";

    let template = document.createElement("article");
    template.setAttribute("class", "project");
    template.innerHTML = `
            <div class="project-window">
                <span class="project-circle project-circle--red" aria-hidden="true"></span>
                <span class="project-circle project-circle--yellow" aria-hidden="true"></span>
                <span class="project-circle project-circle--green" aria-hidden="true"></span>
            </div>
            <div class="project-content">
                <i class='bx bxl-github project-icon'></i>
                <h3 class="project-grid project-title">
                    <span class="project-label">${labels.project}</span><span class="project-name">${name}</span>
                </h3>
                <p class="project-grid"><span class="project-label">${labels.description}</span><span
                        class="project-label--description">${description}</span>
                </p>
                ${topicsHTML}
                <p class="project-grid"><span class="project-label">${labels.github}</span><span><a target="_blank" rel="noopener noreferrer" href="${html_url}"
                        title="${name} - code" class="project-link">&lt;${labels.sourceCode}&gt;</a></span></p>
            </div>
        `;
    container.appendChild(template);

    const projectContent = template.querySelector(".project-content");
    if (!projectContent) return;

    if (homepage && homepage !== "") {
      const demoHTML = `<p class="project-grid">
        <span class="project-label">${labels.demo}</span>
        <span><a target="_blank" rel="noopener noreferrer" href="${homepage}"
          title="${name} - demo" class="project-link">&lt;${labels.visitSite}&gt;</a></span>
      </p>`;

      const demoDiv = document.createElement("div");
      demoDiv.innerHTML = demoHTML;
      const githubLine = projectContent.querySelector(
        ".project-grid:last-child"
      );
      if (githubLine) {
        projectContent.insertBefore(demoDiv.firstChild, githubLine.nextSibling);
      }
    }
  });
}

export { fetchRepositoriesData, filterAndDisplayRepositories };
