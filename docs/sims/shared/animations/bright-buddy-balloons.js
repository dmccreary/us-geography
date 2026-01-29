// bright-buddy-balloons.js - Self-contained celebration animation
// Colorful balloons floating upward with strings
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="bright-buddy-balloons.js"></script>
//   2. Call createBrightBuddyBalloons(canvasWidth, startY) when celebration should trigger
//   3. Call updateAndDrawBrightBuddyBalloons() in your draw() loop

let brightBuddyBalloonParticles = [];

const balloonColors = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B59B6', '#FF6B9D'
];

/**
 * Create bright buddy balloons celebration
 * @param {number} areaWidth - Width of area to launch balloons from
 * @param {number} startY - Y position to start from (bottom)
 * @param {number} speedMultiplier - Speed adjustment (default 1.0)
 */
function createBrightBuddyBalloons(areaWidth, startY, speedMultiplier = 1.0) {
  brightBuddyBalloonParticles = [];
  for (let i = 0; i < 15; i++) {
    let balloonColor = color(balloonColors[floor(random(balloonColors.length))]);
    brightBuddyBalloonParticles.push({
      x: random(50, areaWidth - 50),
      y: startY + random(20, 100),
      vx: random(-0.5, 0.5) * speedMultiplier,
      vy: random(-2.5, -1.5) * speedMultiplier,
      size: random(30, 50),
      alpha: 255,
      color: balloonColor,
      wobble: random(0.02, 0.04) * speedMultiplier,
      wobbleOffset: random(TWO_PI),
      stringLength: random(20, 40)
    });
  }
}

/**
 * Update physics and draw all balloon particles
 */
function updateAndDrawBrightBuddyBalloons() {
  for (let i = brightBuddyBalloonParticles.length - 1; i >= 0; i--) {
    let p = brightBuddyBalloonParticles[i];

    // Update physics
    p.x += p.vx + sin(frameCount * p.wobble + p.wobbleOffset) * 0.3;
    p.y += p.vy;

    // Check if off top of screen
    if (p.y < -60) {
      p.alpha = 0;
    }

    // Draw balloon
    push();
    translate(p.x, p.y);

    // String
    stroke(150, p.alpha);
    strokeWeight(1);
    line(0, p.size / 2, 0, p.size / 2 + p.stringLength);

    // Balloon body
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    noStroke();
    ellipse(0, 0, p.size, p.size * 1.2);

    // Balloon knot
    triangle(-3, p.size / 2 - 2, 3, p.size / 2 - 2, 0, p.size / 2 + 5);

    // Highlight
    fill(255, 255, 255, p.alpha * 0.4);
    ellipse(-p.size * 0.2, -p.size * 0.25, p.size * 0.25, p.size * 0.35);

    pop();

    // Remove faded particles
    if (p.alpha <= 0) {
      brightBuddyBalloonParticles.splice(i, 1);
    }
  }
}

/**
 * Check if the animation is still playing
 */
function isBrightBuddyBalloonsActive() {
  return brightBuddyBalloonParticles.length > 0;
}

/**
 * Clear all balloon particles immediately
 */
function clearBrightBuddyBalloons() {
  brightBuddyBalloonParticles = [];
}
