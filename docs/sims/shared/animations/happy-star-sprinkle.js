// happy-star-sprinkle.js - Self-contained celebration animation
// Smiling stars with faces gently falling like sprinkles
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="happy-star-sprinkle.js"></script>
//   2. Call createHappyStarSprinkle(canvasWidth, drawHeight) when celebration should trigger
//   3. Call updateAndDrawHappyStarSprinkle() in your draw() loop

let happyStarParticles = [];

const happyStarColors = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B59B6', '#FF6B9D'
];

/**
 * Create happy star sprinkle celebration
 * @param {number} areaWidth - Width of the area to sprinkle across
 * @param {number} floorY - Y position of the floor (stars fall to here)
 * @param {number} speedMultiplier - Speed adjustment (default 1.0)
 */
function createHappyStarSprinkle(areaWidth, floorY, speedMultiplier = 1.0) {
  happyStarParticles = [];
  for (let i = 0; i < 30; i++) {
    let starColor = color(happyStarColors[floor(random(happyStarColors.length))]);
    happyStarParticles.push({
      x: random(30, areaWidth - 30),
      y: random(-50, 50),
      vx: random(-0.5, 0.5) * speedMultiplier,
      vy: random(2.5, 4) * speedMultiplier,
      size: random(25, 45),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.05, 0.05) * speedMultiplier,
      alpha: 255,
      color: starColor,
      wobble: random(0.02, 0.05) * speedMultiplier,
      wobbleOffset: random(TWO_PI),
      floorY: floorY
    });
  }
}

/**
 * Update physics and draw all happy star particles
 */
function updateAndDrawHappyStarSprinkle() {
  for (let i = happyStarParticles.length - 1; i >= 0; i--) {
    let p = happyStarParticles[i];

    // Update physics
    p.x += p.vx + sin(frameCount * p.wobble + p.wobbleOffset) * 0.5;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;

    // Check if past floor
    if (p.y > p.floorY + 50) {
      p.alpha = 0;
    }

    // Draw the happy star
    push();
    translate(p.x, p.y);
    rotate(p.rotation);

    // Draw star body
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    noStroke();
    drawStarShapeHSS(0, 0, p.size / 2, p.size, 5);

    // Draw happy face
    fill(0, 0, 0, p.alpha);
    ellipse(-p.size * 0.15, -p.size * 0.05, p.size * 0.12);
    ellipse(p.size * 0.15, -p.size * 0.05, p.size * 0.12);

    noFill();
    stroke(0, 0, 0, p.alpha);
    strokeWeight(2);
    arc(0, p.size * 0.05, p.size * 0.3, p.size * 0.2, 0, PI);

    pop();

    // Remove faded particles
    if (p.alpha <= 0) {
      happyStarParticles.splice(i, 1);
    }
  }
}

/**
 * Draw a star shape (internal utility)
 */
function drawStarShapeHSS(x, y, radius1, radius2, npoints) {
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
function isHappyStarSprinkleActive() {
  return happyStarParticles.length > 0;
}

/**
 * Clear all happy star particles immediately
 */
function clearHappyStarSprinkle() {
  happyStarParticles = [];
}
