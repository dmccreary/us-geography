// yellow-stars.js - Self-contained celebration animation
// Classic golden stars floating upward with rotation
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="yellow-stars.js"></script>
//   2. Call createYellowStars(centerX, startY) when celebration should trigger
//   3. Call updateAndDrawYellowStars() in your draw() loop

let yellowStarsParticles = [];

/**
 * Create yellow stars celebration
 * @param {number} centerX - X center position for stars
 * @param {number} startY - Y position to start from (bottom of area)
 * @param {number} spreadWidth - Horizontal spread width (default 200)
 * @param {number} speedMultiplier - Speed adjustment (default 1.0)
 */
function createYellowStars(centerX, startY, spreadWidth = 200, speedMultiplier = 1.0) {
  yellowStarsParticles = [];
  for (let i = 0; i < 25; i++) {
    yellowStarsParticles.push({
      x: centerX + random(-spreadWidth/2, spreadWidth/2),
      y: startY + random(-50, 0),
      vx: random(-1, 1) * speedMultiplier,
      vy: random(-2.5, -1.5) * speedMultiplier,
      size: random(20, 40),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.1, 0.1) * speedMultiplier,
      alpha: 255,
      fadeRate: 2.1 * speedMultiplier,
      floatAccel: 0.02 * speedMultiplier
    });
  }
}

/**
 * Update physics and draw all star particles
 */
function updateAndDrawYellowStars() {
  for (let i = yellowStarsParticles.length - 1; i >= 0; i--) {
    let p = yellowStarsParticles[i];

    // Update physics
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.alpha -= p.fadeRate;
    p.vy -= p.floatAccel; // Float upward

    // Draw the star
    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    fill(255, 215, 0, p.alpha); // Gold color
    noStroke();
    drawStarShapeYS(0, 0, p.size / 2, p.size, 5);
    pop();

    // Remove faded particles
    if (p.alpha <= 0) {
      yellowStarsParticles.splice(i, 1);
    }
  }
}

/**
 * Draw a star shape (internal utility)
 */
function drawStarShapeYS(x, y, radius1, radius2, npoints) {
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
function isYellowStarsActive() {
  return yellowStarsParticles.length > 0;
}

/**
 * Clear all star particles immediately
 */
function clearYellowStars() {
  yellowStarsParticles = [];
}
