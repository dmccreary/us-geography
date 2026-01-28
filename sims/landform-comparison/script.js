/* Landform Comparison MicroSim */

let canvasWidth, canvasHeight;
const drawHeight = 360;
const controlHeight = 80;

// Landform data
const landforms = [
    {
        name: 'Mountain',
        description: 'Very high land with steep sides and peaks',
        elevation: '10,000+ feet',
        funFact: 'The Rocky Mountains stretch over 3,000 miles!',
        color: { top: [139, 90, 43], bottom: [34, 139, 34] }
    },
    {
        name: 'Hill',
        description: 'Rounded, raised land lower than mountains',
        elevation: '500-2,000 feet',
        funFact: 'The Black Hills of South Dakota are actually mountains!',
        color: { top: [107, 142, 35], bottom: [34, 139, 34] }
    },
    {
        name: 'Plateau',
        description: 'Flat, elevated land with steep sides',
        elevation: '1,500-5,000 feet',
        funFact: 'The Colorado Plateau is home to the Grand Canyon!',
        color: { top: [205, 133, 63], bottom: [139, 90, 43] }
    },
    {
        name: 'Valley',
        description: 'Low land between mountains or hills',
        elevation: '100-1,000 feet',
        funFact: 'California\'s Central Valley grows 25% of US food!',
        color: { top: [34, 139, 34], bottom: [60, 179, 113] }
    },
    {
        name: 'Plain',
        description: 'Flat, low land often covered with grass',
        elevation: '0-500 feet',
        funFact: 'The Great Plains cover 10 US states!',
        color: { top: [124, 252, 0], bottom: [34, 139, 34] }
    }
];

let hoveredLandform = -1;
let selectedLandform = -1;
let showElevation = true;
let quizMode = false;
let quizQuestion = 0;
let score = 0;
let showAnswer = false;
let answerCorrect = false;
let stars = [];
let celebrationStars = [];

const quizQuestions = [
    { q: "Which landform is flat on top?", a: "Plateau" },
    { q: "Which landform is the tallest?", a: "Mountain" },
    { q: "Which landform has a river flowing through it?", a: "Valley" },
    { q: "Which landform is lowest and flattest?", a: "Plain" },
    { q: "Which landform is shorter than a mountain but taller than a plain?", a: "Hill" },
    { q: "Where would you find the Grand Canyon?", a: "Plateau" }
];
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 5;

const buttons = [];

function updateCanvasSize() {
    const container = document.getElementById('canvas-container');
    canvasWidth = min(container.offsetWidth || 700, 700);
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
    const btnW = 85;
    const btnH = 26;
    const startX = canvasWidth / 2 - 140;

    buttons.push({ x: startX, y: btnY, w: btnW, h: btnH, label: 'Elevation', action: () => { showElevation = !showElevation; } });
    buttons.push({ x: startX + 95, y: btnY, w: btnW, h: btnH, label: 'Quiz Me!', action: startQuiz });
    buttons.push({ x: startX + 190, y: btnY, w: btnW, h: btnH, label: 'Reset', action: resetView });
}

function resetView() {
    selectedLandform = -1;
    quizMode = false;
}

function startQuiz() {
    quizMode = true;
    quizQuestion = 0;
    score = 0;
    showAnswer = false;
    stars = [];
    celebrationStars = [];
    shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
}

function draw() {
    background('aliceblue');

    // Draw terrain cross-section
    drawTerrain();

    // Control area
    noStroke();
    fill(255);
    rect(0, drawHeight, canvasWidth, controlHeight);

    if (quizMode) {
        drawQuiz();
    } else {
        drawButtons();
        drawInfoPanel();
    }

    drawStars();
    drawCelebration();
}

