const scenes = [...document.querySelectorAll('.scene')];
const nextButtons = document.querySelectorAll('[data-next]');
const progressBar = document.getElementById('progressBar');
const audio = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');

let currentScene = 0;
let musicStarted = false;

function showScene(index) {
  if (index < 0 || index >= scenes.length) return;
  scenes[currentScene].classList.remove('active');
  currentScene = index;
  scenes[currentScene].scrollTop = 0;
  scenes[currentScene].classList.add('active');
  progressBar.style.width = `${(currentScene / (scenes.length - 1)) * 100}%`;
}

nextButtons.forEach(btn => {
  btn.addEventListener('click', () => showScene(currentScene + 1));
});

// 5 minutes et 25 secondes = (5 * 60) + 25 = 325 secondes
const START_TIME = 325;

function setInitialTime() {
  if (audio.currentTime < START_TIME) {
    try {
      audio.currentTime = START_TIME;
    } catch (e) {
      // Ignorer si les métadonnées audio ne sont pas encore prêtes
    }
  }
}

audio.addEventListener('loadedmetadata', setInitialTime);
audio.addEventListener('canplay', setInitialTime);

async function playAudio() {
  try {
    setInitialTime();
    await audio.play();
    musicStarted = true;
    musicToggle.classList.add('playing');
    musicToggle.setAttribute('aria-pressed', 'true');
    musicLabel.textContent = 'Mettre en pause';
  } catch (error) {
    // Les navigateurs bloquent souvent la lecture automatique sans interaction préalable
    console.log("Lecture automatique en attente d'une première interaction...");
  }
}

function pauseAudio() {
  audio.pause();
  musicToggle.classList.remove('playing');
  musicToggle.setAttribute('aria-pressed', 'false');
  musicLabel.textContent = musicStarted ? 'Reprendre la musique' : 'Activer la musique';
}

// Tentative de lancement direct au chargement du site
window.addEventListener('DOMContentLoaded', () => {
  setInitialTime();
  playAudio();
});

// En cas de blocage d'autoplay par la sécurité du navigateur : démarre dès le premier clic/touche
const startOnFirstInteraction = () => {
  if (audio.paused && !musicStarted) {
    playAudio();
  }
  window.removeEventListener('click', startOnFirstInteraction);
  window.removeEventListener('keydown', startOnFirstInteraction);
  window.removeEventListener('touchstart', startOnFirstInteraction);
};

window.addEventListener('click', startOnFirstInteraction);
window.addEventListener('keydown', startOnFirstInteraction);
window.addEventListener('touchstart', startOnFirstInteraction);

musicToggle.addEventListener('click', (e) => {
  e.stopPropagation(); // Évite le double déclenchement
  if (audio.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
});

// Navigation clavier discrète.
document.addEventListener('keydown', (event) => {
  if ((event.key === 'ArrowRight' || event.key === 'Enter') && currentScene < scenes.length - 1) {
    showScene(currentScene + 1);
  }
  if (event.key === 'ArrowLeft' && currentScene > 0) {
    showScene(currentScene - 1);
  }
});
