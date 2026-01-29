// baseball-explosion.js - Self-contained celebration animation
// Baseballs exploding upward from a center point with red stitching
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="baseball-explosion.js"></script>
//   2. Call createBaseballExplosion(centerX, startY) when celebration should trigger
//   3. Call updateAndDrawBaseballExplosion() in your draw() loop
//
// Example:
//   function onGameWin() {
//     createBaseballExplosion(canvasWidth/2, drawHeight);
//   }
//   function draw() {
//     // ... your drawing code ...
//     updateAndDrawBaseballExplosion(); // Draw celebration on top
//   }

let baseballExplosionParticles = [];

/**
 * Create a baseball explosion celebration
 * @param {number} centerX - X position to explode from
 * @param {number} startY - Y position to explode from (usually bottom of draw area)
 * @param {number} speedMultiplier - Speed adjustment (default 1.0, use 1.8 for fast, 0.5 for slow)
 */
function createBaseballExplosion(centerX, startY, speedMultiplier = 1.0) {
  baseballExplosionParticles = [];
  for (let i = 0; i < 15; i++) {
    let angle = random(-PI * 0.85, -PI * 0.15); // Spread upward in an arc
    let speed = random(10, 16) * speedMultiplier;
    baseballExplosionParticles.push({
      x: centerX,
      y: startY,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(25, 40),
      rotation: random(-0.3, 0.3),
      rotationSpeed: random(-0.12, 0.12) * speedMultiplier,
      alpha: 255,
      fadeRate: 1.0 * speedMultiplier,
      gravity: 0.18 * speedMultiplier
    });
  }
}

/**
 * Update physics and draw all baseball particles
 * Call this in your draw() loop
 */
function updateAndDrawBaseballExplosion() {
  for (let i = baseballExplosionParticles.length - 1; i >= 0; i--) {
    let p = baseballExplosionParticles[i];

    // Update physics
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotationSpeed;
    p.alpha -= p.fadeRate;

    // Draw the baseball
    push();
      translate(p.x, p.y);
      rotate(p.rotation);
      drawBaseballBE(0, 0, p.size, p.alpha);
    pop();

    // Remove faded particles
    if (p.alpha <= 0) {
      baseballExplosionParticles.splice(i, 1);
    }
  }
}

/**
 * Draw a baseball with red stitching
 * @param {number} x - Center X position
 * @param {number} y - Center Y position
 * @param {number} size - Diameter of the baseball
 * @param {number} alpha - Transparency (0-255)
 */
function drawBaseballBE(x, y, size, alpha) {
  // Ball body - white with subtle gray edge
  fill(255, 255, 255, alpha);
  stroke(200, 200, 200, alpha * 0.9);
  strokeWeight(1.5);
  ellipse(x, y, size, size);

  // Red stitching - curved seams
  stroke(200, 50, 50, alpha);
  strokeWeight(1.5);
  noFill();

  // Left seam curve
  arc(x - size * 0.2, y, size * 0.4, size * 0.7, -PI/2, PI/2);

  // Right seam curve
  arc(x + size * 0.2, y, size * 0.4, size * 0.7, PI/2, -PI/2);

  // Stitch marks on left seam
  let stitchSize = size * 0.08;
  let stitchSpacing = size * 0.12;
  stroke(200, 50, 50, alpha);
  strokeWeight(1.2);

  for (let i = -2; i <= 2; i++) {
    let stitchY = y + i * stitchSpacing;
    let leftCurveX = x - size * 0.2 - size * 0.2 * cos(asin(i * stitchSpacing / (size * 0.35)));

    // Small diagonal stitch marks
    line(leftCurveX - stitchSize, stitchY - stitchSize/2,
         leftCurveX + stitchSize, stitchY + stitchSize/2);
  }

  // Stitch marks on right seam
  for (let i = -2; i <= 2; i++) {
    let stitchY = y + i * stitchSpacing;
    let rightCurveX = x + size * 0.2 + size * 0.2 * cos(asin(i * stitchSpacing / (size * 0.35)));

    // Small diagonal stitch marks
    line(rightCurveX - stitchSize, stitchY - stitchSize/2,
         rightCurveX + stitchSize, stitchY + stitchSize/2);
  }
}

/**
 * Check if the animation is still playing
 * @returns {boolean} True if particles are still visible
 */
function isBaseballExplosionActive() {
  return baseballExplosionParticles.length > 0;
}

/**
 * Clear all baseball particles immediately
 */
function clearBaseballExplosion() {
  baseballExplosionParticles = [];
}
