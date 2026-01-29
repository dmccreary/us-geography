/* Mountain States MicroSim
 * Uses high-quality Natural Earth GeoJSON for state boundaries
 */

// =============================================================================
// MAP VIEW CONFIGURATION
// =============================================================================
// Adjust these values to change the initial map position and zoom level.
// The base center is [40, -110] (latitude, longitude) - roughly central Mountain region.
//
// HORIZONTAL_PAN: Shifts the map east or west
//   - Negative values move the map CENTER west (states appear to shift RIGHT)
//   - Positive values move the map CENTER east (states appear to shift LEFT)
//
// VERTICAL_PAN: Shifts the map north or south
//   - Positive values move the map CENTER north (states appear to shift DOWN)
//   - Negative values move the map CENTER south (states appear to shift UP)
//
// ZOOM: Controls the zoom level
//   - Higher values = more zoomed in (closer view)
//   - Lower values = more zoomed out (wider view)
// =============================================================================
const HORIZONTAL_PAN = 5;   // Shifted west so info box doesn't cover eastern states
const VERTICAL_PAN = 0;
const ZOOM = 4;

// Base center coordinates (before pan adjustments)
const BASE_CENTER_LAT = 40;
const BASE_CENTER_LNG = -110;

// GeoJSON source - Natural Earth 110m US state boundaries
const STATES_GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_1_states_provinces.geojson';

const stateData = [
    {
        name: 'Montana',
        abbr: 'MT',
        capital: 'Helena',
        lat: 47.0,
        lng: -110.0,
        nickname: 'Big Sky Country',
        famousFor: 'Glacier National Park, wide open spaces',
        population: '1.1 million',
        funFact: 'Montana has more cattle than people!'
    },
    {
        name: 'Idaho',
        abbr: 'ID',
        capital: 'Boise',
        lat: 44.0,
        lng: -114.5,
        nickname: 'Gem State',
        famousFor: 'Potatoes, wilderness areas',
        population: '1.9 million',
        funFact: 'Idaho grows about 1/3 of all potatoes in the US!'
    },
    {
        name: 'Wyoming',
        abbr: 'WY',
        capital: 'Cheyenne',
        lat: 43.0,
        lng: -107.5,
        nickname: 'Cowboy State',
        famousFor: 'Yellowstone, Grand Teton, cowboys',
        population: '580,000',
        funFact: 'Wyoming has the smallest population of any state!'
    },
    {
        name: 'Colorado',
        abbr: 'CO',
        capital: 'Denver',
        lat: 39.0,
        lng: -105.5,
        nickname: 'Centennial State',
        famousFor: 'Skiing, Rocky Mountain National Park',
        population: '5.8 million',
        funFact: 'Colorado has over 50 peaks above 14,000 feet!'
    },
    {
        name: 'Nevada',
        abbr: 'NV',
        capital: 'Carson City',
        lat: 39.5,
        lng: -117.0,
        nickname: 'Silver State',
        famousFor: 'Las Vegas, deserts',
        population: '3.1 million',
        funFact: 'Nevada is the driest state in the US!'
    },
    {
        name: 'Utah',
        abbr: 'UT',
        capital: 'Salt Lake City',
        lat: 39.5,
        lng: -111.5,
        nickname: 'Beehive State',
        famousFor: '5 national parks, Great Salt Lake',
        population: '3.3 million',
        funFact: 'Utah has 5 national parks called the "Mighty Five"!'
    },
    {
        name: 'Arizona',
        abbr: 'AZ',
        capital: 'Phoenix',
        lat: 34.0,
        lng: -111.5,
        nickname: 'Grand Canyon State',
        famousFor: 'Grand Canyon, desert landscapes',
        population: '7.3 million',
        funFact: 'The Grand Canyon is over a mile deep!'
    },
    {
        name: 'New Mexico',
        abbr: 'NM',
        capital: 'Santa Fe',
        lat: 34.5,
        lng: -106.0,
        nickname: 'Land of Enchantment',
        famousFor: 'Adobe architecture, Native American culture, chile peppers',
        population: '2.1 million',
        funFact: 'Santa Fe is the oldest capital city in the US!'
    }
];

