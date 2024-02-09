import { filterAndDisplayRepositories } from './fetch.js';
import { workExperienceDetails } from './lang.js';
import { renderWorkExpText } from './workExp.js';

export function renderTabs(lang, tabsContent) {
  const wrapper = document.querySelector('.tabs-wrapper');
  const tabContent = document.querySelector('.tab-content');
  const tabContentWorkExp = document.querySelector('.tab-content-work-exp');
  wrapper.innerHTML = '';
  tabContent.innerHTML = '';
  tabContentWorkExp.innerHTML = '';

  tabsContent[lang].forEach((desc, index) => {
    const li = document.createElement('li');
    li.textContent = desc;
    if (index === 0) {
      li.classList.add('active');
      renderWorkExpText(lang, workExperienceDetails, 'tab-content-work-exp');
    }
    li.addEventListener('click', () => {
      document.querySelectorAll('.tabs-wrapper li').forEach((item) => {
        item.classList.remove('active');
      });
      li.classList.add('active');
      tabContent.innerHTML = '';
      tabContentWorkExp.innerHTML = '';

      try {
        if (index === 0) {
          renderWorkExpText(
            lang,
            workExperienceDetails,
            'tab-content-work-exp'
          );
        } else if (index === 1) {
          filterAndDisplayRepositories('sideproject', 'tab-content');
        } else if (index === 2) {
          filterAndDisplayRepositories('learn', 'tab-content');
        }
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    });

    wrapper.appendChild(li);
  });
}
