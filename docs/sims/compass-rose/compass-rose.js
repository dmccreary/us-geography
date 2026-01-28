// Interactive Compass Rose MicroSim
// Students identify and apply cardinal and intermediate directions
// Two modes: Explore (click to learn) and Quiz (test knowledge)
// MicroSim template version 2026.02

// Canvas dimensions - responsive width
let containerWidth;
let canvasWidth = 400;
let drawHeight = 550;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let containerHeight = canvasHeight;

let margin = 25;
let sliderLeftMargin = 140;
let defaultTextSize = 16;

// Compass rose parameters
let centerX, centerY;
let outerRadius, innerRadius;

// Direction data
const directions = [
  { name: 'N', fullName: 'North', angle: -90, landmark: 'Mountain', color: 'saddlebrown', icon: '⛰️' },
  { name: 'NE', fullName: 'Northeast', angle: -45, landmark: 'Hills', color: 'olive', icon: '🏔️' },
  { name: 'E', fullName: 'East', angle: 0, landmark: 'Ocean', color: 'steelblue', icon: '🌊' },
  { name: 'SE', fullName: 'Southeast', angle: 45, landmark: 'Beach', color: 'sandybrown', icon: '🏖️' },
  { name: 'S', fullName: 'South', angle: 90, landmark: 'Desert', color: 'goldenrod', icon: '🏜️' },
  { name: 'SW', fullName: 'Southwest', angle: 135, landmark: 'Canyon', color: 'sienna', icon: '🏜️' },
  { name: 'W', fullName: 'West', angle: 180, landmark: 'Forest', color: 'forestgreen', icon: '🌲' },
  { name: 'NW', fullName: 'Northwest', angle: -135, landmark: 'Lake', color: 'dodgerblue', icon: '🏞️' }
];

// Game state
let mode = 'explore'; // 'explore' or 'quiz'
let score = 0;
let totalQuizzes = 0;
let selectedDirection = null;
let highlightedDirection = null;
let quizDirection = null;
let feedbackMessage = '';
let feedbackColor = 'black';
let feedbackTimer = 0;

// Track which directions have been correctly answered
let correctDirections = new Set();
let celebrationTriggered = false;

// Celebration particles
let goldStarParticles = [];

// Buttons
let exploreButton, quizButton;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  var mainElement = document.querySelector('main');
  canvas.parent(mainElement);

  textSize(defaultTextSize);

  // Create mode buttons
  exploreButton = createButton('Explore');
  exploreButton.position(10, drawHeight + 12);
  exploreButton.mousePressed(() => setMode('explore'));

  quizButton = createButton('Quiz');
  quizButton.position(80, drawHeight + 12);
  quizButton.mousePressed(() => setMode('quiz'));

  updateButtonStyles();

  describe('Interactive compass rose with 8 directions. Explore mode shows landmarks, Quiz mode tests direction knowledge.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Drawing area background
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);

  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Calculate compass dimensions based on canvas size
  centerX = canvasWidth / 2;
  centerY = drawHeight / 2 + 10;
  outerRadius = drawHeight * 0.25;
  innerRadius = outerRadius * 0.3;

  // Title
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(24);
  text('Interactive Compass Rose', canvasWidth / 2, 10);

  // Draw landmarks around the edges
  drawLandmarks();

  // Draw the compass rose
  drawCompassRose();

  // Draw direction labels
  drawDirectionLabels();

  // Draw mode-specific elements
  if (mode === 'quiz' && quizDirection !== null) {
    drawQuizArrow();
  }

  // Draw feedback message
  if (feedbackTimer > 0) {
    drawFeedback();
    feedbackTimer--;
  }

  // Draw info panel for highlighted direction
  if (highlightedDirection !== null && mode === 'explore') {
    drawInfoPanel();
  }

  // Draw score in control area
  fill('black');
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Score: ' + score + '/' + totalQuizzes, 150, drawHeight + 25);

  // Draw mode indicator
  textAlign(RIGHT, CENTER);
  text('Mode: ' + (mode === 'explore' ? 'Explore' : 'Quiz'), canvasWidth - 15, drawHeight + 25);

  // Draw celebration animation on top of everything
  if (isGoldStarCelebrationActive()) {
    updateAndDrawGoldStars();
  }

  // Show completion message
  if (celebrationTriggered && mode === 'quiz') {
    fill(0, 0, 0, 180);
    noStroke();
    rectMode(CENTER);
    rect(canvasWidth / 2, centerY, 320, 80, 15);
    rectMode(CORNER);

    fill('gold');
    textAlign(CENTER, CENTER);
    textSize(28);
    textStyle(BOLD);
    text('All 8 Directions Complete!', canvasWidth / 2, centerY - 10);
    textSize(16);
    fill('white');
    textStyle(NORMAL);
    text('Click Quiz button to play again', canvasWidth / 2, centerY + 20);
  }
}

