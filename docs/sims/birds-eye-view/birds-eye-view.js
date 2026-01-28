// Bird's Eye View Comparison MicroSim
// Helps students understand how maps show places from above
// by comparing a 3D isometric view with its 2D map representation

// Canvas dimensions
let canvasWidth = 400;
let drawHeight = 400;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;

// Interactive state
let highlightedElement = null; // null, 'house', 'tree', 'road', 'pond'
let showLabels = true;

// Colors for each element (matching between views)
const colors = {
    house: { fill: '#E74C3C', stroke: '#C0392B', name: 'House' },
    tree: { fill: '#27AE60', stroke: '#1E8449', name: 'Tree' },
    road: { fill: '#7F8C8D', stroke: '#566573', name: 'Road' },
    pond: { fill: '#3498DB', stroke: '#2980B9', name: 'Pond' },
    grass: { fill: '#82E0AA', stroke: '#58D68D' }
};

// Button definitions (calculated in setup)
let buttons = [];

function setup() {
    updateCanvasSize();
    const canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent(document.querySelector('main'));

    describe('Interactive comparison showing a 3D neighborhood view on the left and a 2D map view on the right. Click elements to highlight them in both views.', LABEL);

    textFont('Arial');
    setupButtons();
}

function setupButtons() {
    buttons = [];
    let buttonY = drawHeight + 15;
    let buttonWidth = 70;
    let buttonHeight = 30;
    let buttonSpacing = 10;
    let totalWidth = 4 * buttonWidth + 3 * buttonSpacing + 10 + 100; // element buttons + gap + toggle
    let startX = (canvasWidth - totalWidth) / 2;

    const elements = ['house', 'tree', 'road', 'pond'];

    elements.forEach((elem, i) => {
        buttons.push({
            x: startX + i * (buttonWidth + buttonSpacing),
            y: buttonY,
            w: buttonWidth,
            h: buttonHeight,
            label: colors[elem].name,
            color: colors[elem].fill,
            element: elem,
            type: 'highlight'
        });
    });

    // Labels toggle button
    buttons.push({
        x: startX + 4 * (buttonWidth + buttonSpacing) + 10,
        y: buttonY,
        w: 100,
        h: buttonHeight,
        label: 'Labels',
        color: '#2ECC71',
        type: 'toggle'
    });
}

function draw() {
    background('aliceblue');

    let halfWidth = canvasWidth / 2;

    // Draw dividing line
    stroke('#333');
    strokeWeight(2);
    line(halfWidth, 0, halfWidth, drawHeight);

    // Draw titles
    fill('#333');
    noStroke();
    textAlign(CENTER, TOP);
    textSize(16);
    text('3D View (Isometric)', halfWidth / 2, 10);
    text('Map View (From Above)', halfWidth + halfWidth / 2, 10);

    // Draw both views
    push();
    drawIsometricView(0, 40, halfWidth - 10, drawHeight - 50);
    pop();

    push();
    drawMapView(halfWidth + 10, 40, halfWidth - 20, drawHeight - 50);
    pop();

    // Draw control area background
    fill('white');
    stroke('silver');
    strokeWeight(1);
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Draw buttons
    drawButtons();

    // Draw highlight glow effect
    if (highlightedElement) {
        drawHighlightGlow();
    }
}

function drawButtons() {
    textAlign(CENTER, CENTER);
    textSize(12);

    buttons.forEach(btn => {
        // Determine button color
        let btnColor;
        if (btn.type === 'toggle') {
            btnColor = showLabels ? '#2ECC71' : '#95A5A6';
        } else {
            btnColor = btn.color;
        }

        // Check if this button is "active"
        let isActive = (btn.type === 'highlight' && highlightedElement === btn.element);

        // Draw button shadow/glow if active
        if (isActive) {
            fill(255, 215, 0, 100);
            noStroke();
            rect(btn.x - 3, btn.y - 3, btn.w + 6, btn.h + 6, 8);
        }

        // Draw button
        fill(btnColor);
        stroke(isActive ? 'gold' : 'rgba(0,0,0,0.2)');
        strokeWeight(isActive ? 3 : 1);
        rect(btn.x, btn.y, btn.w, btn.h, 5);

        // Draw label
        fill('white');
        noStroke();
        let labelText = btn.type === 'toggle'
            ? (showLabels ? 'Labels: ON' : 'Labels: OFF')
            : btn.label;
        text(labelText, btn.x + btn.w / 2, btn.y + btn.h / 2);
    });
}

