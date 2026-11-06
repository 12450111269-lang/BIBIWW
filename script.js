/* ==========================================================================
   Bibey's Florist — Enhanced 21st Birthday Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }

  initAmbientCanvas();
  initPlaylistSystem();
  initSurpriseModal();
  initCakeInteraction();
  initLoveBurst();
  initScrapbookLightbox();
  initGardenCatcherGame();
  initScratchCard();
  initJarOfHearts();
});

/* --------------------------------------------------------------------------
   1. Ambient Canvas: Falling Petals, Sparkles & Soft Blue Hearts (💙)
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambientCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const items = [];
  const TOTAL_ITEMS = 38;
  const types = ['petal', 'heart-blue', 'heart-pink', 'sparkle'];

  class FloatingParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 12 + 8;
      this.speedY = Math.random() * 0.9 + 0.45;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.5;
      this.opacity = Math.random() * 0.5 + 0.35;
      this.type = types[Math.floor(Math.random() * types.length)];
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.015) * 0.6 + this.speedX;
      this.rotation += this.rotSpeed;

      if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'petal') {
        ctx.fillStyle = `rgba(247, 184, 183, ${this.opacity})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 'heart-blue') {
        // Soft Blue Heart 💙
        ctx.fillStyle = `rgba(90, 141, 238, ${this.opacity * 0.9})`;
        const s = this.size * 0.45;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.8, -s * 1.5, s * 0.2, 0, s * 1.5);
        ctx.bezierCurveTo(s * 1.5, s * 0.2, s, -s * 0.8, 0, s * 0.3);
        ctx.fill();
      } else if (this.type === 'heart-pink') {
        ctx.fillStyle = `rgba(235, 110, 125, ${this.opacity})`;
        const s = this.size * 0.45;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.8, -s * 1.5, s * 0.2, 0, s * 1.5);
        ctx.bezierCurveTo(s * 1.5, s * 0.2, s, -s * 0.8, 0, s * 0.3);
        ctx.fill();
      } else {
        // Sparkle
        ctx.fillStyle = `rgba(255, 215, 130, ${this.opacity * 0.9})`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_ITEMS; i++) {
    items.push(new FloatingParticle());
  }

  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let item of items) {
      item.update();
      item.draw();
    }
    requestAnimationFrame(loop);
  }

  loop();
}

/* --------------------------------------------------------------------------
   2. Audio Playlist System
   -------------------------------------------------------------------------- */
const playlist = [
  { title: "Taman Bunga (Instrumental)", src: "taman bunga - instrument.mp3" },
  { title: "Berpayung Tuhan (Orchestra)", src: "Berpayung Tuhan - Orchestra Version.mp3" },
  { title: "Instrumen Taman Bunga Tenang", src: "INSTRUMEN TAMAN BUNGA TENANG.mp3" }
];
let currentTrackIdx = 0;
let isAudioPlaying = false;

function initPlaylistSystem() {
  const bgAudio = document.getElementById('bgAudio');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const prevTrackBtn = document.getElementById('prevTrackBtn');
  const nextTrackBtn = document.getElementById('nextTrackBtn');
  const currentSongTitle = document.getElementById('currentSongTitle');
  const songPlayStatus = document.getElementById('songPlayStatus');
  const musicDisc = document.getElementById('musicDisc');
  const playIcon = document.getElementById('playIcon');

  function loadTrack(index) {
    currentTrackIdx = (index + playlist.length) % playlist.length;
    bgAudio.src = playlist[currentTrackIdx].src;
    currentSongTitle.innerText = playlist[currentTrackIdx].title;
    if (isAudioPlaying) {
      bgAudio.play().catch(e => console.log('Audio autoplay prevented'));
    }
  }

  function togglePlay() {
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        updateUI();
      }).catch(e => console.log(e));
    } else {
      bgAudio.pause();
      isAudioPlaying = false;
      updateUI();
    }
  }

  function updateUI() {
    if (!bgAudio.paused) {
      musicDisc.classList.add('playing');
      songPlayStatus.innerText = "Memutar dengan cinta 💙";
      if (playIcon) playIcon.setAttribute('data-lucide', 'pause');
    } else {
      musicDisc.classList.remove('playing');
      songPlayStatus.innerText = "Klik untuk putar musik 🎵";
      if (playIcon) playIcon.setAttribute('data-lucide', 'play');
    }
    if (window.lucide) lucide.createIcons();
  }

  playPauseBtn.addEventListener('click', togglePlay);
  musicToggleBtn.addEventListener('click', togglePlay);

  prevTrackBtn.addEventListener('click', () => {
    loadTrack(currentTrackIdx - 1);
    bgAudio.play().then(() => { isAudioPlaying = true; updateUI(); });
  });

  nextTrackBtn.addEventListener('click', () => {
    loadTrack(currentTrackIdx + 1);
    bgAudio.play().then(() => { isAudioPlaying = true; updateUI(); });
  });

  bgAudio.addEventListener('ended', () => {
    loadTrack(currentTrackIdx + 1);
    bgAudio.play();
  });

  window.startBirthdayMusic = function() {
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        isAudioPlaying = true;
        updateUI();
      }).catch(e => console.log(e));
    }
  };

  // Set initial song title
  currentSongTitle.innerText = playlist[0].title;
}

