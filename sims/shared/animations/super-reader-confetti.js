// super-reader-confetti.js - Self-contained celebration animation
// Rectangular confetti in bright colors tumbling down
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="super-reader-confetti.js"></script>
//   2. Call createSuperReaderConfetti(canvasWidth, drawHeight) when celebration should trigger
//   3. Call updateAndDrawSuperReaderConfetti() in your draw() loop

let superReaderConfettiParticles = [];

const confettiColors = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B59B6', '#FF6B9D'
];

/**
 * Create super reader confetti celebration
 * @param {number} areaWidth - Width of area to rain confetti across
 * @param {number} floorY - Y position of the floor
 * @param {number} speedMultiplier - Speed adjustment (default 1.0)
 */
function createSuperReaderConfetti(areaWidth, floorY, speedMultiplier = 1.0) {
  superReaderConfettiParticles = [];
  for (let i = 0; i < 80; i++) {
    let confettiColor = color(confettiColors[floor(random(confettiColors.length))]);
    superReaderConfettiParticles.push({
      x: random(areaWidth),
      y: random(-100, -10),
      vx: random(-1, 1) * speedMultiplier,
      vy: random(3, 5) * speedMultiplier,
      width: random(8, 15),
      height: random(15, 25),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.2, 0.2) * speedMultiplier,
      alpha: 255,
      color: confettiColor,
      wobble: random(0.03, 0.08) * speedMultiplier,
      floorY: floorY
    });
  }
}

/**
 * Update physics and draw all confetti particles
 */
function updateAndDrawSuperReaderConfetti() {
  for (let i = superReaderConfettiParticles.length - 1; i >= 0; i--) {
    let p = superReaderConfettiParticles[i];

    // Update physics
    p.x += p.vx + sin(frameCount * p.wobble) * 0.5;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;

    // Check if past floor
    if (p.y > p.floorY + 30) {
      p.alpha = 0;
    }

    // Draw confetti piece
    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    noStroke();
    rect(-p.width / 2, -p.height / 2, p.width, p.height, 2);
    pop();

    // Remove faded particles
    if (p.alpha <= 0) {
      superReaderConfettiParticles.splice(i, 1);
    }
  }
}

/**
 * Check if the animation is still playing
 */
function isSuperReaderConfettiActive() {
  return superReaderConfettiParticles.length > 0;
}

/**
 * Clear all confetti particles immediately
 */
function clearSuperReaderConfetti() {
  superReaderConfettiParticles = [];
}
