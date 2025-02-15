// ========== LOADING ==========
let loadProgress = 0;
const progressBar = document.getElementById("progress");
const percentageText = document.getElementById("loading-percentage");
const mainContent = document.getElementById("main-content");

function updateLoading() {
    if (loadProgress < 100) {
        loadProgress++;
        progressBar.style.width = loadProgress + "%";
        percentageText.innerText = loadProgress + "%";
        setTimeout(updateLoading, 30);
    } else {
        document.getElementById("loading-screen").style.display = "none";
        mainContent.classList.remove("hidden");
        playMusic();
    }
}

// Start loading when page loads
window.addEventListener('load', updateLoading);

// ========== AUDIO PLAYER ==========
const audioFiles = [
    'music/blue.mp3',
    'music/diewithasmile.mp3',
    'music/daylight.mp3',
    'music/heatwaves.mp3',
    'music/noinaycoanh.mp3'
];

const songImages = [
    'images/blue.jpg',
    'images/diewithasmile.jpg',
    'images/daylight.jpg',
    'images/heatwaves.jpg',
    'images/noinaycoanh.jpg'
];

let currentSongIndex = 0;
let isPlaying = false;
const audio = new Audio();

// Controls
const playPauseBtn = document.getElementById('pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const favoriteBtn = document.getElementById('favorite');
const songImage = document.getElementById('song-image'); // Ảnh bài hát

// Progress bar & time
const progress = document.querySelector('.progress');
const elapsed = document.querySelector('.elapsed');
const remaining = document.querySelector('.remaining');

// Function to play/pause music
function togglePlay() {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = '▐▐';
        isPlaying = true;
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶';
        isPlaying = false;
    }
}


// const songTitleElement = document.querySelector(".title");
// const songArtistElement = document.querySelector(".artist");

function playMusic() {
    audio.src = audioFiles[currentSongIndex];
    audio.play().catch(error => console.log("Autoplay prevented:", error));

    isPlaying = true;
    playPauseBtn.textContent = '▐▐';

    // Xóa trạng thái active của tất cả các bài hát
    const allSongInfos = document.querySelectorAll('.song-info');
    allSongInfos.forEach(info => info.classList.remove('active'));

    // Thêm trạng thái active cho bài hát hiện tại
    const currentSongInfo = document.querySelector(`#song-info-${currentSongIndex + 1}`);
    currentSongInfo.classList.add('active');

    // Lấy thông tin từ bài hát hiện tại
    const currentTitle = currentSongInfo.querySelector('.title').textContent;
    const currentArtist = currentSongInfo.querySelector('.artist').textContent;

    // Cập nhật thông tin hiển thị
    songTitleElement.textContent = currentTitle;
    songArtistElement.textContent = currentArtist;

    // Cập nhật radio button tương ứng
    document.querySelector(`#item-${currentSongIndex + 1}`).checked = true;

    // Cập nhật thời gian bài hát
    audio.addEventListener('loadedmetadata', () => {
        elapsed.textContent = '0:00';
        remaining.textContent = formatTime(audio.duration);
    });

    updateActiveSong();
}

// // Update progress bar
// audio.addEventListener('timeupdate', () => {
//     if (!isNaN(audio.duration)) {
//         const percent = (audio.currentTime / audio.duration) * 100;
//         progress.style.width = percent + '%';
//         elapsed.textContent = formatTime(audio.currentTime);
//         remaining.textContent = formatTime(audio.duration - audio.currentTime);
//     }
// });

// 

// function playMusic() {
//     // Phát nhạc
//     audio.src = audioFiles[currentSongIndex];
//     audio.play().catch(error => console.log("Autoplay prevented:", error));
//     isPlaying = true;
//     playPauseBtn.textContent = '▐▐';

//     // Reset trạng thái active
//     document.querySelectorAll('.song-info').forEach(info => {
//         info.classList.remove('active');
//     });

//     // Cập nhật trạng thái active mới
//     const newActiveSong = document.querySelector(`#song-info-${currentSongIndex + 1}`);
//     newActiveSong.classList.add('active');

//     // Cập nhật radio button
//     document.querySelector(`#item-${currentSongIndex + 1}`).checked = true;

//     // Reset thanh progress
//     document.querySelectorAll('.progress').forEach(prog => {
//         prog.style.width = '0%';
//     });

//     // Cập nhật active elements
//     activeElements = {
//         title: newActiveSong.querySelector('.title'),
//         artist: newActiveSong.querySelector('.artist'),
//         progress: newActiveSong.querySelector('.progress'),
//         elapsed: newActiveSong.querySelector('.elapsed'),
//         remaining: newActiveSong.querySelector('.remaining')
//     };

