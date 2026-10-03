const scenes = [...document.querySelectorAll('.scene')];
const nextButtons = document.querySelectorAll('[data-next]');
const restartBtn = document.getElementById('restartBtn');
const progressBar = document.getElementById('progressBar');
const audio = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');

let currentScene = 0;
let musicStarted = false;

// Volume par défaut doux
if (audio) {
  try {
    audio.volume = 0.7;
  } catch (e) {
    // Les navigateurs mobiles ignorent l'affectation du volume
  }
}

function updateProgressBar() {
  if (!progressBar || scenes.length <= 1) return;
  const progressPercent = (currentScene / (scenes.length - 1)) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

function showScene(index) {
  if (index < 0 || index >= scenes.length) return;

  scenes[currentScene].classList.remove('active');
  currentScene = index;
  scenes[currentScene].scrollTop = 0;
  scenes[currentScene].classList.add('active');

  updateProgressBar();
}

function setMusicUIPlaying() {
  musicStarted = true;
  if (musicToggle) {
    musicToggle.classList.add('playing');
    musicToggle.setAttribute('aria-pressed', 'true');
  }
  if (musicLabel) {
    musicLabel.textContent = 'Mettre en pause';
  }
}

function setMusicUIPaused() {
  if (musicToggle) {
    musicToggle.classList.remove('playing');
    musicToggle.setAttribute('aria-pressed', 'false');
  }
  if (musicLabel) {
    musicLabel.textContent = musicStarted ? 'Reprendre la musique' : 'Activer la musique';
  }
}

async function playMusicFromUserGesture() {
  if (!audio) return false;
  try {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      await playPromise;
    }
    setMusicUIPlaying();
    return true;
  } catch (error) {
    console.warn('Lecture audio bloquée ou non prête :', error);
    setMusicUIPaused();
    return false;
  }
}

function pauseMusic() {
  if (!audio) return;
  audio.pause();
  setMusicUIPaused();
}

// Synchronisation native avec les événements de l'élément audio
if (audio) {
  audio.addEventListener('play', setMusicUIPlaying);
  audio.addEventListener('pause', setMusicUIPaused);
  audio.addEventListener('error', (event) => {
    console.warn('Erreur de chargement audio :', audio.error || event);
    if (musicLabel) musicLabel.textContent = 'Musique indisponible';
    if (musicToggle) {
      musicToggle.classList.remove('playing');
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  });
}

// Boutons "Commencer" et "Continuer"
nextButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (currentScene === 0 && !musicStarted && audio && audio.paused) {
      playMusicFromUserGesture();
    }
    showScene(currentScene + 1);
  });
});

// Bouton "Recommencer" sur la dernière scène
if (restartBtn) {
  restartBtn.addEventListener('click', () => {
    showScene(0);
  });
}

// Bouton de contrôle manuel de la musique
if (musicToggle) {
  musicToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (!audio) return;

    if (audio.paused) {
      playMusicFromUserGesture();
    } else {
      pauseMusic();
    }
  });
}

// Navigation clavier accessible et sans conflit avec le focus des boutons
document.addEventListener('keydown', (event) => {
  const isButtonFocused = ['BUTTON', 'A'].includes(document.activeElement?.tagName);

  if ((event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') && currentScene < scenes.length - 1) {
    event.preventDefault();
    if (currentScene === 0 && !musicStarted && audio && audio.paused) {
      playMusicFromUserGesture();
    }
    showScene(currentScene + 1);
  } else if ((event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') && currentScene > 0) {
    event.preventDefault();
    showScene(currentScene - 1);
  } else if (event.key === ' ' && !isButtonFocused && currentScene < scenes.length - 1) {
    event.preventDefault();
    if (currentScene === 0 && !musicStarted && audio && audio.paused) {
      playMusicFromUserGesture();
    }
    showScene(currentScene + 1);
  } else if (event.key === 'Home') {
    event.preventDefault();
    showScene(0);
  } else if (event.key === 'End') {
    event.preventDefault();
    showScene(scenes.length - 1);
  }
});

// Support des gestes tactiles (swipe gauche/droite) sur mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (event) => {
  if (!event.changedTouches || event.changedTouches.length === 0) return;
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (event) => {
  if (!event.changedTouches || event.changedTouches.length === 0) return;
  touchEndX = event.changedTouches[0].screenX;
  touchEndY = event.changedTouches[0].screenY;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  // On vérifie qu'il s'agit d'un glissement horizontal net (au moins 45px et plus horizontal que vertical)
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
    if (diffX < 0 && currentScene < scenes.length - 1) {
      // Glissement vers la gauche -> scène suivante
      if (currentScene === 0 && !musicStarted && audio && audio.paused) {
        playMusicFromUserGesture();
      }
      showScene(currentScene + 1);
    } else if (diffX > 0 && currentScene > 0) {
      // Glissement vers la droite -> scène précédente
      showScene(currentScene - 1);
    }
  }
}
