document.addEventListener('DOMContentLoaded', function() {
    const eyeImageWrapper = document.getElementById('eyeImageWrapper');
    const eyeImage = document.getElementById('eyeImage');
    const effectCanvas = document.getElementById('effectCanvas');
    const ctx = effectCanvas.getContext('2d');
    const interactionHint = document.getElementById('interactionHint');
    const glitchText = document.getElementById('glitchText');
    const textLines = document.querySelectorAll('.text-line');
    
    let isPressed = false;
    let animationId;
    let pixelationActive = false;
    let persistentPixels = []; // Array to store pixel data
    
    // Set canvas size to match image
    function resizeCanvas() {
        effectCanvas.width = eyeImage.offsetWidth;
        effectCanvas.height = eyeImage.offsetHeight;
        redrawPersistentPixels(); // Redraw pixels after resize
    }

    // Back door functionality
    const backDoor = document.getElementById('backDoor');
    backDoor.addEventListener('click', function() {
        window.location.href = 'index4.html';
    });

    // Wait for image to load before setting canvas size
    eyeImage.addEventListener('load', function() {
        resizeCanvas();
    });

    function createTransparentRedPixels(x, y) {
        const numPixels = 8 + Math.random() * 12; // 8-20 pixels
        
        for (let i = 0; i < numPixels; i++) {
            const offsetX = (Math.random() - 0.5) * 30;
            const offsetY = (Math.random() - 0.5) * 30;
            
            // Variable pixel size (2-10px) - INCREASED RANGE
            const pixelSize = 2 + Math.random() * 8;
            
            // Red tones with transparency
            const red = Math.floor(180 + Math.random() * 75); // 180-255
            const green = Math.floor(Math.random() * 30); // 0-30
            const blue = Math.floor(Math.random() * 30); // 0-30
            const alpha = 0.2 + Math.random() * 0.4; // 0.2-0.6 transparency
            
            const pixelData = {
                x: x + offsetX - pixelSize/2,
                y: y + offsetY - pixelSize/2,
                size: pixelSize,
                color: `rgba(${red}, ${green}, ${blue}, ${alpha})`
            };
            
            // Store pixel data for persistence
            persistentPixels.push(pixelData);
            
            // Draw pixel
            ctx.fillStyle = pixelData.color;
            ctx.fillRect(pixelData.x, pixelData.y, pixelData.size, pixelData.size);
        }
    }
    
    function redrawPersistentPixels() {
        ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
        
        // Redraw all persistent pixels
        persistentPixels.forEach(pixel => {
            ctx.fillStyle = pixel.color;
            ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size);
        });
    }
    
    function createGlitchLines() {
        const width = effectCanvas.width;
        const height = effectCanvas.height;
        
        // Create 2-3 random red glitch lines (temporary, not persistent)
        for (let i = 0; i < 3; i++) {
            if (Math.random() < 0.7) {
                const y = Math.random() * height;
                const lineHeight = 1 + Math.random() * 2;
                const red = Math.floor(200 + Math.random() * 55); // 200-255
                const alpha = 0.3 + Math.random() * 0.4; // 0.3-0.7
                
                ctx.fillStyle = `rgba(${red}, 0, 0, ${alpha})`;
                ctx.fillRect(0, y, width, lineHeight);
            }
        }
        
        // Schedule to redraw only persistent pixels after glitch lines fade
        setTimeout(() => {
            if (!isPressed) {
                redrawPersistentPixels();
            }
        }, 100);
    }
    
    function pixelationLoop() {
        if (!isPressed) {
            stopPixelation();
            return;
        }
        
        // Redraw persistent pixels first
        redrawPersistentPixels();
        
        // Add some glitch lines occasionally (temporary effect)
        if (Math.random() < 0.3) {
            createGlitchLines();
        }
        
        animationId = requestAnimationFrame(pixelationLoop);
    }
    
    function startPixelation() {
        if (pixelationActive) return;
        
        pixelationActive = true;
        isPressed = true;
        
        eyeImageWrapper.classList.add('active');
        eyeImage.classList.add('glitch-active');
        interactionHint.classList.add('hidden');
        glitchText.classList.add('visible');
        
        // Add glitching class to text lines
        textLines.forEach(line => {
            line.classList.add('glitching');
        });
        
        // Change to ojo2 while pixelating
        eyeImage.src = 'images/ojo/ojo2.jpg';
        
        pixelationLoop();
    }
    
    function stopPixelation() {
        pixelationActive = false;
        isPressed = false;
        
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        eyeImageWrapper.classList.remove('active');
        eyeImage.classList.remove('glitch-active');
        
        // Remove glitching class from text lines
        textLines.forEach(line => {
            line.classList.remove('glitching');
        });
        
        // Return to ojo1 and ensure persistent pixels remain
        eyeImage.src = 'images/ojo/ojo1.jpg';
        
        // Make sure to redraw persistent pixels after image change
        setTimeout(() => {
            redrawPersistentPixels();
        }, 100);
    }
    
    function getEventPosition(e) {
        const rect = eyeImageWrapper.getBoundingClientRect();
        let clientX, clientY;
        
        if (e.type.startsWith('touch')) {
            clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX;
            clientY = e.touches[0]?.clientY || e.changedTouches[0]?.clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    // Mouse events
    eyeImageWrapper.addEventListener('mousedown', function(e) {
        e.preventDefault();
        startPixelation();
    });
    
    eyeImageWrapper.addEventListener('mousemove', function(e) {
        if (isPressed) {
            const pos = getEventPosition(e);
            createTransparentRedPixels(pos.x, pos.y);
        }
    });
    
    document.addEventListener('mouseup', function() {
        if (isPressed) {
            stopPixelation();
        }
    });
    
    // Touch events
    eyeImageWrapper.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startPixelation();
    });
    
    eyeImageWrapper.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (isPressed) {
            const pos = getEventPosition(e);
            createTransparentRedPixels(pos.x, pos.y);
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (isPressed) {
            e.preventDefault();
            stopPixelation();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Clear canvas button (optional - for testing)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'c' || e.key === 'C') {
            persistentPixels = [];
            ctx.clearRect(0, 0, effectCanvas.width, effectCanvas.height);
        }
    });

    // Prevent any scrolling on main container
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (!e.target.closest('#eyeImageWrapper')) {
            e.preventDefault();
        }
    }, { passive: false });
});