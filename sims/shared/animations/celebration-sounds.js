// celebration-sounds.js - Audio feedback for celebration animations
// Optional - provides celebratory sound effects using Web Audio API
// Copy this file into your MicroSim folder if you want sound effects
//
// Usage:
//   1. Include this file in your main.html: <script src="celebration-sounds.js"></script>
//   2. Call playCelebrationSound() when triggering a celebration
//   3. Optionally specify a sound type: playCelebrationSound('fanfare')

/**
 * Play a celebration sound effect
 * @param {string} type - Sound type: 'chime' (default), 'fanfare', 'pop', 'whoosh'
 */
function playCelebrationSound(type = 'chime') {
  try {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let notes;

    switch (type) {
      case 'fanfare':
        // Triumphant ascending fanfare
        notes = [392, 494, 587, 784, 988]; // G major ascending
        playNoteSequence(audioContext, notes, 0.1, 0.25);
        break;

      case 'pop':
        // Quick pop sound
        notes = [880];
        playNoteSequence(audioContext, notes, 0.15, 0.15);
        break;

      case 'whoosh':
        // Rising whoosh
        playWhoosh(audioContext);
        break;

      case 'chime':
      default:
        // Pleasant chime sequence
        notes = [523, 659, 784, 1047]; // C major ascending
        playNoteSequence(audioContext, notes, 0.12, 0.25);
        break;
    }
  } catch (e) {
    // Audio not available - fail silently
  }
}

/**
 * Play a sequence of musical notes
 */
function playNoteSequence(audioContext, notes, interval, duration) {
  notes.forEach((freq, i) => {
    let oscillator = audioContext.createOscillator();
    let gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = freq;
    oscillator.type = 'sine';

    let startTime = audioContext.currentTime + i * interval;
    gainNode.gain.setValueAtTime(0.15, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  });
}

/**
 * Play a rising whoosh sound effect
 */
function playWhoosh(audioContext) {
  let oscillator = audioContext.createOscillator();
  let gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

/**
 * Play a success/correct answer sound
 */
function playCorrectSound() {
  try {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = audioContext.createOscillator();
    let gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 880; // A5 note
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (e) {
    // Audio not available
  }
}

/**
 * Play a gentle "try again" sound
 */
function playTryAgainSound() {
  try {
    let audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let oscillator = audioContext.createOscillator();
    let gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 220; // A3 note - lower, gentler
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (e) {
    // Audio not available
  }
}
