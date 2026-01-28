/* Midwest States MicroSim */

const stateData = [
    {
        name: 'Illinois',
        abbr: 'IL',
        capital: 'Springfield',
        capitalCoords: [39.78, -89.65],
        lat: 40.0,
        lng: -89.0,
        nickname: 'Prairie State',
        famousFor: 'Chicago, Abraham Lincoln, deep-dish pizza',
        population: '12.7 million',
        funFact: 'Chicago has more movable bridges than any other city in the world!'
    },
    {
        name: 'Indiana',
        abbr: 'IN',
        capital: 'Indianapolis',
        capitalCoords: [39.77, -86.16],
        lat: 40.0,
        lng: -86.2,
        nickname: 'Hoosier State',
        famousFor: 'Indianapolis 500 race, basketball, corn',
        population: '6.8 million',
        funFact: 'The Indianapolis 500 is one of the oldest auto races in the world!'
    },
    {
        name: 'Michigan',
        abbr: 'MI',
        capital: 'Lansing',
        capitalCoords: [42.73, -84.55],
        lat: 44.0,
        lng: -85.5,
        nickname: 'Great Lakes State',
        famousFor: 'Cars (Detroit), Great Lakes, cherries',
        population: '10 million',
        funFact: 'Michigan touches 4 of the 5 Great Lakes!'
    },
    {
        name: 'Ohio',
        abbr: 'OH',
        capital: 'Columbus',
        capitalCoords: [39.96, -82.99],
        lat: 40.3,
        lng: -82.7,
        nickname: 'Buckeye State',
        famousFor: 'Rock and Roll Hall of Fame, astronauts, Ohio State football',
        population: '11.8 million',
        funFact: 'Ohio has produced more presidents (8) than any other state!'
    },
    {
        name: 'Wisconsin',
        abbr: 'WI',
        capital: 'Madison',
        capitalCoords: [43.07, -89.40],
        lat: 44.5,
        lng: -90.0,
        nickname: 'Badger State',
        famousFor: 'Cheese, dairy farms, Green Bay Packers',
        population: '5.9 million',
        funFact: 'Wisconsin produces more cheese than any other state!'
    },
    {
        name: 'Minnesota',
        abbr: 'MN',
        capital: 'St. Paul',
        capitalCoords: [44.94, -93.09],
        lat: 46.0,
        lng: -94.5,
        nickname: 'Land of 10,000 Lakes',
        famousFor: 'Lakes (actually over 11,000!), Mall of America, cold winters',
        population: '5.7 million',
        funFact: 'Minnesota actually has over 11,000 lakes, not just 10,000!'
    },
    {
        name: 'Iowa',
        abbr: 'IA',
        capital: 'Des Moines',
        capitalCoords: [41.59, -93.60],
        lat: 42.0,
        lng: -93.5,
        nickname: 'Hawkeye State',
        famousFor: 'Corn, hogs, first presidential caucus',
        population: '3.2 million',
        funFact: 'Iowa produces more corn than any other state!'
    },
    {
        name: 'Kansas',
        abbr: 'KS',
        capital: 'Topeka',
        capitalCoords: [39.05, -95.67],
        lat: 38.5,
        lng: -98.5,
        nickname: 'Sunflower State',
        famousFor: 'Wheat, Wizard of Oz, flat prairies, Tornado Alley',
        population: '2.9 million',
        funFact: 'Kansas is in Tornado Alley and sees about 100 tornadoes per year!'
    }
];

// Simplified state boundaries
const stateBounds = {
    'Minnesota': [[49, -97.2], [49, -89.5], [46, -89.5], [43.5, -91.2], [43.5, -96.5], [46, -97.2]],
    'Wisconsin': [[47, -92.5], [47, -86.8], [42.5, -87], [42.5, -91], [44, -92.5]],
    'Michigan': [[46.5, -90.5], [46.5, -82], [41.7, -82], [41.7, -87], [44, -87.5], [45.5, -90.5]],
    'Iowa': [[43.5, -96.6], [43.5, -90.1], [40.4, -90.1], [40.4, -96.6]],
    'Illinois': [[42.5, -91], [42.5, -87], [37, -87.5], [37, -91.5]],
    'Indiana': [[41.8, -88], [41.8, -84.8], [38, -84.8], [37.8, -88]],
    'Ohio': [[42, -84.8], [42, -80.5], [38.4, -80.5], [38.4, -84.8]],
    'Kansas': [[40, -102], [40, -94.6], [37, -94.6], [37, -102]]
};

const quizQuestions = [
    { q: 'Which state is known for deep-dish pizza and Chicago?', a: 'Illinois' },
    { q: 'Which state hosts the Indianapolis 500?', a: 'Indiana' },
    { q: 'Which state touches 4 of the 5 Great Lakes?', a: 'Michigan' },
    { q: 'Which state has produced the most US presidents?', a: 'Ohio' },
    { q: 'Which state produces the most cheese?', a: 'Wisconsin' },
    { q: 'Which state is the Land of 10,000 Lakes?', a: 'Minnesota' },
    { q: 'Which state produces the most corn?', a: 'Iowa' },
    { q: 'Which state is famous for the Wizard of Oz?', a: 'Kansas' },
    { q: 'Where is Detroit, the car capital?', a: 'Michigan' },
    { q: 'Which state has Topeka as its capital?', a: 'Kansas' }
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
        center: [42, -90],
        zoom: 5,
        minZoom: 4,
        maxZoom: 8
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

    // Add Great Lakes labels
    addGreatLakesLabels();

    // Setup controls
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

function addStatePolygons() {
    const colors = ['#FF9800', '#FFA726', '#FFB74D', '#FFCC80', '#FFE0B2', '#FB8C00', '#F57C00', '#EF6C00'];

    stateData.forEach((state, i) => {
        const bounds = stateBounds[state.name];
        if (bounds) {
            const polygon = L.polygon(bounds, {
                color: colors[i % colors.length],
                weight: 2,
                opacity: 0.8,
                fillColor: colors[i % colors.length],
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
            .bindTooltip(`${state.capital}`, { permanent: false, direction: 'top' });
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
                color: #E65100;
                border: 1px solid #E65100;
                white-space: nowrap;
            ">${state.abbr}</div>`,
            iconSize: [30, 20],
            iconAnchor: [15, 10]
        });

        L.marker([state.lat, state.lng], { icon, interactive: false }).addTo(map);
    });
}

function addGreatLakesLabels() {
    const lakes = [
        { name: 'Lake Superior', lat: 47.5, lng: -88 },
        { name: 'Lake Michigan', lat: 44, lng: -87 },
        { name: 'Lake Huron', lat: 44.5, lng: -82.5 },
        { name: 'Lake Erie', lat: 42, lng: -81 }
    ];

    lakes.forEach(lake => {
        const icon = L.divIcon({
            className: 'lake-label',
            html: `<div style="
                color: #1565C0;
                font-size: 10px;
                font-style: italic;
                white-space: nowrap;
            ">${lake.name}</div>`,
            iconSize: [80, 15],
            iconAnchor: [40, 7]
        });

        L.marker([lake.lat, lake.lng], { icon, interactive: false }).addTo(map);
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
    map.setView([42, -90], 5);
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
