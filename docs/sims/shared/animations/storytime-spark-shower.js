// storytime-spark-shower.js - Self-contained celebration animation
// Colorful sparks falling like rain with trails
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="storytime-spark-shower.js"></script>
//   2. Call createStorytimeSparkShower(canvasWidth, drawHeight) when celebration should trigger
//   3. Call updateAndDrawStorytimeSparkShower() in your draw() loop

let storytimeSparkParticles = [];

const sparkShowerColors = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B59B6', '#FF6B9D'
];

/**
 * Create storytime spark shower celebration
 * @param {number} areaWidth - Width of area to rain sparks across
 * @param {number} floorY - Y position of the floor
 * @param {number} speedMultiplier - Speed adjustment (default 1.0)
 */
function createStorytimeSparkShower(areaWidth, floorY, speedMultiplier = 1.0) {
  storytimeSparkParticles = [];
  for (let i = 0; i < 100; i++) {
    let sparkColor = color(sparkShowerColors[floor(random(sparkShowerColors.length))]);
    storytimeSparkParticles.push({
      x: random(areaWidth),
      y: random(-200, -10),
      vx: random(-0.3, 0.3) * speedMultiplier,
      vy: random(3, 5) * speedMultiplier,
      size: random(6, 16),
      alpha: 255,
      color: sparkColor,
      trail: [],
      trailLength: floor(random(5, 15)),
      floorY: floorY
    });
  }
}

/**
 * Update physics and draw all spark particles
 */
function updateAndDrawStorytimeSparkShower() {
  for (let i = storytimeSparkParticles.length - 1; i >= 0; i--) {
    let p = storytimeSparkParticles[i];

    // Add current position to trail
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > p.trailLength) {
      p.trail.shift();
    }

    // Update physics
    p.x += p.vx;
    p.y += p.vy;

    // Check if past floor
    if (p.y > p.floorY + 20) {
      p.alpha = 0;
    }

    // Draw trail with dark edges for visibility
    for (let j = 0; j < p.trail.length; j++) {
      let t = p.trail[j];
      let trailAlpha = (j / p.trail.length) * p.alpha * 0.5;
      let trailSize = p.size * (j / p.trail.length);

      // Dark edge for trail
      stroke(80, 80, 120, trailAlpha * 0.8);
      strokeWeight(1);
      fill(red(p.color), green(p.color), blue(p.color), trailAlpha);
      ellipse(t.x, t.y, trailSize);
    }

    // Draw spark with dark edge for visibility
    stroke(80, 80, 120, p.alpha * 0.9);
    strokeWeight(1.5);
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    ellipse(p.x, p.y, p.size);

    // Add bright center highlight
    noStroke();
    fill(255, 255, 255, p.alpha * 0.7);
    ellipse(p.x, p.y, p.size * 0.4);

    // Remove faded particles
    if (p.alpha <= 0) {
      storytimeSparkParticles.splice(i, 1);
    }
  }
}

/**
 * Check if the animation is still playing
 */
function isStorytimeSparkShowerActive() {
  return storytimeSparkParticles.length > 0;
}

/**
 * Clear all spark particles immediately
 */
function clearStorytimeSparkShower() {
  storytimeSparkParticles = [];
}
