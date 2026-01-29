// book-burst.js - Self-contained celebration animation
// Colorful closed books shooting upward from a center point
// Copy this file into your MicroSim folder to use
//
// Usage:
//   1. Include this file in your main.html: <script src="book-burst.js"></script>
//   2. Call createBookBurst(centerX, startY) when celebration should trigger
//   3. Call updateAndDrawBookBurst() in your draw() loop
//
// Example:
//   function onGameWin() {
//     createBookBurst(canvasWidth/2, drawHeight);
//   }
//   function draw() {
//     // ... your drawing code ...
//     updateAndDrawBookBurst(); // Draw celebration on top
//   }

let bookBurstParticles = [];

// Rainbow colors for book covers
const bookBurstColors = [
  '#FF6B6B', '#FF8E53', '#FFD93D', '#6BCB77',
  '#4D96FF', '#9B59B6', '#FF6B9D'
];

/**
 * Create a book burst celebration
 * @param {number} centerX - X position to burst from
 * @param {number} startY - Y position to burst from (usually bottom of draw area)
 * @param {number} speedMultiplier - Speed adjustment (default 1.0, use 1.8 for fast, 0.5 for slow)
 */
function createBookBurst(centerX, startY, speedMultiplier = 1.0) {
  bookBurstParticles = [];
  for (let i = 0; i < 20; i++) {
    let angle = random(-PI * 0.8, -PI * 0.2); // Spread upward in an arc
    let speed = random(8, 14) * speedMultiplier;
    let bookColor = color(bookBurstColors[floor(random(bookBurstColors.length))]);
    bookBurstParticles.push({
      x: centerX,
      y: startY,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      width: random(25, 40),
      height: random(30, 45),
      rotation: random(-0.3, 0.3),
      rotationSpeed: random(-0.08, 0.08) * speedMultiplier,
      alpha: 255,
      fadeRate: 1.2 * speedMultiplier,
      color: bookColor,
      gravity: 0.15 * speedMultiplier
    });
  }
}

/**
 * Update physics and draw all book particles
 * Call this in your draw() loop
 */
function updateAndDrawBookBurst() {
  for (let i = bookBurstParticles.length - 1; i >= 0; i--) {
    let p = bookBurstParticles[i];

    // Update physics
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.rotation += p.rotationSpeed;
    p.alpha -= p.fadeRate;

    // Draw the book
    push();
    translate(p.x, p.y);
    rotate(p.rotation);

    let w = p.width;
    let h = p.height;
    let spineWidth = w * 0.15;
    let pageInset = 3;

    // Book spine (left edge) - darker colored
    fill(red(p.color) * 0.7, green(p.color) * 0.7, blue(p.color) * 0.7, p.alpha);
    stroke(50, 50, 50, p.alpha * 0.8);
    strokeWeight(1);
    rect(-w / 2, -h / 2, spineWidth, h, 2, 0, 0, 2);

    // Pages (white with slight gray edge)
    fill(250, 248, 245, p.alpha);
    stroke(180, 180, 180, p.alpha * 0.8);
    strokeWeight(1);
    rect(-w / 2 + spineWidth, -h / 2 + pageInset, w - spineWidth, h - pageInset * 2);

    // Book cover (front) - main color
    fill(red(p.color), green(p.color), blue(p.color), p.alpha);
    stroke(50, 50, 50, p.alpha * 0.8);
    strokeWeight(1.5);
    rect(-w / 2 + spineWidth - 2, -h / 2, w - spineWidth + 2, h, 0, 3, 3, 0);

    // Cover decoration - simple line detail
    stroke(255, 255, 255, p.alpha * 0.4);
    strokeWeight(2);
    line(-w / 2 + spineWidth + 8, -h / 2 + 8, w / 2 - 8, -h / 2 + 8);
    line(-w / 2 + spineWidth + 8, -h / 2 + 14, w / 2 - 8, -h / 2 + 14);

    pop();

    // Remove faded particles
    if (p.alpha <= 0) {
      bookBurstParticles.splice(i, 1);
    }
  }
}

/**
 * Check if the animation is still playing
 * @returns {boolean} True if particles are still visible
 */
function isBookBurstActive() {
  return bookBurstParticles.length > 0;
}

/**
 * Clear all book particles immediately
 */
function clearBookBurst() {
  bookBurstParticles = [];
}
