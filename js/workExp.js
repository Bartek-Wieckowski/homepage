export function renderWorkExpText(lang, workExperienceDetails, target) {
  const container = document.querySelector(`.${target}`);

  workExperienceDetails[lang].forEach((experience) => {
    let template = document.createElement('article');
    template.setAttribute('class', 'work-experience-wrapper');

    template.innerHTML = `
    <div class="date-wrapper">
        <span class="date-work">${experience.startDate} - ${experience.endDate}</span>
    </div>
    <div class="company-wrapper">
        <h3 class="company-name">${experience.company}</h3>
        <p class="company-position">${experience.position}</p>
        <p class="company-technologies">${experience.technologies}</p>
        <ul class="company-description">
            ${experience.description
              .map((sentence) => `<li class="company-description-text">${sentence}</li>`)
              .join('')}
        </ul>
    </div>
  `;
    container.appendChild(template);
  });
}
