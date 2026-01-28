/* Understanding Contour Lines MicroSim */

let canvasWidth, canvasHeight;
const drawHeight = 340;
const controlHeight = 80;
let terrainType = 'hill'; // 'hill', 'valley', 'ridge'
let showLabels = true;
let rotationX = -0.6;
let rotationY = 0;
let isDragging = false;
let lastMouseX, lastMouseY;
let quizMode = false;
let quizQuestion = 0;
let score = 0;
let showAnswer = false;
let answerCorrect = false;
let stars = [];
let celebrationStars = [];

const buttons = [];
const contourLevels = [20, 40, 60, 80, 100];
const contourColors = ['#2E7D32', '#4CAF50', '#81C784', '#C8E6C9', '#F5F5F5'];

const quizQuestions = [
    { q: "Close contour lines mean:", a: "Steep slope", opts: ["Steep slope", "Flat area", "Valley"] },
    { q: "Contour lines that form circles usually show:", a: "Hills or peaks", opts: ["Hills or peaks", "Rivers", "Roads"] },
    { q: "What do contour lines connect?", a: "Equal elevation", opts: ["Equal elevation", "Cities", "Rivers"] },
    { q: "Widely spaced contour lines indicate:", a: "Gentle slope", opts: ["Gentle slope", "Cliff", "Peak"] },
    { q: "V-shaped contour lines pointing uphill indicate:", a: "Valley", opts: ["Valley", "Ridge", "Plateau"] },
    { q: "The contour interval is:", a: "Elevation between lines", opts: ["Elevation between lines", "Line thickness", "Map scale"] }
];
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 6;

function updateCanvasSize() {
    const container = document.getElementById('canvas-container');
    canvasWidth = min(container.offsetWidth || 600, 600);
    canvasHeight = drawHeight + controlHeight;
}

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    textAlign(CENTER, CENTER);
    setupButtons();
}

function setupButtons() {
    buttons.length = 0;
    const btnY = drawHeight + 12;
    const btnW = 70;
    const btnH = 26;
    const startX = canvasWidth / 2 - 185;

    buttons.push({ x: startX, y: btnY, w: btnW, h: btnH, label: 'Hill', action: () => { terrainType = 'hill'; quizMode = false; } });
    buttons.push({ x: startX + 80, y: btnY, w: btnW, h: btnH, label: 'Valley', action: () => { terrainType = 'valley'; quizMode = false; } });
    buttons.push({ x: startX + 160, y: btnY, w: btnW, h: btnH, label: 'Ridge', action: () => { terrainType = 'ridge'; quizMode = false; } });
    buttons.push({ x: startX + 240, y: btnY, w: btnW, h: btnH, label: 'Labels', action: () => { showLabels = !showLabels; } });
    buttons.push({ x: startX + 320, y: btnY, w: btnW, h: btnH, label: 'Quiz Me!', action: startQuiz });
}

function startQuiz() {
    quizMode = true;
    quizQuestion = 0;
    score = 0;
    showAnswer = false;
    stars = [];
    celebrationStars = [];
    shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
}

function getElevation(x, y, type) {
    // Normalize x, y to -1 to 1 range
    const nx = x / 50;
    const ny = y / 50;

    if (type === 'hill') {
        // Single hill in center
        const d = sqrt(nx * nx + ny * ny);
        return max(0, 100 * (1 - d * 0.8));
    } else if (type === 'valley') {
        // Valley with high sides
        return 20 + abs(nx) * 80;
    } else if (type === 'ridge') {
        // Ridge running diagonally
        const d = abs(nx - ny * 0.3);
        return max(0, 100 * (1 - d * 1.2));
    }
    return 50;
}

function draw() {
    background('aliceblue');

    // Draw the two views side by side
    const viewWidth = canvasWidth / 2 - 20;
    const viewHeight = drawHeight - 30;

    // Left: 3D terrain view
    push();
    fill(240, 248, 255);
    stroke(200);
    rect(10, 25, viewWidth, viewHeight, 5);
    pop();

    draw3DTerrain(10, 25, viewWidth, viewHeight);

    // Right: 2D contour map
    push();
    fill(255);
    stroke(200);
    rect(canvasWidth / 2 + 10, 25, viewWidth, viewHeight, 5);
    pop();

    draw2DContour(canvasWidth / 2 + 10, 25, viewWidth, viewHeight);

    // Labels for views
    fill(50);
    textSize(12);
    textStyle(BOLD);
    text('3D Terrain (drag to rotate)', 10 + viewWidth / 2, 15);
    text('2D Contour Map', canvasWidth / 2 + 10 + viewWidth / 2, 15);
    textStyle(NORMAL);

    // Control area
    noStroke();
    fill(255);
    rect(0, drawHeight, canvasWidth, controlHeight);

    if (quizMode) {
        drawQuiz();
    } else {
        drawButtons();
        drawInfo();
    }

    drawStars();
    drawCelebration();
}

