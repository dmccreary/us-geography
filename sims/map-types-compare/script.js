/* Political vs Physical Maps MicroSim */

let canvasWidth, canvasHeight;
const drawHeight = 320;
const controlHeight = 100;
let currentView = 'split'; // 'split', 'political', 'physical'
let quizMode = false;
let quizQuestion = 0;
let score = 0;
let showAnswer = false;
let answerCorrect = false;
let stars = [];
let celebrationStars = [];

const buttons = [];

const quizQuestions = [
    { q: "Which map shows country borders?", a: "Political", opts: ["Political", "Physical"] },
    { q: "Which map shows mountains?", a: "Physical", opts: ["Political", "Physical"] },
    { q: "Which map shows state capitals?", a: "Political", opts: ["Political", "Physical"] },
    { q: "Which map shows rivers and lakes?", a: "Physical", opts: ["Political", "Physical"] },
    { q: "Which map uses colors for different countries?", a: "Political", opts: ["Political", "Physical"] },
    { q: "Which map shows elevation changes?", a: "Physical", opts: ["Political", "Physical"] }
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
    const btnY = drawHeight + 15;
    const btnW = 80;
    const btnH = 28;
    const startX = canvasWidth / 2 - 180;

    buttons.push({ x: startX, y: btnY, w: btnW, h: btnH, label: 'Split View', action: () => { currentView = 'split'; quizMode = false; } });
    buttons.push({ x: startX + 90, y: btnY, w: btnW, h: btnH, label: 'Political', action: () => { currentView = 'political'; quizMode = false; } });
    buttons.push({ x: startX + 180, y: btnY, w: btnW, h: btnH, label: 'Physical', action: () => { currentView = 'physical'; quizMode = false; } });
    buttons.push({ x: startX + 270, y: btnY, w: btnW, h: btnH, label: 'Quiz Me!', action: startQuiz });
}

function startQuiz() {
    quizMode = true;
    quizQuestion = 0;
    score = 0;
    showAnswer = false;
    stars = [];
    celebrationStars = [];
    shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
    currentView = 'split';
}

function draw() {
    background('aliceblue');

    // Draw maps area
    if (currentView === 'split') {
        drawPoliticalMap(0, 0, canvasWidth / 2, drawHeight);
        drawPhysicalMap(canvasWidth / 2, 0, canvasWidth / 2, drawHeight);
        // Divider line
        stroke(100);
        strokeWeight(2);
        line(canvasWidth / 2, 0, canvasWidth / 2, drawHeight);
    } else if (currentView === 'political') {
        drawPoliticalMap(0, 0, canvasWidth, drawHeight);
    } else {
        drawPhysicalMap(0, 0, canvasWidth, drawHeight);
    }

    // Control area
    noStroke();
    fill(255);
    rect(0, drawHeight, canvasWidth, controlHeight);

    if (quizMode) {
        drawQuiz();
    } else {
        drawButtons();
        drawLegend();
    }

    // Draw stars for correct answers
    drawStars();
    drawCelebration();
}

