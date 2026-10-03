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

async function playAudio() {
  try {
    await audio.play();
    musicStarted = true;
    musicToggle.classList.add('playing');
    musicToggle.setAttribute('aria-pressed', 'true');
    musicLabel.textContent = 'Mettre en pause';
  } catch (error) {
    console.log("Lecture audio en attente d'une action utilisateur.");
  }
}

function pauseAudio() {
  audio.pause();
  musicToggle.classList.remove('playing');
  musicToggle.setAttribute('aria-pressed', 'false');
  musicLabel.textContent = musicStarted ? 'Reprendre la musique' : 'Activer la musique';
}

// Clic direct sur les boutons Commencer / Continuer
nextButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (audio.paused) {
      playAudio();
    }
    showScene(currentScene + 1);
  });
});

// Bouton toggle musique en haut
musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (audio.paused) {
    playAudio();
  } else {
    pauseAudio();
  }
});

// Navigation clavier
document.addEventListener('keydown', (event) => {
  if ((event.key === 'ArrowRight' || event.key === 'Enter') && currentScene < scenes.length - 1) {
    if (audio.paused) {
      playAudio();
    }
    showScene(currentScene + 1);
  }
  if (event.key === 'ArrowLeft' && currentScene > 0) {
    showScene(currentScene - 1);
  }
});
