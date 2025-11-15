const engines = {

  youtube: {
    name: 'YouTube',
    query: q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
  },
  google: {
    name: 'Google',
    query: q => `https://www.google.com/search?q=${encodeURIComponent(q)}`
  },
  duckduckgo: {
    name: 'DuckDuckGo',
    query: q => `https://duckduckgo.com/?q=${encodeURIComponent(q)}`
  },
  startpage: {
    name: 'Startpage',
    query: q => `https://www.startpage.com/do/search?q=${encodeURIComponent(q)}`
  }
};

const defaultEngine = 'youtube';
let selected = defaultEngine;

const engineButtons = document.querySelectorAll('.engine-btn');
const input = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function setActiveEngine(name) {
  selected = name;
  engineButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.engine === name);
    btn.setAttribute('aria-pressed', btn.dataset.engine === name ? 'true' : 'false');
  });
  input.placeholder = `Search with ${engines[name].name}...`;
}

// Initialize
setActiveEngine(defaultEngine);

// Click on icons
engineButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const eng = btn.dataset.engine;
    setActiveEngine(eng);
    input.focus();
  });

  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

function doSearch() {
  const q = input.value.trim();
  if (!q) return;
  const url = engines[selected].query(q);
  window.location.href = url; // same tab
}

// Enter key
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    doSearch();
  }
});

// Search button
searchBtn.addEventListener('click', e => {
  e.preventDefault();
  doSearch();
});

// Shortcut: Ctrl/Cmd + K focuses input
window.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    input.focus();
  }
});
