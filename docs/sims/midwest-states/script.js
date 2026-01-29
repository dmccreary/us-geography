/* Midwest States MicroSim
 * Uses high-quality Natural Earth GeoJSON for state boundaries
 */

// =============================================================================
// MAP VIEW CONFIGURATION
// =============================================================================
// Adjust these values to change the initial map position and zoom level.
// The base center is [42, -90] (latitude, longitude) - roughly central Midwest.
//
// HORIZONTAL_PAN: Shifts the map east or west
//   - Negative values move the map CENTER west (states appear to shift RIGHT)
//   - Positive values move the map CENTER east (states appear to shift LEFT)
//   - Each unit is approximately 1 degree of longitude (~50 miles at this latitude)
//
// VERTICAL_PAN: Shifts the map north or south
//   - Positive values move the map CENTER north (states appear to shift DOWN)
//   - Negative values move the map CENTER south (states appear to shift UP)
//   - Each unit is approximately 1 degree of latitude (~69 miles)
//
// ZOOM: Controls the zoom level
//   - Higher values = more zoomed in (closer view)
//   - Lower values = more zoomed out (wider view)
//   - Typical range: 3 (very wide) to 6 (close up)
// =============================================================================
const HORIZONTAL_PAN = 8;  // Shifted west so info box doesn't cover eastern states
const VERTICAL_PAN = 0;     // No vertical adjustment
const ZOOM = 4;             // Zoomed out to show all states with room for info box

// Base center coordinates (before pan adjustments)
const BASE_CENTER_LAT = 42;
const BASE_CENTER_LNG = -90;

// GeoJSON source - Natural Earth 110m US state boundaries
const STATES_GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_1_states_provinces.geojson';

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

// Map state names to their data for quick lookup
const stateNameToData = {};
stateData.forEach(state => {
    stateNameToData[state.name] = state;
});

// List of Midwest state names to filter from GeoJSON
const midwestStateNames = stateData.map(s => s.name);

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
let statesGeoData = null;
const TOTAL_QUESTIONS = 6;

async function init() {
    // Apply pan offsets to base center
    const centerLat = BASE_CENTER_LAT + VERTICAL_PAN;
    const centerLng = BASE_CENTER_LNG + HORIZONTAL_PAN;

    map = L.map('map', {
        center: [centerLat, centerLng],
        zoom: ZOOM,
        minZoom: 3,
        maxZoom: 8
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO | <a href="https://www.naturalearthdata.com/">Natural Earth</a>'
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

    // Load state boundaries from Natural Earth GeoJSON
    await loadStateBoundaries();

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

// Load state boundaries from Natural Earth GeoJSON
async function loadStateBoundaries() {
    const colors = ['#FF9800', '#FFA726', '#FFB74D', '#FFCC80', '#FFE0B2', '#FB8C00', '#F57C00', '#EF6C00'];

    try {
        const response = await fetch(STATES_GEOJSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        statesGeoData = await response.json();

        // Filter for Midwest states and add to map
        statesGeoData.features.forEach(feature => {
            const stateName = feature.properties.name;

            if (midwestStateNames.includes(stateName)) {
                const state = stateNameToData[stateName];
                const colorIndex = stateData.indexOf(state);
                const color = colors[colorIndex % colors.length];

                const layer = L.geoJSON(feature, {
                    style: {
                        fillColor: color,
                        fillOpacity: 0.3,
                        color: color,
                        weight: 2,
                        opacity: 0.8
                    }
                }).addTo(map);

                // Add event handlers
                layer.on('click', () => {
                    if (!quizMode) {
                        info.update(state);
                        highlightState(state.name);
                    } else {
                        handleQuizClick(state.name);
                    }
                });

                layer.on('mouseover', () => {
                    if (!quizMode) layer.setStyle({ fillOpacity: 0.5 });
                });

                layer.on('mouseout', () => {
                    layer.setStyle({ fillOpacity: 0.3 });
                });

                statePolygons.push({ polygon: layer, state });
            }
        });

    } catch (error) {
        console.error('Error loading state boundaries:', error);
        document.getElementById('map').innerHTML +=
            '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;z-index:1000;">' +
            'Loading map data... If this persists, check your internet connection.</div>';
    }
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
    // Reset to initial map view using configured pan and zoom
    const centerLat = BASE_CENTER_LAT + VERTICAL_PAN;
    const centerLng = BASE_CENTER_LNG + HORIZONTAL_PAN;
    map.setView([centerLat, centerLng], ZOOM);
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
