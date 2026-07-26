/**
 * hand-tracking.js - MediaPipe Hand Landmarker integration & Relative Pinch calculation
 */

class HandTracker {
  constructor() {
    this.handLandmarker = null;
    this.videoElement = null;
    this.canvasElement = null;
    this.isCameraActive = false;
    this.isFallbackMode = false;

    // Smooth Cursor Coordinates
    this.cursorX = window.innerWidth / 2;
    this.cursorY = window.innerHeight / 2;
    this.targetX = this.cursorX;
    this.targetY = this.cursorY;

    // Gesture State
    this.isPinching = false;
    this.pinchRatio = 1.0;
    this.isHandDetected = false;

    // Callback on hand update
    this.onUpdateCallback = null;
  }

  async init(videoEl, canvasEl, onStatusChange) {
    this.videoElement = videoEl;
    this.canvasElement = canvasEl;

    // Setup Fallback Mouse/Touch Listeners
    this.setupFallbackListeners();

    try {
      // Import MediaPipe Tasks Vision module dynamically or from window
      const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest");
      const { HandLandmarker, FilesetResolver } = vision;

      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1,
        minHandDetectionConfidence: 0.6,
        minHandPresenceConfidence: 0.6,
        minTrackingConfidence: 0.6
      });

      if (onStatusChange) onStatusChange({ success: true, message: "MediaPipe Ready" });
    } catch (err) {
      console.warn("MediaPipe HandLandmarker init failed, switching to Mouse/Touch mode:", err);
      this.isFallbackMode = true;
      if (onStatusChange) onStatusChange({ success: false, message: "Fallback Mouse Mode Active" });
    }
  }

  async startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.isFallbackMode = true;
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      this.videoElement.srcObject = stream;
      await this.videoElement.play();
      this.isCameraActive = true;
      this.isFallbackMode = false;
      return true;
    } catch (err) {
      console.warn("Camera access denied or failed:", err);
      this.isCameraActive = false;
      this.isFallbackMode = true;
      return false;
    }
  }

  stopCamera() {
    if (this.videoElement && this.videoElement.srcObject) {
      const tracks = this.videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      this.videoElement.srcObject = null;
    }
    this.isCameraActive = false;
    this.isFallbackMode = true;
    this.isHandDetected = false;
  }

  processFrame(timestamp) {
    // Lerp Smooth Cursor Movement
    this.cursorX += (this.targetX - this.cursorX) * 0.3;
    this.cursorY += (this.targetY - this.cursorY) * 0.3;

    if (!this.isCameraActive || this.isFallbackMode || !this.handLandmarker || !this.videoElement || this.videoElement.readyState < 2) {
      return;
    }

    try {
      const results = this.handLandmarker.detectForVideo(this.videoElement, timestamp);

      if (results.landmarks && results.landmarks.length > 0) {
        this.isHandDetected = true;
        const landmarks = results.landmarks[0];

        // Landmark points
        // 0: Wrist, 4: Thumb Tip, 8: Index Tip, 9: Middle MCP
        const thumbTip = landmarks[4];
        const indexTip = landmarks[8];
        const wrist = landmarks[0];
        const middleMCP = landmarks[9];

        // Mirror compensation for cursor coordinates
        const rawCursorX = 1.0 - ((thumbTip.x + indexTip.x) / 2);
        const rawCursorY = (thumbTip.y + indexTip.y) / 2;

        this.targetX = rawCursorX * this.canvasElement.width;
        this.targetY = rawCursorY * this.canvasElement.height;

        // Relative Pinch Logic Formula
        // Distance(ThumbTip, IndexTip) / Distance(Wrist, MiddleMCP)
        const pinchDistance = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
        const handScaleDistance = Math.hypot(wrist.x - middleMCP.x, wrist.y - middleMCP.y);

        if (handScaleDistance > 0.001) {
          this.pinchRatio = pinchDistance / handScaleDistance;
        } else {
          this.pinchRatio = 1.0;
        }

        // Pinch trigger threshold < 0.35
        this.isPinching = this.pinchRatio < 0.35;
      } else {
        this.isHandDetected = false;
        this.isPinching = false;
      }
    } catch (e) {
      console.warn("Frame detection error:", e);
    }
  }

  setupFallbackListeners() {
    window.addEventListener('mousemove', (e) => {
      if (this.isFallbackMode || !this.isCameraActive) {
        this.targetX = e.clientX;
        this.targetY = e.clientY;
        this.isHandDetected = true;
      }
    });

    window.addEventListener('mousedown', () => {
      if (this.isFallbackMode || !this.isCameraActive) {
        this.isPinching = true;
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isFallbackMode || !this.isCameraActive) {
        this.isPinching = false;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if ((this.isFallbackMode || !this.isCameraActive) && e.touches.length > 0) {
        this.targetX = e.touches[0].clientX;
        this.targetY = e.touches[0].clientY;
        this.isHandDetected = true;
      }
    });

    window.addEventListener('touchstart', (e) => {
      if (this.isFallbackMode || !this.isCameraActive) {
        if (e.touches.length > 0) {
          this.targetX = e.touches[0].clientX;
          this.targetY = e.touches[0].clientY;
        }
        this.isPinching = true;
        this.isHandDetected = true;
      }
    });

    window.addEventListener('touchend', () => {
      if (this.isFallbackMode || !this.isCameraActive) {
        this.isPinching = false;
      }
    });
  }
}

const handTracker = new HandTracker();
