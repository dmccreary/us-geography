// giggle-glitter-pop.js - Self-contained celebration animation
// Bouncy glitter circles that pop and multiply into sparkles
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="giggle-glitter-pop.js"></script>
//   2. Call createGiggleGlitterPop(canvasWidth, drawHeight) when celebration should trigger
//   3. Call updateAndDrawGiggleGlitterPop() in your draw() loop

let giggleGlitterParticles = [];

const glitterColors = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B59B6', '#FF6B9D'
];

/**
 * Create giggle glitter pop celebration
 * @param {number} areaWidth - Width of area to place glitter
 * @param {number} areaHeight - Height of area to place glitter
 * @param {number} speedMultiplier - Speed adjustment (default 1.0)
 */
function createGiggleGlitterPop(areaWidth, areaHeight, speedMultiplier = 1.0) {
  giggleGlitterParticles = [];
  for (let i = 0; i < 20; i++) {
    let glitterColor = color(glitterColors[floor(random(glitterColors.length))]);
    giggleGlitterParticles.push({
      type: 'glitter',
      x: random(50, areaWidth - 50),
      y: random(100, areaHeight - 100),
      vx: 0,
      vy: 0,
      size: random(15, 30),
      alpha: 255,
      color: glitterColor,
      bouncePhase: random(TWO_PI),
      bounceSpeed: random(0.1, 0.2) * speedMultiplier,
      popTimer: random(40, 70) / speedMultiplier,
      speedMultiplier: speedMultiplier
    });
  }
}

/**
 * Update physics and draw all glitter particles
 */
function updateAndDrawGiggleGlitterPop() {
  for (let i = giggleGlitterParticles.length - 1; i >= 0; i--) {
    let p = giggleGlitterParticles[i];

    if (p.type === 'glitter') {
      // Update bouncing
      p.y += sin(frameCount * p.bounceSpeed + p.bouncePhase) * 2;
      p.popTimer--;

      if (p.popTimer <= 0) {
        // Create mini sparkles when popping
        for (let j = 0; j < 8; j++) {
          let angle = (TWO_PI / 8) * j;
          let popSpeed = random(1, 3) * p.speedMultiplier;
          giggleGlitterParticles.push({
            type: 'sparkle',
            x: p.x,
            y: p.y,
            vx: cos(angle) * popSpeed,
            vy: sin(angle) * popSpeed,
            size: random(5, 10),
            alpha: 255,
            fadeRate: 3 * p.speedMultiplier,
            color: p.color,
            twinkle: 0.2 * p.speedMultiplier
          });
        }
        p.alpha = 0;
      } else {
        // Draw glitter circle
        push();
        translate(p.x, p.y);
        fill(red(p.color), green(p.color), blue(p.color), p.alpha);
        noStroke();
        ellipse(0, 0, p.size);

        // Shimmer highlight
        fill(255, 255, 255, p.alpha * 0.6);
        ellipse(-p.size * 0.2, -p.size * 0.2, p.size * 0.3);
        pop();
      }
    } else if (p.type === 'sparkle') {
      // Update sparkle
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.alpha -= p.fadeRate;
      p.size *= 0.98;

      // Draw sparkle (4-pointed star)
      push();
      translate(p.x, p.y);
      let twinkleSize = p.size * (0.8 + sin(frameCount * p.twinkle) * 0.2);
      fill(red(p.color), green(p.color), blue(p.color), p.alpha);
      noStroke();
      drawSparkleShapeGGP(0, 0, twinkleSize / 3, twinkleSize, 4);
      pop();
    }

    // Remove faded particles
    if (p.alpha <= 0) {
      giggleGlitterParticles.splice(i, 1);
    }
  }
}

/**
 * Draw a sparkle shape (internal utility)
 */
function drawSparkleShapeGGP(x, y, radius1, radius2, npoints) {
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
function isGiggleGlitterPopActive() {
  return giggleGlitterParticles.length > 0;
}

/**
 * Clear all glitter particles immediately
 */
function clearGiggleGlitterPop() {
  giggleGlitterParticles = [];
}