function drawLandmarks() {
  let landmarkRadius = outerRadius + 70;

  for (let dir of directions) {
    let angle = radians(dir.angle);
    let x = centerX + cos(angle) * landmarkRadius;
    let y = centerY + sin(angle) * landmarkRadius;

    // Draw landmark circle
    let isHighlighted = (highlightedDirection !== null && directions[highlightedDirection].name === dir.name);

    if (isHighlighted) {
      fill(dir.color);
      stroke('gold');
      strokeWeight(3);
    } else {
      fill(dir.color);
      stroke('white');
      strokeWeight(2);
    }

    circle(x, y, 70);

    // Draw landmark icon
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(36);
    text(dir.icon, x, y);
  }
}

function drawCompassRose() {
  // Draw outer circle
  stroke('darkslategray');
  strokeWeight(2);
  noFill();
  circle(centerX, centerY, outerRadius * 2);

  // Draw cardinal direction points (larger)
  for (let i = 0; i < 4; i++) {
    let dir = directions[i * 2]; // N, E, S, W
    let angle = radians(dir.angle);
    let isHighlighted = (highlightedDirection !== null && directions[highlightedDirection].name === dir.name);

    drawCompassPoint(angle, outerRadius, innerRadius * 0.6, dir.name === 'N' ? 'firebrick' : 'darkslategray', isHighlighted);
  }

  // Draw intermediate direction points (smaller)
  for (let i = 0; i < 4; i++) {
    let dir = directions[i * 2 + 1]; // NE, SE, SW, NW
    let angle = radians(dir.angle);
    let isHighlighted = (highlightedDirection !== null && directions[highlightedDirection].name === dir.name);

    drawCompassPoint(angle, outerRadius * 0.7, innerRadius * 0.4, 'slategray', isHighlighted);
  }

  // Draw center circle
  fill('white');
  stroke('darkslategray');
  strokeWeight(2);
  circle(centerX, centerY, innerRadius);
}

function drawCompassPoint(angle, length, width, baseColor, isHighlighted) {
  push();
  translate(centerX, centerY);
  rotate(angle);

  // Draw the point (triangle)
  if (isHighlighted) {
    fill('gold');
    stroke('orange');
    strokeWeight(3);
  } else {
    fill(baseColor);
    stroke('white');
    strokeWeight(1);
  }

  beginShape();
  vertex(length, 0);
  vertex(width * 0.3, -width * 0.5);
  vertex(width * 0.3, width * 0.5);
  endShape(CLOSE);

  pop();
}

function drawDirectionLabels() {
  let labelRadius = outerRadius + 20;

  for (let i = 0; i < directions.length; i++) {
    let dir = directions[i];
    let angle = radians(dir.angle);
    let x = centerX + cos(angle) * labelRadius;
    let y = centerY + sin(angle) * labelRadius;

    let isHighlighted = (highlightedDirection !== null && directions[highlightedDirection].name === dir.name);

    noStroke();
    textAlign(CENTER, CENTER);

    if (isHighlighted) {
      fill('gold');
      textSize(22);
      textStyle(BOLD);
    } else if (dir.name === 'N') {
      fill('firebrick');
      textSize(20);
      textStyle(BOLD);
    } else {
      fill('darkslategray');
      textSize(18);
      textStyle(NORMAL);
    }

    text(dir.name, x, y);
  }

  textStyle(NORMAL);
}

