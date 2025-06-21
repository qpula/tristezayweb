document.addEventListener('DOMContentLoaded', function() {
    const posts = [
        {
            username: "alfonstorm",
            content: "Rehuía, entonces, tu boca y buscando tu frente dejaba correr a lo largo de tu cuerpo abandonado el caudal temblante y profundo de mi vida.",
            likes: 2,
            comments: 0,
            shares: 0
        },
        {
            username: "alfonstorm",
            content: "La caricia que vaga sin destino ni objeto, la caricia perdida ¿quién la recogerá?",
            likes: 45,
            comments: 12,
            shares: 3
        },
        {
            username: "alfonstorm",
            content: "Persigo lo perfecto en mí y en los demás, persigo lo perfecto para poder amar.",
            likes: 234,
            comments: 67,
            shares: 23
        },
        {
            username: "alfonstorm",
            content: "Yo me vuelvo de espaldas. Desde un quiosco contemplo el mar lejano, negro y fosco, irónica la boca. Ruge el viento.",
            likes: 1,
            comments: 0,
            shares: 0
        },
        {
            username: "alfonstorm",
            content: "En la noche pasada no estaba quieto el mar. Nada más. Tempestades que las trae y las lleva. Un viento que nos marca cada vez costa nueva.",
            likes: 156,
            comments: 34,
            shares: 12
        },
        {
            username: "alfonstorm",
            content: "Tenías miedo de mi carne mortal y en ella buscabas al alma inmortal. Para encontrarla, a palabras duras, me abrías grandes heridas. Entonces te inclinabas sobre ellas y aspirabas, terrible, el olor de mi sangre 💔",
            likes: 8,
            comments: 2,
            shares: 0
        },
        {
            username: "alfonstorm",
            content: "¿Qué forma le ves tú a esa estrella? Tú me dijiste: -La de siempre. Pero yo no la veía como habitualmente, sino aumentada con extraños picos y fulgurando un brillo verdáceo y extraño.",
            likes: 1247,
            comments: 389,
            shares: 156
        },
        {
            username: "alfonstorm",
            content: "El agua que se va allá lejos, caminos del mar, se lleva mis pensamientos y entonces me parece que eres tú mismo quien se aleja para siempre en ellos.",
            likes: 12,
            comments: 3,
            shares: 1
        }
    ];

    // Back door functionality
    const backDoor = document.getElementById('backDoor');
    backDoor.addEventListener('click', function() {
        window.location.href = 'index3.html';
    });

    function getEngagementLevel(likes, comments, shares) {
        const total = likes + comments * 2 + shares * 3;
        if (total < 10) return 'low-engagement';
        if (total < 50) return 'medium-engagement';
        if (total < 200) return 'high-engagement';
        return 'viral';
    }

    function createPost(postData, index) {
        const post = document.createElement('div');
        post.className = `post ${getEngagementLevel(postData.likes, postData.comments, postData.shares)}`;
        
        post.innerHTML = `
            <div class="post-header">
                <div class="post-avatar"></div>
                <div class="post-username">${postData.username}</div>
            </div>
            <div class="post-content">${postData.content}</div>
            <div class="post-engagement">
                <div class="engagement-item" data-type="like" data-post="${index}">
                    ♡ <span class="engagement-count">${postData.likes}</span>
                </div>
                <div class="engagement-item" data-type="comment" data-post="${index}">
                    💬 <span class="engagement-count">${postData.comments}</span>
                </div>
                <div class="engagement-item" data-type="share" data-post="${index}">
                    ↗ <span class="engagement-count">${postData.shares}</span>
                </div>
            </div>
        `;

        return post;
    }

    function updatePostVisibility(postElement, postData) {
        const newLevel = getEngagementLevel(postData.likes, postData.comments, postData.shares);
        postElement.className = `post ${newLevel}`;
    }

    function initializeFeed() {
        const feedContainer = document.getElementById('feedContainer');
        
        posts.forEach((postData, index) => {
            const postElement = createPost(postData, index);
            feedContainer.appendChild(postElement);
            
            // Add click events to engagement buttons
            const engagementItems = postElement.querySelectorAll('.engagement-item');
            engagementItems.forEach(item => {
                item.addEventListener('click', function() {
                    const type = this.getAttribute('data-type');
                    const postIndex = parseInt(this.getAttribute('data-post'));
                    const countElement = this.querySelector('.engagement-count');
                    
                    // Increase engagement
                    if (type === 'like') {
                        posts[postIndex].likes += Math.floor(Math.random() * 5) + 1;
                        countElement.textContent = posts[postIndex].likes;
                    } else if (type === 'comment') {
                        posts[postIndex].comments += Math.floor(Math.random() * 3) + 1;
                        countElement.textContent = posts[postIndex].comments;
                    } else if (type === 'share') {
                        posts[postIndex].shares += Math.floor(Math.random() * 2) + 1;
                        countElement.textContent = posts[postIndex].shares;
                    }
                    
                    // Update post visibility based on new engagement
                    updatePostVisibility(postElement, posts[postIndex]);
                });
            });
        });
    }

    // Simulate algorithm changes over time
    function simulateAlgorithm() {
        setInterval(() => {
            posts.forEach((post, index) => {
                // Random engagement fluctuation
                if (Math.random() < 0.3) {
                    post.likes += Math.floor(Math.random() * 3);
                    post.comments += Math.floor(Math.random() * 2);
                    
                    const postElement = document.querySelectorAll('.post')[index];
                    if (postElement) {
                        const likeCount = postElement.querySelector('[data-type="like"] .engagement-count');
                        const commentCount = postElement.querySelector('[data-type="comment"] .engagement-count');
                        
                        if (likeCount) likeCount.textContent = post.likes;
                        if (commentCount) commentCount.textContent = post.comments;
                        
                        updatePostVisibility(postElement, post);
                    }
                }
            });
        }, 3000);
    }

    // Initialize
    initializeFeed();
    simulateAlgorithm();

    // Prevent any scrolling on main container
    document.addEventListener('wheel', function(e) {
        if (!e.target.closest('.feed-container')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (!e.target.closest('.feed-container')) {
            e.preventDefault();
        }
    }, { passive: false });
});