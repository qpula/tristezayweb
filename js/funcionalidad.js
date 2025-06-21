document.addEventListener('DOMContentLoaded', function() {
    const doorsGrid = document.getElementById('doorsGrid');
    const doorItems = document.querySelectorAll('.door-item');
    
    // Function to get random position ensuring doors don't overlap and stay within bounds
    function getRandomPosition(doorWidth, doorHeight, containerWidth, containerHeight, existingPositions) {
        let attempts = 0;
        let position;
        
        do {
            position = {
                x: Math.random() * (containerWidth - doorWidth),
                y: Math.random() * (containerHeight - doorHeight)
            };
            attempts++;
        } while (attempts < 100 && isOverlapping(position, doorWidth, doorHeight, existingPositions));
        
        return position;
    }
    
    // Function to check if positions overlap
    function isOverlapping(newPos, width, height, existingPositions) {
        const margin = 25; // Minimum distance between doors
        
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
    
    // Function to position doors randomly
    function positionDoorsRandomly() {
        const container = doorsGrid;
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Get door dimensions based on screen size
        let doorWidth, doorHeight;
        if (window.innerWidth <= 768) {
            doorWidth = 70;
            doorHeight = 100;
        } else if (window.innerWidth <= 1024) {
            doorWidth = 90;
            doorHeight = 130;
        } else {
            doorWidth = 110;
            doorHeight = 160;
        }
        
        const existingPositions = [];
        
        doorItems.forEach((door, index) => {
            const position = getRandomPosition(doorWidth, doorHeight, containerWidth, containerHeight, existingPositions);
            
            door.style.left = position.x + 'px';
            door.style.top = position.y + 'px';
            door.style.width = doorWidth + 'px';
            door.style.height = doorHeight + 'px';
            
            existingPositions.push({
                x: position.x,
                y: position.y,
                width: doorWidth,
                height: doorHeight
            });
        });
    }
    
    // Add click event listeners to doors
    doorItems.forEach(door => {
        door.addEventListener('click', function() {
            const doorNumber = this.getAttribute('data-door');
            // Add click animation
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                window.location.href = `door${doorNumber}.html`;
            }, 150);
        });
        
        // Removed hover effects
    });
    
    // Position doors on load
    positionDoorsRandomly();
    
    // Reposition doors on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            positionDoorsRandomly();
        }, 250);
    });
    
    // Add keyboard navigation (optional)
    document.addEventListener('keydown', function(e) {
        if (e.key >= '1' && e.key <= '9') {
            const doorNumber = e.key;
            window.location.href = `door${doorNumber}.html`;
        } else if (e.key === '0') {
            window.location.href = 'door10.html';
        }
    });
    
    // Prevent any scrolling
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
});