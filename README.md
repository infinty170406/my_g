# 💖 Site Web Romantique & Interactif pour Gabriel 💖

Ce projet est un mini-site web interactif, doux et extrêmement kawaii, conçu comme une lettre d'excuses personnalisée pour **Gabriel**. 

Il offre une expérience ludique et émotionnelle avec des transitions fluides, une pluie de cœurs et de bulles en 60 FPS, et un bouton joueur qui s'échappe lorsqu'on essaie de cliquer dessus.

---

## 📁 Structure des Fichiers

```text
├── index.html        # Structure de la page et des scènes
├── style.css         # Système de design kawaii, animations et responsive
├── script.js        # Logique interactive, particules Canvas et moteur audio
├── README.md         # Ce guide d'utilisation
├── audio/            # Dossier pour la musique de fond
│   └── sorry.mp3     # [Optionnel] Ajoutez votre fichier de musique ici !
├── assets/           # Dossier pour d'autres ressources
└── images/           # Dossier pour des images si nécessaire
```

---

## 🎵 Gestion de la Musique de Fond (Justin Bieber - Sorry)

Pour des raisons de droits d'auteur, la chanson originale de Justin Bieber n'est pas incluse par défaut. 

### Option 1 : Utiliser votre propre fichier (Recommandé)
1. Procurez-vous le fichier audio de **Sorry - Justin Bieber** (au format `.mp3`).
2. Renommez le fichier en `sorry.mp3`.
3. Placez-le dans le dossier `audio/` du projet.
4. Au clic sur **Start**, le site jouera automatiquement votre musique !

### Option 2 : Le synthétiseur "Boîte à Musique" (Fallback Automatique)
Si aucun fichier `audio/sorry.mp3` n'est détecté ou s'il y a un problème de chargement, le site utilise une **alternative magique** :
* Un synthétiseur codé avec l'**API Web Audio** du navigateur qui génère en temps réel une douce mélodie romantique rappelant une boîte à musique en cristal (sur une progression d'accords doux : *Fmaj7 - Cmaj7 - G6 - Am7*).
* Cela garantit que le site a toujours une ambiance sonore charmante, même sans fichier MP3 local !

---

## 🚀 Comment lancer le projet

Le site est entièrement statique (HTML, CSS et JavaScript pur). Vous pouvez le lancer de deux manières :

### Méthode A : Double-clic (Simple)
* Double-cliquez simplement sur le fichier `index.html` pour l'ouvrir dans votre navigateur préféré.
* *Note : Certains navigateurs bloquent la lecture de fichiers audio locaux via le protocole `file://`. Si le son ne joue pas du tout, utilisez la Méthode B.*

### Méthode B : Serveur Local (Recommandé pour tester l'audio)
Si vous possédez **Python** installé sur votre machine :
1. Ouvrez un terminal dans le dossier du projet.
2. Lancez la commande suivante :
   ```bash
   python3 -m http.server 8000
   ```
3. Ouvrez votre navigateur et allez sur `http://localhost:8000`.

---

## ✨ Fonctionnalités Kawaii & Détails Premium

* **Compte à rebours immersif** : Un compte à rebours dynamique "3, 2, 1, ❤️" plein écran avec effet de flou et zoom élastique.
* **Système de particules Canvas** : Une pluie infinie et fluide de petits cœurs et de bulles lumineuses qui oscillent doucement, avec un **effet de parallaxe** discret réagissant aux mouvements de la souris.
* **Le bouton fuyard "Pas encore"** : Le bouton s'échappe intelligemment vers des coordonnées aléatoires dans tout l'écran dès qu'on s'en approche, tout en affichant des bulles de texte amusantes ("Hihi 😜", "Tu es sûr ?", etc.). Il calcule ses trajectoires pour ne jamais sortir de l'écran et ne jamais sauter directement sous votre curseur (évitant ainsi les clics accidentels).
* **Instant magique "Je te pardonne"** : Déclenche une explosion de centaines de confettis multicolores et de petits cœurs volants, et illumine le fond du site d'une douce teinte dorée.
* **Curseur Cœur personnalisé** : Le curseur se transforme en un adorable petit cœur rose qui suit doucement la souris (désactivé automatiquement sur mobile pour le confort tactile).
* **Contrôle du volume** : Un bouton flottant discret en haut à droite permet d'activer ou de couper la musique à tout moment.