function mousePressed() {
    // Check button clicks
    for (let btn of buttons) {
        if (mouseX >= btn.x && mouseX <= btn.x + btn.w &&
            mouseY >= btn.y && mouseY <= btn.y + btn.h) {
            if (btn.type === 'toggle') {
                showLabels = !showLabels;
            } else if (btn.type === 'highlight') {
                if (highlightedElement === btn.element) {
                    highlightedElement = null;
                } else {
                    highlightedElement = btn.element;
                }
            }
            return;
        }
    }

    // Check if click is in the drawing area
    if (mouseY < drawHeight && mouseY > 40) {
        let halfWidth = canvasWidth / 2;

        if (mouseX < halfWidth) {
            checkIsometricClick(mouseX, mouseY);
        } else {
            checkMapClick(mouseX - halfWidth, mouseY);
        }
    }
}

function drawIsometricView(x, y, w, h) {
    let centerX = x + w / 2;
    let centerY = y + h / 2;

    // Draw grass base
    fill(colors.grass.fill);
    stroke(colors.grass.stroke);
    strokeWeight(1);

    // Isometric grass plane
    beginShape();
    vertex(centerX, y + 30);
    vertex(x + w - 20, centerY);
    vertex(centerX, y + h - 20);
    vertex(x + 20, centerY);
    endShape(CLOSE);

    // Draw road (horizontal strip in isometric)
    let roadHighlight = highlightedElement === 'road';
    if (roadHighlight) {
        drawGlow(centerX, centerY, 100);
    }
    fill(colors.road.fill);
    stroke(roadHighlight ? 'gold' : colors.road.stroke);
    strokeWeight(roadHighlight ? 3 : 1);

    beginShape();
    vertex(x + 30, centerY - 15);
    vertex(x + w - 30, centerY - 15);
    vertex(x + w - 30, centerY + 15);
    vertex(x + 30, centerY + 15);
    endShape(CLOSE);

    // Draw pond (back right)
    let pondHighlight = highlightedElement === 'pond';
    if (pondHighlight) {
        drawGlow(centerX + 50, centerY - 50, 60);
    }
    fill(colors.pond.fill);
    stroke(pondHighlight ? 'gold' : colors.pond.stroke);
    strokeWeight(pondHighlight ? 3 : 1);
    ellipse(centerX + 50, centerY - 50, 60, 35);

    // Draw trees (multiple)
    let treeHighlight = highlightedElement === 'tree';
    drawIsometricTree(centerX - 60, centerY - 40, treeHighlight);
    drawIsometricTree(centerX - 40, centerY + 50, treeHighlight);
    drawIsometricTree(centerX + 70, centerY + 40, treeHighlight);

    // Draw house (front center)
    let houseHighlight = highlightedElement === 'house';
    drawIsometricHouse(centerX - 20, centerY + 20, houseHighlight);
}

function drawIsometricTree(x, y, highlight) {
    if (highlight) {
        drawGlow(x, y - 20, 40);
    }

    // Trunk
    fill('#8B4513');
    stroke(highlight ? 'gold' : '#5D3A1A');
    strokeWeight(highlight ? 2 : 1);
    rect(x - 4, y - 10, 8, 20);

    // Foliage (triangle for isometric look)
    fill(colors.tree.fill);
    stroke(highlight ? 'gold' : colors.tree.stroke);
    strokeWeight(highlight ? 3 : 1);
    triangle(x, y - 50, x - 20, y - 10, x + 20, y - 10);
}

