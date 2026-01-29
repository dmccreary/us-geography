// flying-frisbees.js - Self-contained celebration animation
// Frisbees flying across the screen from left and right with spinning motion
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="flying-frisbees.js"></script>
//   2. Call createFlyingFrisbees(canvasWidth, drawHeight) when celebration should trigger
//   3. Call updateAndDrawFlyingFrisbees() in your draw() loop

let flyingFrisbeeParticles = [];

const frisbeeColors = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B59B6', '#FF6B9D', '#00CED1'
];

/**
 * Create flying frisbees celebration
 * @param {number} areaWidth - Width of area for frisbees to cross
 * @param {number} areaHeight - Height of area for frisbees to fly in
 * @param {number} speedMultiplier - Speed adjustment (default 1.0)
 */
function createFlyingFrisbees(areaWidth, areaHeight, speedMultiplier = 1.0) {
  flyingFrisbeeParticles = [];
  for (let i = 0; i < 10; i++) {
    let startSide = random() > 0.5;
    let baseSpeed = random(4, 7) * speedMultiplier;
    let frisbeeColor = color(frisbeeColors[floor(random(frisbeeColors.length))]);
    flyingFrisbeeParticles.push({
      x: startSide ? -40 : areaWidth + 40,
      y: random(80, areaHeight - 80),
      vx: startSide ? baseSpeed : -baseSpeed,
      vy: random(-0.3, 0.3) * speedMultiplier,
      size: random(30, 45),
      alpha: 255,
      color: frisbeeColor,
      rotation: random(TWO_PI),
      spinSpeed: random(0.15, 0.25) * (startSide ? 1 : -1) * speedMultiplier,
      wobble: random(0.02, 0.05),
      wobblePhase: random(TWO_PI),
      trail: [],
      areaWidth: areaWidth,
      speedMultiplier: speedMultiplier
    });
  }
}

/**
 * Update physics and draw all frisbee particles
 */
function updateAndDrawFlyingFrisbees() {
  for (let i = flyingFrisbeeParticles.length - 1; i >= 0; i--) {
    let p = flyingFrisbeeParticles[i];

    // Add trail
    p.trail.push({ x: p.x, y: p.y, alpha: 150, size: p.size * 0.3 });
    if (p.trail.length > 8) {
      p.trail.shift();
    }

    // Update physics
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.spinSpeed;

    // Add wobble effect for realistic frisbee flight
    p.wobblePhase += 0.1 * p.speedMultiplier;
    p.vy += sin(p.wobblePhase) * p.wobble;

    // Fade trail
    for (let t of p.trail) {
      t.alpha -= 18 * p.speedMultiplier;
    }

    // Check if off screen
    if (p.x < -60 || p.x > p.areaWidth + 60) {
      p.alpha = 0;
    }

    // Draw trail (motion blur effect)
    for (let j = 0; j < p.trail.length; j++) {
      let t = p.trail[j];
      if (t.alpha > 0) {
        fill(red(p.color), green(p.color), blue(p.color), t.alpha * 0.3);
        noStroke();
        ellipse(t.x, t.y, t.size * (j / p.trail.length + 0.5));
      }
    }

    // Draw frisbee (viewed from side, spinning flat like a flying saucer)
    push();
    translate(p.x, p.y);

    // The frisbee stays level (horizontal ellipse) - no rotation of the shape itself
    // Instead, the spin is shown through moving highlights and pattern

    // Frisbee outer ring (the disc edge)
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    stroke(red(p.color) * 0.7, green(p.color) * 0.7, blue(p.color) * 0.7, p.alpha);
    strokeWeight(2);
    ellipse(0, 0, p.size, p.size * 0.35);

    // Frisbee inner ring (lighter center area)
    fill(red(p.color) + 40, green(p.color) + 40, blue(p.color) + 40, p.alpha);
    noStroke();
    ellipse(0, 0, p.size * 0.7, p.size * 0.24);

    // Spinning highlight - orbits around the center to show rotation
    // The highlight position is based on rotation, compressed to ellipse perspective
    let highlightX = cos(p.rotation) * p.size * 0.25;
    let highlightY = sin(p.rotation) * p.size * 0.08; // Compressed for side view
    fill(255, 255, 255, p.alpha * 0.7);
    ellipse(highlightX, highlightY, p.size * 0.15, p.size * 0.06);

    // Second highlight on opposite side (dimmer)
    fill(255, 255, 255, p.alpha * 0.3);
    ellipse(-highlightX, -highlightY, p.size * 0.1, p.size * 0.04);

    // Spinning stripe/logo mark to emphasize rotation
    let stripeX = cos(p.rotation + PI/2) * p.size * 0.3;
    let stripeY = sin(p.rotation + PI/2) * p.size * 0.1;
    stroke(red(p.color) * 0.5, green(p.color) * 0.5, blue(p.color) * 0.5, p.alpha * 0.6);
    strokeWeight(2);
    // Draw a short arc segment that spins with the disc
    let arcX1 = cos(p.rotation) * p.size * 0.35;
    let arcY1 = sin(p.rotation) * p.size * 0.12;
    let arcX2 = cos(p.rotation + 0.5) * p.size * 0.35;
    let arcY2 = sin(p.rotation + 0.5) * p.size * 0.12;
    line(arcX1, arcY1, arcX2, arcY2);

    // Ridges on the frisbee rim
    stroke(red(p.color) * 0.6, green(p.color) * 0.6, blue(p.color) * 0.6, p.alpha * 0.4);
    strokeWeight(1);
    noFill();
    ellipse(0, 0, p.size * 0.88, p.size * 0.31);

    pop();

    // Remove faded particles
    if (p.alpha <= 0) {
      flyingFrisbeeParticles.splice(i, 1);
    }
  }
}

/**
 * Check if the animation is still playing
 */
function isFlyingFrisbeesActive() {
  return flyingFrisbeeParticles.length > 0;
}

/**
 * Clear all frisbee particles immediately
 */
function clearFlyingFrisbees() {
  flyingFrisbeeParticles = [];
}