function draw3DTerrain(x, y, w, h) {
    push();

    // Create a graphics buffer for 3D
    const cx = x + w / 2;
    const cy = y + h / 2;

    // Simple isometric-style 3D representation
    const gridSize = 10;
    const cellSize = min(w, h) / 15;
    const heightScale = 0.8;

    translate(cx, cy + 20);

    // Draw terrain as a grid of quads
    for (let i = -gridSize; i < gridSize; i++) {
        for (let j = -gridSize; j < gridSize; j++) {
            const x1 = i * 5;
            const y1 = j * 5;
            const x2 = (i + 1) * 5;
            const y2 = (j + 1) * 5;

            const h1 = getElevation(x1, y1, terrainType);
            const h2 = getElevation(x2, y1, terrainType);
            const h3 = getElevation(x2, y2, terrainType);
            const h4 = getElevation(x1, y2, terrainType);

            // Isometric projection with rotation
            const cosX = cos(rotationX);
            const sinX = sin(rotationX);
            const cosY = cos(rotationY);
            const sinY = sin(rotationY);

            function project(px, py, pz) {
                // Apply Y rotation
                let rx = px * cosY - py * sinY;
                let ry = px * sinY + py * cosY;
                // Apply X rotation
                let rz = pz * cosX - ry * sinX;
                ry = pz * sinX + ry * cosX;
                // Scale and return
                return { x: rx * cellSize * 0.15, y: ry * cellSize * 0.15 - rz * heightScale };
            }

            const p1 = project(x1, y1, h1);
            const p2 = project(x2, y1, h2);
            const p3 = project(x2, y2, h3);
            const p4 = project(x1, y2, h4);

            // Color based on average elevation
            const avgH = (h1 + h2 + h3 + h4) / 4;
            const colorIndex = constrain(floor(avgH / 25), 0, 4);
            fill(contourColors[4 - colorIndex]);
            stroke(100, 50);
            strokeWeight(0.5);

            beginShape();
            vertex(p1.x, p1.y);
            vertex(p2.x, p2.y);
            vertex(p3.x, p3.y);
            vertex(p4.x, p4.y);
            endShape(CLOSE);
        }
    }

    pop();
}

function draw2DContour(x, y, w, h) {
    push();
    const cx = x + w / 2;
    const cy = y + h / 2;
    const mapSize = min(w, h) - 40;
    const mapScale = mapSize / 100;

    // Draw contour lines
    for (let level = 0; level < contourLevels.length; level++) {
        const targetElev = contourLevels[level];
        stroke(139, 90, 43);
        strokeWeight(level === 2 ? 2 : 1); // Index line thicker
        noFill();

        // March through grid and find contour
        const resolution = 2;
        beginShape();
        let foundPoints = [];

        for (let angle = 0; angle <= TWO_PI; angle += 0.05) {
            // Find distance from center where elevation equals target
            for (let dist = 0; dist < 50; dist += resolution) {
                const px = cos(angle) * dist;
                const py = sin(angle) * dist;
                const elev = getElevation(px, py, terrainType);

                if (abs(elev - targetElev) < 5) {
                    foundPoints.push({ x: cx + px * mapScale, y: cy + py * mapScale });
                    break;
                }
            }
        }

        // Draw smooth contour from found points
        if (foundPoints.length > 3) {
            beginShape();
            for (let pt of foundPoints) {
                curveVertex(pt.x, pt.y);
            }
            if (terrainType === 'hill') {
                // Close the loop for hill
                curveVertex(foundPoints[0].x, foundPoints[0].y);
                curveVertex(foundPoints[1].x, foundPoints[1].y);
            }
            endShape();

            // Add elevation label
            if (showLabels && foundPoints.length > 0) {
                const labelPt = foundPoints[floor(foundPoints.length / 4)];
                fill(255);
                noStroke();
                rect(labelPt.x - 12, labelPt.y - 8, 24, 14, 2);
                fill(139, 90, 43);
                textSize(9);
                noStroke();
                text(targetElev + 'm', labelPt.x, labelPt.y);
            }
        }
    }

    // Draw special contour patterns based on terrain type
    if (terrainType === 'valley') {
        // V-shaped contours for valley
        stroke(139, 90, 43);
        strokeWeight(1);
        for (let level = 0; level < 4; level++) {
            const offset = level * 15;
            noFill();
            beginShape();
            vertex(cx - mapSize / 2 + offset, cy - mapSize / 3);
            vertex(cx, cy + offset * 0.5);
            vertex(cx + mapSize / 2 - offset, cy - mapSize / 3);
            endShape();
        }
    } else if (terrainType === 'ridge') {
        // Elongated contours for ridge
        stroke(139, 90, 43);
        for (let level = 0; level < 4; level++) {
            const rw = (4 - level) * 25 * mapScale;
            const rh = (4 - level) * 8 * mapScale;
            strokeWeight(level === 2 ? 2 : 1);
            noFill();
            ellipse(cx, cy, rw, rh);

            if (showLabels) {
                fill(255);
                noStroke();
                rect(cx + rw / 2 - 12, cy - 8, 24, 14, 2);
                fill(139, 90, 43);
                textSize(9);
                text((level + 1) * 25 + 'm', cx + rw / 2, cy);
                stroke(139, 90, 43);
            }
        }
    }

    // Legend
    fill(50);
    textSize(10);
    noStroke();
    textAlign(LEFT, CENTER);
    text('Contour interval: 20m', x + 10, y + h - 15);
    textAlign(CENTER, CENTER);

    pop();
}

