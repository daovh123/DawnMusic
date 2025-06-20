// DOM Elements
const musicContainer = document.getElementById("music-container");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const audio = document.getElementById("audio");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeControl = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");

// Danh sách bài hát
const songs = [
  {
    title: "Bài hát 1",
    name: "song1",
    cover: "song1.jpg",
    audio: "song1.mp3",
  },
  {
    title: "Bài hát 2",
    name: "song2",
    cover: "song2.jpg",
    audio: "song2.mp3",
  },
  {
    title: "Bài hát 3",
    name: "song3",
    cover: "song3.jpg",
    audio: "song3.mp3",
  },
];

let songIndex = 0;
let isPlaying = false;

// Khởi tạo trình phát nhạc
function initPlayer() {
  // Tạo playlist
  renderPlaylist();
  // Tải bài hát đầu tiên
  loadSong(songs[songIndex]);
  // Cập nhật volume
  audio.volume = volumeControl.value;
}

// Hiển thị danh sách phát
function renderPlaylist() {
  playlistEl.innerHTML = songs
    .map(
      (song, index) => `
    <li class="${index === songIndex ? "active" : ""}" data-index="${index}">
      <span>${song.title}</span>
    </li>
  `
    )
    .join("");

  // Thêm sự kiện click cho từng bài hát
  document.querySelectorAll("#playlist li").forEach((item) => {
    item.addEventListener("click", function () {
      songIndex = parseInt(this.getAttribute("data-index"));
      loadSong(songs[songIndex]);
      playSong();
      updateActiveSong();
    });
  });
}

// Cập nhật bài hát đang active trong playlist
function updateActiveSong() {
  document.querySelectorAll("#playlist li").forEach((item, index) => {
    item.classList.toggle("active", index === songIndex);
  });
}

// Tải bài hát
function loadSong(song) {
  title.innerText = song.title;
  audio.src = `music/${song.audio}`;
  cover.src = `images/${song.cover}`;

  // Fallback nếu ảnh bìa không tồn tại
  cover.onerror = () => {
    cover.src = "images/song_default.jpg";
  };
}

// Phát nhạc
function playSong() {
  isPlaying = true;
  musicContainer.classList.add("play");
  playBtn.querySelector("i").classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Dừng");
  audio.play();
}

// Dừng nhạc
function pauseSong() {
  isPlaying = false;
  musicContainer.classList.remove("play");
  playBtn.querySelector("i").classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Phát");
  audio.pause();
}

// Bài trước
function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
  updateActiveSong();
}

// Bài tiếp
function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
  updateActiveSong();
}

// Cập nhật thanh tiến độ
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  // Cập nhật thời gian
  durationEl.textContent = formatTime(duration);
  currentTimeEl.textContent = formatTime(currentTime);
}

// Định dạng thời gian (giây -> phút:giây)
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Nhảy đến vị trí click trên progress bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// Điều chỉnh âm lượng
function setVolume() {
  audio.volume = this.value;

  // Cập nhật icon volume
  const volumeIcons = document.querySelectorAll(".volume-control i");
  if (this.value == 0) {
    volumeIcons.forEach((icon) =>
      icon.classList.replace("fa-volume-up", "fa-volume-mute")
    );
  } else {
    volumeIcons.forEach((icon) =>
      icon.classList.replace("fa-volume-mute", "fa-volume-up")
    );
  }
}

// Sự kiện
playBtn.addEventListener("click", () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", nextSong);
audio.addEventListener("loadedmetadata", updateProgress);
progressContainer.addEventListener("click", setProgress);
volumeControl.addEventListener("input", setVolume);

// Xử lý lỗi
audio.addEventListener("error", () => {
  console.error("Lỗi khi tải bài hát");
  nextSong();
});

// Khởi tạo trình phát nhạc
initPlayer();

// Mở khóa audio trên trình duyệt
document.addEventListener(
  "click",
  () => {
    audio
      .play()
      .then(() => {
        pauseSong(); // Tự động pause để người dùng chủ động play
      })
      .catch((e) => console.log("Yêu cầu tương tác trước khi phát"));
  },
  { once: true }
);
