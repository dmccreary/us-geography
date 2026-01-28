/* Tornado Alley MicroSim */

const tornadoStates = [
    {
        name: 'Texas',
        abbr: 'TX',
        lat: 31.5,
        lng: -99.5,
        avgTornadoes: 155,
        peakSeason: 'April-June',
        description: 'Most tornadoes of any state due to large size and position',
        funFact: 'Texas averages about 155 tornadoes per year!'
    },
    {
        name: 'Oklahoma',
        abbr: 'OK',
        lat: 35.5,
        lng: -97.5,
        avgTornadoes: 62,
        peakSeason: 'April-May',
        description: 'Heart of Tornado Alley, severe tornado activity',
        funFact: 'Oklahoma City has been hit by more tornadoes than any other US city!'
    },
    {
        name: 'Kansas',
        abbr: 'KS',
        lat: 38.5,
        lng: -98.5,
        avgTornadoes: 96,
        peakSeason: 'May-June',
        description: 'Famous from The Wizard of Oz, high tornado frequency',
        funFact: 'Kansas is where Dorothy and Toto were swept away in the tornado!'
    },
    {
        name: 'Nebraska',
        abbr: 'NE',
        lat: 41.5,
        lng: -99.5,
        avgTornadoes: 57,
        peakSeason: 'May-June',
        description: 'Northern edge of Tornado Alley',
        funFact: 'Nebraska sees about 57 tornadoes on average each year!'
    },
    {
        name: 'South Dakota',
        abbr: 'SD',
        lat: 44.5,
        lng: -100.5,
        avgTornadoes: 36,
        peakSeason: 'June-July',
        description: 'Northern Tornado Alley, later season tornadoes',
        funFact: 'Tornadoes happen later in the year as you go north!'
    }
];

// State boundaries (simplified)
const stateBounds = {
    'Texas': [[36.5, -106.6], [36.5, -100], [34, -100], [32, -103], [31.8, -106.5], [29.5, -103], [26, -97], [26, -93.5], [30, -93.5], [34, -94]],
    'Oklahoma': [[37, -103], [37, -94.5], [33.5, -94.5], [34, -100], [36.5, -100], [36.5, -103]],
    'Kansas': [[40, -102], [40, -94.6], [37, -94.6], [37, -102]],
    'Nebraska': [[43, -104], [43, -96], [40, -96], [40, -102], [41, -104]],
    'South Dakota': [[46, -104], [46, -96.5], [43, -96.5], [43, -104]]
};

const quizQuestions = [
    { q: 'Which state has the most tornadoes per year?', a: 'Texas' },
    { q: 'Where is the "heart" of Tornado Alley?', a: 'Oklahoma' },
    { q: 'Which state is Dorothy and Toto from?', a: 'Kansas' },
    { q: 'What creates tornadoes in this region?', a: 'Warm and cold air meeting', opts: ['Warm and cold air meeting', 'Ocean currents', 'Mountain winds', 'Earthquakes'] },
    { q: 'When do most tornadoes occur?', a: 'Spring and early summer', opts: ['Spring and early summer', 'Winter', 'Fall', 'Late summer'] },
    { q: 'Where does the warm air come from?', a: 'Gulf of Mexico', opts: ['Gulf of Mexico', 'Pacific Ocean', 'Atlantic Ocean', 'Great Lakes'] },
    { q: 'Where does the cold air come from?', a: 'Canada', opts: ['Canada', 'Mexico', 'Pacific Ocean', 'Gulf of Mexico'] }
];

let map;
let statePolygons = [];
let airMassLayers = [];
let info;
let quizMode = false;
let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
let animating = false;
const TOTAL_QUESTIONS = 5;

