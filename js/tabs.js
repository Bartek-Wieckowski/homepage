export function renderTabs(lang, tabsContent) {
  const wrapper = document.querySelector('.tabs-wrapper');
  const tabContent = document.querySelector('.tab-content');
  wrapper.innerHTML = '';
  tabContent.innerHTML = '';

  tabsContent[lang].forEach((desc, index) => {
    const li = document.createElement('li');
    li.textContent = desc;
    if (index === 0) {
      li.classList.add('active');

      const content = document.createElement('div');
      content.textContent = `Content for ${desc}`;
      tabContent.appendChild(content);
    }
    li.addEventListener('click', () => {
      document.querySelectorAll('.tabs-wrapper li').forEach((item) => {
        item.classList.remove('active');
      });
      li.classList.add('active');

      tabContent.innerHTML = '';
      const content = document.createElement('div');
      content.textContent = `Content for ${desc}`;
      tabContent.appendChild(content);
    });

    wrapper.appendChild(li);
  });
}
