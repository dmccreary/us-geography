/* State Capitals Quiz MicroSim
 * Learn all 50 state capitals with Study Mode and Quiz Mode
 * Uses high-quality Natural Earth GeoJSON for state boundaries
 */

// =============================================================================
// MAP VIEW CONFIGURATION
// =============================================================================
const HORIZONTAL_PAN = 0;
const VERTICAL_PAN = 2;
const ZOOM = 3.5;
const BASE_CENTER_LAT = 39;
const BASE_CENTER_LNG = -98;

// GeoJSON source - Natural Earth 110m US state boundaries
const STATES_GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_1_states_provinces.geojson';

// =============================================================================
// GLOBAL STATE
// =============================================================================
let statesData = [];
let stateNameToData = {};
let map;
let statePolygons = [];
let info;

// Mode state
let currentMode = null; // 'study' or 'quiz'
let quizLength = 10;

// Study mode state
let studyIndex = 0;
let studyOrder = [];
let capitalMarker = null;

// Quiz mode state
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answeredCurrentQuestion = false;

// Celebration state
let celebrationParticles = [];
let p5Canvas;
let showingCelebration = false;

// Encouraging messages
const correctMessages = [
    "Great job!", "Excellent!", "You got it!", "Awesome!",
    "Perfect!", "Well done!", "Fantastic!", "Amazing!"
];

const incorrectMessages = [
    "Good try!", "Almost!", "Keep going!", "You'll get it!"
];

const resultMessages = {
    perfect: ["Outstanding! Perfect score!", "Incredible! You know them all!", "Superstar! 100%!"],
    great: ["Great work!", "Excellent job!", "Really impressive!"],
    good: ["Good effort!", "Nice work!", "Keep practicing!"],
    okay: ["Good start!", "You're learning!", "Practice makes perfect!"]
};

// =============================================================================
// INITIALIZATION
// =============================================================================

async function init() {
    // Load state data
    await loadStateData();

    // Setup event listeners
    setupEventListeners();
}

async function loadStateData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        statesData = data.states;

        // Build lookup map
        statesData.forEach(state => {
            stateNameToData[state.name] = state;
        });

        // Initialize study order
        studyOrder = statesData.map((_, i) => i);
    } catch (error) {
        console.error('Error loading state data:', error);
    }
}

function setupEventListeners() {
    // Mode selection
    document.getElementById('studyModeBtn').addEventListener('click', () => selectMode('study'));
    document.getElementById('quizModeBtn').addEventListener('click', () => selectMode('quiz'));

    // Quiz length buttons
    document.querySelectorAll('.length-btn').forEach(btn => {
        btn.addEventListener('click', () => selectQuizLength(parseInt(btn.dataset.length)));
    });

    // Start quiz button
    document.getElementById('startQuizBtn').addEventListener('click', startQuiz);

    // Study mode navigation
    document.getElementById('prevStateBtn').addEventListener('click', prevStudyState);
    document.getElementById('nextStateBtn').addEventListener('click', nextStudyState);
    document.getElementById('shuffleBtn').addEventListener('click', shuffleStudyOrder);
    document.getElementById('backToMenuBtn').addEventListener('click', backToMenu);

    // Results buttons
    document.getElementById('tryAgainBtn').addEventListener('click', tryAgain);
    document.getElementById('newQuizBtn').addEventListener('click', backToMenu);
    document.getElementById('backToMenuBtn2').addEventListener('click', backToMenu);
}

// =============================================================================
// MODE SELECTION
// =============================================================================

function selectMode(mode) {
    // Update button states
    document.getElementById('studyModeBtn').classList.toggle('selected', mode === 'study');
    document.getElementById('quizModeBtn').classList.toggle('selected', mode === 'quiz');

    if (mode === 'study') {
        document.getElementById('quizLengthSection').classList.add('hidden');
        startStudyMode();
    } else {
        document.getElementById('quizLengthSection').classList.remove('hidden');
    }
}

function selectQuizLength(length) {
    quizLength = length;
    document.querySelectorAll('.length-btn').forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.length) === length);
    });
}

// =============================================================================
// MAP INITIALIZATION
// =============================================================================