function drawPoliticalMap(x, y, w, h) {
    push();
    // Background
    fill(230, 240, 255);
    noStroke();
    rect(x, y, w, h);

    // Title
    fill(50);
    textSize(14);
    textStyle(BOLD);
    text('POLITICAL MAP', x + w/2, y + 20);
    textStyle(NORMAL);

    // Draw simplified US states with different colors
    const stateColors = [
        color(255, 200, 200), // red tint
        color(200, 255, 200), // green tint
        color(200, 200, 255), // blue tint
        color(255, 255, 200), // yellow tint
        color(255, 200, 255), // pink tint
        color(200, 255, 255)  // cyan tint
    ];

    const scale = w / 300;
    const offsetX = x + 30 * scale;
    const offsetY = y + 60;

    // Western states
    fill(stateColors[0]);
    stroke(80);
    strokeWeight(1);
    rect(offsetX, offsetY, 40 * scale, 80 * scale);

    fill(stateColors[1]);
    rect(offsetX + 40 * scale, offsetY, 50 * scale, 60 * scale);

    fill(stateColors[2]);
    rect(offsetX + 90 * scale, offsetY, 50 * scale, 50 * scale);

    fill(stateColors[3]);
    rect(offsetX + 140 * scale, offsetY, 60 * scale, 60 * scale);

    fill(stateColors[4]);
    rect(offsetX + 40 * scale, offsetY + 60 * scale, 80 * scale, 50 * scale);

    fill(stateColors[5]);
    rect(offsetX + 120 * scale, offsetY + 50 * scale, 80 * scale, 60 * scale);

    fill(stateColors[0]);
    rect(offsetX, offsetY + 80 * scale, 40 * scale, 60 * scale);

    fill(stateColors[2]);
    rect(offsetX + 200 * scale, offsetY, 40 * scale, 110 * scale);

    // Capital markers (stars)
    fill(255, 0, 0);
    noStroke();
    drawStar(offsetX + 20 * scale, offsetY + 40 * scale, 4, 8);
    drawStar(offsetX + 65 * scale, offsetY + 30 * scale, 4, 8);
    drawStar(offsetX + 170 * scale, offsetY + 30 * scale, 4, 8);
    drawStar(offsetX + 220 * scale, offsetY + 50 * scale, 4, 8);

    // Labels
    fill(0);
    textSize(9 * scale);
    noStroke();
    text('State A', offsetX + 20 * scale, offsetY + 100 * scale);
    text('State B', offsetX + 80 * scale, offsetY + 85 * scale);
    text('State C', offsetX + 160 * scale, offsetY + 80 * scale);

    // Legend items for political
    textSize(10);
    fill(255, 0, 0);
    drawStar(x + 20, y + h - 50, 4, 8);
    fill(50);
    text('= Capital', x + 55, y + h - 50);

    stroke(80);
    strokeWeight(2);
    line(x + 15, y + h - 30, x + 35, y + h - 30);
    noStroke();
    fill(50);
    text('= Border', x + 60, y + h - 30);

    pop();
}

