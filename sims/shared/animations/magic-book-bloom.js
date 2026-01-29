// magic-book-bloom.js - Self-contained celebration animation
// Glowing particles blooming outward like opening a magic book
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="magic-book-bloom.js"></script>
//   2. Call createMagicBookBloom(centerX, centerY) when celebration should trigger
//   3. Call updateAndDrawMagicBookBloom() in your draw() loop

let magicBookBloomParticles = [];

/**
 * Create magic book bloom celebration
 * @param {number} centerX - X center of bloom
 * @param {number} centerY - Y center of bloom
 * @param {number} speedMultiplier - Speed adjustment (default 1.0)
 */
function createMagicBookBloom(centerX, centerY, speedMultiplier = 1.0) {
  magicBookBloomParticles = [];
  for (let i = 0; i < 50; i++) {
    let angle = (TWO_PI / 50) * i + random(-0.2, 0.2);
    let speed = random(1.5, 3.5) * speedMultiplier;
    // Soft pastel magical colors
    let bloomColor = color(random(200, 255), random(150, 255), random(200, 255));
    magicBookBloomParticles.push({
      x: centerX,
      y: centerY,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(10, 25),
      alpha: 255,
      fadeRate: 2.1 * speedMultiplier,
      color: bloomColor,
      glow: random(5, 15),
      pulse: random(0.05, 0.1) * speedMultiplier
    });
  }
}

/**
 * Update physics and draw all bloom particles
 */
function updateAndDrawMagicBookBloom() {
  for (let i = magicBookBloomParticles.length - 1; i >= 0; i--) {
    let p = magicBookBloomParticles[i];

    // Update physics
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.97;
    p.vy *= 0.97;
    p.alpha -= p.fadeRate;
    p.size += sin(frameCount * p.pulse) * 0.3;

    // Draw bloom particle with glow
    push();
    translate(p.x, p.y);

    // Glow effect
    for (let g = p.glow; g > 0; g -= 3) {
      fill(red(p.color), green(p.color), blue(p.color), p.alpha * 0.1);
      noStroke();
      ellipse(0, 0, p.size + g * 2);
    }

    // Core
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    ellipse(0, 0, p.size);

    pop();

    // Remove faded particles
    if (p.alpha <= 0) {
      magicBookBloomParticles.splice(i, 1);
    }
  }
}

/**
 * Check if the animation is still playing
 */
function isMagicBookBloomActive() {
  return magicBookBloomParticles.length > 0;
}

/**
 * Clear all bloom particles immediately
 */
function clearMagicBookBloom() {
  magicBookBloomParticles = [];
}
