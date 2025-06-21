document.addEventListener('DOMContentLoaded', function() {
    let textIndex = 0;
    let isTextMode = false;

    const texts = [
        "La puerta más ornamentada.",
        "La más compleja.",
        "La que promete más detrás.",
        "Pero al abrirla...",
        "Solo te encontrás cuatro paredes.",
        "Bien pintadas.",
        "Un espacio chato.",
        "Prolijo.",
        "La web es un conglomerado de puertas.",
        "Cada una de distinto atractivo que la anterior.",
        "Cada una con sus secretos detrás.",
        "El sadfishing es solo otra puerta ornamentada.",
        "Que nunca lleva a ninguna parte."
    ];

    const numberOfDoors = 10; // Reduced for better spacing

    // Back door functionality
    const backDoor = document.getElementById('backDoor');
    backDoor.addEventListener('click', function() {
        window.location.href = 'index7.html';
    });

    // Get random door dimensions
    function getRandomDoorSize() {
        const minSize = window.innerWidth <= 480 ? 40 : window.innerWidth <= 768 ? 50 : 60;
        const maxSize = window.innerWidth <= 480 ? 120 : window.innerWidth <= 768 ? 150 : 180;
        
        const width = Math.floor(Math.random() * (maxSize - minSize) + minSize);
        const height = Math.floor(width * 1.5); // Maintain door proportion
        
        return [width, height];
    }

    // Function to check overlap with better margin
    function isOverlapping(newPos, width, height, existingPositions) {
        const margin = 40; // Fixed larger margin
        
        for (let pos of existingPositions) {
            if (newPos.x < pos.x + pos.width + margin &&
                newPos.x + width + margin > pos.x &&
                newPos.y < pos.y + pos.height + margin &&
                newPos.y + height + margin > pos.y) {
                return true;
            }
        }
        return false;
    }

    // Improved random position function
    function getRandomPosition(doorWidth, doorHeight, containerWidth, containerHeight, existingPositions) {
        let attempts = 0;
        let position;
        const maxAttempts = 300;
        const safeMargin = 30;
        
        do {
            if (attempts < 100) {
                // Random placement
                position = {
                    x: Math.random() * (containerWidth - doorWidth - safeMargin * 2) + safeMargin,
                    y: Math.random() * (containerHeight - doorHeight - safeMargin * 2) + safeMargin
                };
            } else if (attempts < 200) {
                // Grid-based with variation
                const gridCols = 4;
                const gridRows = 3;
                const cellWidth = (containerWidth - safeMargin * 2) / gridCols;
                const cellHeight = (containerHeight - safeMargin * 2) / gridRows;
                
                const col = (attempts - 100) % gridCols;
                const row = Math.floor((attempts - 100) / gridCols) % gridRows;
                
                position = {
                    x: col * cellWidth + Math.random() * (cellWidth - doorWidth) + safeMargin,
                    y: row * cellHeight + Math.random() * (cellHeight - doorHeight) + safeMargin
                };
            } else {
                // Systematic placement
                const spacing = 80;
                const col = (attempts - 200) % Math.floor(containerWidth / spacing);
                const row = Math.floor((attempts - 200) / Math.floor(containerWidth / spacing));
                
                position = {
                    x: col * spacing + safeMargin,
                    y: row * spacing + safeMargin
                };
            }
            
            // Ensure position is within bounds
            position.x = Math.max(safeMargin, Math.min(position.x, containerWidth - doorWidth - safeMargin));
            position.y = Math.max(safeMargin, Math.min(position.y, containerHeight - doorHeight - safeMargin));
            
            attempts++;
        } while (attempts < maxAttempts && isOverlapping(position, doorWidth, doorHeight, existingPositions));
        
        return position;
    }

    // Function to create doors
    function createDoors() {
        const doorsContainer = document.getElementById('doorsContainer');
        const containerRect = doorsContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        const existingPositions = [];

        // Clear existing doors
        doorsContainer.innerHTML = '';

        console.log('Container dimensions:', containerWidth, containerHeight); // Debug

        for (let i = 0; i < numberOfDoors; i++) {
            const doorDiv = document.createElement('div');
            const doorImg = document.createElement('img');
            
            doorDiv.className = 'door-item';
            
            doorImg.src = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9.jpg-2ZQw0L6OtaJWAoToiokXuGAiC5HdsO.jpeg';
            doorImg.alt = 'Puerta 46';
            doorImg.className = 'door-image';
            
            doorDiv.appendChild(doorImg);
            
            // Get random dimensions
            const [doorWidth, doorHeight] = getRandomDoorSize();
            
            console.log(`Door ${i}: ${doorWidth}x${doorHeight}`); // Debug
            
            // Set dimensions directly via style
            doorDiv.style.width = doorWidth + 'px';
            doorDiv.style.height = doorHeight + 'px';
            
            // Position with improved algorithm
            const position = getRandomPosition(doorWidth, doorHeight, containerWidth, containerHeight, existingPositions);
            
            console.log(`Door ${i} position:`, position); // Debug
            
            doorDiv.style.left = position.x + 'px';
            doorDiv.style.top = position.y + 'px';
            
            existingPositions.push({
                x: position.x,
                y: position.y,
                width: doorWidth,
                height: doorHeight
            });
            
            // Add click event
            doorDiv.addEventListener('click', handleDoorClick);
            
            // Add to container
            doorsContainer.appendChild(doorDiv);
            
            // Add entrance animation
            doorDiv.style.opacity = '0';
            doorDiv.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                doorDiv.style.transition = 'all 0.5s ease';
                doorDiv.style.opacity = '1';
                doorDiv.style.transform = 'scale(1)';
            }, i * 150);
        }
    }

    // Function to show text
    function showText() {
        const textOverlay = document.getElementById('textOverlay');
        const textContentLarge = document.getElementById('textContentLarge');
        
        textContentLarge.textContent = texts[textIndex];
        textOverlay.classList.add('visible');
        isTextMode = true;
    }

    // Function to hide text
    function hideText() {
        const textOverlay = document.getElementById('textOverlay');
        textOverlay.classList.remove('visible');
        isTextMode = false;
    }

    // Handle door click
    function handleDoorClick() {
        if (!isTextMode) {
            textIndex = 0;
            showText();
        }
    }

    // Handle text overlay click
    function handleTextClick() {
        if (textIndex < texts.length - 1) {
            textIndex++;
            showText();
        } else {
            hideText();
            textIndex = 0;
        }
    }

    // Initialize
    createDoors();
    
    // Add click event to text overlay
    const textOverlay = document.getElementById('textOverlay');
    textOverlay.addEventListener('click', handleTextClick);
    
    // Add keyboard support
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
            if (isTextMode) {
                handleTextClick();
            } else {
                handleDoorClick();
            }
        }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createDoors();
        }, 250);
    });

    // Prevent any scrolling on main container
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
});