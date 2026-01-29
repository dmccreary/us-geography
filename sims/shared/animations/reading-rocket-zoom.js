// reading-rocket-zoom.js - Self-contained celebration animation
// Rockets zooming across the screen with flame trails
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="reading-rocket-zoom.js"></script>
//   2. Call createReadingRocketZoom(canvasWidth, drawHeight) when celebration should trigger
//   3. Call updateAndDrawReadingRocketZoom() in your draw() loop

let readingRocketParticles = [];

const rocketColors = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B59B6', '#FF6B9D'
];

/**
 * Create reading rocket zoom celebration
 * @param {number} areaWidth - Width of area for rockets to cross
 * @param {number} areaHeight - Height of area for rockets to fly in
 * @param {number} speedMultiplier - Speed adjustment (default 1.0)
 */
function createReadingRocketZoom(areaWidth, areaHeight, speedMultiplier = 1.0) {
  readingRocketParticles = [];
  for (let i = 0; i < 8; i++) {
    let startSide = random() > 0.5;
    let baseSpeed = random(5, 8) * speedMultiplier;
    let rocketColor = color(rocketColors[floor(random(rocketColors.length))]);
    readingRocketParticles.push({
      x: startSide ? -30 : areaWidth + 30,
      y: random(80, areaHeight - 80),
      vx: startSide ? baseSpeed : -baseSpeed,
      vy: random(-0.5, 0.5) * speedMultiplier,
      size: 25,
      alpha: 255,
      color: rocketColor,
      trail: [],
      areaWidth: areaWidth,
      speedMultiplier: speedMultiplier
    });
  }
}

/**
 * Update physics and draw all rocket particles
 */
function updateAndDrawReadingRocketZoom() {
  for (let i = readingRocketParticles.length - 1; i >= 0; i--) {
    let p = readingRocketParticles[i];

    // Add trail
    p.trail.push({ x: p.x, y: p.y, alpha: 255 });
    if (p.trail.length > 20) {
      p.trail.shift();
    }

    // Update physics
    p.x += p.vx;
    p.y += p.vy;

    // Fade trail
    for (let t of p.trail) {
      t.alpha -= 12 * p.speedMultiplier;
    }

    // Check if off screen
    if (p.x < -50 || p.x > p.areaWidth + 50) {
      p.alpha = 0;
    }

    // Draw trail
    for (let j = 0; j < p.trail.length; j++) {
      let t = p.trail[j];
      if (t.alpha > 0) {
        fill(255, 200, 100, t.alpha);
        noStroke();
        ellipse(t.x, t.y, 8 * (j / p.trail.length));
      }
    }

    // Draw rocket
    push();
    translate(p.x, p.y);
    if (p.vx < 0) rotate(PI);

    // Rocket body
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    noStroke();
    ellipse(0, 0, p.size, p.size * 0.6);

    // Rocket nose
    fill(255, 100, 100, p.alpha);
    triangle(p.size / 2, 0, p.size / 2 - 8, -6, p.size / 2 - 8, 6);

    // Rocket fins
    fill(red(p.color) * 0.7, green(p.color) * 0.7, blue(p.color) * 0.7, p.alpha);
    triangle(-p.size / 2, 0, -p.size / 2 - 5, -8, -p.size / 2 + 5, 0);
    triangle(-p.size / 2, 0, -p.size / 2 - 5, 8, -p.size / 2 + 5, 0);

    // Window
    fill(200, 230, 255, p.alpha);
    ellipse(p.size / 4, 0, 8);

    pop();

    // Remove faded particles
    if (p.alpha <= 0) {
      readingRocketParticles.splice(i, 1);
    }
  }
}

/**
 * Check if the animation is still playing
 */
function isReadingRocketZoomActive() {
  return readingRocketParticles.length > 0;
}

/**
 * Clear all rocket particles immediately
 */
function clearReadingRocketZoom() {
  readingRocketParticles = [];
}