function drawTerrain() {
    const landformWidth = canvasWidth / 5;
    const groundY = drawHeight - 60;
    const waterLevel = groundY + 10;

    // Sky gradient
    for (let y = 0; y < groundY - 50; y++) {
        let inter = map(y, 0, groundY - 50, 0, 1);
        let c = lerpColor(color(135, 206, 250), color(176, 224, 230), inter);
        stroke(c);
        line(0, y, canvasWidth, y);
    }

    // Draw each landform
    for (let i = 0; i < landforms.length; i++) {
        const lf = landforms[i];
        const x = i * landformWidth;
        const isHovered = hoveredLandform === i;
        const isSelected = selectedLandform === i;

        push();
        translate(x, 0);

        // Highlight if hovered or selected
        if (isHovered || isSelected) {
            fill(255, 255, 200, 100);
            noStroke();
            rect(0, 0, landformWidth, drawHeight);
        }

        // Draw the landform shape
        drawLandformShape(i, landformWidth, groundY);

        // Draw vegetation
        drawVegetation(i, landformWidth, groundY);

        // Draw river in valley
        if (i === 3) {
            drawRiver(landformWidth, groundY);
        }

        // Elevation marker
        if (showElevation) {
            drawElevationMarker(i, landformWidth, groundY);
        }

        // Label
        fill(50);
        textSize(12);
        textStyle(BOLD);
        text(lf.name, landformWidth / 2, groundY + 30);
        textStyle(NORMAL);

        pop();
    }

    // Ground line
    stroke(139, 90, 43);
    strokeWeight(3);
    line(0, groundY + 15, canvasWidth, groundY + 15);
    strokeWeight(1);
}

function drawLandformShape(index, w, groundY) {
    const lf = landforms[index];
    const cx = w / 2;

    beginShape();
    noStroke();

    // Create gradient fill
    let topCol = color(lf.color.top[0], lf.color.top[1], lf.color.top[2]);
    let botCol = color(lf.color.bottom[0], lf.color.bottom[1], lf.color.bottom[2]);

    switch (index) {
        case 0: // Mountain - tall peak with steep sides
            fill(topCol);
            vertex(10, groundY);
            vertex(cx - 30, groundY - 80);
            vertex(cx - 10, groundY - 200);
            vertex(cx, groundY - 250); // Peak
            vertex(cx + 10, groundY - 200);
            vertex(cx + 30, groundY - 80);
            vertex(w - 10, groundY);
            break;

        case 1: // Hill - rounded lower elevation
            fill(topCol);
            vertex(10, groundY);
            bezierVertex(20, groundY - 30, cx - 20, groundY - 100, cx, groundY - 100);
            bezierVertex(cx + 20, groundY - 100, w - 20, groundY - 30, w - 10, groundY);
            break;

        case 2: // Plateau - flat top with steep sides
            fill(topCol);
            vertex(15, groundY);
            vertex(25, groundY - 140);
            vertex(30, groundY - 150);
            vertex(w - 30, groundY - 150); // Flat top
            vertex(w - 25, groundY - 140);
            vertex(w - 15, groundY);
            break;

        case 3: // Valley - dip between high sides
            fill(topCol);
            vertex(5, groundY - 120);
            vertex(15, groundY);
            bezierVertex(cx - 30, groundY - 10, cx + 30, groundY - 10, w - 15, groundY);
            vertex(w - 5, groundY - 120);
            vertex(w - 5, groundY + 20);
            vertex(5, groundY + 20);
            break;

        case 4: // Plain - flat and low
            fill(topCol);
            vertex(5, groundY);
            vertex(10, groundY - 30);
            vertex(cx - 40, groundY - 35);
            vertex(cx, groundY - 40);
            vertex(cx + 40, groundY - 35);
            vertex(w - 10, groundY - 30);
            vertex(w - 5, groundY);
            break;
    }
    endShape(CLOSE);

    // Snow cap for mountain
    if (index === 0) {
        fill(255);
        beginShape();
        vertex(cx - 15, groundY - 210);
        vertex(cx, groundY - 250);
        vertex(cx + 15, groundY - 210);
        endShape(CLOSE);
    }
}