function drawPhysicalMap(x, y, w, h) {
    push();
    // Background - earth tones
    fill(220, 230, 210);
    noStroke();
    rect(x, y, w, h);

    // Title
    fill(50);
    textSize(14);
    textStyle(BOLD);
    text('PHYSICAL MAP', x + w/2, y + 20);
    textStyle(NORMAL);

    const scale = w / 300;
    const offsetX = x + 20 * scale;
    const offsetY = y + 50;

    // Mountains (darker/brown)
    fill(139, 119, 101);
    beginShape();
    vertex(offsetX + 20 * scale, offsetY + 100 * scale);
    vertex(offsetX + 40 * scale, offsetY + 30 * scale);
    vertex(offsetX + 60 * scale, offsetY + 60 * scale);
    vertex(offsetX + 80 * scale, offsetY + 20 * scale);
    vertex(offsetX + 100 * scale, offsetY + 70 * scale);
    vertex(offsetX + 100 * scale, offsetY + 100 * scale);
    endShape(CLOSE);

    // Snow caps
    fill(255);
    triangle(offsetX + 40 * scale, offsetY + 30 * scale, offsetX + 35 * scale, offsetY + 45 * scale, offsetX + 45 * scale, offsetY + 45 * scale);
    triangle(offsetX + 80 * scale, offsetY + 20 * scale, offsetX + 73 * scale, offsetY + 40 * scale, offsetX + 87 * scale, offsetY + 40 * scale);

    // Plains (light green)
    fill(180, 210, 150);
    rect(offsetX + 100 * scale, offsetY + 40 * scale, 120 * scale, 80 * scale);

    // River
    stroke(70, 130, 180);
    strokeWeight(3);
    noFill();
    beginShape();
    vertex(offsetX + 160 * scale, offsetY + 10 * scale);
    vertex(offsetX + 155 * scale, offsetY + 40 * scale);
    vertex(offsetX + 165 * scale, offsetY + 70 * scale);
    vertex(offsetX + 150 * scale, offsetY + 100 * scale);
    vertex(offsetX + 160 * scale, offsetY + 130 * scale);
    endShape();

    // Lake
    fill(70, 130, 180);
    noStroke();
    ellipse(offsetX + 200 * scale, offsetY + 50 * scale, 40 * scale, 30 * scale);

    // Forest area (darker green)
    fill(60, 120, 60);
    ellipse(offsetX + 130 * scale, offsetY + 90 * scale, 50 * scale, 40 * scale);

    // Desert (tan)
    fill(210, 180, 140);
    rect(offsetX, offsetY + 100 * scale, 80 * scale, 40 * scale);

    // Elevation labels
    fill(50);
    textSize(8);
    noStroke();
    text('Mountains', offsetX + 60 * scale, offsetY + 85 * scale);
    text('Plains', offsetX + 160 * scale, offsetY + 75 * scale);
    text('Desert', offsetX + 40 * scale, offsetY + 120 * scale);

    // Legend for physical
    textSize(10);
    fill(139, 119, 101);
    rect(x + 10, y + h - 60, 15, 10);
    fill(50);
    text('Mountains', x + 55, y + h - 55);

    fill(70, 130, 180);
    rect(x + 10, y + h - 40, 15, 10);
    fill(50);
    text('Water', x + 45, y + h - 35);

    fill(180, 210, 150);
    rect(x + w/2 - 20, y + h - 60, 15, 10);
    fill(50);
    text('Plains', x + w/2 + 20, y + h - 55);

    fill(210, 180, 140);
    rect(x + w/2 - 20, y + h - 40, 15, 10);
    fill(50);
    text('Desert', x + w/2 + 22, y + h - 35);

    pop();
}

function drawStar(cx, cy, radius1, radius2) {
    push();
    beginShape();
    for (let i = 0; i < 10; i++) {
        let angle = TWO_PI * i / 10 - HALF_PI;
        let r = (i % 2 === 0) ? radius2 : radius1;
        vertex(cx + cos(angle) * r, cy + sin(angle) * r);
    }
    endShape(CLOSE);
    pop();
}

function drawButtons() {
    for (let btn of buttons) {
        let isHover = mouseX > btn.x && mouseX < btn.x + btn.w &&
                      mouseY > btn.y && mouseY < btn.y + btn.h;
        let isActive = (btn.label === 'Split View' && currentView === 'split') ||
                       (btn.label === 'Political' && currentView === 'political') ||
                       (btn.label === 'Physical' && currentView === 'physical') ||
                       (btn.label === 'Quiz Me!' && quizMode);

        fill(isActive ? color(30, 136, 229) : (isHover ? color(200, 220, 255) : 255));
        stroke(30, 136, 229);
        strokeWeight(2);
        rect(btn.x, btn.y, btn.w, btn.h, 4);

        fill(isActive ? 255 : color(30, 136, 229));
        noStroke();
        textSize(11);
        textStyle(BOLD);
        text(btn.label, btn.x + btn.w/2, btn.y + btn.h/2);
        textStyle(NORMAL);
    }
}

function drawLegend() {
    fill(100);
    textSize(11);
    noStroke();
    text('Compare what Political and Physical maps show', canvasWidth/2, drawHeight + 70);

    textSize(10);
    fill(80);
    text('Political: borders, capitals, cities | Physical: terrain, rivers, elevation', canvasWidth/2, drawHeight + 88);
}

