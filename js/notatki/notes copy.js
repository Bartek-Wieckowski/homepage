// ==========================================
// GLOBALNE ZMIENNE
// ==========================================

let ASSETS_BY_ID = {};

// ==========================================
// FUNKCJE FETCH
// ==========================================

async function fetchAllData() {
  try {
    const [categoriesRes, notesRes] = await Promise.all([
      fetch(
        `${BASE_URL}/entries?access_token=${ACCESS_TOKEN}&content_type=homepageCategories`
      ),
      fetch(
        `${BASE_URL}/entries?access_token=${ACCESS_TOKEN}&content_type=homepageNotes&include=2`
      ),
    ]);

    const categoriesData = await categoriesRes.json();
    const notesData = await notesRes.json();

    const assets = (notesData.includes && notesData.includes.Asset) || [];
    ASSETS_BY_ID = assets.reduce((acc, asset) => {
      acc[asset.sys.id] = asset;
      return acc;
    }, {});

    const allCategories = categoriesData.items.map((category) => ({
      id: category.sys.id,
      name: category.fields.categoryName,
      backgroundColor: category.fields.backgroundColor,
      textColor: category.fields.textColor,
    }));

    const allNotes = notesData.items.map((note) => ({
      id: note.sys.id,
      title: note.fields.title,
      content: note.fields.content,
      category: note.fields.category?.sys?.id,
    }));

    return {
      categories: allCategories,
      notes: allNotes,
    };
  } catch (error) {
    console.error("Błąd pobierania danych:", error);
    return null;
  }
}

async function fetchNote(noteId) {
  try {
    const response = await fetch(
      `${BASE_URL}/entries/${noteId}?access_token=${ACCESS_TOKEN}`
    );
    return await response.json();
  } catch (error) {
    console.error("Błąd pobierania notatki:", error);
    return null;
  }
}

// ==========================================
// FUNKCJE RENDEROWANIA
// ==========================================

function groupNotesByCategory(notes, categories) {
  const grouped = {};
  categories.forEach((cat) => {
    grouped[cat.id] = {
      name: cat.name,
      backgroundColor: cat.backgroundColor,
      textColor: cat.textColor,
      notes: [],
    };
  });

  notes.forEach((note) => {
    const categoryId = note.category;
    if (categoryId && grouped[categoryId]) {
      grouped[categoryId].notes.push(note);
    }
  });

  return grouped;
}

function renderCategories(groupedData) {
  const container = document.getElementById("categories-container");
  container.innerHTML = "";

  Object.keys(groupedData).forEach((catId) => {
    const category = groupedData[catId];
    const div = document.createElement("div");
    div.className = "category";
    div.textContent = category.name;

    div.addEventListener("click", () => {
      renderNotes(category.notes, {
        backgroundColor: category.backgroundColor,
        textColor: category.textColor,
      });
    });

    container.appendChild(div);
  });
}

