// Weather vs Climate MicroSim
// Shows difference between daily weather (variable) and climate (consistent pattern)

let canvasWidth, canvasHeight;
const drawHeight = 300;
const controlHeight = 50;

// Cities with climate data (avg high temps by month, avg rainfall inches/month)
const cities = {
    'Phoenix, AZ': {
        temps: [67, 71, 77, 85, 94, 104, 106, 104, 100, 88, 75, 66],
        rain: [0.7, 0.7, 0.9, 0.2, 0.1, 0.0, 0.9, 1.0, 0.7, 0.6, 0.6, 0.9],
        climate: 'Desert - Hot and Dry'
    },
    'Seattle, WA': {
        temps: [47, 50, 54, 58, 65, 70, 76, 76, 70, 60, 51, 45],
        rain: [5.6, 3.5, 3.7, 2.7, 2.0, 1.5, 0.8, 1.0, 1.6, 3.2, 5.9, 5.8],
        climate: 'Marine - Mild and Rainy'
    },
    'Miami, FL': {
        temps: [76, 78, 80, 83, 87, 89, 91, 91, 89, 86, 81, 77],
        rain: [2.0, 2.1, 2.6, 3.4, 5.5, 9.7, 6.5, 8.6, 9.8, 6.3, 3.3, 2.1],
        climate: 'Tropical - Hot and Humid'
    },
    'Chicago, IL': {
        temps: [32, 36, 47, 59, 70, 80, 84, 82, 75, 62, 48, 36],
        rain: [2.1, 1.8, 2.6, 3.7, 4.1, 4.1, 3.6, 4.1, 3.3, 3.2, 3.4, 2.5],
        climate: 'Continental - Hot Summers, Cold Winters'
    }
};

let currentCity = 'Phoenix, AZ';
let currentMonth = 6; // July (0-indexed)
let todayTemp, todayCondition;
let weatherIcons = [];
let buttons = [];

// Weather conditions
const conditions = ['sunny', 'partly cloudy', 'cloudy', 'rainy', 'stormy'];

function setup() {
    updateCanvasSize();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    textAlign(CENTER, CENTER);

    generateTodayWeather();
    createButtons();
}

function updateCanvasSize() {
    const container = document.getElementById('canvas-container');
    canvasWidth = Math.min(container.offsetWidth, 700);
    canvasHeight = drawHeight + controlHeight;
}

function windowResized() {
    updateCanvasSize();
    createCanvas(canvasWidth, canvasHeight);
    createButtons();
}

function createButtons() {
    buttons = [];
    const cityNames = Object.keys(cities);
    const btnWidth = 100;
    const btnHeight = 25;
    const startX = (canvasWidth - cityNames.length * (btnWidth + 10)) / 2;

    cityNames.forEach((city, i) => {
        buttons.push({
            x: startX + i * (btnWidth + 10),
            y: drawHeight + 12,
            w: btnWidth,
            h: btnHeight,
            label: city.split(',')[0],
            city: city
        });
    });
}

function generateTodayWeather() {
    const data = cities[currentCity];
    const avgTemp = data.temps[currentMonth];
    // Random variation: +/- 15 degrees from average
    todayTemp = avgTemp + Math.floor(random(-15, 16));

    // Condition based on rainfall probability
    const rainChance = data.rain[currentMonth] / 10;
    const r = random();
    if (r < rainChance * 0.3) todayCondition = 'stormy';
    else if (r < rainChance * 0.6) todayCondition = 'rainy';
    else if (r < rainChance + 0.2) todayCondition = 'cloudy';
    else if (r < rainChance + 0.4) todayCondition = 'partly cloudy';
    else todayCondition = 'sunny';
}