/* --------------------------------------------------------------------------
   3. Surprise Modal & Reveal Logic
   -------------------------------------------------------------------------- */
function initSurpriseModal() {
  const overlay = document.getElementById('surpriseOverlay');
  const closeBtn = document.getElementById('closeSurpriseBtn');
  const claimOrderBtn = document.getElementById('claimOrderBtn');
  const openSurpriseBtn = document.getElementById('openSurpriseBtn');
  const openCartBtn = document.getElementById('openCartBtn');
  const waxSealBtn = document.getElementById('waxSealBtn');
  const stepEnvelope = document.getElementById('stepEnvelope');
  const stepLetter = document.getElementById('stepLetter');

  window.openSurpriseModal = function() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  claimOrderBtn.addEventListener('click', window.openSurpriseModal);
  openSurpriseBtn.addEventListener('click', window.openSurpriseModal);
  openCartBtn.addEventListener('click', window.openSurpriseModal);
  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Open Wax Seal
  waxSealBtn.addEventListener('click', () => {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#5A8DEE', '#D97477', '#F6C1A7', '#D4AF37', '#FFF']
      });
    }

    if (window.startBirthdayMusic) {
      window.startBirthdayMusic();
    }

    stepEnvelope.classList.remove('active');
    stepLetter.classList.add('active');
  });
}

/* --------------------------------------------------------------------------
   4. Interactive Cake Candle
   -------------------------------------------------------------------------- */
function initCakeInteraction() {
  const candle = document.getElementById('birthdayCandle');
  const flame = document.getElementById('flame');
  const cakeInstruction = document.getElementById('cakeInstruction');

  if (!candle || !flame) return;

  candle.addEventListener('click', () => {
    if (flame.classList.contains('extinguished')) return;

    flame.classList.add('extinguished');

    const smoke = document.createElement('div');
    smoke.className = 'flame-smoke';
    smoke.innerText = '💨';
    candle.appendChild(smoke);

    setTimeout(() => smoke.remove(), 1200);

    cakeInstruction.innerHTML = '✨ <strong>Wish granted!</strong> Happy 21st Birthday, my dearest Biww! 💙🌸✨';
    cakeInstruction.style.color = '#5A8DEE';

    if (typeof confetti === 'function') {
      const end = Date.now() + 3 * 1000;
      const colors = ['#5A8DEE', '#D97477', '#FFD700', '#F9E2E2', '#FFF'];

      (function frame() {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  });
}

/* --------------------------------------------------------------------------
   5. Floating Hearts & Love Counter
   -------------------------------------------------------------------------- */
let loveTotal = 20;

function initLoveBurst() {
  const loveBtn = document.getElementById('loveBurstBtn');
  const loveCount = document.getElementById('loveCount');

  if (!loveBtn) return;

  loveBtn.addEventListener('click', (e) => {
    loveTotal++;
    loveCount.innerText = loveTotal;
    createFloatingHeart(e.clientX, e.clientY);
  });
}

function createFloatingHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'floating-click-heart';
  const emojis = ['💙', '🌸', '💖', '✨', '💐', '🥰', '🫶🏻', '🍓'];
  heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];

  heart.style.left = `${x - 12 + (Math.random() - 0.5) * 30}px`;
  heart.style.top = `${y - 20}px`;

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1400);
}