function drawButtons() {
    for (let btn of buttons) {
        let isHover = mouseX > btn.x && mouseX < btn.x + btn.w &&
                      mouseY > btn.y && mouseY < btn.y + btn.h;
        let isActive = (btn.label === 'Hill' && terrainType === 'hill') ||
                       (btn.label === 'Valley' && terrainType === 'valley') ||
                       (btn.label === 'Ridge' && terrainType === 'ridge') ||
                       (btn.label === 'Labels' && showLabels) ||
                       (btn.label === 'Quiz Me!' && quizMode);

        fill(isActive ? color(30, 136, 229) : (isHover ? color(200, 220, 255) : 255));
        stroke(30, 136, 229);
        strokeWeight(2);
        rect(btn.x, btn.y, btn.w, btn.h, 4);

        fill(isActive ? 255 : color(30, 136, 229));
        noStroke();
        textSize(10);
        textStyle(BOLD);
        text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
        textStyle(NORMAL);
    }
}

function drawInfo() {
    fill(80);
    textSize(10);
    noStroke();

    let info = '';
    if (terrainType === 'hill') {
        info = 'Hill: Concentric circles, smallest at peak. Closer lines = steeper slope.';
    } else if (terrainType === 'valley') {
        info = 'Valley: V-shapes point uphill (upstream). Water flows downhill between lines.';
    } else if (terrainType === 'ridge') {
        info = 'Ridge: Elongated contours. High ground runs along the ridge crest.';
    }
    text(info, canvasWidth / 2, drawHeight + 55);
    text('Drag the 3D view to rotate', canvasWidth / 2, drawHeight + 70);
}

function drawQuiz() {
    if (quizQuestion >= TOTAL_QUESTIONS) {
        fill(30, 136, 229);
        textSize(14);
        textStyle(BOLD);
        text(score === TOTAL_QUESTIONS ? '🎉 Perfect Score! 🎉' : 'Quiz Complete!', canvasWidth / 2, drawHeight + 20);
        textStyle(NORMAL);
        textSize(12);
        fill(50);
        text(`You got ${score} of ${TOTAL_QUESTIONS} correct!`, canvasWidth / 2, drawHeight + 40);

        let btnX = canvasWidth / 2 - 50;
        let btnY = drawHeight + 55;
        let isHover = mouseX > btnX && mouseX < btnX + 100 && mouseY > btnY && mouseY < btnY + 22;
        fill(isHover ? color(200, 220, 255) : 255);
        stroke(30, 136, 229);
        strokeWeight(2);
        rect(btnX, btnY, 100, 22, 4);
        fill(30, 136, 229);
        noStroke();
        textSize(11);
        text('Try Again', canvasWidth / 2, btnY + 11);

        if (score === TOTAL_QUESTIONS && celebrationStars.length === 0) {
            startCelebration();
        }
        return;
    }

    let q = shuffledQuestions[quizQuestion];

    // Progress and stars
    fill(30, 136, 229);
    textSize(11);
    textStyle(BOLD);
    text(`${quizQuestion + 1} of ${TOTAL_QUESTIONS}`, canvasWidth - 50, drawHeight + 12);

    for (let i = 0; i < stars.length; i++) {
        fill(255, 215, 0);
        drawStar(15 + i * 22, drawHeight + 12, 5, 10);
    }

    textStyle(NORMAL);
    fill(50);
    textSize(12);
    text(q.q, canvasWidth / 2, drawHeight + 25);

    let btnW = 110;
    let btnH = 24;
    let btnY = drawHeight + 42;
    let totalW = q.opts.length * btnW + (q.opts.length - 1) * 10;
    let startX = (canvasWidth - totalW) / 2;

    for (let i = 0; i < q.opts.length; i++) {
        let btnX = startX + i * (btnW + 10);
        let isHover = mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;

        if (showAnswer) {
            if (q.opts[i] === q.a) {
                fill(200, 255, 200);
                stroke(0, 150, 0);
            } else {
                fill(255, 200, 200);
                stroke(200, 0, 0);
            }
        } else {
            fill(isHover ? color(200, 220, 255) : 255);
            stroke(30, 136, 229);
        }
        strokeWeight(2);
        rect(btnX, btnY, btnW, btnH, 4);

        fill(50);
        noStroke();
        textSize(10);
        text(q.opts[i], btnX + btnW / 2, btnY + btnH / 2);
    }

    if (showAnswer) {
        fill(answerCorrect ? color(0, 150, 0) : color(200, 0, 0));
        textSize(11);
        textStyle(BOLD);
        text(answerCorrect ? 'Correct!' : `Answer: ${q.a}`, canvasWidth / 2, drawHeight + 72);
        textStyle(NORMAL);
    }
}

