function renderAboutMeHeader(lang) {
  const header = document.createElement("h2");
  header.textContent = lang === "EN" ? "About" : "O mnie";
  return header;
}

function renderTechnologiesLogos(techData) {
  const container = document.createElement("div");
  container.classList.add("technologies-logos");

  techData.logos.forEach((tech) => {
    const logoWrapper = document.createElement("div");
    logoWrapper.classList.add("logo-wrapper");

    const img = document.createElement("img");
    img.src = tech.path;
    img.alt = tech.name;
    img.classList.add("tech-logo");

    if (tech.animation === "spin") {
      img.classList.add("spin-animation");
    }

    const tooltip = document.createElement("div");
    tooltip.classList.add("tooltip");
    tooltip.textContent = tech.name;

    logoWrapper.appendChild(img);
    logoWrapper.appendChild(tooltip);
    container.appendChild(logoWrapper);
  });

  return container;
}

export function renderAboutMeText(lang, aboutDescribe) {
  const wrapper = document.querySelector(".me-about-wrapper");
  wrapper.innerHTML = "";

  const header = renderAboutMeHeader(lang);
  wrapper.appendChild(header);

  aboutDescribe[lang].forEach((desc, index, array) => {
    // Check if this is a technologies object
    if (typeof desc === "object" && desc.type === "technologies") {
      const techContainer = renderTechnologiesLogos(desc);
      wrapper.appendChild(techContainer);
    } else {
      const p = document.createElement("p");
      p.textContent = desc;

      if (index === array.length - 1) {
        const icon = document.createElement("i");
        icon.classList.add("bx", "bx-redo");
        icon.setAttribute("role", "tab");
        icon.setAttribute("tabindex", "0");
        p.appendChild(icon);

        const scrollToTabsSection = () => {
          const tabsSection = document.querySelector(".main-projects");
          if (tabsSection) {
            tabsSection.scrollIntoView({ behavior: "smooth" });
          }
        };

        icon.addEventListener("click", scrollToTabsSection);

        icon.addEventListener("keypress", (event) => {
          if (event.key === "Enter") {
            scrollToTabsSection();
          }
        });
      }
      wrapper.appendChild(p);
    }
  });
}
