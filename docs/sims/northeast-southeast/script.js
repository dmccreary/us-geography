/* Northeast and Southeast Regions MicroSim
 * Uses high-quality Natural Earth GeoJSON for state boundaries
 */

// =============================================================================
// MAP VIEW CONFIGURATION
// =============================================================================
// Adjust these values to change the initial map position and zoom level.
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
// View configurations for each region
const VIEWS = {
    northeast: { lat: 42, lng: -73, horizontalPan: 5, verticalPan: 0, zoom: 5 },
    southeast: { lat: 33, lng: -83, horizontalPan: 5, verticalPan: 0, zoom: 5 },
    both:      { lat: 36, lng: -80, horizontalPan: 5, verticalPan: 0, zoom: 4 }  // Wider view to show both regions
};

// GeoJSON source - Natural Earth 110m US state boundaries
const STATES_GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_1_states_provinces.geojson';

const northeastStates = [
    { name: 'Maine', abbr: 'ME', lat: 45.3, lng: -69.0, capital: 'Augusta', pop: '1.4M', fact: 'Easternmost state' },
    { name: 'New Hampshire', abbr: 'NH', lat: 43.8, lng: -71.5, capital: 'Concord', pop: '1.4M', fact: 'Live Free or Die' },
    { name: 'Vermont', abbr: 'VT', lat: 44.0, lng: -72.7, capital: 'Montpelier', pop: '645K', fact: 'Maple syrup capital' },
    { name: 'Massachusetts', abbr: 'MA', lat: 42.3, lng: -71.8, capital: 'Boston', pop: '7M', fact: 'Birthplace of Revolution' },
    { name: 'Rhode Island', abbr: 'RI', lat: 41.7, lng: -71.5, capital: 'Providence', pop: '1.1M', fact: 'Smallest state' },
    { name: 'Connecticut', abbr: 'CT', lat: 41.5, lng: -72.7, capital: 'Hartford', pop: '3.6M', fact: 'Constitution State' },
    { name: 'New York', abbr: 'NY', lat: 42.9, lng: -75.5, capital: 'Albany', pop: '19.3M', fact: 'Empire State' },
    { name: 'New Jersey', abbr: 'NJ', lat: 40.2, lng: -74.7, capital: 'Trenton', pop: '9.3M', fact: 'Garden State' },
    { name: 'Pennsylvania', abbr: 'PA', lat: 40.9, lng: -77.8, capital: 'Harrisburg', pop: '13M', fact: 'Keystone State' }
];

const southeastStates = [
    { name: 'Virginia', abbr: 'VA', lat: 37.5, lng: -78.8, capital: 'Richmond', pop: '8.6M', fact: 'Birthplace of Presidents' },
    { name: 'West Virginia', abbr: 'WV', lat: 38.9, lng: -80.5, capital: 'Charleston', pop: '1.8M', fact: 'Mountain State' },
    { name: 'North Carolina', abbr: 'NC', lat: 35.5, lng: -79.8, capital: 'Raleigh', pop: '10.4M', fact: 'First in Flight' },
    { name: 'South Carolina', abbr: 'SC', lat: 33.8, lng: -80.9, capital: 'Columbia', pop: '5.1M', fact: 'Palmetto State' },
    { name: 'Georgia', abbr: 'GA', lat: 32.7, lng: -83.5, capital: 'Atlanta', pop: '10.7M', fact: 'Peach State' },
    { name: 'Florida', abbr: 'FL', lat: 28.5, lng: -82.5, capital: 'Tallahassee', pop: '21.5M', fact: 'Sunshine State' },
    { name: 'Alabama', abbr: 'AL', lat: 32.8, lng: -86.8, capital: 'Montgomery', pop: '5M', fact: 'Heart of Dixie' },
    { name: 'Mississippi', abbr: 'MS', lat: 32.7, lng: -89.7, capital: 'Jackson', pop: '2.9M', fact: 'Magnolia State' },
    { name: 'Tennessee', abbr: 'TN', lat: 35.8, lng: -86.3, capital: 'Nashville', pop: '6.9M', fact: 'Volunteer State' },
    { name: 'Kentucky', abbr: 'KY', lat: 37.8, lng: -85.7, capital: 'Frankfort', pop: '4.5M', fact: 'Bluegrass State' }
];