function init() {
    map = L.map('map', {
        center: [38, -98],
        zoom: 4,
        minZoom: 3,
        maxZoom: 7
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO'
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
                <p><span class="stat">Avg Tornadoes/Year:</span> ${state.avgTornadoes}</p>
                <p><span class="stat">Peak Season:</span> ${state.peakSeason}</p>
                <p>${state.description}</p>
                <p><span class="stat">Fun Fact:</span> ${state.funFact}</p>
            `;
        } else {
            this._div.innerHTML = '<p style="color: #888; font-style: italic;">Click a state to see tornado info</p>';
        }
    };
    info.addTo(map);

    // Add Tornado Alley region
    addTornadoAlleyRegion();

    // Add state polygons
    addStatePolygons();

    // Add air mass indicators
    addAirMassIndicators();

    // Add state labels
    addStateLabels();

    // Setup controls
    document.getElementById('animateBtn').addEventListener('click', toggleAnimation);
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

function addTornadoAlleyRegion() {
    // Tornado Alley outline (approximate)
    const tornadoAlleyBounds = [
        [46, -104], [46, -94], [40, -91], [32, -94], [28, -97],
        [28, -102], [32, -106], [40, -104]
    ];

    L.polygon(tornadoAlleyBounds, {
        color: '#EF5350',
        weight: 3,
        opacity: 0.8,
        fillColor: '#EF5350',
        fillOpacity: 0.15,
        dashArray: '10, 5'
    }).addTo(map).bindTooltip('Tornado Alley', { permanent: false });
}

function addStatePolygons() {
    tornadoStates.forEach(state => {
        const bounds = stateBounds[state.name];
        if (bounds) {
            const polygon = L.polygon(bounds, {
                color: '#C62828',
                weight: 2,
                opacity: 0.8,
                fillColor: '#EF5350',
                fillOpacity: 0.4
            }).addTo(map);

            polygon.on('click', () => {
                if (!quizMode) {
                    info.update(state);
                    highlightState(state.name);
                } else {
                    handleQuizClick(state.name);
                }
            });

            polygon.on('mouseover', () => {
                if (!quizMode) polygon.setStyle({ fillOpacity: 0.6 });
            });

            polygon.on('mouseout', () => {
                polygon.setStyle({ fillOpacity: 0.4 });
            });

            statePolygons.push({ polygon, state });
        }
    });
}

function addAirMassIndicators() {
    // Warm air from Gulf of Mexico
    const warmAirPath = [
        [22, -90], [26, -94], [30, -96], [34, -98], [38, -98]
    ];

    const warmAirLine = L.polyline(warmAirPath, {
        color: '#FF7043',
        weight: 6,
        opacity: 0.7,
        className: 'air-mass-arrow'
    }).addTo(map);
    warmAirLine.bindTooltip('Warm, moist air from Gulf of Mexico', { permanent: false });

    // Add arrow decoration for warm air
    const warmArrow = L.marker([34, -98], {
        icon: L.divIcon({
            className: 'arrow-icon',
            html: '<span style="font-size: 24px; color: #FF7043;">▲</span>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        })
    }).addTo(map);

    // Cold air from Canada
    const coldAirPath = [
        [55, -100], [50, -99], [46, -98], [42, -98], [38, -98]
    ];

    const coldAirLine = L.polyline(coldAirPath, {
        color: '#42A5F5',
        weight: 6,
        opacity: 0.7,
        className: 'air-mass-arrow'
    }).addTo(map);
    coldAirLine.bindTooltip('Cold, dry air from Canada', { permanent: false });

    // Add arrow decoration for cold air
    const coldArrow = L.marker([42, -98], {
        icon: L.divIcon({
            className: 'arrow-icon',
            html: '<span style="font-size: 24px; color: #42A5F5;">▼</span>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        })
    }).addTo(map);

    // Collision zone marker
    const collisionMarker = L.marker([38, -98], {
        icon: L.divIcon({
            className: 'collision-marker',
            html: '<span style="font-size: 28px;">🌪️</span>',
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        })
    }).addTo(map);
    collisionMarker.bindTooltip('Air masses collide here creating tornadoes!', { permanent: false });

    airMassLayers = [warmAirLine, coldAirLine, warmArrow, coldArrow, collisionMarker];
}

function addStateLabels() {
    tornadoStates.forEach(state => {
        const icon = L.divIcon({
            className: 'state-label',
            html: `<div style="
                background: rgba(255,255,255,0.9);
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 11px;
                font-weight: bold;
                color: #C62828;
                border: 1px solid #C62828;
                white-space: nowrap;
            ">${state.abbr}</div>`,
            iconSize: [30, 20],
            iconAnchor: [15, 10]
        });

        L.marker([state.lat, state.lng], { icon, interactive: false }).addTo(map);
    });
}

function highlightState(name) {
    statePolygons.forEach(({ polygon, state }) => {
        if (state.name === name) {
            polygon.setStyle({ fillOpacity: 0.7, weight: 4 });
            setTimeout(() => polygon.setStyle({ fillOpacity: 0.4, weight: 2 }), 800);
        }
    });
}

function toggleAnimation() {
    animating = !animating;
    const btn = document.getElementById('animateBtn');
    btn.textContent = animating ? 'Stop Animation' : 'Animate Air Masses';
    btn.classList.toggle('active', animating);

    if (animating) {
        // Add pulsing animation class to air mass layers
        airMassLayers.forEach(layer => {
            if (layer._path) {
                layer._path.classList.add('air-mass-arrow');
            }
        });
    }
}

