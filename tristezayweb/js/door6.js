document.addEventListener('DOMContentLoaded', function() {
    const voidSpace = document.getElementById('voidSpace');
    const centerFigure = document.getElementById('centerFigure');
    const mouth = document.getElementById('mouth');
    const soundWaves = document.getElementById('soundWaves');
    const echoText = document.getElementById('echoText');
    const originalWord = document.getElementById('originalWord');
    const voidParticles = document.getElementById('voidParticles');
    const interactionHint = document.getElementById('interactionHint');
    const silenceMeter = document.getElementById('silenceMeter');
    const meterFill = document.getElementById('meterFill');
    const meterText = document.getElementById('meterText');
    const narrativeOverlay = document.getElementById('narrativeOverlay');
    
    let isScreaming = false;
    let screamDuration = 0;
    let totalScreams = 0;
    let silenceLevel = 100;
    let particleInterval;
    let screamTimeout;
    
    const words = [
        "ESTOY ACÁ", "DUELE", "LA SOLEDAD ABRUMA", "TENGO MIEDO", "¿HAY ALGUIEN AHÍ?", 
        "ESCUCHAME", "ABRAZAME"
    ];

    // Back door functionality
    const backDoor = document.getElementById('backDoor');
    backDoor.addEventListener('click', function() {
        window.location.href = 'index6.html';
    });

    function createVoidParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'void-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (8 + Math.random() * 4) + 's';
            voidParticles.appendChild(particle);
        }
    }

    function createSoundWave() {
        const wave = document.createElement('div');
        wave.className = 'sound-wave';
        soundWaves.appendChild(wave);
        
        setTimeout(() => {
            wave.remove();
        }, 2000);
    }

    function createEcho(word) {
        const echo = document.createElement('span');
        echo.className = 'echo-word echo';
        echo.textContent = word;
        echo.style.left = (Math.random() * 200 - 100) + 'px';
        echo.style.top = (Math.random() * 200 - 100) + 'px';
        echo.style.fontSize = (1.5 + Math.random() * 1) + 'rem';
        
        echoText.appendChild(echo);
        
        setTimeout(() => {
            echo.remove();
        }, 3000);
    }

    function updateSilenceMeter() {
        meterFill.style.width = (100 - silenceLevel) + '%';
        
        if (silenceLevel === 100) {
            meterText.textContent = '∞ dB';
        } else {
            meterText.textContent = Math.floor(100 - silenceLevel) + ' dB';
        }
        
        // Change meter color based on level
        if (silenceLevel < 30) {
            meterFill.style.background = '#ef4444';
        } else if (silenceLevel < 70) {
            meterFill.style.background = 'linear-gradient(90deg, #fbbf24 0%, #ef4444 100%)';
        } else {
            meterFill.style.background = 'linear-gradient(90deg, #22c55e 0%, #fbbf24 50%, #ef4444 100%)';
        }
    }

    function startScreaming() {
        if (isScreaming) return;
        
        isScreaming = true;
        totalScreams++;
        screamDuration = 0;
        
        voidSpace.classList.add('screaming');
        mouth.classList.add('screaming');
        interactionHint.classList.add('hidden');
        silenceMeter.classList.add('visible');
        
        // Show random word
        const randomWord = words[Math.floor(Math.random() * words.length)];
        originalWord.textContent = randomWord;
        originalWord.style.opacity = '1';
        
        // Create sound waves
        const waveInterval = setInterval(() => {
            if (isScreaming) {
                createSoundWave();
                createEcho(randomWord);
                screamDuration += 100;
                
                // Decrease silence level
                silenceLevel = Math.max(0, silenceLevel - 2);
                updateSilenceMeter();
            } else {
                clearInterval(waveInterval);
            }
        }, 200);
        
        // Auto-stop after 5 seconds
        screamTimeout = setTimeout(() => {
            stopScreaming();
        }, 5000);
    }

    function stopScreaming() {
        if (!isScreaming) return;
        
        isScreaming = false;
        clearTimeout(screamTimeout);
        
        voidSpace.classList.remove('screaming');
        mouth.classList.remove('screaming');
        originalWord.style.opacity = '0';
        
        // Gradually increase silence level
        const silenceInterval = setInterval(() => {
            silenceLevel = Math.min(100, silenceLevel + 1);
            updateSilenceMeter();
            
            if (silenceLevel >= 100) {
                clearInterval(silenceInterval);
                if (totalScreams < 3) {
                    interactionHint.classList.remove('hidden');
                }
            }
        }, 50);
        
        // Check for narrative trigger
        if (totalScreams >= 5 && screamDuration > 2000) {
            setTimeout(() => {
                showNarrative();
            }, 2000);
        }
    }

    function showNarrative() {
        narrativeOverlay.classList.add('visible');
        
        setTimeout(() => {
            narrativeOverlay.classList.remove('visible');
        }, 6000);
    }

    // Mouse events
    voidSpace.addEventListener('mousedown', function(e) {
        e.preventDefault();
        startScreaming();
    });

    document.addEventListener('mouseup', function() {
        stopScreaming();
    });

    // Touch events
    voidSpace.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startScreaming();
    });

    document.addEventListener('touchend', function(e) {
        e.preventDefault();
        stopScreaming();
    });

    // Keyboard events
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && !isScreaming) {
            e.preventDefault();
            startScreaming();
        }
    });

    document.addEventListener('keyup', function(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            stopScreaming();
        }
    });

    // Initialize
    createVoidParticles();
    updateSilenceMeter();
    
    // Ambient effects
    setInterval(() => {
        if (!isScreaming && Math.random() < 0.1) {
            // Random void distortion
            voidSpace.style.filter = `hue-rotate(${Math.random() * 60}deg) contrast(${0.8 + Math.random() * 0.4})`;
            setTimeout(() => {
                voidSpace.style.filter = 'none';
            }, 200);
        }
    }, 3000);
    
    // Particle regeneration
    setInterval(() => {
        if (voidParticles.children.length < 15) {
            const particle = document.createElement('div');
            particle.className = 'void-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (8 + Math.random() * 4) + 's';
            voidParticles.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 12000);
        }
    }, 2000);

    // Prevent any scrolling on main container
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Prevent context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
});