function renderNotes(notes, categoryMeta, categoryColorsById) {
  const container = document.getElementById("notes-list");
  if (!container) return;

  container.innerHTML = "";

  if (!notes || notes.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><h2>Brak notatek w tej kategorii</h2></div>';
    return;
  }

  const grid = document.createElement("div");
  grid.className = "notes-grid";

  notes.forEach((note) => {
    const card = document.createElement("article");
    card.className = "note-card";

    const bg =
      categoryMeta?.backgroundColor ||
      categoryColorsById?.[note.category]?.backgroundColor;
    const color =
      categoryMeta?.textColor || categoryColorsById?.[note.category]?.textColor;

    if (bg) card.style.background = bg;
    if (color) card.style.color = color;

    const title = document.createElement("h3");
    title.className = "note-card-title";
    title.textContent = note.title || "Bez tytułu";

    const excerpt = document.createElement("p");
    excerpt.className = "note-card-excerpt";
    excerpt.textContent = getExcerptFromRichText(note.content, 160);

    card.appendChild(title);
    card.appendChild(excerpt);
    card.addEventListener("click", () => openNoteModal(note));

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

function getExcerptFromRichText(richText, maxLen) {
  const text = richTextToPlainText(richText).trim();
  if (!text) return "";
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

function richTextToPlainText(node) {
  if (!node) return "";
  if (Array.isArray(node)) return node.map(richTextToPlainText).join("");
  const { nodeType, content, value } = node;
  if (nodeType === "text") return value || "";
  if (content && Array.isArray(content)) {
    return content.map(richTextToPlainText).join(" ").replace(/\s+/g, " ");
  }
  return "";
}

// ==========================================
// MODAL Z NOTATKĄ
// ==========================================

function openNoteModal(noteFromList) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  const renderModal = (title, content) => {
    const html = convertRichTextToHTML(content);
    modal.innerHTML = `
      <button class="modal-close" aria-label="Zamknij">×</button>
      <div class="note-header"><h1>${title}</h1></div>
      <div class="note-content">${html}</div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Podświetlanie kodu po wyrenderowaniu
    Prism.highlightAll();

    const close = () => {
      document.removeEventListener("keydown", onKeyDown);
      overlay.remove();
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    modal.querySelector(".modal-close").addEventListener("click", close);
    document.addEventListener("keydown", onKeyDown);
  };

  if (noteFromList?.content) {
    renderModal(noteFromList.title, noteFromList.content);
  } else if (noteFromList?.id) {
    (async () => {
      const full = await fetchNote(noteFromList.id);
      if (!full) return;
      renderModal(full.fields.title, full.fields.content);
    })();
  }
}

// ==========================================
// KONWERSJA RICH TEXT → HTML
// ==========================================

function convertRichTextToHTML(richText) {
  if (!richText || !richText.content) return "";
  return richText.content.map((node) => convertNode(node)).join("");
}

// --- NOWA FUNKCJA: wykrywanie języka z formatowania ```ts / ```js / ```sql
function extractLanguageFromFencedCode(text) {
  const match = text.match(/^```(\w+)\n([\s\S]*)```$/m);
  if (!match) return { lang: null, code: text };
  return { lang: match[1], code: match[2] };
}

function convertNode(node) {
  const { nodeType, content, value, marks } = node;

  switch (nodeType) {
    case "paragraph":
      return `<p>${content ? content.map(convertNode).join("") : ""}</p>`;

    case "heading-1":
      return `<h1>${content.map(convertNode).join("")}</h1>`;

    case "heading-2":
      return `<h2>${content.map(convertNode).join("")}</h2>`;

    case "heading-3":
      return `<h3>${content.map(convertNode).join("")}</h3>`;

    case "unordered-list":
      return `<ul>${content.map(convertNode).join("")}</ul>`;

    case "ordered-list":
      return `<ol>${content.map(convertNode).join("")}</ol>`;

    case "list-item":
      return `<li>${content.map(convertNode).join("")}</li>`;

    case "blockquote":
      return `<blockquote>${content.map(convertNode).join("")}</blockquote>`;

    case "hr":
      return "<hr>";

    case "embedded-asset-block": {
      const targetId = node?.data?.target?.sys?.id;
      if (!targetId) return "";
      const asset = ASSETS_BY_ID[targetId];
      if (!asset?.fields?.file) return "";
      const url = asset.fields.file.url.startsWith("http")
        ? asset.fields.file.url
        : `https:${asset.fields.file.url}`;
      const alt = asset.fields.title || "";
      return `<figure><img src="${url}" alt="${alt}" /></figure>`;
    }

    case "text": {
      let text = value || "";

      if (marks && marks.length > 0) {
        marks.forEach((mark) => {
          switch (mark.type) {
            case "bold":
              text = `<strong>${text}</strong>`;
              break;
            case "italic":
              text = `<em>${text}</em>`;
              break;
            case "underline":
              text = `<u>${text}</u>`;
              break;
            case "code": {
              const fenced = extractLanguageFromFencedCode(text);
              const lang = node.data?.language || fenced.lang || "text";

              const safe = fenced.code
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

              if (safe.includes("\n")) {
                text = `<pre><code class="language-${lang}">${safe}</code></pre>`;
              } else {
                text = `<code class="language-${lang}">${safe}</code>`;
              }
              break;
            }
          }
        });
      }

      return text;
    }

    default:
      return "";
  }
}

// ==========================================
// INICJALIZACJA
// ==========================================

async function init() {
  const data = await fetchAllData();
  if (!data) return;

  const groupedData = groupNotesByCategory(data.notes, data.categories);
  renderCategories(groupedData);

  const categoryColorsById = Object.keys(groupedData).reduce((acc, catId) => {
    const c = groupedData[catId];
    acc[catId] = {
      backgroundColor: c.backgroundColor,
      textColor: c.textColor,
    };
    return acc;
  }, {});

  renderNotes(data.notes, undefined, categoryColorsById);

  // Podświetlenie kodu przy starcie
  Prism.highlightAll();
}

document.addEventListener("DOMContentLoaded", init);
