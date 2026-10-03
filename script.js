const scenes = [...document.querySelectorAll('.scene')];
const nextButtons = document.querySelectorAll('[data-next]');
const progressBar = document.getElementById('progressBar');
const audio = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');

let currentScene = 0;
let musicStarted = false;
let hasSetInitialTime = false;

// 5 minutes et 25 secondes = (5 * 60) + 25 = 325 secondes
const START_TIME = 325;

function showScene(index) {
  if (index < 0 || index >= scenes.length) return;
  scenes[currentScene].classList.remove('active');
  currentScene = index;
  scenes[currentScene].scrollTop = 0;
  scenes[currentScene].classList.add('active');
  progressBar.style.width = `${(currentScene / (scenes.length - 1)) * 100}%`;
}

function applyStartTimeIfNeeded() {
  if (!hasSetInitialTime) {
    if (audio.duration && !isNaN(audio.duration)) {
      if (START_TIME < audio.duration) {
        audio.currentTime = START_TIME;
      } else {
        console.warn(`Le fichier audio actuel dure ${Math.round(audio.duration)}s (inférieur à 5m25s). Début à 0s.`);
        audio.currentTime = 0;
      }
      hasSetInitialTime = true;
    } else {
      try {
        audio.currentTime = START_TIME;
        hasSetInitialTime = true;
      } catch (e) {
        // En attente du chargement des métadonnées
      }
    }
  }
}

audio.addEventListener('loadedmetadata', () => {
  applyStartTimeIfNeeded();
});

audio.addEventListener('canplay', () => {
  applyStartTimeIfNeeded();
});

async function playAudio() {
  applyStartTimeIfNeeded();
  try {
    await audio.play();
    musicStarted = true;
    musicToggle.classList.add('playing');
    musicToggle.setAttribute('aria-pressed', 'true');
    musicLabel.textContent = 'Mettre en pause';
  } catch (error) {
    console.log("Lecture automatique en attente d'une interaction utilisateur.");
  }
}

function pauseAudio() {
  audio.pause();
  musicToggle.classList.remove('playing');
  musicToggle.setAttribute('aria-pressed', 'false');
  musicLabel.textContent = musicStarted ? 'Reprendre la musique' : 'Activer la musique';
}

// Clic direct sur les boutons Continuer / Commencer
nextButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (audio.paused && !musicStarted) {
      playAudio();
    }
    showScene(currentScene + 1);
  });
});

// Bouton toggle musique
musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (audio.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
});

// Tentative d'autoplay au chargement
window.addEventListener('DOMContentLoaded', () => {
  playAudio();
});

// Déclenchement au premier clic ou appui n'importe où
const startOnFirstGesture = () => {
  if (audio.paused && !musicStarted) {
    playAudio();
  }
  window.removeEventListener('click', startOnFirstGesture);
  window.removeEventListener('touchstart', startOnFirstGesture);
  window.removeEventListener('keydown', startOnFirstGesture);
};

window.addEventListener('click', startOnFirstGesture);
window.addEventListener('touchstart', startOnFirstGesture);
window.addEventListener('keydown', startOnFirstGesture);

// Navigation clavier discrète
document.addEventListener('keydown', (event) => {
  if ((event.key === 'ArrowRight' || event.key === 'Enter') && currentScene < scenes.length - 1) {
    if (audio.paused && !musicStarted) {
      playAudio();
    }
    showScene(currentScene + 1);
  }
  if (event.key === 'ArrowLeft' && currentScene > 0) {
    showScene(currentScene - 1);
  }
});
