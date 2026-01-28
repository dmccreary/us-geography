/* Great Plains Cross-Section MicroSim */

let canvasWidth, canvasHeight;
const drawHeight = 320;
const controlHeight = 80;

const plainsStates = [
    { name: 'Montana', abbr: 'MT', x: 0.15, products: ['Wheat', 'Cattle'] },
    { name: 'North Dakota', abbr: 'ND', x: 0.25, products: ['Wheat', 'Sunflowers'] },
    { name: 'South Dakota', abbr: 'SD', x: 0.35, products: ['Corn', 'Cattle'] },
    { name: 'Wyoming', abbr: 'WY', x: 0.2, products: ['Cattle', 'Sheep'] },
    { name: 'Nebraska', abbr: 'NE', x: 0.45, products: ['Corn', 'Cattle'] },
    { name: 'Kansas', abbr: 'KS', x: 0.55, products: ['Wheat', 'Cattle'] },
    { name: 'Colorado', abbr: 'CO', x: 0.25, products: ['Wheat', 'Cattle'] },
    { name: 'Oklahoma', abbr: 'OK', x: 0.6, products: ['Wheat', 'Oil'] },
    { name: 'Texas', abbr: 'TX', x: 0.55, products: ['Cotton', 'Cattle', 'Oil'] },
    { name: 'New Mexico', abbr: 'NM', x: 0.35, products: ['Cattle', 'Pecans'] }
];

let viewMode = 'physical'; // 'physical' or 'agriculture'
let hoveredRegion = -1;
let quizMode = false;
let quizQuestion = 0;
let score = 0;
let showAnswer = false;
let answerCorrect = false;
let stars = [];
let celebrationStars = [];