window.addToOrder = function(flowerName) {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#5A8DEE', '#F6C1A7', '#D97477']
    });
  }

  createFloatingHeart(window.innerWidth / 2, window.innerHeight / 2);

  const toast = document.createElement('div');
  toast.innerText = `Menambahkan "${flowerName}" untuk keranjang bunga Bibiw 💐💙`;
  toast.style.position = 'fixed';
  toast.style.bottom = '80px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#2B3A55';
  toast.style.color = '#FFF';
  toast.style.padding = '10px 22px';
  toast.style.borderRadius = '30px';
  toast.style.fontSize = '0.9rem';
  toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
  toast.style.zIndex = '9999';
  toast.style.transition = 'opacity 0.4s ease';

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2200);
};

/* --------------------------------------------------------------------------
   6. Scrapbook Lightbox Zoom
   -------------------------------------------------------------------------- */
function initScrapbookLightbox() {
  window.openLightbox = function(src, caption) {
    const overlay = document.getElementById('lightboxOverlay');
    const img = document.getElementById('lightboxImg');
    const cap = document.getElementById('lightboxCaption');

    img.src = src;
    cap.innerText = caption;
    overlay.classList.add('active');
  };

  window.closeLightbox = function() {
    const overlay = document.getElementById('lightboxOverlay');
    overlay.classList.remove('active');
  };
}

/* --------------------------------------------------------------------------
   7. Mini Game 1: Bibiw's Garden Catcher (Tangkap Bunga & Hati)
   -------------------------------------------------------------------------- */
function initGardenCatcherGame() {
  const canvas = document.getElementById('catcherCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const startOverlay = document.getElementById('gameStartOverlay');
  const endOverlay = document.getElementById('gameEndOverlay');
  const startBtn = document.getElementById('startGameBtn');
  const restartBtn = document.getElementById('restartGameBtn');
  const scoreDisplay = document.getElementById('gameScore');
  const timerDisplay = document.getElementById('gameTimer');
  const finalScoreDisplay = document.getElementById('finalScore');
  const gameEndMessage = document.getElementById('gameEndMessage');
  const mLeftBtn = document.getElementById('mLeftBtn');
  const mRightBtn = document.getElementById('mRightBtn');

  let score = 0;
  let timeLeft = 30;
  let isPlaying = false;
  let timerInterval = null;
  let spawnInterval = null;
  let animationFrameId = null;

  // Basket properties
  const basket = {
    x: canvas.width / 2 - 35,
    y: canvas.height - 50,
    width: 70,
    height: 38,
    speed: 7,
    dx: 0
  };

  const items = [];
  const itemTypes = [
    { emoji: '🌸', points: 10, speed: 2.2 },
    { emoji: '🌷', points: 10, speed: 2.4 },
    { emoji: '🍓', points: 15, speed: 2.8 },
    { emoji: '💙', points: 25, speed: 3.0 },
    { emoji: '☁️', points: -15, speed: 2.0 } // obstacle
  ];

  function spawnItem() {
    if (!isPlaying) return;
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    items.push({
      x: Math.random() * (canvas.width - 40) + 20,
      y: -20,
      size: 26,
      ...type
    });
  }

  function update() {
    if (!isPlaying) return;

    // Move basket
    basket.x += basket.dx;
    if (basket.x < 0) basket.x = 0;
    if (basket.x + basket.width > canvas.width) basket.x = canvas.width - basket.width;

    // Move items
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.speed;

      // Check collision with basket
      if (
        it.y + it.size >= basket.y &&
        it.y <= basket.y + basket.height &&
        it.x + it.size >= basket.x &&
        it.x <= basket.x + basket.width
      ) {
        score = Math.max(0, score + it.points);
        scoreDisplay.innerText = score;
        createFloatingHeart(basket.x + 35, basket.y);
        items.splice(i, 1);
        continue;
      }

      // Remove offscreen
      if (it.y > canvas.height + 30) {
        items.splice(i, 1);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw basket
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧺', basket.x + basket.width / 2, basket.y + 30);

    // Draw falling items
    for (let it of items) {
      ctx.font = `${it.size}px sans-serif`;
      ctx.fillText(it.emoji, it.x, it.y);
    }
  }

  function gameLoop() {
    update();
    draw();
    if (isPlaying) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }
  }

  function startGame() {
    score = 0;
    timeLeft = 30;
    items.length = 0;
    isPlaying = true;
    scoreDisplay.innerText = '0';
    timerDisplay.innerText = '30s';
    basket.x = canvas.width / 2 - 35;

    startOverlay.style.display = 'none';
    endOverlay.classList.remove('active');

    clearInterval(timerInterval);
    clearInterval(spawnInterval);

    spawnInterval = setInterval(spawnItem, 600);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.innerText = `${timeLeft}s`;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    gameLoop();
  }

  function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    clearInterval(spawnInterval);
    cancelAnimationFrame(animationFrameId);

    finalScoreDisplay.innerText = score;
    if (score >= 120) {
      gameEndMessage.innerText = "🏆 Piala Juara Hati untuk Bibiw! Kamu mengumpulkan sekeranjang penuh cinta dan bunga mekar! 💙✨";
    } else {
      gameEndMessage.innerText = "Yaaay! Kamu bermain sangat manis, semua cinta ini khusus untuk ulang tahunmu! 🌸💙";
    }

    if (typeof confetti === 'function') {
      confetti({ particleCount: 70, spread: 60 });
    }

    endOverlay.classList.add('active');
  }

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') basket.dx = -basket.speed;
    if (e.key === 'ArrowRight' || e.key === 'd') basket.dx = basket.speed;
  });
  window.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) basket.dx = 0;
  });

  // Mobile controls
  if (mLeftBtn && mRightBtn) {
    mLeftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); basket.dx = -basket.speed; });
    mLeftBtn.addEventListener('touchend', () => { basket.dx = 0; });
    mRightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); basket.dx = basket.speed; });
    mRightBtn.addEventListener('touchend', () => { basket.dx = 0; });
  }

  // Switch game tabs
  window.switchGame = function(gameName) {
    const tabs = document.querySelectorAll('.arcade-tab-btn');
    const panelCatcher = document.getElementById('gameCatcherPanel');
    const panelScratch = document.getElementById('gameScratchPanel');

    tabs.forEach(t => t.classList.remove('active'));
    if (gameName === 'catcher') {
      tabs[0].classList.add('active');
      panelCatcher.classList.add('active');
      panelScratch.classList.remove('active');
    } else {
      tabs[1].classList.add('active');
      panelCatcher.classList.remove('active');
      panelScratch.classList.add('active');
      initScratchCardCanvas(); // redraw scratch layer
    }
  };
}

