import { filterAndDisplayRepositories } from './fetch.js';

const paidProjects = {
  EN: [
    {
      name: 'Arsthanea',
      demo: 'https://arsthanea.vercel.app',
    },
    {
      name: 'HC Wroclaw',
      demo: 'https://hcwroclaw.com',
    },
    {
      name: 'Halcyon',
      demo: 'https://halcyon-virid.vercel.app',
    },
    {
      name: 'Misja Perfekcja',
      demo: 'https://misjaperfekcja.pl',
    },
    {
      name: 'Noble Health',
      demo: 'https://noblehealth.pl',
    },
  ],
  PL: [
    {
      name: 'Arsthanea',
      demo: 'https://arsthanea.vercel.app',
    },
    {
      name: 'HC Wrocław',
      demo: 'https://hcwroclaw.com',
    },
    {
      name: 'Halcyon',
      demo: 'https://halcyon-virid.vercel.app',
    },
    {
      name: 'Misja Perfekcja',
      demo: 'https://misjaperfekcja.pl',
    },
    {
      name: 'Noble Health',
      demo: 'https://noblehealth.pl',
    },
  ],
};

const projectTabs = {
  EN: ['Commercial Projects', 'Personal Projects'],
  PL: ['Projekty Komercyjne', 'Projekty Własne'],
};

function displayPaidProject(project, container) {
  const template = document.createElement('article');
  template.setAttribute('class', 'project');
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
  container.appendChild(template);
}

export function renderBestProjects(lang = 'EN') {
  const tabsContainer = document.querySelector('.main-projects-tabs');
  const contentContainer = document.querySelector('.main-projects-content');

  tabsContainer.innerHTML = '';
  contentContainer.innerHTML = '';

  projectTabs[lang].forEach((tabName, index) => {
    const li = document.createElement('li');
    li.textContent = tabName;
    li.setAttribute('role', 'tab');
    li.setAttribute('tabindex', '0');

    if (index === 0) {
      li.classList.add('active');
      contentContainer.innerHTML = '';
      paidProjects[lang].forEach((project) => {
        displayPaidProject(project, contentContainer);
      });
    }

    li.addEventListener('click', () => activateProjectTab(index, lang));
    li.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        activateProjectTab(index, lang);
      }
    });

    tabsContainer.appendChild(li);
  });
}

function activateProjectTab(index, lang) {
  const tabs = document.querySelectorAll('.main-projects-tabs li');
  const contentContainer = document.querySelector('.main-projects-content');

  tabs.forEach((tab) => tab.classList.remove('active'));
  tabs[index].classList.add('active');

  contentContainer.innerHTML = '';

  if (index === 0) {
    paidProjects[lang].forEach((project) => {
      displayPaidProject(project, contentContainer);
    });
  } else {
    filterAndDisplayRepositories('mainproject', 'main-projects-content');
  }
}
