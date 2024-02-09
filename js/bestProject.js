import { filterAndDisplayRepositories } from './fetch.js';
export function renderBestProjects() {
  filterAndDisplayRepositories('mainproject', 'main-projects-content');
}