const majorCities = [
    { name: 'New York City', state: 'NY', lat: 40.71, lng: -74.01, pop: '8.3M', region: 'northeast', fact: 'Largest US city' },
    { name: 'Boston', state: 'MA', lat: 42.36, lng: -71.06, pop: '675K', region: 'northeast', fact: 'Hub of New England' },
    { name: 'Philadelphia', state: 'PA', lat: 39.95, lng: -75.17, pop: '1.6M', region: 'northeast', fact: 'City of Brotherly Love' },
    { name: 'Miami', state: 'FL', lat: 25.76, lng: -80.19, pop: '450K', region: 'southeast', fact: 'Gateway to Latin America' },
    { name: 'Atlanta', state: 'GA', lat: 33.75, lng: -84.39, pop: '500K', region: 'southeast', fact: 'Capital of the South' },
    { name: 'Charlotte', state: 'NC', lat: 35.23, lng: -80.84, pop: '875K', region: 'southeast', fact: 'Banking center' },
    { name: 'Nashville', state: 'TN', lat: 36.16, lng: -86.78, pop: '690K', region: 'southeast', fact: 'Music City' },
    { name: 'Washington DC', state: 'DC', lat: 38.91, lng: -77.04, pop: '690K', region: 'northeast', fact: 'Nation\'s Capital' }
];

// Map state names to their data for quick lookup
const northeastStateNames = northeastStates.map(s => s.name);
const southeastStateNames = southeastStates.map(s => s.name);
const allStateNames = [...northeastStateNames, ...southeastStateNames];

const stateNameToData = {};
northeastStates.forEach(state => {
    stateNameToData[state.name] = { ...state, region: 'northeast' };
});
southeastStates.forEach(state => {
    stateNameToData[state.name] = { ...state, region: 'southeast' };
});

const quizQuestions = [
    { q: 'Which is the largest city in the Northeast?', a: 'New York City', opts: ['New York City', 'Boston', 'Philadelphia', 'Washington DC'] },
    { q: 'Which state is known as the "Sunshine State"?', a: 'Florida', opts: ['Florida', 'Georgia', 'South Carolina', 'Alabama'] },
    { q: 'What is the capital of Massachusetts?', a: 'Boston', opts: ['Boston', 'Providence', 'Hartford', 'Albany'] },
    { q: 'Which city is called "Music City"?', a: 'Nashville', opts: ['Nashville', 'Atlanta', 'Memphis', 'Charlotte'] },
    { q: 'Which is the smallest state in the US?', a: 'Rhode Island', opts: ['Rhode Island', 'Connecticut', 'Delaware', 'Vermont'] },
    { q: 'Which Southeast state is known as the "Peach State"?', a: 'Georgia', opts: ['Georgia', 'South Carolina', 'Florida', 'Alabama'] },
    { q: 'Where was the American Revolution born?', a: 'Massachusetts', opts: ['Massachusetts', 'Virginia', 'Pennsylvania', 'New York'] },
    { q: 'Which state is known as the "Keystone State"?', a: 'Pennsylvania', opts: ['Pennsylvania', 'New York', 'New Jersey', 'Virginia'] }
];

let map;
let northeastPolygons = [], southeastPolygons = [];
let northeastMarkers = [], southeastMarkers = [], cityMarkers = [];
let info;
let quizMode = false;
let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
let statesGeoData = null;
const TOTAL_QUESTIONS = 6;
let currentView = 'northeast';