const nationalParks = [
    { name: 'Yellowstone', lat: 44.4, lng: -110.5, state: 'Wyoming' },
    { name: 'Grand Teton', lat: 43.8, lng: -110.7, state: 'Wyoming' },
    { name: 'Glacier', lat: 48.7, lng: -113.8, state: 'Montana' },
    { name: 'Rocky Mountain', lat: 40.3, lng: -105.7, state: 'Colorado' },
    { name: 'Grand Canyon', lat: 36.1, lng: -112.1, state: 'Arizona' },
    { name: 'Zion', lat: 37.3, lng: -113.0, state: 'Utah' },
    { name: 'Arches', lat: 38.7, lng: -109.6, state: 'Utah' },
    { name: 'Bryce Canyon', lat: 37.6, lng: -112.2, state: 'Utah' }
];

const quizQuestions = [
    { q: 'Which state is home to the Grand Canyon?', a: 'Arizona' },
    { q: 'Which state capital is Denver?', a: 'Colorado' },
    { q: 'Where is Yellowstone National Park?', a: 'Wyoming' },
    { q: 'Which state is famous for potatoes?', a: 'Idaho' },
    { q: 'Which state is called "Big Sky Country"?', a: 'Montana' },
    { q: 'Which state has Las Vegas?', a: 'Nevada' },
    { q: 'Where is the Great Salt Lake?', a: 'Utah' },
    { q: 'Which state has Santa Fe as its capital?', a: 'New Mexico' },
    { q: 'Which state has the smallest population?', a: 'Wyoming' },
    { q: 'Where is Glacier National Park?', a: 'Montana' }
];

// Map state names to their data for quick lookup
const stateNameToData = {};
stateData.forEach(state => {
    stateNameToData[state.name] = state;
});

// List of Mountain state names to filter from GeoJSON
const mountainStateNames = stateData.map(s => s.name);

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
        maxZoom: 7
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

    // Add Rocky Mountains representation
    addRockyMountains();

    // Load state boundaries from Natural Earth GeoJSON
    await loadStateBoundaries();

    // Add national park markers
    addNationalParks();

    // Add state labels
    addStateLabels();

    // Setup controls
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

function addRockyMountains() {
    // Simplified Rocky Mountains line
    const rockyPath = [
        [60, -125], [55, -120], [50, -115], [48, -114],
        [45, -110], [42, -107], [40, -106], [38, -106],
        [35, -106], [32, -108]
    ];

    L.polyline(rockyPath, {
        color: '#8B4513',
        weight: 8,
        opacity: 0.6,
        dashArray: '10, 5'
    }).addTo(map).bindTooltip('Rocky Mountains', { permanent: false });
}

// Load state boundaries from Natural Earth GeoJSON
async function loadStateBoundaries() {
    try {
        const response = await fetch(STATES_GEOJSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        statesGeoData = await response.json();

        // Filter for Mountain states and add to map
        statesGeoData.features.forEach(feature => {
            const stateName = feature.properties.name;

            if (mountainStateNames.includes(stateName)) {
                const state = stateNameToData[stateName];

                const layer = L.geoJSON(feature, {
                    style: {
                        fillColor: '#4CAF50',
                        fillOpacity: 0.3,
                        color: '#2E7D32',
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

function addNationalParks() {
    nationalParks.forEach(park => {
        const icon = L.divIcon({
            className: 'park-marker',
            html: '<span style="font-size: 16px;">🏔️</span>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        L.marker([park.lat, park.lng], { icon })
            .addTo(map)
            .bindTooltip(`${park.name} NP`, { permanent: false, direction: 'top' });
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
                color: #2E7D32;
                border: 1px solid #2E7D32;
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
            polygon.setStyle({ fillOpacity: 0.6, weight: 3 });
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