function drawStar(cx, cy, r1, r2) {
    push();
    beginShape();
    for (let i = 0; i < 10; i++) {
        let angle = TWO_PI * i / 10 - HALF_PI;
        let r = (i % 2 === 0) ? r2 : r1;
        vertex(cx + cos(angle) * r, cy + sin(angle) * r);
    }
    endShape(CLOSE);
    pop();
}

function startCelebration() {
    for (let i = 0; i < 30; i++) {
        celebrationStars.push({
            x: random(canvasWidth),
            y: random(canvasHeight),
            size: random(10, 25),
            color: random([color(255, 215, 0), color(30, 136, 229), color(0, 200, 200)]),
            alpha: 255,
            vy: random(-3, -1)
        });
    }
}

function drawStars() {
    for (let s of stars) {
        if (s.animating) {
            s.scale = min(s.scale + 0.1, 1);
            s.alpha = min(s.alpha + 15, 255);
            if (s.scale >= 1) s.animating = false;
        }
        push();
        fill(255, 215, 0, s.alpha);
        translate(s.x, s.y);
        scale(s.scale);
        drawStar(0, 0, 5, 10);
        pop();
    }
}

function drawCelebration() {
    for (let i = celebrationStars.length - 1; i >= 0; i--) {
        let s = celebrationStars[i];
        s.y += s.vy;
        s.alpha -= 3;
        if (s.alpha <= 0) {
            celebrationStars.splice(i, 1);
            continue;
        }
        push();
        fill(red(s.color), green(s.color), blue(s.color), s.alpha);
        noStroke();
        translate(s.x, s.y);
        drawStar(0, 0, s.size * 0.4, s.size);
        pop();
    }
}

function mousePressed() {
    // Check if in 3D view area for dragging
    const viewWidth = canvasWidth / 2 - 20;
    const viewHeight = drawHeight - 30;
    if (mouseX > 10 && mouseX < 10 + viewWidth && mouseY > 25 && mouseY < 25 + viewHeight) {
        isDragging = true;
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        return;
    }

    if (quizMode) {
        if (quizQuestion >= TOTAL_QUESTIONS) {
            let btnX = canvasWidth / 2 - 50;
            let btnY = drawHeight + 55;
            if (mouseX > btnX && mouseX < btnX + 100 && mouseY > btnY && mouseY < btnY + 22) {
                startQuiz();
            }
            return;
        }

        if (showAnswer) return;

        let q = shuffledQuestions[quizQuestion];
        let btnW = 110;
        let btnH = 24;
        let btnY = drawHeight + 42;
        let totalW = q.opts.length * btnW + (q.opts.length - 1) * 10;
        let startX = (canvasWidth - totalW) / 2;

        for (let i = 0; i < q.opts.length; i++) {
            let btnX = startX + i * (btnW + 10);
            if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
                showAnswer = true;
                answerCorrect = (q.opts[i] === q.a);
                if (answerCorrect) {
                    score++;
                    stars.push({
                        x: 15 + (score - 1) * 22,
                        y: drawHeight + 12,
                        scale: 0,
                        alpha: 0,
                        animating: true
                    });
                }
                setTimeout(() => {
                    quizQuestion++;
                    showAnswer = false;
                }, 1500);
            }
        }
    } else {
        for (let btn of buttons) {
            if (mouseX > btn.x && mouseX < btn.x + btn.w &&
                mouseY > btn.y && mouseY < btn.y + btn.h) {
                btn.action();
            }
        }
    }
}

function mouseDragged() {
    if (isDragging) {
        const dx = mouseX - lastMouseX;
        const dy = mouseY - lastMouseY;
        rotationY += dx * 0.01;
        rotationX += dy * 0.01;
        rotationX = constrain(rotationX, -PI / 2, 0);
        lastMouseX = mouseX;
        lastMouseY = mouseY;
    }
}

function mouseReleased() {
    isDragging = false;
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    setupButtons();
}