function drawQuizArrow() {
  let dir = directions[quizDirection];
  let angle = radians(dir.angle);

  // Draw pulsing arrow from center
  let pulseSize = 1 + sin(frameCount * 0.1) * 0.1;
  let arrowLength = innerRadius * 1.5 * pulseSize;

  push();
  translate(centerX, centerY);
  rotate(angle);

  // Arrow line
  stroke('orangered');
  strokeWeight(4);
  line(0, 0, arrowLength, 0);

  // Arrow head
  fill('orangered');
  noStroke();
  triangle(arrowLength + 15, 0, arrowLength - 5, -8, arrowLength - 5, 8);

  pop();

  // Quiz prompt
  fill('orangered');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text('Click the correct direction!', canvasWidth / 2, drawHeight - 35);
  textStyle(NORMAL);
}

function drawFeedback() {
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(BOLD);
  fill(feedbackColor);
  text(feedbackMessage, canvasWidth / 2, drawHeight - 60);
  textStyle(NORMAL);
}

function drawInfoPanel() {
  let dir = directions[highlightedDirection];

  // Panel background - positioned in lower left
  let panelWidth = 180;
  let panelHeight = 70;
  let panelX = 10;
  let panelY = drawHeight - 80;

  fill(255, 255, 255, 230);
  stroke(200);
  strokeWeight(1);
  rect(panelX, panelY, panelWidth, panelHeight, 10);

  // Panel content
  fill('black');
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18);
  textStyle(BOLD);
  text(dir.fullName, panelX + panelWidth / 2, panelY + 10);

  textStyle(NORMAL);
  textSize(16);
  fill('dimgray');
  text('Landmark: ' + dir.landmark, panelX + panelWidth / 2, panelY + 35);
  text(dir.icon, panelX + panelWidth / 2, panelY + 52);
}

function mousePressed() {
  // Check if click is in the compass area
  if (mouseY > drawHeight || mouseY < 40) return;

  // Calculate which direction was clicked
  let clickAngle = atan2(mouseY - centerY, mouseX - centerX);
  let clickDegrees = degrees(clickAngle);

  // Find closest direction
  let closestDir = null;
  let closestDiff = 360;

  for (let i = 0; i < directions.length; i++) {
    let dir = directions[i];
    let diff = abs(angleDifference(clickDegrees, dir.angle));

    if (diff < closestDiff && diff < 30) {
      closestDiff = diff;
      closestDir = i;
    }
  }

  if (closestDir !== null) {
    if (mode === 'explore') {
      // Toggle highlight
      if (highlightedDirection === closestDir) {
        highlightedDirection = null;
      } else {
        highlightedDirection = closestDir;
      }
    } else if (mode === 'quiz' && quizDirection !== null) {
      // Check answer
      totalQuizzes++;

      if (closestDir === quizDirection) {
        score++;
        correctDirections.add(quizDirection);
        feedbackMessage = 'Correct! ' + directions[closestDir].fullName + ' (' + correctDirections.size + '/8)';
        feedbackColor = 'green';
        feedbackTimer = 90;
        highlightedDirection = closestDir;

        // Check if all 8 directions completed
        if (correctDirections.size >= 8 && !celebrationTriggered) {
          celebrationTriggered = true;
          createGoldStarCelebration();
          feedbackMessage = 'Perfect! All directions complete!';
          feedbackTimer = 180;
        } else {
          // Generate new quiz after delay
          setTimeout(() => {
            generateQuizQuestion();
            highlightedDirection = null;
          }, 1500);
        }
      } else {
        feedbackMessage = 'Try again! That was ' + directions[closestDir].name;
        feedbackColor = 'crimson';
        feedbackTimer = 90;
      }
    }
  }
}

