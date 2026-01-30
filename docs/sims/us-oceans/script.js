/* US Oceans MicroSim */

// Natural Earth GeoJSON for marine features
const MARINE_GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_geography_marine_polys.geojson';

const oceanData = [
    {
        name: 'Atlantic Ocean',
        color: '#1565C0',
        lat: 32.0,
        lng: -70.0,
        size: '41.1 million sq miles',
        description: 'The second largest ocean, connecting America to Europe and Africa.',
        coastalStates: ['Maine', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey', 'Delaware', 'Maryland', 'Virginia', 'North Carolina', 'South Carolina', 'Georgia', 'Florida'],
        funFacts: [
            'Named after Atlas from Greek mythology',
            'The Titanic sank in the North Atlantic in 1912',
            'Major shipping route between US and Europe'
        ],
        features: 'Warm Gulf Stream, hurricane formation, important fishing grounds',
        // Natural Earth feature names that map to this ocean
        neFeatures: ['North Atlantic Ocean', 'Sargasso Sea']
    },
    {
        name: 'Pacific Ocean',
        color: '#0D47A1',
        lat: 35.0,
        lng: -135.0,
        size: '63.8 million sq miles',
        description: 'The largest and deepest ocean, covering more area than all land combined!',
        coastalStates: ['Washington', 'Oregon', 'California', 'Alaska', 'Hawaii'],
        funFacts: [
            'Contains the Mariana Trench, the deepest point on Earth',
            'Home to the Ring of Fire with many volcanoes',
            'Name means "peaceful" in Latin'
        ],
        features: 'Cool California Current, abundant marine life, volcanic islands',
        neFeatures: ['North Pacific Ocean']
    },
    {
        name: 'Gulf of Mexico',
        color: '#26A69A',
        lat: 25.0,
        lng: -90.0,
        size: '615,000 sq miles',
        description: 'A warm gulf connected to the Atlantic, bordered by the US, Mexico, and Cuba.',
        coastalStates: ['Texas', 'Louisiana', 'Mississippi', 'Alabama', 'Florida (west coast)'],
        funFacts: [
            'Warm waters help form powerful hurricanes',
            'Rich in oil and natural gas deposits',
            'The Mississippi River empties here'
        ],
        features: 'Warm water year-round, oil platforms, shrimp fishing, barrier islands',
        neFeatures: ['Gulf of Mexico']
    },
    {
        name: 'Arctic Ocean',
        color: '#5C6BC0',
        lat: 72.0,
        lng: -160.0,
        size: '5.4 million sq miles',
        description: 'The smallest and coldest ocean, mostly frozen for part of the year.',
        coastalStates: ['Alaska (northern coast)'],
        funFacts: [
            'Covered by sea ice much of the year',
            'Home to polar bears and Arctic seals',
            'Daylight lasts 24 hours in summer!'
        ],
        features: 'Sea ice, permafrost coast, polar wildlife, midnight sun',
        neFeatures: ['Arctic Ocean', 'Chukchi Sea', 'Beaufort Sea']
    }
];

const quizQuestions = [
    { q: 'Which is the largest ocean?', a: 'Pacific Ocean' },
    { q: 'Which body of water helps form hurricanes?', a: 'Gulf of Mexico' },
    { q: 'Which ocean is mostly frozen?', a: 'Arctic Ocean' },
    { q: 'Which ocean connects the US to Europe?', a: 'Atlantic Ocean' },
    { q: 'Which ocean has the Mariana Trench?', a: 'Pacific Ocean' },
    { q: 'Where does the Mississippi River empty?', a: 'Gulf of Mexico' },
    { q: 'Which ocean borders California?', a: 'Pacific Ocean' },
    { q: 'Which ocean borders New York?', a: 'Atlantic Ocean' },
    { q: 'Which is the smallest ocean?', a: 'Arctic Ocean' },
    { q: 'Where would you find polar bears near the US?', a: 'Arctic Ocean' }
];

let map;
let markers = [];
let oceanPolygons = [];
let info;
let quizMode = false;
let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 5;

async function init() {
    // Initialize map centered on US and oceans
    map = L.map('map', {
        center: [35, -100],
        zoom: 3,
        minZoom: 2,
        maxZoom: 6
    });

    // Add tile layer with water emphasis
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
    info.update = function(ocean) {
        if (ocean) {
            this._div.innerHTML = `
                <h4 style="color: ${ocean.color}">${ocean.name}</h4>
                <p>${ocean.description}</p>
                <p><span class="stat">Size:</span> ${ocean.size}</p>
                <p><span class="stat">US Coastal States:</span> ${ocean.coastalStates.slice(0, 5).join(', ')}${ocean.coastalStates.length > 5 ? '...' : ''}</p>
                <p><span class="stat">Features:</span> ${ocean.features}</p>
                <p><span class="stat">Fun Fact:</span> ${ocean.funFacts[0]}</p>
            `;
        } else {
            this._div.innerHTML = '<p style="color: #888; font-style: italic;">Click on an ocean to see details</p>';
        }
    };
    info.addTo(map);

    // Load Natural Earth marine boundaries
    await loadMarineBoundaries();

    // Add markers for each ocean
    addOceanMarkers();

    // Setup controls
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

async function loadMarineBoundaries() {
    // Use Natural Earth GeoJSON for Gulf of Mexico (well-defined feature)
    // Use improved manual polygons for major oceans (Natural Earth has holes)

    // Add manual ocean regions first
    addOceanRegions();

    // Then try to load Natural Earth for Gulf of Mexico overlay
    try {
        const response = await fetch(MARINE_GEOJSON_URL);
        const geoData = await response.json();

        const gulfOcean = oceanData.find(o => o.name === 'Gulf of Mexico');

        geoData.features.forEach(feature => {
            const featureName = feature.properties.name;

            // Only use Natural Earth for Gulf of Mexico
            if (featureName === 'Gulf of Mexico' && gulfOcean) {
                // Remove the manual Gulf polygon first
                oceanPolygons = oceanPolygons.filter(op => {
                    if (op.ocean.name === 'Gulf of Mexico') {
                        map.removeLayer(op.polygon);
                        return false;
                    }
                    return true;
                });

                const layer = L.geoJSON(feature, {
                    style: {
                        fillColor: gulfOcean.color,
                        fillOpacity: 0.3,
                        color: gulfOcean.color,
                        weight: 2,
                        opacity: 0.8
                    }
                }).addTo(map);

                layer.on('click', () => {
                    if (!quizMode) {
                        info.update(gulfOcean);
                        highlightOcean(gulfOcean.name);
                    }
                });

                layer.on('mouseover', () => {
                    if (!quizMode) {
                        layer.setStyle({ fillOpacity: 0.5 });
                    }
                });

                layer.on('mouseout', () => {
                    layer.setStyle({ fillOpacity: 0.3 });
                });

                oceanPolygons.push({ polygon: layer, ocean: gulfOcean });
            }
        });
    } catch (error) {
        console.error('Error loading Natural Earth marine boundaries:', error);
        // Manual polygons already added, so we're fine
    }
}

function addOceanRegions() {
    // Improved ocean boundary polygons with better precision
    // Following approximate coastlines more closely
    const oceanBounds = {
        'Atlantic Ocean': [
            // Following US East Coast more precisely
            [47, -67],   // Maine coast
            [44, -66],   // Nova Scotia approach
            [42, -65],   // Gulf of Maine
            [40, -70],   // Cape Cod
            [38, -73],   // New Jersey coast
            [35, -75],   // North Carolina
            [32, -79],   // South Carolina
            [30, -80],   // Georgia/Florida border
            [27, -80],   // Florida east coast
            [25, -80],   // Miami
            [24, -80],   // Florida Keys approach
            // Extend into open Atlantic
            [20, -70],
            [15, -60],
            [20, -50],
            [30, -45],
            [40, -50],
            [50, -55],
            [50, -65]
        ],
        'Pacific Ocean': [
            // Following US West Coast and extending to Hawaii/Alaska
            [70, -168],  // Bering Strait area
            [65, -168],  // Western Alaska
            [60, -165],
            [55, -165],  // Aleutians approach
            [55, -140],
            [50, -130],  // Pacific Northwest approach
            [48, -125],  // Washington coast
            [45, -124],  // Oregon coast
            [42, -124],  // Northern California
            [38, -123],  // San Francisco
            [35, -121],  // Central California
            [32, -117],  // San Diego
            [28, -115],  // Baja approach
            [23, -115],
            // Extend into open Pacific
            [20, -130],
            [22, -160],  // Hawaii area
            [30, -175],
            [45, -180],
            [60, -180],
            [70, -180]
        ],
        'Gulf of Mexico': [
            // Detailed Gulf coastline (fallback if Natural Earth fails)
            [30.3, -88],   // Mobile Bay
            [30, -89.5],   // Mississippi coast
            [29.5, -90],   // Louisiana delta
            [29, -91],
            [29.5, -93],   // Louisiana coast
            [29.5, -94],   // Texas border
            [28.5, -96],   // Corpus Christi
            [26, -97],     // South Texas
            [23, -97.5],   // Mexico coast
            [21, -97],
            [20, -96],
            [19.5, -96],
            [19, -95],
            [18.5, -94],
            [18.5, -92],
            [19, -90],
            [20, -87],     // Yucatan
            [21.5, -87],
            [23, -84],     // Cuba approach
            [24.5, -83],   // Florida Keys
            [25, -82],
            [26, -82],
            [27, -82.5],   // Tampa Bay
            [28, -83],
            [29, -83.5],   // Big Bend
            [29.5, -84],
            [30, -84.5],   // Apalachicola
            [30, -86],
            [30.3, -87],   // Pensacola
            [30.3, -88]
        ],
        'Arctic Ocean': [
            // Northern Alaska coast
            [71.5, -156],  // Barrow area
            [71, -157],
            [70.5, -160],
            [70, -162],
            [69, -164],
            [68.5, -166],
            [66, -168],    // Bering Strait
            // Extend into Arctic
            [67, -175],
            [70, -180],
            [73, -180],
            [75, -170],
            [75, -155],
            [74, -145],
            [72, -142],
            [71, -141],    // Alaska/Canada border
            [70, -141],
            [69.5, -142],
            [70, -145],
            [70.5, -148],
            [71, -152],
            [71.5, -155]
        ]
    };

    oceanData.forEach(ocean => {
        const bounds = oceanBounds[ocean.name];
        if (bounds) {
            const polygon = L.polygon(bounds, {
                color: ocean.color,
                weight: 2,
                opacity: 0.8,
                fillColor: ocean.color,
                fillOpacity: 0.3
            }).addTo(map);

            polygon.on('click', () => {
                if (!quizMode) {
                    info.update(ocean);
                    highlightOcean(ocean.name);
                }
            });

            polygon.on('mouseover', () => {
                if (!quizMode) {
                    polygon.setStyle({ fillOpacity: 0.5 });
                }
            });

            polygon.on('mouseout', () => {
                polygon.setStyle({ fillOpacity: 0.3 });
            });

            oceanPolygons.push({ polygon, ocean });
        }
    });
}

function addOceanMarkers() {
    oceanData.forEach(ocean => {
        const icon = L.divIcon({
            className: 'ocean-marker',
            html: `<div style="
                background: ${ocean.color};
                padding: 4px 8px;
                border-radius: 4px;
                border: 2px solid white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                color: white;
                font-size: 11px;
                font-weight: bold;
                white-space: nowrap;
            ">${ocean.name}</div>`,
            iconSize: [100, 30],
            iconAnchor: [50, 15]
        });

        const marker = L.marker([ocean.lat, ocean.lng], { icon })
            .addTo(map)
            .on('click', () => {
                if (!quizMode) {
                    info.update(ocean);
                    highlightOcean(ocean.name);
                }
            });

        markers.push({ marker, ocean });
    });
}

function highlightOcean(name) {
    oceanPolygons.forEach(({ polygon, ocean }) => {
        if (ocean.name === name) {
            polygon.setStyle({ fillOpacity: 0.6, weight: 4 });
            setTimeout(() => polygon.setStyle({ fillOpacity: 0.3, weight: 3 }), 800);
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

    // Generate options from ocean names
    const options = [q.a];
    const otherOceans = oceanData.map(o => o.name).filter(n => n !== q.a);
    while (options.length < 4) {
        const random = otherOceans[Math.floor(Math.random() * otherOceans.length)];
        if (!options.includes(random)) options.push(random);
    }
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

    // Highlight the correct ocean on the map
    highlightOcean(correct);

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

    if (score === TOTAL_QUESTIONS) {
        celebrate();
    }
}

function resetView() {
    quizMode = false;
    document.getElementById('quizBtn').classList.remove('active');
    document.getElementById('quizPanel').classList.add('hidden');
    map.setView([35, -100], 3);
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