function drawQuiz() {
    if (quizQuestion >= TOTAL_QUESTIONS) {
        // Quiz complete
        fill(30, 136, 229);
        textSize(16);
        textStyle(BOLD);
        text(score === TOTAL_QUESTIONS ? '🎉 Perfect Score! 🎉' : 'Quiz Complete!', canvasWidth/2, drawHeight + 30);
        textStyle(NORMAL);
        textSize(14);
        fill(50);
        text(`You got ${score} of ${TOTAL_QUESTIONS} correct!`, canvasWidth/2, drawHeight + 55);

        // Try Again button
        let btnX = canvasWidth/2 - 50;
        let btnY = drawHeight + 70;
        let isHover = mouseX > btnX && mouseX < btnX + 100 && mouseY > btnY && mouseY < btnY + 25;
        fill(isHover ? color(200, 220, 255) : 255);
        stroke(30, 136, 229);
        strokeWeight(2);
        rect(btnX, btnY, 100, 25, 4);
        fill(30, 136, 229);
        noStroke();
        textSize(12);
        text('Try Again', canvasWidth/2, btnY + 12);

        if (score === TOTAL_QUESTIONS && celebrationStars.length === 0) {
            startCelebration();
        }
        return;
    }

    let q = shuffledQuestions[quizQuestion];

    // Progress
    fill(30, 136, 229);
    textSize(12);
    textStyle(BOLD);
    text(`Question ${quizQuestion + 1} of ${TOTAL_QUESTIONS}`, canvasWidth - 80, drawHeight + 15);

    // Stars earned
    for (let i = 0; i < stars.length; i++) {
        fill(255, 215, 0);
        drawStar(20 + i * 25, drawHeight + 15, 6, 12);
    }

    // Question
    textStyle(NORMAL);
    fill(50);
    textSize(14);
    text(q.q, canvasWidth/2, drawHeight + 35);

    // Answer buttons
    let btnW = 100;
    let btnH = 30;
    let btnY = drawHeight + 55;

    for (let i = 0; i < q.opts.length; i++) {
        let btnX = canvasWidth/2 - 110 + i * 120;
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
        textSize(13);
        text(q.opts[i], btnX + btnW/2, btnY + btnH/2);
    }

    // Feedback
    if (showAnswer) {
        fill(answerCorrect ? color(0, 150, 0) : color(200, 0, 0));
        textSize(13);
        textStyle(BOLD);
        text(answerCorrect ? 'Correct!' : `Answer: ${q.a}`, canvasWidth/2, drawHeight + 95);
        textStyle(NORMAL);
    }
}

function drawStars() {
    // Animated stars
    for (let i = stars.length - 1; i >= 0; i--) {
        let s = stars[i];
        if (s.animating) {
            s.scale = min(s.scale + 0.1, 1);
            s.alpha = min(s.alpha + 15, 255);
            if (s.scale >= 1) s.animating = false;
        }
        push();
        fill(255, 215, 0, s.alpha);
        translate(s.x, s.y);
        scale(s.scale);
        drawStar(0, 0, 6, 12);
        pop();
    }
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
    if (quizMode) {
        if (quizQuestion >= TOTAL_QUESTIONS) {
            // Try Again button
            let btnX = canvasWidth/2 - 50;
            let btnY = drawHeight + 70;
            if (mouseX > btnX && mouseX < btnX + 100 && mouseY > btnY && mouseY < btnY + 25) {
                startQuiz();
            }
            return;
        }

        if (showAnswer) return;

        let q = shuffledQuestions[quizQuestion];
        let btnW = 100;
        let btnH = 30;
        let btnY = drawHeight + 55;

        for (let i = 0; i < q.opts.length; i++) {
            let btnX = canvasWidth/2 - 110 + i * 120;
            if (mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH) {
                showAnswer = true;
                answerCorrect = (q.opts[i] === q.a);
                if (answerCorrect) {
                    score++;
                    stars.push({
                        x: 20 + (score - 1) * 25,
                        y: drawHeight + 15,
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

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    setupButtons();
}
