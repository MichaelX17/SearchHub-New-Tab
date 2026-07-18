// ===== COLOR PROFILES =====
const profiles = {
  'blue-purple': {
    flare1: '#1e3a8a',
    flare2: '#7c3aed',
    bg: '#0a0a1a'
  },
  'red-black': {
    flare1: '#dc2626',
    flare2: '#111827',
    bg: '#1a0a0a'
  },
  'pink-white': {
    flare1: '#ec4899',
    flare2: '#f3f4f6',
    bg: '#1a0a14'
  },
  'green-blue': {
    flare1: '#059669',
    flare2: '#38bdf8',
    bg: '#0a1a0a'
  },
  'orange-yellow': {
    flare1: '#ea580c',
    flare2: '#facc15',
    bg: '#1a100a'
  }
};

// Current state
let currentProfile = 'blue-purple';
const defaultProfile = 'blue-purple';

// DOM elements
const root = document.documentElement;
const flare1 = document.querySelector('.flare1');
const flare2 = document.querySelector('.flare2');
const profileBtns = document.querySelectorAll('.profile-btn');
const brandMark = document.getElementById('brandMark');
const searchBtn = document.getElementById('searchBtn');

// ===== APPLY PROFILE =====
function applyProfile(profileName) {
  const profile = profiles[profileName];
  if (!profile) return;

  currentProfile = profileName;

  // Flare colors
  root.style.setProperty('--flare1', profile.flare1);
  root.style.setProperty('--flare2', profile.flare2);

  // Page background
  root.style.background = profile.bg;

  // Update logo gradient
  brandMark.style.background = `linear-gradient(135deg, ${profile.flare1}, ${profile.flare2})`;

  // Update search button
  searchBtn.style.background = `linear-gradient(90deg, ${profile.flare1}, ${profile.flare2})`;

  // Toggle active class on profile buttons
  profileBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.profile === profileName);
  });

  // Save preference
  try {
    localStorage.setItem('selectedProfile', profileName);
  } catch (e) { /* ignore */ }
}

// ===== RANDOM FLARE MOVEMENT =====
function moveFlares() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const rangeX = vw * 0.3;
  const rangeY = vh * 0.3;

  const rand = (min, max) => Math.random() * (max - min) + min;

  const x1 = rand(-rangeX, rangeX);
  const y1 = rand(-rangeY, rangeY);
  const x2 = rand(-rangeX, rangeX);
  const y2 = rand(-rangeY, rangeY);

  flare1.style.transform = `translate(${x1}px, ${y1}px)`;
  flare2.style.transform = `translate(${x2}px, ${y2}px)`;
}

// ===== INITIALIZATION =====
// Load saved profile
let savedProfile = localStorage.getItem('selectedProfile');
if (!savedProfile || !profiles[savedProfile]) {
  savedProfile = defaultProfile;
}
applyProfile(savedProfile);

// Initial flare movement and interval
moveFlares();
setInterval(moveFlares, 5000);

// Recalculate on resize
window.addEventListener('resize', moveFlares);

// ===== PROFILE SELECTOR EVENTS =====
profileBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const profile = btn.dataset.profile;
    if (profile && profiles[profile]) {
      applyProfile(profile);
      setTimeout(moveFlares, 100);
    }
  });
});

// ===== SEARCH ENGINE LOGIC (unchanged) =====
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
const searchBtnAction = document.getElementById('searchBtn');

function setActiveEngine(name) {
  selected = name;
  engineButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.engine === name);
    btn.setAttribute('aria-pressed', btn.dataset.engine === name ? 'true' : 'false');
  });
  input.placeholder = `Search with ${engines[name].name}...`;
}

setActiveEngine(defaultEngine);

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
  window.location.href = url;
}

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    doSearch();
  }
});

searchBtnAction.addEventListener('click', e => {
  e.preventDefault();
  doSearch();
});

// Shortcut: Ctrl/Cmd + K
window.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    input.focus();
  }
});