async function initMap() {
    if (map) return; // Already initialized

    const centerLat = BASE_CENTER_LAT + VERTICAL_PAN;
    const centerLng = BASE_CENTER_LNG + HORIZONTAL_PAN;

    map = L.map('map', {
        center: [centerLat, centerLng],
        zoom: ZOOM,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        minZoom: 2,
        maxZoom: 8
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO | <a href="https://www.naturalearthdata.com/">Natural Earth</a>'
    }).addTo(map);

    // Add info control
    info = L.control({ position: 'topright' });
    info.onAdd = function() {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    info.update = function(state) {
        if (state) {
            this._div.innerHTML = `
                <h4>${state.name}</h4>
                <p class="capital-name">Capital: ${state.capital}</p>
            `;
        } else {
            this._div.innerHTML = '<p style="color: #888; font-style: italic;">Hover over a state</p>';
        }
    };
    info.addTo(map);

    // Load state boundaries
    await loadStateBoundaries();
}

async function loadStateBoundaries() {
    const colors = [
        '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784',
        '#AED581', '#DCE775', '#FFF176', '#FFD54F', '#FFB74D'
    ];

    try {
        const response = await fetch(STATES_GEOJSON_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const geoData = await response.json();

        // Get list of US state names
        const usStateNames = statesData.map(s => s.name);

        geoData.features.forEach(feature => {
            const stateName = feature.properties.name;

            if (usStateNames.includes(stateName)) {
                const state = stateNameToData[stateName];
                const colorIndex = statesData.indexOf(state) % colors.length;
                const color = colors[colorIndex];

                const layer = L.geoJSON(feature, {
                    style: {
                        fillColor: color,
                        fillOpacity: 0.4,
                        color: '#333',
                        weight: 1,
                        opacity: 0.8
                    }
                }).addTo(map);

                // Add event handlers
                layer.on('click', () => handleStateClick(stateName));
                layer.on('mouseover', () => {
                    layer.setStyle({ fillOpacity: 0.6, weight: 2 });
                    info.update(state);
                });
                layer.on('mouseout', () => {
                    layer.setStyle({ fillOpacity: 0.4, weight: 1 });
                    info.update(null);
                });

                statePolygons.push({ polygon: layer, state, color });
            }
        });

    } catch (error) {
        console.error('Error loading state boundaries:', error);
        document.getElementById('map').innerHTML +=
            '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;z-index:1000;">' +
            'Loading map data... Please check your internet connection.</div>';
    }
}

function handleStateClick(stateName) {
    const state = stateNameToData[stateName];
    if (!state) return;

    // Zoom to state
    const bounds = statePolygons.find(sp => sp.state.name === stateName)?.polygon.getBounds();
    if (bounds) {
        map.fitBounds(bounds, { padding: [30, 30], maxZoom: 6 });
    }
}

function highlightState(stateName, highlightColor = null) {
    statePolygons.forEach(({ polygon, state, color }) => {
        if (state.name === stateName) {
            const useColor = highlightColor || color;
            polygon.setStyle({
                fillOpacity: 0.8,
                weight: 3,
                color: highlightColor || '#333',
                fillColor: useColor
            });
        }
    });
}

function resetStateStyles() {
    statePolygons.forEach(({ polygon, color }) => {
        polygon.setStyle({
            fillOpacity: 0.4,
            weight: 1,
            color: '#333',
            fillColor: color
        });
    });
}

function zoomToState(stateName) {
    const statePolygon = statePolygons.find(sp => sp.state.name === stateName);
    if (statePolygon) {
        const bounds = statePolygon.polygon.getBounds();
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
        highlightState(stateName, '#FFD700');
    }
}

function resetMapView() {
    const centerLat = BASE_CENTER_LAT + VERTICAL_PAN;
    const centerLng = BASE_CENTER_LNG + HORIZONTAL_PAN;
    map.setView([centerLat, centerLng], ZOOM);
    resetStateStyles();
    hideCapitalMarker();
}

// =============================================================================
// STUDY MODE
// =============================================================================

async function startStudyMode() {
    currentMode = 'study';
    studyIndex = 0;

    // Hide start screen, show map
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('mapContainer').classList.remove('hidden');

    // Initialize map if needed
    await initMap();

    // Show study panel
    document.getElementById('studyPanel').classList.remove('hidden');
    document.getElementById('quizPanel').classList.add('hidden');
    document.getElementById('resultsPanel').classList.add('hidden');

    updateStudyDisplay();
}

function updateStudyDisplay() {
    const state = statesData[studyOrder[studyIndex]];

    document.getElementById('studyProgress').textContent =
        `State ${studyIndex + 1} of ${statesData.length}`;
    document.getElementById('studyState').textContent = state.name;
    document.getElementById('studyCapital').textContent = state.capital;

    // Highlight and zoom to state
    resetStateStyles();
    zoomToState(state.name);

    // Show capital marker
    showCapitalMarker(state);
}

function showCapitalMarker(state) {
    // Remove existing marker if any
    if (capitalMarker) {
        map.removeLayer(capitalMarker);
        capitalMarker = null;
    }

    // Create marker icon for capital - dynamically sized based on text length
    const capitalIcon = L.divIcon({
        className: 'capital-marker',
        html: `<div style="
            background: #D32F2F;
            color: white;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            border: 2px solid white;
            transform: translateX(-50%);
            display: inline-block;
        ">
            <span style="color: gold;">★</span> ${state.capital}
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 15]
    });

    // Add marker at capital coordinates
    capitalMarker = L.marker([state.lat, state.lng], { icon: capitalIcon })
        .addTo(map);
}

function hideCapitalMarker() {
    if (capitalMarker) {
        map.removeLayer(capitalMarker);
        capitalMarker = null;
    }
}

function prevStudyState() {
    studyIndex = (studyIndex - 1 + statesData.length) % statesData.length;
    updateStudyDisplay();
}

function nextStudyState() {
    studyIndex = (studyIndex + 1) % statesData.length;
    updateStudyDisplay();
}

function shuffleStudyOrder() {
    // Fisher-Yates shuffle
    for (let i = studyOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [studyOrder[i], studyOrder[j]] = [studyOrder[j], studyOrder[i]];
    }
    studyIndex = 0;
    updateStudyDisplay();

    // Small celebration for shuffling
    triggerMiniCelebration();
}

// =============================================================================
// QUIZ MODE
// =============================================================================

async function startQuiz() {
    currentMode = 'quiz';
    currentQuestionIndex = 0;
    score = 0;

    // Generate quiz questions
    generateQuizQuestions();

    // Hide start screen, show map
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('mapContainer').classList.remove('hidden');

    // Initialize map if needed
    await initMap();

    // Show quiz panel
    document.getElementById('studyPanel').classList.add('hidden');
    document.getElementById('quizPanel').classList.remove('hidden');
    document.getElementById('resultsPanel').classList.add('hidden');

    // Clear stars
    document.getElementById('starsDisplay').innerHTML = '';

    // Reset map view
    resetMapView();

    showQuestion();
}

function generateQuizQuestions() {
    // Shuffle states and pick quizLength number
    const shuffled = [...statesData].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, quizLength);

    quizQuestions = selected.map(state => {
        // Generate 3 wrong answers from other state capitals
        const otherCapitals = statesData
            .filter(s => s.name !== state.name)
            .map(s => s.capital)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        // Combine correct answer with wrong ones and shuffle
        const options = [state.capital, ...otherCapitals].sort(() => Math.random() - 0.5);

        return {
            state: state,
            correctAnswer: state.capital,
            options: options
        };
    });
}

function showQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        showResults();
        return;
    }

    answeredCurrentQuestion = false;
    const question = quizQuestions[currentQuestionIndex];

    // Update progress
    document.getElementById('quizProgress').textContent =
        `Question ${currentQuestionIndex + 1} of ${quizLength}`;
    document.getElementById('quizScore').textContent = `Score: ${score}`;

    // Show question
    document.getElementById('quizQuestion').textContent =
        `What is the capital of ${question.state.name}?`;

    // Clear feedback
    document.getElementById('quizFeedback').textContent = '';
    document.getElementById('quizFeedback').className = 'quiz-feedback';

    // Generate option buttons
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => handleAnswer(option));
        optionsContainer.appendChild(btn);
    });

    // Highlight the state being asked about
    resetStateStyles();
    zoomToState(question.state.name);
}

function handleAnswer(selectedAnswer) {
    if (answeredCurrentQuestion) return;
    answeredCurrentQuestion = true;

    const question = quizQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correctAnswer;

    // Disable all buttons
    document.querySelectorAll('.quiz-option').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === question.correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedAnswer && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    // Show feedback
    const feedback = document.getElementById('quizFeedback');
    if (isCorrect) {
        score++;
        document.getElementById('quizScore').textContent = `Score: ${score}`;
        feedback.textContent = correctMessages[Math.floor(Math.random() * correctMessages.length)];
        feedback.className = 'quiz-feedback correct';
        addStar();
        triggerMiniCelebration();
    } else {
        const msg = incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)];
        feedback.textContent = `${msg} The capital is ${question.correctAnswer}.`;
        feedback.className = 'quiz-feedback incorrect';
    }

    // Move to next question after delay
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

function addStar() {
    const display = document.getElementById('starsDisplay');
    const star = document.createElement('span');
    star.className = 'gold-star';
    star.textContent = '⭐';
    display.appendChild(star);
    setTimeout(() => star.classList.add('animated'), 50);
}

// =============================================================================
// RESULTS
// =============================================================================

function showResults() {
    document.getElementById('quizPanel').classList.add('hidden');
    document.getElementById('resultsPanel').classList.remove('hidden');

    const percentage = Math.round((score / quizLength) * 100);
    const isPerfect = score === quizLength;

    // Header
    document.getElementById('resultsHeader').textContent =
        isPerfect ? '🎉 Perfect Score! 🎉' : 'Quiz Complete!';

    // Score
    document.getElementById('resultsScore').textContent =
        `You got ${score} out of ${quizLength} correct! (${percentage}%)`;

    // Message
    let messages;
    if (isPerfect) {
        messages = resultMessages.perfect;
    } else if (percentage >= 80) {
        messages = resultMessages.great;
    } else if (percentage >= 60) {
        messages = resultMessages.good;
    } else {
        messages = resultMessages.okay;
    }
    document.getElementById('resultsMessage').textContent =
        messages[Math.floor(Math.random() * messages.length)];

    // Stars
    document.getElementById('resultsStars').textContent = '⭐'.repeat(score);

    // Reset map view
    resetMapView();

    // Trigger celebration for good scores
    if (percentage >= 60) {
        triggerBigCelebration(isPerfect);
    }
}

function tryAgain() {
    // Restart with same settings
    startQuiz();
}

function backToMenu() {
    currentMode = null;

    // Reset map if exists
    if (map) {
        resetMapView();
    }

    // Hide map container, show start screen
    document.getElementById('mapContainer').classList.add('hidden');
    document.getElementById('startScreen').classList.remove('hidden');
    document.getElementById('quizLengthSection').classList.add('hidden');

    // Reset mode button states
    document.getElementById('studyModeBtn').classList.remove('selected');
    document.getElementById('quizModeBtn').classList.remove('selected');
}

// =============================================================================
// CELEBRATION ANIMATIONS (p5.js)
// =============================================================================

// Initialize p5.js in instance mode for the celebration canvas
function initCelebrationCanvas() {
    const sketch = (p) => {
        p.setup = function() {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('celebrationCanvas');
            canvas.style('pointer-events', 'none');
            p.noLoop();
        };

        p.draw = function() {
            p.clear();

            for (let i = celebrationParticles.length - 1; i >= 0; i--) {
                const particle = celebrationParticles[i];
                particle.update();
                particle.draw(p);

                if (particle.isDead()) {
                    celebrationParticles.splice(i, 1);
                }
            }

            if (celebrationParticles.length === 0) {
                showingCelebration = false;
                p.noLoop();
            }
        };

        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };

        p5Canvas = p;
    };

    new p5(sketch);
}

class ConfettiParticle {
    constructor(x, y, color, speedMultiplier = 1) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8 * speedMultiplier;
        this.vy = (Math.random() * -10 - 5) * speedMultiplier;
        this.gravity = 0.3;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.3;
        this.width = Math.random() * 10 + 5;
        this.height = Math.random() * 15 + 8;
        this.color = color;
        this.alpha = 255;
        this.fadeRate = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.rotation += this.rotationSpeed;
        this.vx *= 0.99;

        if (this.y > window.innerHeight - 100) {
            this.alpha -= this.fadeRate * 3;
        }
    }

    draw(p) {
        p.push();
        p.translate(this.x, this.y);
        p.rotate(this.rotation);
        p.fill(this.color[0], this.color[1], this.color[2], this.alpha);
        p.noStroke();
        p.rect(-this.width / 2, -this.height / 2, this.width, this.height, 2);
        p.pop();
    }

    isDead() {
        return this.alpha <= 0 || this.y > window.innerHeight + 50;
    }
}

class StarParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.size = Math.random() * 20 + 15;
        this.color = color;
        this.alpha = 255;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.97;
        this.vy *= 0.97;
        this.alpha -= 4;
        this.rotation += this.rotationSpeed;
    }

    draw(p) {
        p.push();
        p.translate(this.x, this.y);
        p.rotate(this.rotation);
        p.fill(this.color[0], this.color[1], this.color[2], this.alpha);
        p.noStroke();
        this.drawStar(p, 0, 0, this.size / 2, this.size, 5);
        p.pop();
    }

    drawStar(p, x, y, radius1, radius2, npoints) {
        const angle = p.TWO_PI / npoints;
        const halfAngle = angle / 2.0;
        p.beginShape();
        for (let a = -p.PI / 2; a < p.TWO_PI - p.PI / 2; a += angle) {
            let sx = x + Math.cos(a) * radius2;
            let sy = y + Math.sin(a) * radius2;
            p.vertex(sx, sy);
            sx = x + Math.cos(a + halfAngle) * radius1;
            sy = y + Math.sin(a + halfAngle) * radius1;
            p.vertex(sx, sy);
        }
        p.endShape(p.CLOSE);
    }

    isDead() {
        return this.alpha <= 0;
    }
}

const celebrationColors = [
    [255, 107, 107], // Red
    [255, 142, 83],  // Orange
    [255, 217, 61],  // Yellow
    [107, 203, 119], // Green
    [77, 150, 255],  // Blue
    [155, 89, 182],  // Purple
    [255, 107, 157]  // Pink
];

function triggerMiniCelebration() {
    if (!p5Canvas) {
        initCelebrationCanvas();
        setTimeout(() => triggerMiniCelebration(), 100);
        return;
    }

    // Burst of stars from center
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 15; i++) {
        const color = celebrationColors[Math.floor(Math.random() * celebrationColors.length)];
        celebrationParticles.push(new StarParticle(centerX, centerY, color));
    }

    showingCelebration = true;
    p5Canvas.loop();
}

function triggerBigCelebration(isPerfect) {
    if (!p5Canvas) {
        initCelebrationCanvas();
        setTimeout(() => triggerBigCelebration(isPerfect), 100);
        return;
    }

    const width = window.innerWidth;
    const particleCount = isPerfect ? 150 : 80;

    // Confetti rain from top
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const x = Math.random() * width;
            const y = Math.random() * -200;
            const color = celebrationColors[Math.floor(Math.random() * celebrationColors.length)];
            celebrationParticles.push(new ConfettiParticle(x, y, color));
        }, Math.random() * 1000);
    }

    // Stars bursting from multiple points
    const burstPoints = isPerfect ? 5 : 3;
    for (let b = 0; b < burstPoints; b++) {
        setTimeout(() => {
            const x = (width / (burstPoints + 1)) * (b + 1);
            const y = window.innerHeight * 0.4;
            for (let i = 0; i < 20; i++) {
                const color = celebrationColors[Math.floor(Math.random() * celebrationColors.length)];
                celebrationParticles.push(new StarParticle(x, y, color));
            }
        }, b * 200);
    }

    showingCelebration = true;
    p5Canvas.loop();
}

// =============================================================================
// START
// =============================================================================

document.addEventListener('DOMContentLoaded', init);