/* --------------------------------------------------------------------------
   8. Mini Game 2: Birthday Scratch Card (Gosok Kupon)
   -------------------------------------------------------------------------- */
const coupons = [
  {
    title: "KUPON BEBAS MERENGEK & DITURUTIN 24 JAM",
    desc: "Berlaku seumur hidup! Bisa ditukarkan kapan saja dengan pelukan hangat, traktiran makanan favorit, dan jalan-jalan berdua tanpa batas!",
    code: "BIBIW-TURNING-21"
  },
  {
    title: "TIKET FINE DINING & DATING SEHARIAN",
    desc: "Hak istimewa untuk memilih tempat makan apa saja, pesan apa saja yang kamu suka, dan seharian penuh ditemani sampai tersenyum puas!",
    code: "DATE-FOR-MY-BIBIW"
  },
  {
    title: "KARTU HAK PATEN TIDAK BOLEH DIMARAHI",
    desc: "Jika Bibiw lagi ngambek atau sedih, kartu ini otomatis memberi hak untuk dipeluk erat, dielus kepalanya, dan ditenangkan sampai pulih!",
    code: "LOVE-HUG-UNLIMITED"
  }
];
let currentCouponIdx = 0;

function initScratchCard() {
  const resetBtn = document.getElementById('resetScratchBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentCouponIdx = (currentCouponIdx + 1) % coupons.length;
      document.getElementById('couponTitle').innerText = coupons[currentCouponIdx].title;
      document.getElementById('couponDesc').innerText = coupons[currentCouponIdx].desc;
      initScratchCardCanvas();
    });
  }
  initScratchCardCanvas();
}

