// 🎬 Handle Splash Screen & Music
const enterBtn = document.getElementById('enter-btn');
const splashScreen = document.getElementById('splash-screen');
const appContainer = document.getElementById('app-container');
const bgMusic = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');

let isPlaying = false;

enterBtn.addEventListener('click', () => {
    splashScreen.style.opacity = '0';
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        appContainer.classList.remove('hidden');
    }, 800);
    
    // Attempt to play music automatically (Requires user interaction first, which the button click satisfies)
    bgMusic.play().then(() => {
        isPlaying = true;
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }).catch(err => console.log("Audio play failed:", err));
});

// 🎵 Play/Pause Music
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.innerHTML = '<i class="fas fa-music"></i>';
    } else {
        bgMusic.play();
        musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

// 📑 Tab Switching Logic
function switchTab(tabId) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden', 'active'));

    // Add active class to clicked tab
    event.currentTarget.classList.add('active');
    
    // Show selected content
    const selectedContent = document.getElementById(tabId);
    selectedContent.classList.remove('hidden');
    selectedContent.classList.add('active');
}

// 📸 Story Logic
const storyModal = document.getElementById('story-modal');
const storyImage = document.getElementById('story-image');
const progressFill = document.querySelector('.progress-fill');
let storyTimeout;

const stories = {
    engagement: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
    haldi: "https://images.unsplash.com/photo-1605337035541-0c538a0f8247?auto=format&fit=crop&w=800&q=80",
    wedding: "https://images.unsplash.com/photo-1552589574-8898166c421f?auto=format&fit=crop&w=800&q=80"
};

function openStory(type) {
    storyImage.src = stories[type];
    storyModal.classList.remove('hidden');
    
    // Animate progress bar (simulating a 5 second story)
    progressFill.style.transition = 'none';
    progressFill.style.width = '0%';
    
    setTimeout(() => {
        progressFill.style.transition = 'width 5s linear';
        progressFill.style.width = '100%';
    }, 50);

    // Auto close after 5 seconds
    storyTimeout = setTimeout(closeStory, 5000);
}

function closeStory() {
    storyModal.classList.add('hidden');
    clearTimeout(storyTimeout);
}

// ❤️ Double Tap to Like (Instagram Style)
const reelsElements = document.querySelectorAll('.double-tap-like');
const heartsContainer = document.getElementById('hearts-container');

reelsElements.forEach(reel => {
    let lastTap = 0;
    reel.addEventListener('touchstart', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 300 && tapLength > 0) {
            // It's a double tap!
            createFloatingHeart(e.touches[0].clientX, e.touches[0].clientY);
            
            // Turn the heart icon red
            const likeBtn = reel.querySelector('.like-btn');
            if(likeBtn) {
                likeBtn.style.color = '#e74c3c';
            }
            e.preventDefault();
        }
        lastTap = currentTime;
    });
});

function createFloatingHeart(x, y) {
    const heart = document.createElement('i');
    heart.classList.add('fas', 'fa-heart', 'floating-heart');
    heart.style.left = `${x - 20}px`;
    heart.style.top = `${y - 20}px`;
    heartsContainer.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 1500);
}

// 📤 Share Feature
document.getElementById('share-btn').addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: 'Aditi & Rahul Wedding Album',
            text: 'Check out our beautiful wedding memories! ❤️',
            url: window.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
        alert("Share link copied to clipboard!");
        navigator.clipboard.writeText(window.location.href);
    }
});