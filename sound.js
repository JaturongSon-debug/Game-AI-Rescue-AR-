/**
 * sound.js - Web Audio API Synthesizer & Speech Synthesis API (Thai th-TH)
 */

class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.speechSynth = window.speechSynthesis || null;
    this.voices = [];

    if (this.speechSynth) {
      this.loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  loadVoices() {
    if (!this.speechSynth) return;
    this.voices = this.speechSynth.getVoices();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.speechSynth) {
      this.speechSynth.cancel();
    }
    return this.isMuted;
  }

  playTone(freq = 440, type = 'sine', duration = 0.15, gainVal = 0.2) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio play error:", e);
    }
  }

  playClick() {
    this.playTone(523.25, 'triangle', 0.08, 0.2);
  }

  playGrab() {
    this.playTone(329.63, 'sine', 0.1, 0.25);
  }

  playUnplug() {
    this.playTone(659.25, 'triangle', 0.2, 0.3);
  }

  playBreaker() {
    this.playTone(150, 'sawtooth', 0.25, 0.4);
  }

  playErrorBuzzer() {
    this.playTone(120, 'sawtooth', 0.3, 0.4);
  }

  playElectricSpark() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;
    const bufferSize = this.audioCtx.sampleRate * 0.15;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = buffer;
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.15);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);
    whiteNoise.start();
  }

  playCPRBeat() {
    this.playTone(440, 'square', 0.1, 0.3);
  }

  playVictory() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.2, 0.3);
      }, idx * 120);
    });
  }

  speak(text) {
    if (this.isMuted || !this.speechSynth) return;
    this.speechSynth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'th-TH';
    utterance.rate = 1.0;
    utterance.pitch = 1.1;

    const thaiVoice = this.voices.find(v => v.lang.includes('th'));
    if (thaiVoice) {
      utterance.voice = thaiVoice;
    }

    this.speechSynth.speak(utterance);
  }
}

const soundManager = new SoundEngine();
