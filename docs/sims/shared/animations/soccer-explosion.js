// soccer-explosion.js - Self-contained celebration animation
// Soccer balls exploding upward from a center point with black pentagon pattern
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="soccer-explosion.js"></script>
//   2. Call createSoccerExplosion(centerX, startY) when celebration should trigger
//   3. Call updateAndDrawSoccerExplosion() in your draw() loop
//
// Example:
//   function onGameWin() {
//     createSoccerExplosion(canvasWidth/2, drawHeight);
//   }
//   function draw() {
//     // ... your drawing code ...
//     updateAndDrawSoccerExplosion(); // Draw celebration on top
//   }

let soccerExplosionParticles = [];

/**
 * Create a soccer ball explosion celebration
 * @param {number} centerX - X position to explode from
 * @param {number} startY - Y position to explode from (usually bottom of draw area)
 * @param {number} speedMultiplier - Speed adjustment (default 1.0, use 1.8 for fast, 0.5 for slow)
 */
function createSoccerExplosion(centerX, startY, speedMultiplier = 1.0) {
  soccerExplosionParticles = [];
  for (let i = 0; i < 15; i++) {
    let angle = random(-PI * 0.85, -PI * 0.15); // Spread upward in an arc
    let speed = random(10, 16) * speedMultiplier;
    soccerExplosionParticles.push({
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
 * Update physics and draw all soccer ball particles
 * Call this in your draw() loop
 */
function updateAndDrawSoccerExplosion() {
  for (let i = soccerExplosionParticles.length - 1; i >= 0; i--) {
    let p = soccerExplosionParticles[i];

    // Update physics
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotationSpeed;
    p.alpha -= p.fadeRate;

    // Draw the soccer ball
    push();
      translate(p.x, p.y);
      rotate(p.rotation);
      drawSoccerBallSE(0, 0, p.size, p.alpha);
    pop();

    // Remove faded particles
    if (p.alpha <= 0) {
      soccerExplosionParticles.splice(i, 1);
    }
  }
}

/**
 * Draw a soccer ball with classic black pentagon and white hexagon pattern
 * @param {number} x - Center X position
 * @param {number} y - Center Y position
 * @param {number} size - Diameter of the soccer ball
 * @param {number} alpha - Transparency (0-255)
 */
function drawSoccerBallSE(x, y, size, alpha) {
  let radius = size / 2;
  let lineWeight = max(1, size * 0.03);

  // Step 1: Solid white ball with black outline
  fill(255, 255, 255, alpha);
  stroke(30, 30, 30, alpha);
  strokeWeight(lineWeight * 1.5);
  ellipse(x, y, size, size);

  // Step 2: Center black pentagon (filled, no stroke)
  fill(30, 30, 30, alpha);
  noStroke();
  let centerPentRadius = radius * 0.30;
  drawPentagonSE(x, y, centerPentRadius, -PI / 2);

  // Step 3: Lines from center pentagon vertices to edge
  stroke(30, 30, 30, alpha);
  strokeWeight(lineWeight);

  for (let i = 0; i < 5; i++) {
    let angle = (TWO_PI / 5) * i - PI / 2;
    let x1 = x + cos(angle) * centerPentRadius;
    let y1 = y + sin(angle) * centerPentRadius;
    let x2 = x + cos(angle) * (radius * 0.95);
    let y2 = y + sin(angle) * (radius * 0.95);
    line(x1, y1, x2, y2);
  }

  // Step 4: Small black shapes at the edge (aligned with the lines)
  // These peek in from the edge of the ball, with points touching the spokes
  fill(30, 30, 30, alpha);
  noStroke();

  for (let i = 0; i < 5; i++) {
    let angle = (TWO_PI / 5) * i - PI / 2; // Same angle as the spokes

    // Draw a small triangle/wedge at the edge
    let edgeDist = radius * 0.98;
    let innerDist = radius * 0.65;
    let spread = PI / 8;

    beginShape();
    // Inner point (on the spoke line)
    vertex(x + cos(angle) * innerDist, y + sin(angle) * innerDist);
    // Edge points (wider, to sides of the spoke)
    vertex(x + cos(angle - spread) * edgeDist, y + sin(angle - spread) * edgeDist);
    vertex(x + cos(angle + spread) * edgeDist, y + sin(angle + spread) * edgeDist);
    endShape(CLOSE);
  }
}

/**
 * Draw a pentagon shape
 * @param {number} x - Center X position
 * @param {number} y - Center Y position
 * @param {number} radius - Radius of the pentagon
 * @param {number} rotation - Rotation offset
 */
function drawPentagonSE(x, y, radius, rotation) {
  beginShape();
  for (let i = 0; i < 5; i++) {
    let angle = (TWO_PI / 5) * i + rotation;
    let px = x + cos(angle) * radius;
    let py = y + sin(angle) * radius;
    vertex(px, py);
  }
  endShape(CLOSE);
}

/**
 * Draw a hexagon shape
 * @param {number} x - Center X position
 * @param {number} y - Center Y position
 * @param {number} radius - Radius of the hexagon
 * @param {number} rotation - Rotation offset
 */
function drawHexagonSE(x, y, radius, rotation) {
  beginShape();
  for (let i = 0; i < 6; i++) {
    let angle = (TWO_PI / 6) * i + rotation;
    let px = x + cos(angle) * radius;
    let py = y + sin(angle) * radius;
    vertex(px, py);
  }
  endShape(CLOSE);
}

/**
 * Check if the animation is still playing
 * @returns {boolean} True if particles are still visible
 */
function isSoccerExplosionActive() {
  return soccerExplosionParticles.length > 0;
}

/**
 * Clear all soccer ball particles immediately
 */
function clearSoccerExplosion() {
  soccerExplosionParticles = [];
}
