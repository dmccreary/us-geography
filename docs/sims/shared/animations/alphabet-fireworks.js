// alphabet-fireworks.js - Self-contained celebration animation
// Letters shooting up and exploding like fireworks
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="alphabet-fireworks.js"></script>
//   2. Call createAlphabetFireworks(canvasWidth, startY) when celebration should trigger
//   3. Call updateAndDrawAlphabetFireworks() in your draw() loop

let alphabetFireworksParticles = [];

const alphabetFireworksColors = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B59B6', '#FF6B9D'
];

const alphabetLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Create alphabet fireworks celebration
 * @param {number} areaWidth - Width of area to launch from
 * @param {number} startY - Y position to launch from (bottom)
 * @param {number} speedMultiplier - Speed adjustment (default 1.0)
 */
function createAlphabetFireworks(areaWidth, startY, speedMultiplier = 1.0) {
  alphabetFireworksParticles = [];
  for (let i = 0; i < 15; i++) {
    let startX = random(50, areaWidth - 50);
    let letterColor = color(alphabetFireworksColors[floor(random(alphabetFireworksColors.length))]);
    alphabetFireworksParticles.push({
      type: 'letter',
      x: startX,
      y: startY - 20,
      vx: 0,
      vy: random(-6, -4) * speedMultiplier,
      size: random(24, 36),
      alpha: 255,
      color: letterColor,
      letter: alphabetLetters[floor(random(alphabetLetters.length))],
      exploded: false,
      explosionTime: random(25, 40) / speedMultiplier,
      speedMultiplier: speedMultiplier
    });
  }
}

/**
 * Update physics and draw all firework particles
 */
function updateAndDrawAlphabetFireworks() {
  for (let i = alphabetFireworksParticles.length - 1; i >= 0; i--) {
    let p = alphabetFireworksParticles[i];

    if (p.type === 'letter') {
      // Update letter rocket
      if (!p.exploded) {
        p.y += p.vy;
        p.explosionTime--;
        if (p.explosionTime <= 0 || p.y < 100) {
          p.exploded = true;
          // Create explosion pieces
          for (let j = 0; j < 12; j++) {
            let angle = (TWO_PI / 12) * j;
            let expSpeed = random(2, 4) * p.speedMultiplier;
            alphabetFireworksParticles.push({
              type: 'explosion',
              x: p.x,
              y: p.y,
              vx: cos(angle) * expSpeed,
              vy: sin(angle) * expSpeed,
              size: random(5, 10),
              alpha: 255,
              fadeRate: 4.5 * p.speedMultiplier,
              color: p.color,
              gravity: 0.1 * p.speedMultiplier
            });
          }
        }

        // Draw letter
        push();
        translate(p.x, p.y);
        fill(red(p.color), green(p.color), blue(p.color), p.alpha);
        noStroke();
        textSize(p.size);
        textAlign(CENTER, CENTER);
        text(p.letter, 0, 0);
        pop();
      } else {
        p.alpha -= 15 * p.speedMultiplier;
      }
    } else if (p.type === 'explosion') {
      // Update explosion piece
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.fadeRate;

      // Draw explosion piece
      fill(red(p.color), green(p.color), blue(p.color), p.alpha);
      noStroke();
      ellipse(p.x, p.y, p.size);
    }

    // Remove faded particles
    if (p.alpha <= 0) {
      alphabetFireworksParticles.splice(i, 1);
    }
  }
}

/**
 * Check if the animation is still playing
 */
function isAlphabetFireworksActive() {
  return alphabetFireworksParticles.length > 0;
}

/**
 * Clear all firework particles immediately
 */
function clearAlphabetFireworks() {
  alphabetFireworksParticles = [];
}
