/**
 * game.js - Main Application Orchestrator for 10 Levels & Scoring HUD
 */

class GameApp {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.video = null;
    this.isPaused = false;
    this.animationFrameId = null;

    this.elements = {};
  }

  async init() {
    this.bindElements();
    this.setupCanvas();
    this.bindEvents();

    await handTracker.init(this.video, this.canvas, (status) => {
      this.updateHandStatus(status.success);
    });

    levelManager.initLevel(1, this.canvas.width, this.canvas.height);
    this.updateLevelUI();
    this.loop(0);
  }

  bindElements() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.video = document.getElementById('webcam-video');

    this.elements = {
      privacyModal: document.getElementById('privacy-modal'),
      btnStartCam: document.getElementById('btn-start-cam'),
      btnFallbackMouse: document.getElementById('btn-fallback-mouse'),
      btnSoundToggle: document.getElementById('btn-sound-toggle'),
      btnPause: document.getElementById('btn-pause'),
      btnCameraToggle: document.getElementById('btn-camera-toggle'),
      levelTitle: document.getElementById('level-title'),
      levelDesc: document.getElementById('level-desc'),
      handDot: document.getElementById('hand-dot'),
      handText: document.getElementById('hand-text'),
      scoreText: document.getElementById('score-text'),
      winModal: document.getElementById('win-modal'),
      winStars: document.getElementById('win-stars'),
      btnNextLevel: document.getElementById('btn-next-level'),
      btnRestart: document.getElementById('btn-restart')
    };
  }

  setupCanvas() {
    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      levelManager.initLevel(levelManager.currentLevel, this.canvas.width, this.canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();
  }

  bindEvents() {
    this.elements.btnStartCam.addEventListener('click', async () => {
      soundManager.playClick();
      const ok = await handTracker.startCamera();
      this.elements.privacyModal.classList.add('hidden');
      this.updateHandStatus(ok);
    });

    this.elements.btnFallbackMouse.addEventListener('click', () => {
      soundManager.playClick();
      handTracker.stopCamera();
      this.elements.privacyModal.classList.add('hidden');
      this.updateHandStatus(false);
    });

    this.elements.btnSoundToggle.addEventListener('click', () => {
      const isMuted = soundManager.toggleMute();
      this.elements.btnSoundToggle.innerText = isMuted ? '🔇' : '🔊';
    });

    this.elements.btnPause.addEventListener('click', () => {
      soundManager.playClick();
      this.isPaused = !this.isPaused;
      this.elements.btnPause.innerText = this.isPaused ? '▶️' : '⏸️';
    });

    this.elements.btnCameraToggle.addEventListener('click', async () => {
      soundManager.playClick();
      if (handTracker.isCameraActive) {
        handTracker.stopCamera();
        this.elements.btnCameraToggle.innerText = '📷 เปิดกล้อง';
      } else {
        const ok = await handTracker.startCamera();
        this.elements.btnCameraToggle.innerText = '🚫 ปิดกล้อง';
        this.updateHandStatus(ok);
      }
    });

    this.canvas.addEventListener('click', (e) => {
      if (levelManager.currentLevel === 8 && levelManager.state.l8.phoneDialed !== "1129") {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        const phoneW = Math.min(w * 0.75, Math.max(260, Math.min(w * 0.38, 320)));
        const phoneH = Math.min(h * 0.65, 520);
        const phoneX = (w - phoneW) / 2;
        const phoneY = Math.max(h * 0.22, 130);

        const screenX = phoneX + 8;
        const screenY = phoneY + 32;
        const screenW = phoneW - 16;
        const screenH = phoneH - 42;

        const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "Call"];
        const startY = screenY + 115;
        const rowGap = (screenH - 130) / 4;
        const colGap = screenW / 3;
        const btnRadius = Math.min(24, Math.min(colGap, rowGap) * 0.38);

        keys.forEach((k, idx) => {
          const row = Math.floor(idx / 3);
          const col = idx % 3;
          const kx = screenX + colGap * (col + 0.5);
          const ky = startY + rowGap * (row + 0.4);
          const dist = Math.hypot(e.clientX - kx, e.clientY - ky);
          if (dist < btnRadius + 10) {
            levelManager.pressKeypad(k);
          }
        });
      }
    });

    this.elements.btnNextLevel.addEventListener('click', () => {
      soundManager.playClick();
      this.elements.winModal.classList.add('hidden');
      if (levelManager.currentLevel < 10) {
        levelManager.initLevel(levelManager.currentLevel + 1, this.canvas.width, this.canvas.height);
        this.updateLevelUI();
      } else {
        levelManager.initLevel(1, this.canvas.width, this.canvas.height);
        this.updateLevelUI();
      }
    });

    this.elements.btnRestart.addEventListener('click', () => {
      soundManager.playClick();
      this.elements.winModal.classList.add('hidden');
      levelManager.initLevel(1, this.canvas.width, this.canvas.height);
      this.updateLevelUI();
    });
  }

  updateHandStatus(active) {
    if (active && handTracker.isCameraActive) {
      this.elements.handDot.classList.add('active');
      this.elements.handText.innerText = "ตรวจจับมือ (AR Active)";
    } else {
      this.elements.handDot.classList.remove('active');
      this.elements.handText.innerText = "โหมดเมาส์ / สัมผัสหน้าจอ";
    }
  }

  updateLevelUI() {
    const info = levelManager.levelInfo[levelManager.currentLevel - 1];
    this.elements.levelTitle.innerText = info.title;
    this.elements.levelDesc.innerText = info.desc;
    if (this.elements.scoreText) {
      this.elements.scoreText.innerText = `คะแนนสะสม: ${levelManager.totalScore}`;
    }
  }

  loop(timestamp) {
    if (!this.isPaused) {
      handTracker.processFrame(timestamp);
      levelManager.update(handTracker, this.canvas.width, this.canvas.height);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      levelManager.render(this.ctx, this.canvas.width, this.canvas.height, handTracker);

      if (levelManager.levelComplete && this.elements.winModal.classList.contains('hidden')) {
        setTimeout(() => {
          if (this.elements.winStars) {
            this.elements.winStars.innerText = "⭐".repeat(levelManager.starCount);
          }
          this.elements.winModal.classList.remove('hidden');
        }, 500);
      }
    }

    this.animationFrameId = requestAnimationFrame((ts) => this.loop(ts));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new GameApp();
  app.init();
});
