document.addEventListener('DOMContentLoaded', function() {
    let counter = 0;
    let messages = [];

    const messageTexts = [
        "Un like más.",
        "¿Te sentís mejor ahora?",
        "La validación digital no llena el vacío.",
        "Cada like es un momento de dopamina.",
        "Efímero. Insustancial.",
        "La tristeza no se cura con atención virtual.",
        "Has llegado a 100 likes. No sentís nada."
    ];

    const messageTriggers = [0, 5, 10, 20, 30, 50, 100];

    // Back door functionality
    const backDoor = document.getElementById('backDoor');
    backDoor.addEventListener('click', function() {
        window.location.href = 'index5.html';
    });

    function updateCounter() {
        document.getElementById('counter').textContent = counter;
    }

    function addMessage(text) {
        const messageContainer = document.getElementById('messageContainer');
        const initialMessage = document.getElementById('initialMessage');
        
        // Hide initial message on first click
        if (counter === 1) {
            initialMessage.style.display = 'none';
        }
        
        const messageElement = document.createElement('p');
        messageElement.textContent = text;
        messageElement.className = 'message';
        
        messageContainer.appendChild(messageElement);
        
        // Scroll to bottom
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    function handleLikeClick() {
        counter++;
        updateCounter();
        
        // Check if we should show a message
        const triggerIndex = messageTriggers.indexOf(counter);
        if (triggerIndex !== -1 && triggerIndex < messageTexts.length) {
            addMessage(messageTexts[triggerIndex]);
        }
    }

    // Initialize the page
    const likeButton = document.getElementById('likeButton');
    likeButton.addEventListener('click', handleLikeClick);
    
    updateCounter();

    // Optional: Add keyboard support
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
            handleLikeClick();
        }
    });

    // Prevent any scrolling on main container
    document.addEventListener('wheel', function(e) {
        if (e.target.closest('.message-container')) {
            return; // Allow scrolling in message container
        }
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('.message-container')) {
            return; // Allow scrolling in message container
        }
        e.preventDefault();
    }, { passive: false });
});