document.addEventListener('DOMContentLoaded', function() {
    const imageContainer = document.getElementById('imageContainer');
    const backDoor = document.getElementById('backDoor');
    let currentImages = [];
    let usedPositions = [];

    // Tree structure mapping
    const imageTree = {
        1: [2, 3],
        2: [4, 5],
        3: [6, 7],
        4: [8, 9],
        5: [10, 11],
        6: [], // Terminal nodes
        7: [],
        8: [],
        9: [],
        10: [],
        11: []
    };

    // Back door functionality
    backDoor.addEventListener('click', function() {
        window.location.href = 'index1.html';
    });

    // Function to get random position without overlap
    function getRandomPosition(imageWidth, imageHeight, containerWidth, containerHeight, existingPositions) {
        let attempts = 0;
        let position;
        const margin = 30;

        do {
            position = {
                x: Math.random() * (containerWidth - imageWidth - margin * 2) + margin,
                y: Math.random() * (containerHeight - imageHeight - margin * 2) + margin
            };
            attempts++;
        } while (attempts < 100 && isOverlapping(position, imageWidth, imageHeight, existingPositions, margin));

        return position;
    }

    // Function to check overlap
    function isOverlapping(newPos, width, height, existingPositions, margin) {
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

    // Function to create image element
    function createImageElement(imageNumber, level) {
        const img = document.createElement('img');
        const children = imageTree[imageNumber];

        img.src = `images/iatears/iatears_${imageNumber}-01.png`;
        img.alt = `Imagen ${imageNumber}`;
        img.className = `clickable-image level-${level} fade-in`;
        img.dataset.hover = `images/iatears/iatears_${imageNumber}.png`;
        img.dataset.original = `images/iatears/iatears_${imageNumber}-01.png`;
        img.dataset.children = children.join(',');
        img.dataset.level = level;
        img.dataset.imageNumber = imageNumber;

        // Hover effect
        img.addEventListener('mouseenter', function() {
            this.src = this.dataset.hover;
        });

        img.addEventListener('mouseleave', function() {
            this.src = this.dataset.original;
        });

        // Click effect (handled for all, even terminals)
        img.addEventListener('click', function() {
            expandImage(parseInt(this.dataset.imageNumber), parseInt(this.dataset.level));
        });

        return img;
    }

    // Function to position image randomly
    function positionImage(img, level) {
        const container = imageContainer;
        const containerRect = container.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        let imageWidth, imageHeight;
        if (window.innerWidth <= 768) {
            imageWidth = imageHeight = 150;
        } else if (window.innerWidth <= 1024) {
            imageWidth = imageHeight = 180;
        } else {
            imageWidth = imageHeight = 200;
        }

        const position = getRandomPosition(imageWidth, imageHeight, containerWidth, containerHeight, usedPositions);

        img.style.left = position.x + 'px';
        img.style.top = position.y + 'px';

        usedPositions.push({
            x: position.x,
            y: position.y,
            width: imageWidth,
            height: imageHeight
        });
    }

    // Function to expand image (show children or redirect)
    function expandImage(imageNumber, currentLevel) {
        const children = imageTree[imageNumber];

        if (children.length === 0) {
            // Terminal node: redirect
            window.location.href = 'index1.html';
            return;
        }

        // Clear current images
        currentImages.forEach(img => {
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
        });

        usedPositions = [];
        currentImages = [];

        const nextLevel = currentLevel + 1;

        children.forEach((childNumber, index) => {
            const img = createImageElement(childNumber, nextLevel);
            imageContainer.appendChild(img);

            setTimeout(() => {
                positionImage(img, nextLevel);
            }, index * 100);

            currentImages.push(img);
        });
    }

    // Initialize first image
    function initializeFirstImage() {
        const mainImage = document.getElementById('mainImage');

        mainImage.style.left = '50%';
        mainImage.style.top = '50%';
        mainImage.style.transform = 'translate(-50%, -50%)';
        mainImage.style.position = 'absolute';

        currentImages.push(mainImage);

        mainImage.addEventListener('mouseenter', function() {
            this.src = this.dataset.hover;
        });

        mainImage.addEventListener('mouseleave', function() {
            this.src = 'images/iatears/iatears_1-01.png';
        });

        mainImage.addEventListener('click', function() {
            expandImage(1, 1);
        });
    }

    // Initialize
    initializeFirstImage();

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            usedPositions = [];
            currentImages.forEach((img, index) => {
                if (img.id !== 'mainImage') {
                    setTimeout(() => {
                        positionImage(img, parseInt(img.dataset.level));
                    }, index * 50);
                }
            });
        }, 250);
    });
});
