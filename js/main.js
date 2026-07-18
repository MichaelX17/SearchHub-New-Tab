// ===== PERFILES DE COLOR =====
const profiles = {
  'azul-morado': {
    flare1: '#1e3a8a',
    flare2: '#7c3aed',
    bg: '#0a0a1a'
  },
  'rojo-negro': {
    flare1: '#dc2626',
    flare2: '#111827',
    bg: '#1a0a0a'
  },
  'rosa-blanco': {
    flare1: '#ec4899',
    flare2: '#f3f4f6',
    bg: '#1a0a14'
  },
  'verde-azul': {
    flare1: '#059669',
    flare2: '#38bdf8',
    bg: '#0a1a0a'
  },
  'naranja-amarillo': {
    flare1: '#ea580c',
    flare2: '#facc15',
    bg: '#1a100a'
  }
};

// Estado actual
let currentProfile = 'azul-morado';
const defaultProfile = 'azul-morado';

// Elementos del DOM
const root = document.documentElement;
const flare1 = document.querySelector('.flare1');
const flare2 = document.querySelector('.flare2');
const profileBtns = document.querySelectorAll('.profile-btn');
const brandMark = document.getElementById('brandMark');
const searchBtn = document.getElementById('searchBtn');

// ===== APLICAR PERFIL =====
function applyProfile(profileName) {
  const profile = profiles[profileName];
  if (!profile) return;

  currentProfile = profileName;

  // Colores de los flares
  root.style.setProperty('--flare1', profile.flare1);
  root.style.setProperty('--flare2', profile.flare2);

  // Fondo de la página
  root.style.background = profile.bg;

  // Actualizar el logo (gradiente)
  brandMark.style.background = `linear-gradient(135deg, ${profile.flare1}, ${profile.flare2})`;

  // Actualizar botón de búsqueda
  searchBtn.style.background = `linear-gradient(90deg, ${profile.flare1}, ${profile.flare2})`;

  // Activar botón correspondiente en el selector
  profileBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.profile === profileName);
  });

  // Guardar preferencia
  try {
    localStorage.setItem('selectedProfile', profileName);
  } catch (e) { /* ignore */ }
}

// ===== MOVIMIENTO ALEATORIO DE FLARES =====
function moveFlares() {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Rango de movimiento: -30% a +30% del viewport en X e Y
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

// ===== INICIALIZAR =====
// Cargar perfil guardado
let savedProfile = localStorage.getItem('selectedProfile');
if (!savedProfile || !profiles[savedProfile]) {
  savedProfile = defaultProfile;
}
applyProfile(savedProfile);

// Mover flares al inicio y luego cada 5 segundos
moveFlares();
setInterval(moveFlares, 5000);

// Recalcular al redimensionar (para ajustar rangos)
window.addEventListener('resize', moveFlares);

// ===== SELECTOR DE PERFILES =====
profileBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const profile = btn.dataset.profile;
    if (profile && profiles[profile]) {
      applyProfile(profile);
      // Reiniciamos la posición de los flares para que se muevan desde su posición actual
      // pero como la transición es suave, simplemente forzamos un nuevo movimiento después de un breve delay
      setTimeout(moveFlares, 100);
    }
  });
});

// ===== LÓGICA DE BÚSQUEDA (EXISTENTE) =====
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

// Atajo Ctrl/Cmd + K
window.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    input.focus();
  }
});
