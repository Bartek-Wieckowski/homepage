let repositoriesData;

async function fetchRepositoriesData() {
  try {
    const response = await fetch(
      'https://api.github.com/users/bartek-wieckowski/repos?sort=create'
    );
    return (repositoriesData = await response.json());
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

function filterAndDisplayRepositories(category, target) {
  const filteredRepos = repositoriesData.filter(
    (repo) =>
      repo.description &&
      repo.description.toLowerCase().includes(category.toLowerCase())
  );
  displayRepositories(filteredRepos, target);
}

function displayRepositories(repos, target) {
  const container = document.querySelector(`.${target}`);

  repos.forEach((repo) => {
    const { description, homepage, html_url, name } = repo;
    let template = document.createElement('article');
    template.setAttribute('class', 'project');
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
                <p class="project-grid"><span class="project-label">description:</span><span
                        class="project-label--description">${description}</span>
                </p>
                <p class="project-grid" style="${homepage === '' ? 'opacity: 0; visibility: hidden' : ''}"><span class="project-label">demo:</span><span><a target="_blank" rel="noopener noreferrer" href="${homepage}"
                        title="${name} - demo" class="project-link">&lt;see_here&gt;</a></span></p>
                <p class="project-grid"><span class="project-label">github:</span><span><a target="_blank" rel="noopener noreferrer" href="${html_url}"
                        title="${name} - code" class="project-link">&lt;source_code&gt;</a></span></p>
            </div>
        `;
    container.appendChild(template);
  });
}

export { fetchRepositoriesData, filterAndDisplayRepositories };
