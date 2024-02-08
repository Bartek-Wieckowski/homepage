export async function renderTabs(lang, tabsContent) {
  const wrapper = document.querySelector('.tabs-wrapper');
  const tabContent = document.querySelector('.tab-content');
  wrapper.innerHTML = '';
  tabContent.innerHTML = '';

  tabsContent[lang].forEach(async (desc, index) => {
    const li = document.createElement('li');
    li.textContent = desc;
    if (index === 0) {
      li.classList.add('active');

      const content = document.createElement('div');
      content.textContent = `Content for ${desc}`;
      tabContent.appendChild(content);
    }
    li.addEventListener('click', async () => {
      document.querySelectorAll('.tabs-wrapper li').forEach((item) => {
        item.classList.remove('active');
      });
      li.classList.add('active');

      tabContent.innerHTML = '';
      const content = document.createElement('div');
      showLoader();

      try {
        if (index === 1) {
          await fetchRepositories('JavaScript');
        } else if (index === 2) {
          await fetchRepositories('Another');
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
      } finally {
        hideLoader();
      }

      tabContent.appendChild(content);
    });

    wrapper.appendChild(li);
  });
}

async function fetchRepositories(category) {
  try {
    const response = await fetch(
      `https://api.github.com/users/bartek-wieckowski/repos?sort=create`
    );
    const repos = await response.json();
    filterAndDisplayRepositories(repos, category);
  } catch (error) {
    console.error('Error fetching repositories:', error);
  }
}

function filterAndDisplayRepositories(repos, category) {
  const filteredRepos = repos.filter(
    (repo) =>
      repo.description &&
      repo.description.toLowerCase().includes(category.toLowerCase())
  );
  displayRepositories(filteredRepos);
}

function displayRepositories(repos) {
  const container = document.querySelector('.tab-content');
  container.innerHTML = '';

  repos.forEach((repo) => {
    const { description, homepage, html_url, name } = repo;
    let template = document.createElement('article');
    template.setAttribute('class', 'project');
    template.innerHTML = `
            <div class="project__window">
                <span class="project__circle project__circle--red"></span>
                <span class="project__circle project__circle--yellow"></span>
                <span class="project__circle project__circle--green"></span>
            </div>
            <div class="project__content">
                <i class='bx bxl-github project__icon'></i>
                <h3 class="project__grid project__title">
                    <span class="project__label">project:</span><span class="project__name">${name}</span>
                </h3>
                <p class="project__grid"><span class="project__label">description:</span><span
                        class="project__label--description">${description}</span>
                </p>
                <p class="project__grid"><span class="project__label">demo:</span><span><a target="_blank" rel="noopener noreferrer" href="${homepage}"
                        title="${name} - demo" class="project__link">&lt;see_here&gt;</a></span></p>
                <p class="project__grid"><span class="project__label">github:</span><span><a target="_blank" rel="noopener noreferrer" href="${html_url}"
                        title="${name} - code" class="project__link">&lt;source_code&gt;</a></span></p>
            </div>
        `;
    container.appendChild(template);
  });
}

function showLoader() {
  const loaderContainer = document.querySelector('.loader-container');
  const loader = document.querySelector('.loader');
  loader.style.display = 'block';
  loaderContainer.style.display = 'flex';
}

function hideLoader() {
  const loaderContainer = document.querySelector('.loader-container');
  const loader = document.querySelector('.loader');
  loader.style.display = 'none';
  loaderContainer.style.display = 'none';
}