function angleDifference(a1, a2) {
  let diff = a1 - a2;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}

function setMode(newMode) {
  mode = newMode;
  highlightedDirection = null;
  feedbackMessage = '';
  feedbackTimer = 0;

  if (mode === 'quiz') {
    // Reset quiz progress when starting quiz mode
    resetQuizProgress();
    score = 0;
    totalQuizzes = 0;
    generateQuizQuestion();
  } else {
    quizDirection = null;
    clearGoldStarCelebration();
  }

  updateButtonStyles();
}

function generateQuizQuestion() {
  // Get list of directions not yet correctly answered
  let remaining = [];
  for (let i = 0; i < directions.length; i++) {
    if (!correctDirections.has(i)) {
      remaining.push(i);
    }
  }

  // Pick randomly from remaining directions
  if (remaining.length > 0) {
    quizDirection = remaining[floor(random(remaining.length))];
  } else {
    quizDirection = null; // All complete
  }
}

function updateButtonStyles() {
  // Visual feedback for active mode
  if (mode === 'explore') {
    exploreButton.style('font-weight', 'bold');
    exploreButton.style('background-color', 'lightblue');
    quizButton.style('font-weight', 'normal');
    quizButton.style('background-color', 'white');
  } else {
    exploreButton.style('font-weight', 'normal');
    exploreButton.style('background-color', 'white');
    quizButton.style('font-weight', 'bold');
    quizButton.style('background-color', 'lightyellow');
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  redraw();
}

function updateCanvasSize() {
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = container.width;
  canvasWidth = containerWidth;
}

// ============================================
// Gold Star Celebration Animation
// ============================================

function createGoldStarCelebration() {
  goldStarParticles = [];

  // Create explosion of gold stars from center
  let numStars = 50;

  for (let i = 0; i < numStars; i++) {
    let angle = random(TWO_PI);
    let speed = random(3, 12);

    goldStarParticles.push({
      x: centerX,
      y: centerY,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed - random(2, 5), // Bias upward
      size: random(15, 35),
      rotation: random(TWO_PI),
      rotationSpeed: random(-0.15, 0.15),
      alpha: 255,
      fadeRate: random(1.5, 3),
      gravity: 0.15,
      color: random() > 0.3 ? 'gold' : (random() > 0.5 ? 'orange' : 'yellow')
    });
  }
}

function updateAndDrawGoldStars() {
  for (let i = goldStarParticles.length - 1; i >= 0; i--) {
    let p = goldStarParticles[i];

    // Update physics
    p.x += p.vx;
    p.vy += p.gravity;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;
    p.alpha -= p.fadeRate;

    // Remove faded particles
    if (p.alpha <= 0) {
      goldStarParticles.splice(i, 1);
      continue;
    }

    // Draw the star
    drawGoldStar(p.x, p.y, p.size, p.rotation, p.alpha, p.color);
  }
}

function drawGoldStar(x, y, size, rotation, alpha, starColor) {
  push();
  translate(x, y);
  rotate(rotation);

  // Set color with alpha
  if (starColor === 'gold') {
    fill(255, 215, 0, alpha);
    stroke(218, 165, 32, alpha);
  } else if (starColor === 'orange') {
    fill(255, 165, 0, alpha);
    stroke(255, 140, 0, alpha);
  } else {
    fill(255, 255, 0, alpha);
    stroke(255, 215, 0, alpha);
  }
  strokeWeight(1);

  // Draw 5-pointed star
  beginShape();
  for (let i = 0; i < 10; i++) {
    let angle = (TWO_PI / 10) * i - HALF_PI;
    let r = (i % 2 === 0) ? size / 2 : size / 4;
    vertex(cos(angle) * r, sin(angle) * r);
  }
  endShape(CLOSE);

  pop();
}

function isGoldStarCelebrationActive() {
  return goldStarParticles.length > 0;
}

function clearGoldStarCelebration() {
  goldStarParticles = [];
}

function resetQuizProgress() {
  correctDirections.clear();
  celebrationTriggered = false;
}