function drawVegetation(index, w, groundY) {
    const treePositions = [];

    switch (index) {
        case 0: // Mountain - sparse trees at base
            treePositions.push({ x: 25, y: groundY - 10, size: 0.6 });
            treePositions.push({ x: w - 25, y: groundY - 10, size: 0.5 });
            break;
        case 1: // Hill - trees on sides
            treePositions.push({ x: 20, y: groundY - 10, size: 0.7 });
            treePositions.push({ x: 35, y: groundY - 25, size: 0.6 });
            treePositions.push({ x: w - 35, y: groundY - 25, size: 0.6 });
            treePositions.push({ x: w - 20, y: groundY - 10, size: 0.7 });
            break;
        case 2: // Plateau - shrubs on top
            for (let i = 0; i < 4; i++) {
                drawShrub(40 + i * 20, groundY - 155, 0.5);
            }
            break;
        case 3: // Valley - trees along sides
            treePositions.push({ x: 15, y: groundY - 100, size: 0.6 });
            treePositions.push({ x: w - 15, y: groundY - 100, size: 0.6 });
            break;
        case 4: // Plain - grass tufts
            for (let i = 0; i < 6; i++) {
                drawGrass(15 + i * 20, groundY - 35 - random(5));
            }
            break;
    }

    for (let t of treePositions) {
        drawTree(t.x, t.y, t.size);
    }
}

function drawTree(x, y, scale) {
    push();
    translate(x, y);
    scale = scale || 1;

    // Trunk
    fill(139, 90, 43);
    noStroke();
    rect(-3 * scale, 0, 6 * scale, 15 * scale);

    // Foliage
    fill(34, 139, 34);
    triangle(-12 * scale, 0, 0, -25 * scale, 12 * scale, 0);
    triangle(-10 * scale, -10 * scale, 0, -35 * scale, 10 * scale, -10 * scale);

    pop();
}

function drawShrub(x, y, scale) {
    push();
    fill(107, 142, 35);
    noStroke();
    ellipse(x, y, 15 * scale, 10 * scale);
    ellipse(x - 5, y - 3, 10 * scale, 8 * scale);
    ellipse(x + 5, y - 3, 10 * scale, 8 * scale);
    pop();
}

function drawGrass(x, y) {
    push();
    stroke(124, 252, 0);
    strokeWeight(2);
    line(x, y, x - 3, y - 10);
    line(x, y, x, y - 12);
    line(x, y, x + 3, y - 10);
    pop();
}

function drawRiver(w, groundY) {
    push();
    fill(65, 105, 225, 200);
    noStroke();
    beginShape();
    vertex(w / 2 - 8, groundY - 120);
    bezierVertex(w / 2 - 15, groundY - 60, w / 2 - 5, groundY - 30, w / 2 - 3, groundY);
    vertex(w / 2 + 3, groundY);
    bezierVertex(w / 2 + 5, groundY - 30, w / 2 + 15, groundY - 60, w / 2 + 8, groundY - 120);
    endShape(CLOSE);

    // Water shimmer
    stroke(135, 206, 250, 150);
    strokeWeight(1);
    line(w / 2 - 2, groundY - 80, w / 2 + 2, groundY - 75);
    line(w / 2 - 1, groundY - 50, w / 2 + 3, groundY - 45);
    pop();
}

function drawElevationMarker(index, w, groundY) {
    const heights = [250, 100, 150, 120, 40];
    const elevText = ['10,000+', '2,000', '5,000', '1,000', '500'];

    push();
    stroke(100);
    strokeWeight(1);
    setLineDash([3, 3]);
    line(5, groundY - heights[index], 5, groundY);

    // Arrow heads
    noStroke();
    fill(100);
    triangle(5, groundY - heights[index], 2, groundY - heights[index] + 6, 8, groundY - heights[index] + 6);
    triangle(5, groundY, 2, groundY - 6, 8, groundY - 6);

    // Elevation text
    fill(80);
    textSize(9);
    textAlign(LEFT, CENTER);
    text(elevText[index] + ' ft', 12, groundY - heights[index] / 2);
    textAlign(CENTER, CENTER);
    pop();
}

function setLineDash(pattern) {
    drawingContext.setLineDash(pattern);
}

function drawInfoPanel() {
    if (selectedLandform >= 0 || hoveredLandform >= 0) {
        const idx = selectedLandform >= 0 ? selectedLandform : hoveredLandform;
        const lf = landforms[idx];

        fill(80);
        textSize(11);
        textAlign(CENTER, CENTER);

        let infoText = lf.description;
        if (selectedLandform >= 0) {
            infoText += ' | Fun fact: ' + lf.funFact;
        }
        text(infoText, canvasWidth / 2, drawHeight + 55);
    } else {
        fill(120);
        textSize(11);
        text('Hover over a landform to learn about it. Click for fun facts!', canvasWidth / 2, drawHeight + 55);
    }
}