function startQuiz() {
    quizMode = true;
    currentQuestion = 0;
    score = 0;
    shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);

    document.getElementById('quizBtn').classList.add('active');
    document.getElementById('quizPanel').classList.remove('hidden');
    document.getElementById('starsDisplay').innerHTML = '';
    info.update(null);

    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= TOTAL_QUESTIONS) {
        showResults();
        return;
    }

    const q = shuffledQuestions[currentQuestion];
    document.getElementById('quizProgress').textContent = `Question ${currentQuestion + 1} of ${TOTAL_QUESTIONS}`;
    document.getElementById('quizQuestion').textContent = q.q;
    document.getElementById('quizFeedback').textContent = '';
    document.getElementById('quizFeedback').className = 'quiz-feedback';

    // Check if it's a multiple choice question or map click
    if (q.opts) {
        // Multiple choice
        const optionsDiv = document.getElementById('quizOptions');
        optionsDiv.innerHTML = q.opts.map(opt =>
            `<button class="quiz-option" data-answer="${opt}">${opt}</button>`
        ).join('');

        optionsDiv.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => checkMCAnswer(btn, q.a));
        });
    } else {
        // Map click
        document.getElementById('quizOptions').innerHTML = '<p style="font-size: 11px; color: #666;">Click on the correct state on the map!</p>';
    }
}

function handleQuizClick(stateName) {
    if (!quizMode || currentQuestion >= TOTAL_QUESTIONS) return;

    const q = shuffledQuestions[currentQuestion];
    if (q.opts) return; // This is a multiple choice question

    const isCorrect = stateName === q.a;

    highlightState(stateName);
    if (!isCorrect) highlightState(q.a);

    if (isCorrect) {
        score++;
        document.getElementById('quizFeedback').textContent = 'Correct!';
        document.getElementById('quizFeedback').classList.add('correct');
        addStar();
    } else {
        document.getElementById('quizFeedback').textContent = `The answer is: ${q.a}`;
        document.getElementById('quizFeedback').classList.add('incorrect');
    }

    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1500);
}

function checkMCAnswer(btn, correct) {
    const selected = btn.dataset.answer;
    const isCorrect = selected === correct;

    document.querySelectorAll('.quiz-option').forEach(b => {
        b.disabled = true;
        if (b.dataset.answer === correct) {
            b.classList.add('correct');
        } else if (b === btn && !isCorrect) {
            b.classList.add('incorrect');
        }
    });

    if (isCorrect) {
        score++;
        document.getElementById('quizFeedback').textContent = 'Correct!';
        document.getElementById('quizFeedback').classList.add('correct');
        addStar();
    } else {
        document.getElementById('quizFeedback').textContent = `The answer is: ${correct}`;
        document.getElementById('quizFeedback').classList.add('incorrect');
    }

    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1500);
}

function addStar() {
    const display = document.getElementById('starsDisplay');
    const star = document.createElement('span');
    star.className = 'gold-star';
    star.textContent = '⭐';
    display.appendChild(star);
    setTimeout(() => star.classList.add('animated'), 50);
}

function showResults() {
    document.getElementById('quizQuestion').textContent =
        score === TOTAL_QUESTIONS ? 'Perfect Score!' : 'Quiz Complete!';
    document.getElementById('quizOptions').innerHTML =
        `<p>You got ${score} of ${TOTAL_QUESTIONS} correct!</p>
         <button class="quiz-option" onclick="startQuiz()">Try Again</button>`;
    document.getElementById('quizFeedback').textContent = '';

    if (score === TOTAL_QUESTIONS) celebrate();
}

function resetView() {
    quizMode = false;
    animating = false;
    document.getElementById('quizBtn').classList.remove('active');
    document.getElementById('animateBtn').classList.remove('active');
    document.getElementById('animateBtn').textContent = 'Animate Air Masses';
    document.getElementById('quizPanel').classList.add('hidden');
    map.setView([38, -98], 4);
    info.update(null);
}

function celebrate() {
    const container = document.createElement('div');
    container.className = 'celebration-container';
    document.body.appendChild(container);

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'exploding-star';
            star.textContent = '⭐';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.fontSize = (Math.random() * 20 + 15) + 'px';
            container.appendChild(star);
        }, i * 100);
    }

    setTimeout(() => container.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', init);