function draw() {
    background(240, 248, 255); // aliceblue

    // Title
    fill(50);
    textSize(18);
    textStyle(BOLD);
    text('Weather vs Climate', canvasWidth / 2, 20);

    textSize(12);
    textStyle(NORMAL);
    fill(100);
    text(currentCity + ' - ' + cities[currentCity].climate, canvasWidth / 2, 40);

    // Draw two panels
    const panelWidth = canvasWidth / 2 - 20;
    const panelX1 = 10;
    const panelX2 = canvasWidth / 2 + 10;
    const panelY = 55;
    const panelH = 235;

    // Weather panel (left)
    drawWeatherPanel(panelX1, panelY, panelWidth, panelH);

    // Climate panel (right)
    drawClimatePanel(panelX2, panelY, panelWidth, panelH);

    // Controls area
    fill(255);
    noStroke();
    rect(0, drawHeight, canvasWidth, controlHeight);

    // Draw city buttons
    drawButtons();

    // Change Day button
    const changeBtnX = canvasWidth - 90;
    const changeBtnY = drawHeight + 12;
    fill(70, 130, 180);
    rect(changeBtnX, changeBtnY, 80, 25, 4);
    fill(255);
    textSize(11);
    text('Change Day', changeBtnX + 40, changeBtnY + 12);
}

function drawWeatherPanel(x, y, w, h) {
    // Panel background
    fill(255);
    stroke(200);
    rect(x, y, w, h, 8);

    // Header
    fill(70, 130, 180);
    noStroke();
    rect(x, y, w, 30, 8, 8, 0, 0);
    fill(255);
    textSize(14);
    textStyle(BOLD);
    text("Today's Weather", x + w/2, y + 15);

    // Weather icon area
    const iconY = y + 80;
    drawWeatherIcon(x + w/2, iconY, todayCondition);

    // Temperature
    fill(50);
    textSize(36);
    textStyle(BOLD);
    text(todayTemp + '°F', x + w/2, y + 150);

    // Condition text
    textSize(14);
    textStyle(NORMAL);
    fill(100);
    text(todayCondition.charAt(0).toUpperCase() + todayCondition.slice(1), x + w/2, y + 180);

    // Note
    textSize(10);
    fill(150);
    text('(Changes daily!)', x + w/2, y + 200);

    // Thermometer
    drawThermometer(x + 25, y + 100, todayTemp);
}

function drawClimatePanel(x, y, w, h) {
    // Panel background
    fill(255);
    stroke(200);
    rect(x, y, w, h, 8);

    // Header
    fill(34, 139, 34);
    noStroke();
    rect(x, y, w, 30, 8, 8, 0, 0);
    fill(255);
    textSize(14);
    textStyle(BOLD);
    text('Climate Pattern', x + w/2, y + 15);

    // Draw temperature bar chart
    const data = cities[currentCity];
    const chartX = x + 20;
    const chartY = y + 50;
    const chartW = w - 40;
    const chartH = 120;

    // Chart background
    fill(250);
    noStroke();
    rect(chartX, chartY, chartW, chartH);

    // Bars for each month
    const barW = chartW / 12 - 4;
    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

    for (let i = 0; i < 12; i++) {
        const temp = data.temps[i];
        const barH = map(temp, 20, 110, 10, chartH - 20);
        const barX = chartX + i * (barW + 4) + 2;
        const barY = chartY + chartH - barH - 10;

        // Color based on temperature
        if (temp > 90) fill(255, 100, 100);
        else if (temp > 75) fill(255, 180, 100);
        else if (temp > 60) fill(255, 220, 100);
        else if (temp > 45) fill(150, 200, 255);
        else fill(100, 150, 255);

        // Highlight current month
        if (i === currentMonth) {
            stroke(0);
            strokeWeight(2);
        } else {
            noStroke();
        }

        rect(barX, barY, barW, barH, 2);

        // Month label
        noStroke();
        fill(100);
        textSize(8);
        text(months[i], barX + barW/2, chartY + chartH + 8);
    }

    // Average label
    fill(50);
    textSize(12);
    textStyle(BOLD);
    const avgTemp = data.temps[currentMonth];
    text('July Avg: ' + avgTemp + '°F', x + w/2, y + 195);

    // Note
    textSize(10);
    textStyle(NORMAL);
    fill(150);
    text('(Same pattern every year!)', x + w/2, y + 215);
}