function drawIsometricHouse(x, y, highlight) {
    if (highlight) {
        drawGlow(x + 25, y - 20, 80);
    }

    // House body
    fill(colors.house.fill);
    stroke(highlight ? 'gold' : colors.house.stroke);
    strokeWeight(highlight ? 3 : 1);

    // Front face
    beginShape();
    vertex(x, y);
    vertex(x + 50, y);
    vertex(x + 50, y - 40);
    vertex(x, y - 40);
    endShape(CLOSE);

    // Side face (darker)
    fill('#C0392B');
    beginShape();
    vertex(x + 50, y);
    vertex(x + 70, y - 15);
    vertex(x + 70, y - 55);
    vertex(x + 50, y - 40);
    endShape(CLOSE);

    // Roof
    fill('#5D4E37');
    stroke(highlight ? 'gold' : '#3D3427');
    beginShape();
    vertex(x - 5, y - 40);
    vertex(x + 25, y - 65);
    vertex(x + 75, y - 50);
    vertex(x + 55, y - 40);
    endShape(CLOSE);

    // Door
    fill('#5D4E37');
    noStroke();
    rect(x + 18, y - 25, 15, 25);

    // Window
    fill('#87CEEB');
    stroke('#333');
    strokeWeight(1);
    rect(x + 5, y - 35, 10, 10);
}

function drawMapView(x, y, w, h) {
    let centerX = x + w / 2;
    let centerY = y + h / 2;

    // Draw grass background
    fill(colors.grass.fill);
    stroke(colors.grass.stroke);
    strokeWeight(1);
    rect(x, y, w, h, 5);

    // Draw road (horizontal strip)
    let roadHighlight = highlightedElement === 'road';
    fill(colors.road.fill);
    stroke(roadHighlight ? 'gold' : colors.road.stroke);
    strokeWeight(roadHighlight ? 4 : 2);
    rect(x + 10, centerY - 15, w - 20, 30);

    // Draw pond (circle from above)
    let pondHighlight = highlightedElement === 'pond';
    fill(colors.pond.fill);
    stroke(pondHighlight ? 'gold' : colors.pond.stroke);
    strokeWeight(pondHighlight ? 4 : 2);
    ellipse(centerX + 40, centerY - 50, 50, 50);

    // Draw trees (circles from above)
    let treeHighlight = highlightedElement === 'tree';
    drawMapTree(centerX - 50, centerY - 40, treeHighlight);
    drawMapTree(centerX - 30, centerY + 50, treeHighlight);
    drawMapTree(centerX + 60, centerY + 45, treeHighlight);

    // Draw house (rectangle from above)
    let houseHighlight = highlightedElement === 'house';
    fill(colors.house.fill);
    stroke(houseHighlight ? 'gold' : colors.house.stroke);
    strokeWeight(houseHighlight ? 4 : 2);
    rect(centerX - 30, centerY + 10, 40, 35);

    // Roof line indicator
    stroke(houseHighlight ? 'gold' : '#5D4E37');
    strokeWeight(2);
    line(centerX - 30, centerY + 27, centerX + 10, centerY + 27);

    // Draw labels when showLabels is ON
    if (showLabels) {
        drawMapLabel('Road', centerX, centerY);
        drawMapLabel('Pond', centerX + 40, centerY - 70);
        drawMapLabel('Trees', centerX - 50, centerY - 60);
        drawMapLabel('House', centerX - 10, centerY + 30);
    }

    // Draw map legend
    drawMapLegend(x + 10, y + h - 80);
}

function drawMapTree(x, y, highlight) {
    fill(colors.tree.fill);
    stroke(highlight ? 'gold' : colors.tree.stroke);
    strokeWeight(highlight ? 4 : 2);
    ellipse(x, y, 25, 25);

    // Small center dot for tree symbol
    fill(colors.tree.stroke);
    noStroke();
    ellipse(x, y, 6, 6);
}

function drawMapLabel(labelText, x, y) {
    textSize(12);
    let tw = textWidth(labelText) + 10;

    fill('white');
    stroke('#333');
    strokeWeight(1);
    rectMode(CENTER);
    rect(x, y - 25, tw, 18, 3);
    rectMode(CORNER);

    fill('#333');
    noStroke();
    textAlign(CENTER, CENTER);
    text(labelText, x, y - 25);
}