//     audio.addEventListener('loadedmetadata', () => {
//         const activeSong = document.querySelector('.song-info.active');
//         if (activeSong) {
//             const activeElapsed = activeSong.querySelector('.elapsed');
//             const activeRemaining = activeSong.querySelector('.remaining');
            
//             if (activeElapsed) activeElapsed.textContent = '0:00';
//             if (activeRemaining) activeRemaining.textContent = formatTime(audio.duration);
//         }
//     });
// }

// Update progress bar
audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        const currentProgress = document.querySelector('.song-info.active .progress');
        const currentElapsed = document.querySelector('.song-info.active .elapsed');
        const currentRemaining = document.querySelector('.song-info.active .remaining');

        if (currentProgress) {
            currentProgress.style.width = percent + '%';
        }
        if (currentElapsed) {
            currentElapsed.textContent = formatTime(audio.currentTime);
        }
        if (currentRemaining) {
            currentRemaining.textContent = formatTime(audio.duration - audio.currentTime);
        }
    }
});

// audio.addEventListener('timeupdate', () => {
//     if (!isNaN(audio.duration)) {
//         const percent = (audio.currentTime / audio.duration) * 100;
//         const activeSong = document.querySelector('.song-info.active');
        
//         if (activeSong) {
//             const activeProgress = activeSong.querySelector('.progress');
//             const activeElapsed = activeSong.querySelector('.elapsed');
//             const activeRemaining = activeSong.querySelector('.remaining');

//             if (activeProgress) activeProgress.style.width = percent + '%';
//             if (activeElapsed) activeElapsed.textContent = formatTime(audio.currentTime);
//             if (activeRemaining) activeRemaining.textContent = formatTime(audio.duration - audio.currentTime);
//         }
//     }
// });

// Khi bài hát kết thúc, chuyển sang bài tiếp theo
audio.addEventListener("ended", () => {
    changeSong('next');
});

// Chuyển đổi bài hát
function changeSong(direction) {
    if (direction === 'next') {
        currentSongIndex = (currentSongIndex + 1) % audioFiles.length;
    } else {
        currentSongIndex = (currentSongIndex - 1 + audioFiles.length) % audioFiles.length;
    }

    playMusic();
}

// Cập nhật trạng thái bài hát active
function updateActiveSong() {
    document.querySelectorAll('.song-info').forEach((info, index) => {
        info.classList.toggle('active', index === currentSongIndex);
    });
}

// Format time (mm:ss)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Event listeners
playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener("click", () => changeSong('next'));
prevBtn.addEventListener("click", () => changeSong('prev'));

favoriteBtn.addEventListener('click', () => {
    favoriteBtn.textContent = favoriteBtn.textContent === '♡' ? '♥' : '♡';
});

// ========== WISHES ==========
const wishes = [
    // "Chúc em một ngày Valentine tràn đầy yêu thương! 💖",
    // "Anh mong em sẽ luôn hạnh phúc và nở nụ cười! 😊",
    // "Gửi ngàn nụ hôn đến em trong ngày Valentine! 😘",
    // "Mãi bên nhau nhé, tình yêu của anh! ❤️",
    // "Chúc em nhận được thật nhiều hoa và quà! 🎁🌹"
    "You stole my heart, but I’ll let you keep it. <3",
    "You are my today and all of my tomorrows.  😊",
    "Happy Valentine's Day! 😘",
    "Forever smile my darling!! ❤️",
    "🎁🌹"
];

let wishIndex = 0;

function nextWish() {
    wishIndex = (wishIndex + 1) % wishes.length;
    const wishText = document.getElementById("wish-text");

    wishText.style.opacity = 0;
    setTimeout(() => {
        wishText.innerText = wishes[wishIndex];
        wishText.style.opacity = 1;
    }, 500);
}

//Radio buttons change event
// document.querySelectorAll('input[name="slider"]').forEach(radio => {
//     radio.addEventListener('change', (e) => {
//         document.querySelectorAll('.song-info').forEach(info => {
//             info.classList.remove('active');
//         });
//         document.querySelector(`#song-info-${e.target.id.split('-')[1]}`).classList.add('active');
//     });
// });

document.querySelectorAll('input[name="slider"]').forEach((radio, index) => {
    radio.addEventListener('change', () => {
        currentSongIndex = index;
        playMusic();
        
        // Cập nhật trạng thái active cho card
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`#song-${index + 1}`).classList.add('active');
    });
});
