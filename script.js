/**
 * Pour Gabriel ❤️ - Cinematic Apology Interactive Experience
 * Premium direction: Apple-Disney style transitions, 3D envelope opening, 
 * phrase-by-phrase slow narrative, canvas bokeh background, and Web Audio API fallback.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const customCursor = document.getElementById('customCursor');
    const cursorDot = customCursor?.querySelector('.cursor-dot');
    const cursorHalo = customCursor?.querySelector('.cursor-halo');
    
    const sceneWelcome = document.getElementById('scene-welcome');
    const sceneCountdown = document.getElementById('scene-countdown');
    const sceneLetter = document.getElementById('scene-letter');
    const sceneSuccess = document.getElementById('scene-success');
    const sceneFinal = document.getElementById('scene-final');
    
    const moonStartBtn = document.getElementById('moonStartBtn');
    const countdownNumber = document.getElementById('countdownNumber');
    
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const envelopeTop = document.getElementById('envelopeTop');
    const envelopeSeal = document.getElementById('envelopeSeal');
    const letterPreview = document.getElementById('letterPreview');
    const letterCard = document.getElementById('letterCard');
    
    const narrativeContainer = document.getElementById('narrativeContainer');
    const letterButtons = document.getElementById('letterButtons');
    const acceptBtn = document.getElementById('acceptBtn');
    const declineBtn = document.getElementById('declineBtn');
    const escapeBtnWrapper = document.getElementById('escapeBtnWrapper');
    const escapeTooltip = document.getElementById('escapeTooltip');

    // Canvas Setup
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    
    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });

    // ==========================================
    // ELEGANT CUSTOM CURSOR INTERPOLATION
    // ==========================================
    let mouseX = width / 2;
    let mouseY = height / 2;
    let currentX = width / 2;
    let currentY = width / 2;
    
    let targetMouseX = width / 2;
    let targetMouseY = width / 2;

    window.addEventListener('mousemove', (e) => {
        targetMouseX = e.clientX;
        targetMouseY = e.clientY;
    });

    // Smooth trailing halo cursor
    function updateCursor() {
        // Linear interpolation for cursor halo lag
        currentX += (targetMouseX - currentX) * 0.15;
        currentY += (targetMouseY - currentY) * 0.15;

        if (customCursor) {
            if (cursorDot) {
                cursorDot.style.left = `${targetMouseX}px`;
                cursorDot.style.top = `${targetMouseY}px`;
            }
            if (cursorHalo) {
                cursorHalo.style.left = `${currentX}px`;
                cursorHalo.style.top = `${currentY}px`;
            }
        }
        requestAnimationFrame(updateCursor);
    }
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
        updateCursor();
    } else if (customCursor) {
        customCursor.style.display = 'none';
    }

    // Cursor hover states
    const hoverElements = document.querySelectorAll('button, .capsule-btn, .giant-moon, .envelope-wrapper');
    hoverElements.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            if (customCursor) customCursor.classList.add('hover');
        });
        elem.addEventListener('mouseleave', () => {
            if (customCursor) customCursor.classList.remove('hover');
        });
    });

    // ==========================================
    // CANVAS BACKGROUND: BOKEH & RARE HEART PARTICLES
    // ==========================================
    const particles = [];
    const maxParticles = 30; // Fewer particles for a cleaner look

    class BokehParticle {
        constructor() {
            this.reset();
            this.y = Math.random() * height;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + 20 + Math.random() * 100;
            this.radius = 20 + Math.random() * 60; // Large blurred spots
            this.speed = 0.2 + Math.random() * 0.5;
            this.opacity = 0.05 + Math.random() * 0.15; // Extremely faint
            this.parallaxFactor = 0.02 + Math.random() * 0.06;
            this.wobble = Math.random() * 100;
            this.wobbleSpeed = 0.005 + Math.random() * 0.01;
        }

        update() {
            this.y -= this.speed;
            this.wobble += this.wobbleSpeed;

            // Apply parallax based on mouse
            const mouseDx = (targetMouseX - width / 2) * this.parallaxFactor;
            const mouseDy = (targetMouseY - height / 2) * this.parallaxFactor;

            const drawY = this.y - mouseDy;
            if (this.y < -this.radius || drawY < -this.radius) {
                this.reset();
            }
        }

        draw() {
            const mouseDx = (targetMouseX - width / 2) * this.parallaxFactor;
            const mouseDy = (targetMouseY - height / 2) * this.parallaxFactor;
            const drawX = this.x + Math.sin(this.wobble) * 15 - mouseDx;
            const drawY = this.y - mouseDy;

            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // Soft radial glow gradient
            const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, this.radius);
            grad.addColorStop(0, 'rgba(255, 229, 236, 0.8)');
            grad.addColorStop(0.5, 'rgba(232, 215, 255, 0.3)');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(drawX, drawY, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class RareHeart {
        constructor() {
            this.reset();
            this.y = Math.random() * height;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = -30 - Math.random() * 50;
            this.size = 10 + Math.random() * 15;
            this.speed = 0.4 + Math.random() * 0.6; // Very slow drift
            this.opacity = 0.1 + Math.random() * 0.2; // faint
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.005;
            this.parallaxFactor = 0.05 + Math.random() * 0.08;
            this.swing = Math.random() * 100;
            this.swingSpeed = 0.01;
        }

        update() {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            this.swing += this.swingSpeed;

            const mouseDx = (targetMouseX - width / 2) * this.parallaxFactor;
            const mouseDy = (targetMouseY - height / 2) * this.parallaxFactor;

            const drawX = this.x + Math.sin(this.swing) * 20 - mouseDx;
            if (this.y > height + this.size || drawX < -this.size || drawX > width + this.size) {
                this.reset();
            }
        }

        draw() {
            const mouseDx = (targetMouseX - width / 2) * this.parallaxFactor;
            const mouseDy = (targetMouseY - height / 2) * this.parallaxFactor;
            const drawX = this.x + Math.sin(this.swing) * 20 - mouseDx;
            const drawY = this.y - mouseDy;

            ctx.save();
            ctx.translate(drawX, drawY);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#FF8E9E';

            // Drawing high quality smooth heart
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size);
            ctx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    class FallingPetal {
        constructor() {
            this.reset();
            this.y = Math.random() * height;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = -20 - Math.random() * 50;
            this.size = 6 + Math.random() * 10;
            this.speed = 0.5 + Math.random() * 0.8;
            this.opacity = 0.15 + Math.random() * 0.25;
            this.rotation = Math.random() * Math.PI;
            this.rotationSpeed = (Math.random() - 0.5) * 0.01;
            this.parallaxFactor = 0.04 + Math.random() * 0.06;
            this.swing = Math.random() * 100;
            this.swingSpeed = 0.01 + Math.random() * 0.015;
        }

        update() {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            this.swing += this.swingSpeed;

            const mouseDx = (targetMouseX - width / 2) * this.parallaxFactor;
            const mouseDy = (targetMouseY - height / 2) * this.parallaxFactor;

            const drawX = this.x + Math.sin(this.swing) * 15 - mouseDx;
            if (this.y > height + this.size || drawX < -this.size || drawX > width + this.size) {
                this.reset();
            }
        }

        draw() {
            const mouseDx = (targetMouseX - width / 2) * this.parallaxFactor;
            const mouseDy = (targetMouseY - height / 2) * this.parallaxFactor;
            const drawX = this.x + Math.sin(this.swing) * 15 - mouseDx;
            const drawY = this.y - mouseDy;

            ctx.save();
            ctx.translate(drawX, drawY);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            
            // Draw cherry blossom petal
            ctx.fillStyle = '#FFE5EC';
            ctx.strokeStyle = '#FFAEC9';
            ctx.lineWidth = 0.5;

            ctx.beginPath();
            ctx.moveTo(0, -this.size/2);
            ctx.bezierCurveTo(-this.size/2, -this.size/4, -this.size, this.size/2, 0, this.size);
            ctx.bezierCurveTo(this.size, this.size/2, this.size/2, -this.size/4, 0, -this.size/2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }

    // Populate particles
    for (let i = 0; i < maxParticles * 0.5; i++) {
        particles.push(new BokehParticle());
    }
    for (let i = 0; i < maxParticles * 0.2; i++) {
        particles.push(new RareHeart());
    }
    for (let i = 0; i < maxParticles * 0.3; i++) {
        particles.push(new FallingPetal());
    }

    // Canvas animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ==========================================
    // TRANSITIONS & SCENE FLOWS (GSAP ELEGANCE)
    // ==========================================
    function switchScene(fromScene, toScene, onComplete = null) {
        gsap.to(fromScene, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                fromScene.classList.remove('active');
                fromScene.style.pointerEvents = 'none';
                
                toScene.classList.add('active');
                toScene.style.pointerEvents = 'auto';
                
                gsap.fromTo(toScene, 
                    { opacity: 0 },
                    { 
                        opacity: 1, 
                        duration: 0.8, 
                        ease: "power2.out",
                        onComplete: () => {
                            if (onComplete) onComplete();
                        }
                    }
                );
            }
        });
    }

    // ==========================================
    // SCENE 1: START EXPERIENCES (MOON ZOOM)
    // ==========================================
    moonStartBtn.addEventListener('click', () => {
        // Premium zoom animation of the Moon
        gsap.to(moonStartBtn, {
            scale: 8,
            opacity: 0,
            duration: 1.4,
            ease: "power2.inOut",
            onComplete: () => {
                // Instantly go to black screen countdown
                switchScene(sceneWelcome, sceneCountdown, runCinematicCountdown);
            }
        });
        
        // Fade titles quickly
        gsap.to([".welcome-title", ".welcome-subtitle"], {
            opacity: 0,
            y: -20,
            duration: 0.6,
            stagger: 0.1
        });
    });

    // ==========================================
    // SCENE 2: CINEMATIC COUNTDOWN
    // ==========================================
    function runCinematicCountdown() {
        const counts = ["3", "2", "1", "❤️"];
        let index = 0;

        function showNextCount() {
            if (index >= counts.length) {
                // Countdown complete, transition to envelope scene
                switchScene(sceneCountdown, sceneLetter, initEnvelopeScene);
                return;
            }

            const currentVal = counts[index];
            countdownNumber.innerHTML = currentVal;

            if (currentVal === "❤️") {
                countdownNumber.style.color = "var(--color-accent-red)";
            } else {
                countdownNumber.style.color = "#FFFFFF";
            }

            // Clean, dramatic Apple trailer style: scale up and fade out slowly
            gsap.fromTo(countdownNumber, 
                { scale: 0.85, opacity: 0 },
                { 
                    scale: 1.1, 
                    opacity: 1, 
                    duration: 0.65, 
                    ease: "power1.out",
                    onComplete: () => {
                        gsap.to(countdownNumber, {
                            scale: 1.3,
                            opacity: 0,
                            duration: 0.45,
                            delay: 0.15,
                            ease: "power1.in",
                            onComplete: () => {
                                index++;
                                showNextCount();
                            }
                        });
                    }
                }
            );
        }

        // Delay starting countdown slightly after black screen loads
        setTimeout(showNextCount, 400);
    }

    // ==========================================
    // SCENE 3: ENVELOPE SELECTION & OPENING
    // ==========================================
    function initEnvelopeScene() {
        // Reset envelope elements
        envelopeTop.style.transform = 'rotateX(0deg)';
        envelopeSeal.style.opacity = '1';
        envelopeSeal.style.transform = 'scale(1)';
        letterPreview.style.transform = 'translateY(0)';
        
        envelopeWrapper.style.display = 'block';
        letterCard.classList.add('hidden');
        letterCard.style.opacity = '0';
        
        // Click to Open Envelope
        envelopeWrapper.addEventListener('click', openEnvelope, { once: true });
    }

    function openEnvelope() {
        // 1. Break/fade seal
        gsap.to(envelopeSeal, {
            scale: 0.4,
            opacity: 0,
            duration: 0.4,
            ease: "back.in(1.2)"
        });

        // 2. Rotate envelope top flap open (3D flip)
        gsap.to(envelopeTop, {
            transform: 'rotateX(-180deg)',
            duration: 0.7,
            delay: 0.2,
            ease: "power2.inOut",
            onComplete: () => {
                // 3. Slide letter card preview upwards
                gsap.to(letterPreview, {
                    y: -140,
                    scale: 1.05,
                    duration: 0.8,
                    ease: "back.out(1.2)",
                    onComplete: () => {
                        // 4. Fade envelope out, and scale up the main glass letter card
                        gsap.to(envelopeWrapper, {
                            scale: 0.85,
                            opacity: 0,
                            duration: 0.6,
                            ease: "power2.inOut",
                            onComplete: () => {
                                envelopeWrapper.style.display = 'none';
                                
                                // Show and animate full glass card
                                letterCard.classList.remove('hidden');
                                gsap.fromTo(letterCard,
                                    { scale: 0.9, opacity: 0, y: 40 },
                                    { 
                                        scale: 1, 
                                        opacity: 1, 
                                        y: 0, 
                                        duration: 0.8, 
                                        ease: "back.out(1.1)",
                                        onComplete: startCinematicNarrative
                                    }
                                );
                                
                                // Generate card sparkles
                                createCardSparkles();
                            }
                        });
                    }
                });
            }
        });
    }

    // Card sparkles generation
    function createCardSparkles() {
        const sparklesContainer = document.getElementById('cardSparkles');
        if (!sparklesContainer) return;
        sparklesContainer.innerHTML = '';
        
        const cardWidth = letterCard.offsetWidth;
        const cardHeight = letterCard.offsetHeight;
        
        for (let i = 0; i < 8; i++) {
            const star = document.createElement('span');
            star.className = 'sparkle-star';
            star.innerHTML = Math.random() > 0.5 ? '✨' : '⭐';
            
            let x, y;
            const padding = 15;
            if (i < 2) {
                x = padding + Math.random() * (cardWidth - padding * 2);
                y = -10 + Math.random() * 20;
            } else if (i < 4) {
                x = padding + Math.random() * (cardWidth - padding * 2);
                y = cardHeight - 10 + Math.random() * 20;
            } else if (i < 6) {
                x = -10 + Math.random() * 20;
                y = padding + Math.random() * (cardHeight - padding * 2);
            } else {
                x = cardWidth - 10 + Math.random() * 20;
                y = padding + Math.random() * (cardHeight - padding * 2);
            }
            
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;
            star.style.animationDelay = `${Math.random() * 1.5}s`;
            star.style.fontSize = `${10 + Math.random() * 8}px`;
            
            sparklesContainer.appendChild(star);
        }
    }

    // ==========================================
    // SCENE 3: PHRASE-BY-PHRASE NARRATIVE REVEAL
    // ==========================================
    const narrativePhrases = [
        "Gabriel...",
        "Il y a quelque chose qui me trotte dans la tête depuis un moment.",
        "Chaque fois qu'on se voit...",
        "Je finis par passer beaucoup trop de temps à parler avec ta sœur.",
        "Et plus le temps passe...",
        "Plus je me rends compte...",
        "...que ce n'est pas avec elle que j'avais envie de passer ces moments.",
        "C'était avec toi.",
        "Je suis désolée. Vraiment.",
        "Tu mérites toute mon attention.",
        "Est-ce que tu pourrais me pardonner ? 👉👈"
    ];

    // Map custom reading delays (in milliseconds) for each phrase
    const phraseDelays = [
        2500, // Gabriel...
        3800, // Il y a quelque chose...
        2500, // Chaque fois...
        3800, // Je finis par passer...
        2500, // Et plus le temps...
        2500, // Plus je me rends compte...
        3800, // ...que ce n'est pas avec elle...
        3200, // C'était avec toi.
        3000, // Je suis désolée. Vraiment.
        3000, // Tu mérites...
        4000  // Est-ce que tu pourrais...
    ];

    function startCinematicNarrative() {
        let currentIdx = 0;
        
        function showPhrase() {
            if (currentIdx >= narrativePhrases.length) {
                // Show buttons
                letterButtons.classList.remove('hidden');
                gsap.fromTo(letterButtons,
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
                );
                return;
            }
            
            // Create narrative DOM node
            const p = document.createElement('p');
            p.className = 'narrative-phrase active';
            p.textContent = narrativePhrases[currentIdx];
            narrativeContainer.appendChild(p);
            
            // Fade in and slide up slightly
            gsap.fromTo(p,
                { opacity: 0, y: 12 },
                { opacity: 0.9, y: 0, duration: 0.8, ease: "power2.out" }
            );

            // Wait custom reading delay, then fade out and show next
            setTimeout(() => {
                gsap.to(p, {
                    opacity: 0,
                    y: -10,
                    duration: 0.6,
                    ease: "power2.in",
                    onComplete: () => {
                        p.remove();
                        currentIdx++;
                        showPhrase();
                    }
                });
            }, phraseDelays[currentIdx]);
        }

        showPhrase();
    }

    // ==========================================
    // ESCAPING BUTTON LOGIC (Pill style)
    // ==========================================
    let escapeCount = 0;
    const escapeMessages = [
        "Hihi 😜",
        "Tu es sûr ? 🤔",
        "Allez 😭",
        "Je fais de mon mieux... 👉👈",
        "Tu vas finir par cliquer sur l'autre 😂"
    ];

    function escapeBtn() {
        const padding = 70;
        const acceptBtnRect = acceptBtn.getBoundingClientRect();
        const wrapperRect = escapeBtnWrapper.getBoundingClientRect();

        // Convert to absolute body position on first interaction to avoid overflow clip
        if (escapeCount === 0) {
            escapeBtnWrapper.style.position = 'fixed';
            escapeBtnWrapper.style.left = '0px';
            escapeBtnWrapper.style.top = '0px';
            escapeBtnWrapper.style.margin = '0';
            escapeBtnWrapper.style.zIndex = '2000';
            document.body.appendChild(escapeBtnWrapper);
            
            gsap.set(escapeBtnWrapper, {
                x: wrapperRect.left,
                y: wrapperRect.top
            });
        }

        let newX = 0;
        let newY = 0;
        let isTooClose = true;
        let attempts = 0;

        while (isTooClose && attempts < 50) {
            // Random coordinates in viewport
            newX = padding + Math.random() * (width - 2 * padding - wrapperRect.width);
            newY = padding + Math.random() * (height - 2 * padding - wrapperRect.height);

            // Avoid landing near primary accept button
            const distToAcceptX = newX - acceptBtnRect.left;
            const distToAcceptY = newY - acceptBtnRect.top;
            const distToAccept = Math.sqrt(distToAcceptX * distToAcceptX + distToAcceptY * distToAcceptY);

            // Avoid landing near the cursor
            const distToMouseX = newX - targetMouseX;
            const distToMouseY = newY - targetMouseY;
            const distToMouse = Math.sqrt(distToMouseX * distToMouseX + distToMouseY * distToMouseY);

            if (distToAccept > 160 && distToMouse > 160) {
                isTooClose = false;
            }
            attempts++;
        }

        // Smooth GSAP slide escape
        gsap.to(escapeBtnWrapper, {
            x: newX,
            y: newY,
            scale: 0.85 + Math.random() * 0.25,
            duration: 0.35,
            ease: "power2.out"
        });

        // Elastic micro-scale on button
        gsap.fromTo(declineBtn,
            { scale: 0.9 },
            { scale: 1, duration: 0.2, ease: "elastic.out(1.2)" }
        );

        // Show tooltip bubble
        const messageIdx = Math.min(escapeCount, escapeMessages.length - 1);
        escapeTooltip.textContent = escapeMessages[messageIdx];
        escapeTooltip.classList.add('show');
        
        gsap.killTweensOf(hideTooltip);
        setTimeout(hideTooltip, 2200);
        
        escapeCount++;
    }

    function hideTooltip() {
        escapeTooltip.classList.remove('show');
    }

    declineBtn.addEventListener('mouseover', escapeBtn);
    declineBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        escapeBtn();
    });
    declineBtn.addEventListener('click', (e) => {
        e.preventDefault();
        escapeBtn();
    });

    // ==========================================
    // ACCEPTANCE & FINAL SCENE
    // ==========================================
    acceptBtn.addEventListener('click', () => {
        // 1. Instantly hide decline button
        if (escapeBtnWrapper) {
            gsap.to(escapeBtnWrapper, {
                opacity: 0,
                scale: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    escapeBtnWrapper.style.display = 'none';
                }
            });
        }

        // 2. Play confetti explosion
        triggerConfettiExplosion();
        
        // 3. Add glowing gold tint to background
        document.body.classList.add('golden-moment');
        
        // 4. Camera Zoom simulation (scale letterCard slightly during transition)
        gsap.to(letterCard, {
            scale: 1.15,
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut"
        });

        // 5. Fade in Success Card
        switchScene(sceneLetter, sceneSuccess, () => {
            // Beating heart scale timeline
            const beatingHeart = document.getElementById('beatingHeart');
            
            // Hold success screen for 4.5 seconds, then transition to final message
            setTimeout(() => {
                document.body.classList.remove('golden-moment');
                
                switchScene(sceneSuccess, sceneFinal, () => {
                    // Stagger outro texts
                    const finalTexts = document.querySelectorAll('.final-text');
                    gsap.to(finalTexts, {
                        opacity: 0.9,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.6,
                        ease: "power2.out"
                    });
                });
            }, 4500);
        });
    });

    function triggerConfettiExplosion() {
        const count = 200;
        const defaults = { origin: { y: 0.6 } };

        function fire(ratio, opts) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * ratio)
            });
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });

        // Extra cute heart-shaped particles explosion!
        setTimeout(() => {
            confetti({
                particleCount: 40,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FF5A79', '#FF8E9E', '#FFFDFD']
            });
            confetti({
                particleCount: 40,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FF5A79', '#FF8E9E', '#FFFDFD']
            });
        }, 300);
    }
});