function drawMapLegend(x, y) {
    fill('rgba(255, 255, 255, 0.9)');
    stroke('#333');
    strokeWeight(1);
    rect(x, y, 90, 70, 5);

    textAlign(LEFT, CENTER);
    textSize(10);
    fill('#333');
    noStroke();
    text('Map Key:', x + 5, y + 10);

    // House
    fill(colors.house.fill);
    rect(x + 5, y + 20, 12, 10);
    fill('#333');
    text('House', x + 22, y + 25);

    // Tree
    fill(colors.tree.fill);
    ellipse(x + 11, y + 42, 10, 10);
    fill('#333');
    text('Tree', x + 22, y + 42);

    // Pond
    fill(colors.pond.fill);
    ellipse(x + 11, y + 58, 10, 10);
    fill('#333');
    text('Pond', x + 22, y + 58);
}

function drawGlow(x, y, size) {
    noStroke();
    for (let i = 5; i > 0; i--) {
        fill(255, 215, 0, 30);
        ellipse(x, y, size + i * 10, size + i * 10);
    }
}

function drawHighlightGlow() {
    // Draw pulsing border around the view containing highlighted element
    let pulse = sin(frameCount * 0.1) * 0.3 + 0.7;
    stroke(255, 215, 0, pulse * 255);
    strokeWeight(3);
    noFill();

    // Highlight both views
    rect(2, 2, canvasWidth / 2 - 6, drawHeight - 4, 5);
    rect(canvasWidth / 2 + 4, 2, canvasWidth / 2 - 6, drawHeight - 4, 5);
}

function checkIsometricClick(mx, my) {
    let centerX = canvasWidth / 4;
    let centerY = drawHeight / 2 + 20;

    // House area
    if (mx > centerX - 30 && mx < centerX + 60 && my > centerY - 30 && my < centerY + 40) {
        toggleHighlight('house');
        return;
    }

    // Pond area
    if (dist(mx, my, centerX + 50, centerY - 50) < 35) {
        toggleHighlight('pond');
        return;
    }

    // Tree areas
    if (dist(mx, my, centerX - 60, centerY - 30) < 25 ||
        dist(mx, my, centerX - 40, centerY + 50) < 25 ||
        dist(mx, my, centerX + 70, centerY + 40) < 25) {
        toggleHighlight('tree');
        return;
    }

    // Road area
    if (my > centerY - 20 && my < centerY + 20 && mx > 30 && mx < canvasWidth / 2 - 30) {
        toggleHighlight('road');
        return;
    }
}

function checkMapClick(mx, my) {
    let w = canvasWidth / 2 - 20;
    let centerX = w / 2;
    let centerY = drawHeight / 2 + 20;

    // House
    if (mx > centerX - 30 && mx < centerX + 10 && my > centerY + 10 && my < centerY + 45) {
        toggleHighlight('house');
        return;
    }

    // Pond
    if (dist(mx, my, centerX + 40, centerY - 50) < 30) {
        toggleHighlight('pond');
        return;
    }

    // Trees
    if (dist(mx, my, centerX - 50, centerY - 40) < 15 ||
        dist(mx, my, centerX - 30, centerY + 50) < 15 ||
        dist(mx, my, centerX + 60, centerY + 45) < 15) {
        toggleHighlight('tree');
        return;
    }

    // Road
    if (my > centerY - 15 && my < centerY + 15 && mx > 10 && mx < w - 10) {
        toggleHighlight('road');
        return;
    }
}

function toggleHighlight(element) {
    if (highlightedElement === element) {
        highlightedElement = null;
    } else {
        highlightedElement = element;
    }
}

function windowResized() {
    updateCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
    setupButtons();
}

function updateCanvasSize() {
    const container = document.querySelector('main');
    if (container) {
        canvasWidth = container.offsetWidth;
    }
    canvasHeight = drawHeight + controlHeight;
}