async function init() {
    // Start with northeast view
    const view = VIEWS.northeast;
    const centerLat = view.lat + view.verticalPan;
    const centerLng = view.lng + view.horizontalPan;

    map = L.map('map', {
        center: [centerLat, centerLng],
        zoom: view.zoom,
        minZoom: 4,
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
    info.update = function(data) {
        if (data) {
            if (data.type === 'state') {
                this._div.className = 'info' + (data.region === 'southeast' ? ' southeast' : '');
                this._div.innerHTML = `
                    <h4>${data.name} (${data.abbr})</h4>
                    <p><span class="stat">Capital:</span> ${data.capital}</p>
                    <p><span class="stat">Population:</span> ${data.pop}</p>
                    <p><span class="stat">Known for:</span> ${data.fact}</p>
                `;
            } else if (data.type === 'city') {
                this._div.className = 'info' + (data.region === 'southeast' ? ' southeast' : '');
                this._div.innerHTML = `
                    <h4>● ${data.name}</h4>
                    <p><span class="stat">State:</span> ${data.state}</p>
                    <p><span class="stat">Population:</span> ${data.pop}</p>
                    <p>${data.fact}</p>
                `;
            } else if (data.type === 'region') {
                this._div.className = 'info' + (data.region === 'southeast' ? ' southeast' : '');
                this._div.innerHTML = `
                    <h4>${data.name}</h4>
                    <p>${data.desc}</p>
                    <p><span class="stat">States:</span> ${data.states}</p>
                    <p><span class="stat">Character:</span> ${data.character}</p>
                `;
            }
        } else {
            this._div.className = 'info';
            this._div.innerHTML = '<p style="color: #888; font-style: italic;">Click on states or cities</p>';
        }
    };
    info.addTo(map);

    // Load state boundaries from Natural Earth GeoJSON
    await loadStateBoundaries();

    // Add state markers
    addStateMarkers();

    // Add city markers
    addCityMarkers();

    // Setup controls
    document.getElementById('northeastBtn').addEventListener('click', () => showRegion('northeast'));
    document.getElementById('southeastBtn').addEventListener('click', () => showRegion('southeast'));
    document.getElementById('bothBtn').addEventListener('click', () => showRegion('both'));
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);

    showRegion('northeast');
}

// Load state boundaries from Natural Earth GeoJSON
async function loadStateBoundaries() {
    try {
        const response = await fetch(STATES_GEOJSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        statesGeoData = await response.json();

        // Filter and create polygons for both regions
        statesGeoData.features.forEach(feature => {
            const stateName = feature.properties.name;

            if (northeastStateNames.includes(stateName)) {
                const state = stateNameToData[stateName];
                const layer = L.geoJSON(feature, {
                    style: {
                        fillColor: '#64B5F6',
                        fillOpacity: 0.3,
                        color: '#1976D2',
                        weight: 2,
                        opacity: 0.8
                    }
                });

                layer.on('click', () => {
                    if (!quizMode) info.update({ type: 'state', ...state });
                });
                layer.on('mouseover', () => {
                    if (!quizMode) layer.setStyle({ fillOpacity: 0.5 });
                });
                layer.on('mouseout', () => {
                    layer.setStyle({ fillOpacity: 0.3 });
                });

                northeastPolygons.push({ layer, state });
            }

            if (southeastStateNames.includes(stateName)) {
                const state = stateNameToData[stateName];
                const layer = L.geoJSON(feature, {
                    style: {
                        fillColor: '#FF8A65',
                        fillOpacity: 0.3,
                        color: '#E64A19',
                        weight: 2,
                        opacity: 0.8
                    }
                });

                layer.on('click', () => {
                    if (!quizMode) info.update({ type: 'state', ...state });
                });
                layer.on('mouseover', () => {
                    if (!quizMode) layer.setStyle({ fillOpacity: 0.5 });
                });
                layer.on('mouseout', () => {
                    layer.setStyle({ fillOpacity: 0.3 });
                });

                southeastPolygons.push({ layer, state });
            }
        });

    } catch (error) {
        console.error('Error loading state boundaries:', error);
        document.getElementById('map').innerHTML +=
            '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;z-index:1000;">' +
            'Loading map data... If this persists, check your internet connection.</div>';
    }
}

function addStateMarkers() {
    northeastStates.forEach(state => {
        const icon = L.divIcon({
            className: 'state-label',
            html: `<div style="
                background: rgba(25, 118, 210, 0.9);
                padding: 2px 5px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
                color: white;
                border: 1px solid #1565C0;
            ">${state.abbr}</div>`,
            iconSize: [25, 18],
            iconAnchor: [12, 9]
        });

        const marker = L.marker([state.lat, state.lng], { icon })
            .on('click', () => {
                if (!quizMode) info.update({ type: 'state', region: 'northeast', ...state });
            });

        marker.bindTooltip(state.name, { permanent: false, direction: 'top' });
        northeastMarkers.push(marker);
    });

    southeastStates.forEach(state => {
        const icon = L.divIcon({
            className: 'state-label',
            html: `<div style="
                background: rgba(230, 74, 25, 0.9);
                padding: 2px 5px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
                color: white;
                border: 1px solid #BF360C;
            ">${state.abbr}</div>`,
            iconSize: [25, 18],
            iconAnchor: [12, 9]
        });

        const marker = L.marker([state.lat, state.lng], { icon })
            .on('click', () => {
                if (!quizMode) info.update({ type: 'state', region: 'southeast', ...state });
            });

        marker.bindTooltip(state.name, { permanent: false, direction: 'top' });
        southeastMarkers.push(marker);
    });
}

function addCityMarkers() {
    majorCities.forEach(city => {
        const color = city.region === 'northeast' ? '#0D47A1' : '#BF360C';
        const icon = L.divIcon({
            className: 'city-marker',
            html: `<span style="font-size: 14px; color: ${color}; text-shadow: 1px 1px white;">●</span>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        const marker = L.marker([city.lat, city.lng], { icon })
            .on('click', () => {
                if (!quizMode) info.update({ type: 'city', ...city });
            });

        marker.bindTooltip(`${city.name} (${city.pop})`, { permanent: false, direction: 'top' });
        cityMarkers.push({ marker, city });
    });
}

function showRegion(region) {
    currentView = region;

    // Update button states
    document.getElementById('northeastBtn').classList.remove('active', 'southeast-active');
    document.getElementById('southeastBtn').classList.remove('active', 'southeast-active');
    document.getElementById('bothBtn').classList.remove('active', 'southeast-active');

    if (region === 'northeast') {
        document.getElementById('northeastBtn').classList.add('active');
    } else if (region === 'southeast') {
        document.getElementById('southeastBtn').classList.add('southeast-active');
    } else {
        document.getElementById('bothBtn').classList.add('active');
    }

    // Clear all layers
    northeastPolygons.forEach(({ layer }) => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    southeastPolygons.forEach(({ layer }) => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
    });
    northeastMarkers.forEach(m => {
        if (map.hasLayer(m)) map.removeLayer(m);
    });
    southeastMarkers.forEach(m => {
        if (map.hasLayer(m)) map.removeLayer(m);
    });
    cityMarkers.forEach(({ marker }) => {
        if (map.hasLayer(marker)) map.removeLayer(marker);
    });

    // Add appropriate layers
    if (region === 'northeast' || region === 'both') {
        northeastPolygons.forEach(({ layer }) => layer.addTo(map));
        northeastMarkers.forEach(m => m.addTo(map));
        cityMarkers.filter(({ city }) => city.region === 'northeast').forEach(({ marker }) => marker.addTo(map));
    }

    if (region === 'southeast' || region === 'both') {
        southeastPolygons.forEach(({ layer }) => layer.addTo(map));
        southeastMarkers.forEach(m => m.addTo(map));
        cityMarkers.filter(({ city }) => city.region === 'southeast').forEach(({ marker }) => marker.addTo(map));
    }

    // Adjust view using configured pan and zoom
    const view = VIEWS[region];
    const centerLat = view.lat + view.verticalPan;
    const centerLng = view.lng + view.horizontalPan;
    map.setView([centerLat, centerLng], view.zoom);

    // Update info panel
    if (region === 'northeast') {
        info.update({
            type: 'region',
            name: 'Northeast Region',
            region: 'northeast',
            desc: 'The birthplace of American independence and industry.',
            states: '9 states from Maine to Pennsylvania',
            character: 'Historic cities, changing seasons, diverse cultures'
        });
    } else if (region === 'southeast') {
        info.update({
            type: 'region',
            name: 'Southeast Region',
            region: 'southeast',
            desc: 'The warm, hospitable South with rich cultural heritage.',
            states: '10 states from Virginia to Florida',
            character: 'Warm climate, Southern hospitality, growing cities'
        });
    } else {
        info.update(null);
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

    // Show both regions during quiz
    showRegion('both');

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

    let options = [...q.opts];
    options.sort(() => Math.random() - 0.5);

    const optionsDiv = document.getElementById('quizOptions');
    optionsDiv.innerHTML = options.map(opt =>
        `<button class="quiz-option" data-answer="${opt}">${opt}</button>`
    ).join('');

    optionsDiv.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => checkAnswer(btn, q.a));
    });
}

function checkAnswer(btn, correct) {
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
    document.getElementById('quizBtn').classList.remove('active');
    document.getElementById('quizPanel').classList.add('hidden');
    showRegion('northeast');
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
