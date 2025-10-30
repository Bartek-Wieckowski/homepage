// ==========================================
// KONFIGURACJA CONTENTFUL
// ==========================================

// ==========================================
// FUNKCJE FETCH
// ==========================================

// Pobierz wszystkie kategorie i notatki
async function fetchAllData() {
  try {
    // Równoległe pobieranie kategorii i notatek
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

    const allCategories = categoriesData.items.map((category) => {
      return {
        id: category.sys.id,
        name: category.fields.categoryName,
      };
    });

    const allNotes = notesData.items.map((note) => {
      return {
        id: note.sys.id,
        title: note.fields.title,
        content: note.fields.content,
        category: note.fields.category?.sys?.id,
      };
    });

    return {
      categories: allCategories,
      notes: allNotes,
    };
  } catch (error) {
    console.error("Błąd pobierania danych:", error);
    return null;
  }
}

// Pobierz konkretną notatkę po ID
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

// Pogrupuj notatki według kategorii
function groupNotesByCategory(notes, categories) {
  const grouped = {};

  categories.forEach((cat) => {
    grouped[cat.id] = {
      name: cat.name,
      notes: [],
    };
  });

  notes.forEach((note) => {
    const categoryId = note.category; // używamy nowego pola
    if (categoryId && grouped[categoryId]) {
      grouped[categoryId].notes.push(note);
    }
  });

  return grouped;
}

// Renderuj sidebar z kategoriami
function renderCategories(groupedData) {
  const container = document.getElementById("categories-container");
  container.innerHTML = "";

  Object.keys(groupedData).forEach((catId) => {
    const category = groupedData[catId];

    const div = document.createElement("div");
    div.className = "category";
    div.textContent = category.name;

    div.addEventListener("click", () => {
      renderNotes(category.notes);
    });

    container.appendChild(div);
  });
}
function renderNotes(notes) {
  const container = document.getElementById("notes-container");
  if (!container) return; // <- zabezpieczenie

  container.innerHTML = "";

  if (!notes.length) {
    container.innerHTML = "<p>Brak notatek w tej kategorii</p>";
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "note-list";

  notes.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note.title;
    li.addEventListener("click", () => displayNote(note.id));
    ul.appendChild(li);
  });

  container.appendChild(ul);

  // automatycznie klikamy pierwszą notatkę
  ul.querySelector("li")?.click();
}

// Wyświetl notatkę
async function displayNote(noteId) {
  const container = document.getElementById("note-container");
  container.innerHTML = '<div class="loading">Ładowanie notatki</div>';

  const note = await fetchNote(noteId);

  if (!note) {
    container.innerHTML =
      '<div class="empty-state"><h2>Błąd ładowania notatki</h2></div>';
    return;
  }

  const { title, content, category } = note.fields;

  // Konwertuj Rich Text z Contentful na HTML
  const richContent = convertRichTextToHTML(content);

  // Formatuj datę

  container.innerHTML = `
        <div class="note-header">
            <h1>${title}</h1>
            <p>${category?.sys?.id}</p>
            
        </div>
        <div class="note-content">
            ${richContent}
        </div>
    `;
}

// ==========================================
// KONWERSJA RICH TEXT → HTML
// ==========================================

function convertRichTextToHTML(richText) {
  if (!richText || !richText.content) return "";

  return richText.content.map((node) => convertNode(node)).join("");
}

function convertNode(node) {
  const { nodeType, content, value, marks } = node;

  // Obsługa różnych typów node'ów
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

    case "text":
      let text = value;

      // Obsługa formatowania (bold, italic, code, itp.)
      if (marks && marks.length > 0) {
        marks.forEach((mark) => {
          switch (mark.type) {
            case "bold":
              text = `<strong>${text}</strong>`;
              break;
            case "italic":
              text = `<em>${text}</em>`;
              break;
            case "code":
              text = `<code>${text}</code>`;
              break;
            case "underline":
              text = `<u>${text}</u>`;
              break;
          }
        });
      }

      return text;

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

  // Tworzymy grupowanie
  const groupedData = groupNotesByCategory(data.notes, data.categories);

  // Renderujemy kategorie i podpinamy notatki
  renderCategories(groupedData);

  // Automatycznie klikamy pierwszą kategorię, żeby wyświetlić notatki
  const firstCategoryId = Object.keys(groupedData)[0];
  if (firstCategoryId) {
    renderNotes(groupedData[firstCategoryId].notes);
  }
}

// Uruchom po załadowaniu strony
document.addEventListener("DOMContentLoaded", init);
