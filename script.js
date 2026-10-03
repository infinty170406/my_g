const scenes = [...document.querySelectorAll('.scene')];
const nextButtons = document.querySelectorAll('[data-next]');
const progressBar = document.getElementById('progressBar');
const audio = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicLabel = document.getElementById('musicLabel');

let currentScene = 0;
let musicStarted = false;
let hasSetInitialTime = false;
let userGestureReady = false;

const START_TIME = 325;

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

function applyStartTimeIfNeeded() {
  if (!audio || hasSetInitialTime) return;

  if (audio.duration && !isNaN(audio.duration)) {
    if (START_TIME < audio.duration) {
      audio.currentTime = START_TIME;
    } else {
      console.warn(`Le fichier audio actuel dure ${Math.round(audio.duration)}s (inférieur à 5m25s). Début à 0s.`);
      audio.currentTime = 0;
    }
    hasSetInitialTime = true;
    return;
  }

  try {
    audio.currentTime = START_TIME;
    hasSetInitialTime = true;
  } catch (e) {
    // En attente du chargement des métadonnées
  }
}

async function playMusicFromUserGesture() {
  if (!audio) return false;

  applyStartTimeIfNeeded();

  try {
    if (audio.readyState === 0) {
      audio.load();
    }

    await audio.play();
    setMusicUIPlaying();
    return true;
  } catch (error) {
    console.warn('Lecture audio bloquée par le navigateur :', error);
    setMusicUIPaused();
    return false;
  }
}

function pauseMusic() {
  if (!audio) return;
  audio.pause();
  setMusicUIPaused();
}

function handleFirstUserInteraction() {
  if (userGestureReady) return;
  userGestureReady = true;

  if (!audio) return;

  try {
    audio.volume = 0.7;
    audio.muted = false;
  } catch (e) {
    // Certains navigateurs mobile refusent de modifier le volume avant lecture
  }

  if (audio.paused && !musicStarted) {
    if (audio.readyState >= 2) {
      playMusicFromUserGesture();
    } else {
      const retryAudioStart = () => {
        if (audio && audio.paused && !musicStarted) {
          playMusicFromUserGesture();
        }
      };

      audio.addEventListener('loadedmetadata', retryAudioStart, { once: true });
      audio.addEventListener('canplay', retryAudioStart, { once: true });
    }
  }
}

if (audio) {
  audio.volume = 0.7;
  audio.muted = false;

  audio.addEventListener('loadedmetadata', () => {
    applyStartTimeIfNeeded();
    if (userGestureReady && audio.paused && !musicStarted) {
      playMusicFromUserGesture();
    }
  });

  audio.addEventListener('canplay', () => {
    applyStartTimeIfNeeded();
    if (userGestureReady && audio.paused && !musicStarted) {
      playMusicFromUserGesture();
    }
  });

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

nextButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    handleFirstUserInteraction();

    if (currentScene === 0 && !musicStarted && audio && audio.paused) {
      playMusicFromUserGesture();
    }

    if (currentScene < scenes.length - 1) {
      showScene(currentScene + 1);
    }
  });
});

if (musicToggle) {
  musicToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    handleFirstUserInteraction();

    if (!audio) return;

    if (audio.paused) {
      playMusicFromUserGesture();
    } else {
      pauseMusic();
    }
  });
}

window.addEventListener('click', handleFirstUserInteraction, { once: true });
window.addEventListener('touchstart', handleFirstUserInteraction, { once: true });
window.addEventListener('keydown', handleFirstUserInteraction, { once: true });

document.addEventListener('keydown', (event) => {
  if ((event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown') && currentScene < scenes.length - 1) {
    event.preventDefault();
    handleFirstUserInteraction();

    if (currentScene === 0 && !musicStarted && audio && audio.paused) {
      playMusicFromUserGesture();
    }

    showScene(currentScene + 1);
  } else if ((event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp') && currentScene > 0) {
    event.preventDefault();
    showScene(currentScene - 1);
  } else if (event.key === ' ' && currentScene < scenes.length - 1) {
    event.preventDefault();
    handleFirstUserInteraction();

    if (currentScene === 0 && !musicStarted && audio && audio.paused) {
      playMusicFromUserGesture();
    }

    showScene(currentScene + 1);
  }
});

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

  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
    if (diffX < 0 && currentScene < scenes.length - 1) {
      handleFirstUserInteraction();

      if (currentScene === 0 && !musicStarted && audio && audio.paused) {
        playMusicFromUserGesture();
      }

      showScene(currentScene + 1);
    } else if (diffX > 0 && currentScene > 0) {
      showScene(currentScene - 1);
    }
  }
}