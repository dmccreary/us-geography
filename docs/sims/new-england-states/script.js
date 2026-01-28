/* New England States MicroSim */

const stateData = [
    {
        name: 'Maine',
        abbr: 'ME',
        capital: 'Augusta',
        capitalCoords: [44.31, -69.78],
        lat: 45.3,
        lng: -69.0,
        nickname: 'Pine Tree State',
        famousFor: 'Lobster, Acadia National Park, lighthouses',
        population: '1.4 million',
        funFact: 'Maine is the only state that borders just one other state!',
        color: '#1565C0'
    },
    {
        name: 'New Hampshire',
        abbr: 'NH',
        capital: 'Concord',
        capitalCoords: [43.21, -71.54],
        lat: 43.8,
        lng: -71.5,
        nickname: 'Granite State',
        famousFor: 'White Mountains, no sales tax, first presidential primary',
        population: '1.4 million',
        funFact: 'The state motto is "Live Free or Die"!',
        color: '#1976D2'
    },
    {
        name: 'Vermont',
        abbr: 'VT',
        capital: 'Montpelier',
        capitalCoords: [44.26, -72.58],
        lat: 44.0,
        lng: -72.7,
        nickname: 'Green Mountain State',
        famousFor: 'Maple syrup, fall foliage, Ben & Jerry\'s ice cream',
        population: '645,000',
        funFact: 'Vermont produces more maple syrup than any other state!',
        color: '#1E88E5'
    },
    {
        name: 'Massachusetts',
        abbr: 'MA',
        capital: 'Boston',
        capitalCoords: [42.36, -71.06],
        lat: 42.2,
        lng: -71.8,
        nickname: 'Bay State',
        famousFor: 'Plymouth Rock, Harvard, Boston Tea Party',
        population: '7 million',
        funFact: 'The Pilgrims landed here in 1620!',
        color: '#2196F3'
    },
    {
        name: 'Rhode Island',
        abbr: 'RI',
        capital: 'Providence',
        capitalCoords: [41.82, -71.41],
        lat: 41.6,
        lng: -71.5,
        nickname: 'Ocean State',
        famousFor: 'Beaches, colonial history, smallest state',
        population: '1.1 million',
        funFact: 'Rhode Island is the smallest state but has a very long name!',
        color: '#42A5F5'
    },
    {
        name: 'Connecticut',
        abbr: 'CT',
        capital: 'Hartford',
        capitalCoords: [41.76, -72.68],
        lat: 41.5,
        lng: -72.8,
        nickname: 'Constitution State',
        famousFor: 'Insurance companies, Yale University, submarines',
        population: '3.6 million',
        funFact: 'The first hamburger was served in Connecticut in 1900!',
        color: '#64B5F6'
    }
];

// Simplified state boundaries
const stateBounds = {
    'Maine': [[47.5, -71.1], [47.5, -66.9], [43.0, -66.9], [43.0, -70.7], [45.3, -71.1]],
    'New Hampshire': [[45.3, -72.5], [45.3, -71.0], [42.7, -71.0], [42.7, -72.5]],
    'Vermont': [[45.0, -73.4], [45.0, -72.5], [42.7, -72.5], [42.7, -73.4]],
    'Massachusetts': [[42.9, -73.5], [42.9, -70.0], [41.2, -70.0], [41.2, -73.5]],
    'Rhode Island': [[42.0, -71.8], [42.0, -71.1], [41.1, -71.1], [41.1, -71.8]],
    'Connecticut': [[42.05, -73.7], [42.05, -71.8], [41.0, -71.8], [41.0, -73.7]]
};

const quizQuestions = [
    { q: 'Which state produces the most maple syrup?', a: 'Vermont' },
    { q: 'Which state is the smallest in the US?', a: 'Rhode Island' },
    { q: 'Where did the Pilgrims land in 1620?', a: 'Massachusetts' },
    { q: 'Which state has the motto "Live Free or Die"?', a: 'New Hampshire' },
    { q: 'Which state is famous for lobster?', a: 'Maine' },
    { q: 'Where is Hartford, a center for insurance companies?', a: 'Connecticut' },
    { q: 'Which state borders only one other state?', a: 'Maine' },
    { q: 'Where is Harvard University located?', a: 'Massachusetts' },
    { q: 'Which state is called the "Green Mountain State"?', a: 'Vermont' },
    { q: 'Which state capital is Boston?', a: 'Massachusetts' }
];

let map;
let statePolygons = [];
let info;
let quizMode = false;
let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 6;

function init() {
    map = L.map('map', {
        center: [43.5, -71],
        zoom: 6,
        minZoom: 5,
        maxZoom: 9
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
                <p><span class="stat">Capital:</span> ${state.capital}</p>
                <p><span class="stat">Nickname:</span> ${state.nickname}</p>
                <p><span class="stat">Famous for:</span> ${state.famousFor}</p>
                <p><span class="stat">Population:</span> ${state.population}</p>
                <p><span class="stat">Fun Fact:</span> ${state.funFact}</p>
            `;
        } else {
            this._div.innerHTML = '<p style="color: #888; font-style: italic;">Click a state to see details</p>';
        }
    };
    info.addTo(map);

    // Add state polygons
    addStatePolygons();

    // Add capital markers
    addCapitalMarkers();

    // Add state labels
    addStateLabels();

    // Setup controls
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

function addStatePolygons() {
    stateData.forEach(state => {
        const bounds = stateBounds[state.name];
        if (bounds) {
            const polygon = L.polygon(bounds, {
                color: state.color,
                weight: 2,
                opacity: 0.8,
                fillColor: state.color,
                fillOpacity: 0.3
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
                if (!quizMode) polygon.setStyle({ fillOpacity: 0.5 });
            });

            polygon.on('mouseout', () => {
                polygon.setStyle({ fillOpacity: 0.3 });
            });

            statePolygons.push({ polygon, state });
        }
    });
}

function addCapitalMarkers() {
    stateData.forEach(state => {
        const icon = L.divIcon({
            className: 'capital-marker',
            html: '<span style="font-size: 14px; color: gold; text-shadow: 1px 1px 2px black;">★</span>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        L.marker(state.capitalCoords, { icon })
            .addTo(map)
            .bindTooltip(`${state.capital} (Capital of ${state.name})`, { permanent: false, direction: 'top' });
    });
}

function addStateLabels() {
    stateData.forEach(state => {
        const icon = L.divIcon({
            className: 'state-label',
            html: `<div style="
                background: rgba(255,255,255,0.9);
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 11px;
                font-weight: bold;
                color: ${state.color};
                border: 1px solid ${state.color};
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
            polygon.setStyle({ fillOpacity: 0.6, weight: 4 });
            setTimeout(() => polygon.setStyle({ fillOpacity: 0.3, weight: 2 }), 800);
        }
    });
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

    document.getElementById('quizOptions').innerHTML = '<p style="font-size: 11px; color: #666;">Click on the correct state on the map!</p>';
}

function handleQuizClick(stateName) {
    if (!quizMode || currentQuestion >= TOTAL_QUESTIONS) return;

    const q = shuffledQuestions[currentQuestion];
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
    document.getElementById('quizBtn').classList.remove('active');
    document.getElementById('quizPanel').classList.add('hidden');
    map.setView([43.5, -71], 6);
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