const quizQuestions = [
    { q: "The Great Plains are called America's ___", a: "Breadbasket", opts: ["Breadbasket", "Backyard", "Garden", "Desert"] },
    { q: "What is the main terrain of the Great Plains?", a: "Flat grassland", opts: ["Flat grassland", "Mountains", "Forest", "Desert"] },
    { q: "What major crop grows in Kansas?", a: "Wheat", opts: ["Wheat", "Rice", "Oranges", "Apples"] },
    { q: "Why are there few trees on the Great Plains?", a: "Too dry", opts: ["Too dry", "Too cold", "Too hot", "Too flat"] },
    { q: "What animals originally roamed the Great Plains?", a: "Bison", opts: ["Bison", "Elephants", "Lions", "Kangaroos"] },
    { q: "The Great Plains stretch from Texas to:", a: "Canada", opts: ["Canada", "Mexico", "Florida", "California"] }
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

    buttons.push({ x: startX, y: btnY, w: btnW, h: btnH, label: 'Physical', action: () => { viewMode = 'physical'; quizMode = false; } });
    buttons.push({ x: startX + 95, y: btnY, w: btnW, h: btnH, label: 'Agriculture', action: () => { viewMode = 'agriculture'; quizMode = false; } });
    buttons.push({ x: startX + 190, y: btnY, w: btnW, h: btnH, label: 'Quiz Me!', action: startQuiz });
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

    // Draw cross-section view
    drawCrossSection();

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

function drawCrossSection() {
    const margin = 20;
    const sectionWidth = canvasWidth - 2 * margin;
    const groundLevel = drawHeight - 80;

    // Sky
    for (let y = 0; y < groundLevel - 100; y++) {
        let inter = map(y, 0, groundLevel - 100, 0, 1);
        let c = lerpColor(color(135, 206, 250), color(200, 230, 255), inter);
        stroke(c);
        line(margin, y, canvasWidth - margin, y);
    }

    // Title for view mode
    fill(50);
    textSize(14);
    textStyle(BOLD);
    text(viewMode === 'physical' ? 'Physical Features' : 'Agricultural Products', canvasWidth / 2, 15);
    textStyle(NORMAL);

    // Draw terrain profile
    noStroke();

    // Rocky Mountains (left side)
    fill(139, 90, 43);
    beginShape();
    vertex(margin, groundLevel);
    vertex(margin + 30, groundLevel - 120);
    vertex(margin + 50, groundLevel - 180);
    vertex(margin + 70, groundLevel - 160);
    vertex(margin + 90, groundLevel - 200);
    vertex(margin + 100, groundLevel - 150);
    vertex(margin + 120, groundLevel - 100);
    vertex(margin + 140, groundLevel - 60);
    vertex(margin + 160, groundLevel - 40);
    vertex(margin + 180, groundLevel);
    endShape(CLOSE);

    // Snow caps
    fill(255);
    beginShape();
    vertex(margin + 45, groundLevel - 170);
    vertex(margin + 50, groundLevel - 180);
    vertex(margin + 55, groundLevel - 170);
    endShape(CLOSE);
    beginShape();
    vertex(margin + 85, groundLevel - 190);
    vertex(margin + 90, groundLevel - 200);
    vertex(margin + 95, groundLevel - 185);
    endShape(CLOSE);

    // Great Plains (middle) - gentle slope down
    fill(194, 178, 128);
    beginShape();
    vertex(margin + 160, groundLevel);
    for (let x = margin + 160; x < canvasWidth - margin - 80; x += 10) {
        let elev = map(x, margin + 160, canvasWidth - margin - 80, groundLevel - 40, groundLevel - 15);
        // Add slight undulation
        elev += sin((x - margin) * 0.05) * 3;
        vertex(x, elev);
    }
    vertex(canvasWidth - margin - 80, groundLevel - 15);
    vertex(canvasWidth - margin - 80, groundLevel);
    endShape(CLOSE);

    // Mississippi River valley (right side)
    fill(101, 67, 33);
    beginShape();
    vertex(canvasWidth - margin - 80, groundLevel);
    vertex(canvasWidth - margin - 80, groundLevel - 15);
    vertex(canvasWidth - margin - 60, groundLevel - 10);
    vertex(canvasWidth - margin - 40, groundLevel - 5);
    vertex(canvasWidth - margin, groundLevel);
    endShape(CLOSE);

    // Mississippi River
    fill(65, 105, 225);
    ellipse(canvasWidth - margin - 40, groundLevel - 5, 30, 15);

    // Ground base
    fill(139, 90, 43);
    rect(margin, groundLevel, sectionWidth, 20);

    // Labels
    fill(50);
    textSize(10);
    text('Rocky Mtns', margin + 80, groundLevel + 35);
    text('Great Plains', canvasWidth / 2, groundLevel + 35);
    text('Mississippi', canvasWidth - margin - 40, groundLevel + 35);

    // Elevation markers
    textSize(9);
    fill(80);
    textAlign(LEFT, CENTER);
    text('14,000 ft', margin + 5, groundLevel - 195);
    text('5,000 ft', margin + 5, groundLevel - 40);
    text('500 ft', canvasWidth - margin - 70, groundLevel - 10);
    textAlign(CENTER, CENTER);

    // Draw content based on mode
    if (viewMode === 'physical') {
        drawPhysicalFeatures(margin, groundLevel);
    } else {
        drawAgriculture(margin, groundLevel);
    }
}

function drawPhysicalFeatures(margin, groundLevel) {
    // Grass on plains
    stroke(107, 142, 35);
    strokeWeight(2);
    for (let x = margin + 180; x < canvasWidth - margin - 100; x += 20) {
        let baseY = groundLevel - 30 + sin((x - margin) * 0.05) * 3;
        line(x, baseY, x - 3, baseY - 10);
        line(x, baseY, x, baseY - 12);
        line(x, baseY, x + 3, baseY - 10);
    }
    strokeWeight(1);
    noStroke();

    // Trees in mountains
    for (let i = 0; i < 5; i++) {
        let tx = margin + 120 + i * 15;
        let ty = groundLevel - 50 - i * 8;
        drawTree(tx, ty, 0.5);
    }

    // Bison silhouette
    fill(60, 40, 20);
    let bisonX = canvasWidth / 2;
    let bisonY = groundLevel - 50;
    ellipse(bisonX, bisonY, 30, 20);
    ellipse(bisonX - 12, bisonY - 8, 15, 12);
    rect(bisonX - 15, bisonY, 5, 10);
    rect(bisonX + 5, bisonY, 5, 10);

    // Info text
    fill(50);
    textSize(11);
    text('Flat grassland, few trees', canvasWidth / 2, 35);
    text('Home to bison, pronghorn, prairie dogs', canvasWidth / 2, 50);
}

function drawAgriculture(margin, groundLevel) {
    // Wheat fields
    fill(218, 165, 32);
    for (let x = margin + 200; x < margin + 350; x += 30) {
        let baseY = groundLevel - 35 + sin((x - margin) * 0.05) * 3;
        drawWheat(x, baseY);
    }

    // Corn fields
    fill(34, 139, 34);
    for (let x = margin + 380; x < margin + 480; x += 35) {
        let baseY = groundLevel - 35 + sin((x - margin) * 0.05) * 3;
        drawCorn(x, baseY);
    }

    // Cattle
    fill(139, 90, 43);
    for (let i = 0; i < 3; i++) {
        let cx = canvasWidth / 2 + 80 + i * 40;
        let cy = groundLevel - 45;
        drawCow(cx, cy);
    }

    // Oil derrick
    stroke(50);
    strokeWeight(2);
    let oilX = canvasWidth - margin - 150;
    let oilY = groundLevel - 30;
    line(oilX, oilY, oilX - 15, oilY - 50);
    line(oilX, oilY, oilX + 15, oilY - 50);
    line(oilX - 10, oilY - 30, oilX + 10, oilY - 30);
    line(oilX - 5, oilY - 40, oilX + 5, oilY - 40);
    strokeWeight(1);
    noStroke();

    // Labels
    fill(50);
    textSize(10);
    text('Wheat', margin + 275, groundLevel - 60);
    text('Corn', margin + 430, groundLevel - 60);
    text('Cattle', canvasWidth / 2 + 110, groundLevel - 65);
    text('Oil', canvasWidth - margin - 150, groundLevel - 55);

    // Info text
    fill(50);
    textSize(11);
    text('"America\'s Breadbasket" - feeds the world!', canvasWidth / 2, 35);
    text('Wheat, corn, cattle, oil, sunflowers', canvasWidth / 2, 50);
}

function drawTree(x, y, scale) {
    push();
    translate(x, y);

    fill(139, 90, 43);
    noStroke();
    rect(-2 * scale, 0, 4 * scale, 10 * scale);

    fill(34, 100, 34);
    triangle(-8 * scale, 0, 0, -15 * scale, 8 * scale, 0);
    triangle(-6 * scale, -8 * scale, 0, -22 * scale, 6 * scale, -8 * scale);

    pop();
}

function drawWheat(x, y) {
    push();
    stroke(218, 165, 32);
    strokeWeight(2);
    line(x, y, x, y - 25);

    fill(218, 165, 32);
    noStroke();
    ellipse(x, y - 28, 6, 12);
    pop();
}

function drawCorn(x, y) {
    push();
    stroke(34, 139, 34);
    strokeWeight(3);
    line(x, y, x, y - 30);

    fill(255, 215, 0);
    noStroke();
    ellipse(x + 5, y - 20, 8, 15);
    pop();
}

function drawCow(x, y) {
    push();
    fill(139, 90, 43);
    noStroke();
    ellipse(x, y, 20, 12);
    ellipse(x - 8, y - 4, 8, 6);
    rect(x - 8, y + 2, 3, 6);
    rect(x + 3, y + 2, 3, 6);
    pop();
}

function drawButtons() {
    for (let btn of buttons) {
        let isHover = mouseX > btn.x && mouseX < btn.x + btn.w &&
                      mouseY > btn.y && mouseY < btn.y + btn.h;
        let isActive = (btn.label === 'Physical' && viewMode === 'physical' && !quizMode) ||
                       (btn.label === 'Agriculture' && viewMode === 'agriculture' && !quizMode) ||
                       (btn.label === 'Quiz Me!' && quizMode);

        fill(isActive ? color(139, 119, 101) : (isHover ? color(220, 210, 200) : 255));
        stroke(139, 119, 101);
        strokeWeight(2);
        rect(btn.x, btn.y, btn.w, btn.h, 4);

        fill(isActive ? 255 : color(139, 119, 101));
        noStroke();
        textSize(11);
        textStyle(BOLD);
        text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
        textStyle(NORMAL);
    }
}

function drawInfo() {
    fill(80);
    textSize(10);
    text('The Great Plains cover 10 states from Texas to Canada', canvasWidth / 2, drawHeight + 55);
    text('Click Physical or Agriculture to explore different views', canvasWidth / 2, drawHeight + 70);
}

function drawQuiz() {
    if (quizQuestion >= TOTAL_QUESTIONS) {
        fill(139, 119, 101);
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
        fill(isHover ? color(220, 210, 200) : 255);
        stroke(139, 119, 101);
        strokeWeight(2);
        rect(btnX, btnY, 100, 22, 4);
        fill(139, 119, 101);
        noStroke();
        textSize(11);
        text('Try Again', canvasWidth / 2, btnY + 11);

        if (score === TOTAL_QUESTIONS && celebrationStars.length === 0) {
            startCelebration();
        }
        return;
    }

    let q = shuffledQuestions[quizQuestion];

    fill(139, 119, 101);
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

    let btnW = 100;
    let btnH = 22;
    let btnY = drawHeight + 42;
    let totalW = q.opts.length * btnW + (q.opts.length - 1) * 8;
    let startX = (canvasWidth - totalW) / 2;

    for (let i = 0; i < q.opts.length; i++) {
        let btnX = startX + i * (btnW + 8);
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
            fill(isHover ? color(220, 210, 200) : 255);
            stroke(139, 119, 101);
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
            color: random([color(255, 215, 0), color(139, 119, 101), color(218, 165, 32)]),
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

        let q = shuffledQuestions[quizQuestion];
        let btnW = 100;
        let btnH = 22;
        let btnY = drawHeight + 42;
        let totalW = q.opts.length * btnW + (q.opts.length - 1) * 8;
        let startX = (canvasWidth - totalW) / 2;

        for (let i = 0; i < q.opts.length; i++) {
            let btnX = startX + i * (btnW + 8);
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

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    setupButtons();
}
