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
// 🔍 Fullscreen Image Viewer with Double-Tap & Pinch Zoom
const feedImages = document.querySelectorAll('.feed-item');
const viewerModal = document.getElementById('image-viewer-modal');
const viewerImage = document.getElementById('viewer-image');
const closeViewerBtn = document.getElementById('close-viewer');

let currentScale = 1;
let lastTapTime = 0;
let initialPinchDistance = 0;

// 1. Open image on tap
feedImages.forEach(img => {
    img.addEventListener('click', (e) => {
        viewerImage.src = e.target.src;
        viewerModal.classList.remove('hidden');
        currentScale = 1; // Reset zoom when opening a new image
        viewerImage.style.transform = `scale(${currentScale})`;
    });
});

// 2. Close image viewer
function closeViewer() {
    viewerModal.classList.add('hidden');
    setTimeout(() => { viewerImage.src = ''; }, 300); // Clear source after fade out
}

closeViewerBtn.addEventListener('click', closeViewer);

// Close if user taps the black background
viewerModal.addEventListener('click', (e) => {
    if (e.target === viewerModal || e.target.classList.contains('viewer-container')) {
        closeViewer();
    }
});

// 3. Android Double-Tap to Zoom Logic
viewerImage.addEventListener('touchstart', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    
    // If tap is fast (under 300ms) and only 1 finger
    if (tapLength < 300 && tapLength > 0 && e.touches.length === 1) {
        if (currentScale === 1) {
            currentScale = 2.5; // Zoom in 2.5x
        } else {
            currentScale = 1; // Zoom back out to fit screen
        }
        viewerImage.style.transform = `scale(${currentScale})`;
        e.preventDefault(); 
    }
    lastTapTime = currentTime;
});

// 4. Android Pinch-to-Zoom Logic
viewerImage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault(); // Prevents the whole website from trying to scroll while pinching

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        // Calculate the distance between two fingers using Pythagorean theorem
        const distance = Math.hypot(
            touch2.clientX - touch1.clientX, 
            touch2.clientY - touch1.clientY
        );
        
        if (initialPinchDistance === 0) {
            initialPinchDistance = distance;
        } else {
            // Calculate how much the fingers moved apart
            const scaleChange = distance / initialPinchDistance;
            let newScale = currentScale * scaleChange;
            
            // Limit the zoom so they don't zoom out past the original size, or zoom in too far
            if (newScale >= 1 && newScale <= 4) {
                viewerImage.style.transform = `scale(${newScale})`;
            }
        }
    }
});

viewerImage.addEventListener('touchend', (e) => {
    if (e.touches.length < 2) {
        initialPinchDistance = 0; // Reset pinch distance when fingers lift
        
        // Save the current scale for the next pinch or double-tap
        const transformStr = viewerImage.style.transform;
        if(transformStr.includes('scale')) {
            const match = transformStr.match(/scale\(([^)]+)\)/);
            if(match) currentScale = parseFloat(match[1]);
        }
    }
});