function drawButtons() {
    for (let btn of buttons) {
        let isHover = mouseX > btn.x && mouseX < btn.x + btn.w &&
                      mouseY > btn.y && mouseY < btn.y + btn.h;
        let isActive = (btn.label === 'Elevation' && showElevation) ||
                       (btn.label === 'Quiz Me!' && quizMode);

        fill(isActive ? color(30, 136, 229) : (isHover ? color(200, 220, 255) : 255));
        stroke(30, 136, 229);
        strokeWeight(2);
        rect(btn.x, btn.y, btn.w, btn.h, 4);

        fill(isActive ? 255 : color(30, 136, 229));
        noStroke();
        textSize(11);
        textStyle(BOLD);
        text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
        textStyle(NORMAL);
    }
}

function drawQuiz() {
    if (quizQuestion >= TOTAL_QUESTIONS) {
        fill(30, 136, 229);
        textSize(14);
        textStyle(BOLD);
        text(score === TOTAL_QUESTIONS ? 'Perfect Score!' : 'Quiz Complete!', canvasWidth / 2, drawHeight + 18);
        textStyle(NORMAL);
        textSize(12);
        fill(50);
        text(`You got ${score} of ${TOTAL_QUESTIONS} correct!`, canvasWidth / 2, drawHeight + 38);

        let btnX = canvasWidth / 2 - 50;
        let btnY = drawHeight + 52;
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

    // Answer buttons - click on landforms
    fill(80);
    textSize(10);
    text('Click on the correct landform above!', canvasWidth / 2, drawHeight + 45);

    if (showAnswer) {
        fill(answerCorrect ? color(0, 150, 0) : color(200, 0, 0));
        textSize(11);
        textStyle(BOLD);
        text(answerCorrect ? 'Correct!' : `Answer: ${q.a}`, canvasWidth / 2, drawHeight + 65);
        textStyle(NORMAL);
    }
}

function drawStar(cx, cy, r1, r2) {
    push();
    noStroke();
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

function mouseMoved() {
    if (quizMode && showAnswer) return;

    const landformWidth = canvasWidth / 5;
    if (mouseY < drawHeight && mouseY > 0) {
        hoveredLandform = floor(mouseX / landformWidth);
        if (hoveredLandform >= 5) hoveredLandform = 4;
        if (hoveredLandform < 0) hoveredLandform = 0;
    } else {
        hoveredLandform = -1;
    }
}

function mousePressed() {
    const landformWidth = canvasWidth / 5;

    if (quizMode) {
        if (quizQuestion >= TOTAL_QUESTIONS) {
            let btnX = canvasWidth / 2 - 50;
            let btnY = drawHeight + 52;
            if (mouseX > btnX && mouseX < btnX + 100 && mouseY > btnY && mouseY < btnY + 22) {
                startQuiz();
            }
            return;
        }

        if (showAnswer) return;

        // Check if clicking on a landform
        if (mouseY < drawHeight && mouseY > 0) {
            let clickedIdx = floor(mouseX / landformWidth);
            if (clickedIdx >= 5) clickedIdx = 4;
            if (clickedIdx < 0) clickedIdx = 0;

            let q = shuffledQuestions[quizQuestion];
            showAnswer = true;
            answerCorrect = landforms[clickedIdx].name === q.a;

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
    } else {
        // Normal mode - toggle selection
        if (mouseY < drawHeight && mouseY > 0) {
            let clickedIdx = floor(mouseX / landformWidth);
            if (clickedIdx >= 5) clickedIdx = 4;
            if (clickedIdx < 0) clickedIdx = 0;

            if (selectedLandform === clickedIdx) {
                selectedLandform = -1;
            } else {
                selectedLandform = clickedIdx;
            }
        }

        // Check buttons
        for (let btn of buttons) {
            if (mouseX > btn.x && mouseX < btn.x + btn.w &&
                mouseY > btn.y && mouseY < btn.y + btn.h) {
                btn.action();
            }
        }
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    setupButtons();
}
