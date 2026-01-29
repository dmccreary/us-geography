// rainbow-sparkle-burst.js - Self-contained celebration animation
// Colorful sparkles exploding from center in rainbow colors
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="rainbow-sparkle-burst.js"></script>
//   2. Call createRainbowSparkleBurst(centerX, centerY) when celebration should trigger
//   3. Call updateAndDrawRainbowSparkleBurst() in your draw() loop

let rainbowSparkleParticles = [];

const rainbowSparkleColors = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B59B6', '#FF6B9D'
];

/**
 * Create rainbow sparkle burst celebration
 * @param {number} centerX - X center of explosion
 * @param {number} centerY - Y center of explosion
 * @param {number} speedMultiplier - Speed adjustment (default 1.0)
 */
function createRainbowSparkleBurst(centerX, centerY, speedMultiplier = 1.0) {
  rainbowSparkleParticles = [];
  for (let i = 0; i < 60; i++) {
    let angle = random(TWO_PI);
    let speed = random(3, 6) * speedMultiplier;
    let sparkleColor = color(rainbowSparkleColors[floor(random(rainbowSparkleColors.length))]);
    rainbowSparkleParticles.push({
      x: centerX,
      y: centerY,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(8, 20),
      alpha: 255,
      fadeRate: 2.5 * speedMultiplier,
      color: sparkleColor,
      twinkle: random(0.1, 0.3) * speedMultiplier
    });
  }
}

/**
 * Update physics and draw all sparkle particles
 */
function updateAndDrawRainbowSparkleBurst() {
  for (let i = rainbowSparkleParticles.length - 1; i >= 0; i--) {
    let p = rainbowSparkleParticles[i];

    // Update physics
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.alpha -= p.fadeRate;
    p.size *= 0.98;

    // Draw the sparkle (4-pointed star)
    push();
    translate(p.x, p.y);
    let twinkleSize = p.size * (0.8 + sin(frameCount * p.twinkle) * 0.2);
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    noStroke();
    drawSparkleShapeRSB(0, 0, twinkleSize / 3, twinkleSize, 4);
    pop();

    // Remove faded particles
    if (p.alpha <= 0) {
      rainbowSparkleParticles.splice(i, 1);
    }
  }
}

/**
 * Draw a sparkle/star shape (internal utility)
 */
function drawSparkleShapeRSB(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = -PI / 2; a < TWO_PI - PI / 2; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

/**
 * Check if the animation is still playing
 */
function isRainbowSparkleBurstActive() {
  return rainbowSparkleParticles.length > 0;
}

/**
 * Clear all sparkle particles immediately
 */
function clearRainbowSparkleBurst() {
  rainbowSparkleParticles = [];
}
