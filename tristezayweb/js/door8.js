document.addEventListener('DOMContentLoaded', function() {
    const mazeContainer = document.getElementById('mazeContainer');
    const mazeGrid = document.getElementById('mazeGrid');
    const player = document.getElementById('player');
    const playerTrail = document.getElementById('playerTrail');
    const thoughtsOverlay = document.getElementById('thoughtsOverlay');
    const exitIndicator = document.getElementById('exitIndicator');
    const thoughtCounter = document.getElementById('thoughtCounter');
    const attemptCounter = document.getElementById('attemptCounter');
    const resetButton = document.getElementById('resetButton');
    const movementHint = document.getElementById('movementHint');
    const mazeCompletion = document.getElementById('mazeCompletion');
    const completionStats = document.getElementById('completionStats');
    
    let maze = [];
    let playerPos = { x: 0, y: 0 };
    let exitPos = { x: 14, y: 14 };
    let visitedCells = new Set();
    let thoughtCount = 0;
    let attemptCount = 0;
    let isCompleted = false;
    let moveCount = 0;
    
    const MAZE_SIZE = 15;
    const CELL_SIZE = 500 / MAZE_SIZE;
    
    const negativeThoughts = [
        "No puedo salir",
        "Estoy perdido",
        "Sin esperanza",
        "Todo es inútil",
        "No hay salida",
        "Siempre igual",
        "¿Por qué intentar?",
        "Nunca termina",
        "Estoy atrapado",
        "No sirvo",
        "Todo está mal",
        "Sin sentido"
    ];

    // Back door functionality
    const backDoor = document.getElementById('backDoor');
    backDoor.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    function generateMaze() {
        // Initialize maze with walls
        maze = Array(MAZE_SIZE).fill().map(() => Array(MAZE_SIZE).fill(1));
        
        // Simple maze generation using recursive backtracking
        const stack = [];
        const start = { x: 0, y: 0 };
        maze[start.y][start.x] = 0;
        stack.push(start);
        
        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const neighbors = getUnvisitedNeighbors(current);
            
            if (neighbors.length > 0) {
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];
                removeWall(current, next);
                maze[next.y][next.x] = 0;
                stack.push(next);
            } else {
                stack.pop();
            }
        }
        
        // Ensure exit is accessible
        maze[exitPos.y][exitPos.x] = 0;
        
        // Add some random paths to make it less linear
        for (let i = 0; i < 10; i++) {
            const x = Math.floor(Math.random() * MAZE_SIZE);
            const y = Math.floor(Math.random() * MAZE_SIZE);
            if (Math.random() < 0.3) {
                maze[y][x] = 0;
            }
        }
    }
    
    function getUnvisitedNeighbors(cell) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -2 }, { x: 2, y: 0 }, { x: 0, y: 2 }, { x: -2, y: 0 }
        ];
        
        for (const dir of directions) {
            const newX = cell.x + dir.x;
            const newY = cell.y + dir.y;
            
            if (newX >= 0 && newX < MAZE_SIZE && newY >= 0 && newY < MAZE_SIZE) {
                if (maze[newY][newX] === 1) {
                    neighbors.push({ x: newX, y: newY });
                }
            }
        }
        
        return neighbors;
    }
    
    function removeWall(current, next) {
        const wallX = current.x + (next.x - current.x) / 2;
        const wallY = current.y + (next.y - current.y) / 2;
        maze[wallY][wallX] = 0;
    }
    
    function renderMaze() {
        mazeGrid.innerHTML = '';
        
        for (let y = 0; y < MAZE_SIZE; y++) {
            for (let x = 0; x < MAZE_SIZE; x++) {
                const cell = document.createElement('div');
                cell.className = 'maze-cell';
                
                if (maze[y][x] === 1) {
                    cell.classList.add('wall');
                } else {
                    cell.classList.add('path');
                }
                
                if (x === exitPos.x && y === exitPos.y) {
                    cell.classList.add('exit');
                }
                
                if (visitedCells.has(`${x},${y}`)) {
                    cell.classList.add('visited');
                }
                
                // Add generation animation
                setTimeout(() => {
                    cell.classList.add('generating');
                }, (y * MAZE_SIZE + x) * 10);
                
                mazeGrid.appendChild(cell);
            }
        }
    }
    
    function updatePlayerPosition() {
        const x = playerPos.x * CELL_SIZE + (CELL_SIZE - 20) / 2;
        const y = playerPos.y * CELL_SIZE + (CELL_SIZE - 20) / 2;
        
        player.style.left = x + 'px';
        player.style.top = y + 'px';
        
        // Add to visited cells
        visitedCells.add(`${playerPos.x},${playerPos.y}`);
        
        // Create trail dot
        createTrailDot(x + 10, y + 10);
        
        // Check if reached exit
        if (playerPos.x === exitPos.x && playerPos.y === exitPos.y) {
            completeLevel();
        }
        
        // Update maze rendering to show visited cells
        renderMaze();
    }
    
    function createTrailDot(x, y) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        
        playerTrail.appendChild(dot);
        
        setTimeout(() => {
            dot.remove();
        }, 3000);
    }
    
    function movePlayer(dx, dy) {
        const newX = playerPos.x + dx;
        const newY = playerPos.y + dy;
        
        // Check bounds and walls
        if (newX >= 0 && newX < MAZE_SIZE && newY >= 0 && newY < MAZE_SIZE) {
            if (maze[newY][newX] === 0) {
                playerPos.x = newX;
                playerPos.y = newY;
                moveCount++;
                updatePlayerPosition();
                
                // Generate negative thought occasionally
                if (Math.random() < 0.3) {
                    generateNegativeThought();
                }
                
                movementHint.classList.add('hidden');
            }
        }
    }
    
    function generateNegativeThought() {
        thoughtCount++;
        thoughtCounter.textContent = thoughtCount;
        
        const thought = document.createElement('div');
        thought.className = 'negative-thought';
        thought.textContent = negativeThoughts[Math.floor(Math.random() * negativeThoughts.length)];
        
        // Position near player
        const playerRect = player.getBoundingClientRect();
        const containerRect = mazeContainer.getBoundingClientRect();
        
        thought.style.left = (playerRect.left - containerRect.left + Math.random() * 100 - 50) + 'px';
        thought.style.top = (playerRect.top - containerRect.top + Math.random() * 100 - 50) + 'px';
        
        thoughtsOverlay.appendChild(thought);
        
        setTimeout(() => {
            thought.remove();
        }, 4000);
    }
    
    function completeLevel() {
        if (isCompleted) return;
        
        isCompleted = true;
        exitIndicator.classList.remove('visible');
        
        // Show completion overlay
        setTimeout(() => {
            showCompletion();
        }, 500);
    }
    
    function showCompletion() {
        const efficiency = Math.max(0, 100 - Math.floor((moveCount / 50) * 100));
        const mentalHealth = Math.max(0, 100 - (thoughtCount * 5));
        
        completionStats.innerHTML = `
            <div class="stat-line">
                <span class="stat-label">Movimientos:</span>
                <span class="stat-value">${moveCount}</span>
            </div>
            <div class="stat-line">
                <span class="stat-label">Pensamientos negativos:</span>
                <span class="stat-value">${thoughtCount}</span>
            </div>
            <div class="stat-line">
                <span class="stat-label">Intentos:</span>
                <span class="stat-value">${attemptCount + 1}</span>
            </div>
            <div class="stat-line">
                <span class="stat-label">Eficiencia:</span>
                <span class="stat-value">${efficiency}%</span>
            </div>
            <div class="stat-line">
                <span class="stat-label">Salud mental:</span>
                <span class="stat-value">${mentalHealth}%</span>
            </div>
        `;
        
        mazeCompletion.classList.add('visible');
        
        setTimeout(() => {
            mazeCompletion.classList.remove('visible');
            resetMaze();
        }, 5000);
    }
    
    function resetMaze() {
        attemptCount++;
        attemptCounter.textContent = attemptCount;
        
        playerPos = { x: 0, y: 0 };
        visitedCells.clear();
        moveCount = 0;
        isCompleted = false;
        
        // Clear trails and thoughts
        playerTrail.innerHTML = '';
        thoughtsOverlay.innerHTML = '';
        
        // Generate new maze
        generateMaze();
        renderMaze();
        updatePlayerPosition();
        
        exitIndicator.classList.add('visible');
        movementHint.classList.remove('hidden');
    }
    
    // Keyboard controls
    document.addEventListener('keydown', function(e) {
        if (isCompleted) return;
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                movePlayer(0, -1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                movePlayer(0, 1);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                movePlayer(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                movePlayer(1, 0);
                break;
        }
    });
    
    // Touch controls
    let touchStartX, touchStartY;
    
    mazeContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    mazeContainer.addEventListener('touchend', function(e) {
        if (isCompleted) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        const minSwipeDistance = 30;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > minSwipeDistance) {
                movePlayer(deltaX > 0 ? 1 : -1, 0);
            }
        } else {
            if (Math.abs(deltaY) > minSwipeDistance) {
                movePlayer(0, deltaY > 0 ? 1 : -1);
            }
        }
    });
    
    // Reset button
    resetButton.addEventListener('click', resetMaze);
    
    // Initialize
    generateMaze();
    renderMaze();
    updatePlayerPosition();
    exitIndicator.classList.add('visible');
    
    // Prevent any scrolling on main container
    document.addEventListener('wheel', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (!e.target.closest('.maze-container')) {
            e.preventDefault();
        }
    }, { passive: false });
});