function drawWeatherIcon(x, y, condition) {
    push();
    translate(x, y);

    if (condition === 'sunny') {
        // Sun
        fill(255, 200, 0);
        noStroke();
        ellipse(0, 0, 50, 50);
        stroke(255, 200, 0);
        strokeWeight(3);
        for (let i = 0; i < 8; i++) {
            const angle = i * PI / 4;
            line(cos(angle) * 30, sin(angle) * 30, cos(angle) * 40, sin(angle) * 40);
        }
    } else if (condition === 'partly cloudy') {
        // Sun behind cloud
        fill(255, 200, 0);
        noStroke();
        ellipse(-15, -10, 35, 35);
        // Cloud
        fill(220);
        ellipse(0, 5, 40, 25);
        ellipse(15, 0, 30, 25);
        ellipse(-15, 5, 25, 20);
    } else if (condition === 'cloudy') {
        // Clouds
        fill(180);
        noStroke();
        ellipse(0, 0, 50, 30);
        ellipse(20, -5, 35, 25);
        ellipse(-20, 0, 30, 25);
    } else if (condition === 'rainy') {
        // Cloud with rain
        fill(150);
        noStroke();
        ellipse(0, -10, 50, 30);
        ellipse(20, -15, 35, 25);
        // Rain drops
        stroke(100, 150, 255);
        strokeWeight(2);
        line(-10, 10, -15, 25);
        line(5, 10, 0, 25);
        line(20, 10, 15, 25);
    } else if (condition === 'stormy') {
        // Dark cloud with lightning
        fill(100);
        noStroke();
        ellipse(0, -10, 50, 30);
        ellipse(20, -15, 35, 25);
        // Lightning
        fill(255, 255, 0);
        beginShape();
        vertex(0, 0);
        vertex(-5, 15);
        vertex(5, 12);
        vertex(0, 30);
        vertex(10, 10);
        vertex(0, 15);
        endShape(CLOSE);
    }

    pop();
}

function drawThermometer(x, y, temp) {
    // Thermometer body
    stroke(150);
    strokeWeight(1);
    fill(255);
    rect(x - 8, y - 40, 16, 80, 8, 8, 0, 0);
    ellipse(x, y + 50, 25, 25);

    // Mercury level
    const mercuryH = map(temp, 0, 120, 5, 75);
    fill(255, 50, 50);
    noStroke();
    rect(x - 5, y + 40 - mercuryH, 10, mercuryH);
    ellipse(x, y + 50, 20, 20);
}

function drawButtons() {
    for (let btn of buttons) {
        // Button background
        if (btn.city === currentCity) {
            fill(70, 130, 180);
        } else {
            fill(200);
        }
        noStroke();
        rect(btn.x, btn.y, btn.w, btn.h, 4);

        // Button text
        fill(btn.city === currentCity ? 255 : 50);
        textSize(10);
        textStyle(NORMAL);
        text(btn.label, btn.x + btn.w/2, btn.y + btn.h/2);
    }
}

function mousePressed() {
    // Check city buttons
    for (let btn of buttons) {
        if (mouseX > btn.x && mouseX < btn.x + btn.w &&
            mouseY > btn.y && mouseY < btn.y + btn.h) {
            currentCity = btn.city;
            generateTodayWeather();
            return;
        }
    }

    // Check Change Day button
    const changeBtnX = canvasWidth - 90;
    const changeBtnY = drawHeight + 12;
    if (mouseX > changeBtnX && mouseX < changeBtnX + 80 &&
        mouseY > changeBtnY && mouseY < changeBtnY + 25) {
        generateTodayWeather();
    }
}