function initScratchCardCanvas() {
  const canvas = document.getElementById('scratchCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = canvas.offsetWidth || 460;
  canvas.height = canvas.offsetHeight || 230;

  // Draw silver/gold scratchable coating
  ctx.globalCompositeOperation = 'source-over';
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#D4AF37');
  grad.addColorStop(0.5, '#F3E5AB');
  grad.addColorStop(1, '#AA8015');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pattern text
  ctx.font = 'bold 18px sans-serif';
  ctx.fillStyle = 'rgba(70, 50, 10, 0.4)';
  ctx.textAlign = 'center';
  ctx.fillText('✨ GOSOK LAPISAN EMAS INI ✨', canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = '14px sans-serif';
  ctx.fillText('Special 21st Birthday Reward for Bibiw 💙', canvas.width / 2, canvas.height / 2 + 18);

  let isScratching = false;

  function scratch(e) {
    if (!isScratching) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.onmousedown = (e) => { isScratching = true; scratch(e); };
  canvas.onmousemove = scratch;
  window.onmouseup = () => { isScratching = false; };

  canvas.ontouchstart = (e) => { isScratching = true; scratch(e); };
  canvas.ontouchmove = scratch;
  window.ontouchend = () => { isScratching = false; };
}

/* --------------------------------------------------------------------------
   9. Jar of Hearts Interactive Notes
   -------------------------------------------------------------------------- */
const jarNotes = [
  "Terima kasih sudah selalu jadi alasan aku tersenyum setiap hari. Bersamamu, hal sederhana selalu jadi sangat istimewa. 💙",
  "Semoga di usia 21 tahun ini, semua luka dan badai yang lalu tergantikan dengan pelangi kebahagiaan yang tak pernah pudar. 🌸",
  "Kamu adalah rumah paling tenang, tempat di mana aku selalu ingin pulang dan bercerita tentang apa saja. 🫶🏻",
  "Jangan pernah ragu akan dirimu ya sayang, kamu adalah sosok yang luar biasa kuat dan berharga di mataku. ✨",
  "Aku berjanji akan selalu ada di sisimu, merayakan tawamu dan memelukmu di saat hari terasa begitu berat. 💙",
  "Senyummu di usia 21 ini adalah pemandangan paling indah di seluruh alam semesta. Tetaplah mekar, bidadariku! 🌷",
  "Semoga toples hatimu selalu penuh dengan cinta, kesehatan, dan kasih sayang yang melimpah dari orang-orang tersayang. 🫙💙",
  "Terima kasih sudah lahir ke dunia dan menjadi bagian terindah dari perjalanan hidupku. Happy 21st, Biww! 🎂💙"
];
let currentNoteIndex = 0;

function initJarOfHearts() {
  const jarBtn = document.getElementById('glassJarBtn');
  const pickNoteBtn = document.getElementById('pickNoteBtn');
  const fillJarBtn = document.getElementById('fillJarBtn');
  const noteText = document.getElementById('noteText');
  const noteNumber = document.getElementById('noteNumber');

  function drawNewNote() {
    if (jarBtn) {
      jarBtn.classList.remove('shake');
      void jarBtn.offsetWidth; // trigger reflow
      jarBtn.classList.add('shake');
    }

    currentNoteIndex = (currentNoteIndex + 1) % jarNotes.length;
    noteText.innerText = `"${jarNotes[currentNoteIndex]}"`;
    noteNumber.innerText = currentNoteIndex + 1;

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#5A8DEE', '#F6C1A7']
      });
    }
  }

  if (jarBtn) jarBtn.addEventListener('click', drawNewNote);
  if (pickNoteBtn) pickNoteBtn.addEventListener('click', drawNewNote);

  if (fillJarBtn) {
    fillJarBtn.addEventListener('click', (e) => {
      createFloatingHeart(e.clientX, e.clientY);
      const toast = document.createElement('div');
      toast.innerText = "+1 Hati Biru dimasukkan ke Toples Cinta Bibiw 🫙💙";
      toast.style.position = 'fixed';
      toast.style.bottom = '80px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = '#5A8DEE';
      toast.style.color = '#FFF';
      toast.style.padding = '8px 20px';
      toast.style.borderRadius = '30px';
      toast.style.fontSize = '0.9rem';
      toast.style.zIndex = '9999';
      toast.style.boxShadow = '0 8px 20px rgba(90, 141, 238, 0.3)';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 1800);
    });
  }
}
