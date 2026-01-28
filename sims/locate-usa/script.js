/* Locate USA MicroSim Script
 * ===========================
 * Interactive map for learning US location in North America
 * Uses high-quality GeoJSON boundaries from Natural Earth
 */

// Configuration
// move the map center slightly to the left show more of North America
// so the info box doesn't cover important areas
const MAP_CONFIG = {
    center: [50, -70],
    zoom: 2.4,
    minZoom: 2,
    maxZoom: 8
};

// GeoJSON sources - Natural Earth 110m country boundaries
const COUNTRIES_GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

// Region data with descriptions
const regions = {
    usa: {
        name: "United States of America",
        color: "steelblue",
        description: "The continental United States spans from the Atlantic to the Pacific Ocean.",
        facts: [
            "Northern Hemisphere (above the equator)",
            "Western Hemisphere (west of Prime Meridian)",
            "Bordered by Canada to the north",
            "Bordered by Mexico to the south",
            "Atlantic Ocean on the east coast",
            "Pacific Ocean on the west coast"
        ]
    },
    alaska: {
        name: "Alaska",
        color: "steelblue",
        description: "Alaska is the largest US state, located northwest of Canada.",
        facts: [
            "Largest US state by area",
            "Purchased from Russia in 1867",
            "Borders the Arctic and Pacific Oceans",
            "Not connected to the continental US",
            "Contains the highest peak in North America (Denali)"
        ]
    },
    hawaii: {
        name: "Hawaii",
        color: "steelblue",
        description: "Hawaii is a US state made up of islands in the Pacific Ocean.",
        facts: [
            "Located in the middle of the Pacific Ocean",
            "Made up of 8 main islands",
            "The only US state entirely made of islands",
            "Became the 50th state in 1959",
            "About 2,400 miles from California"
        ]
    },
    canada: {
        name: "Canada",
        color: "forestgreen",
        description: "Canada is the northern neighbor of the United States.",
        facts: [
            "Located north of the United States",
            "Second largest country in the world",
            "Shares the longest border with the US"
        ]
    },
    mexico: {
        name: "Mexico",
        color: "darkorange",
        description: "Mexico is the southern neighbor of the United States.",
        facts: [
            "Located south of the United States",
            "Border runs from California to Texas",
            "Part of North America"
        ]
    },
    atlantic: {
        name: "Atlantic Ocean",
        color: "lightblue",
        description: "The Atlantic Ocean borders the east coast of the United States.",
        facts: [
            "Second largest ocean in the world",
            "Separates the Americas from Europe and Africa",
            "US states like Florida, New York, and Maine touch it"
        ]
    },
    pacific: {
        name: "Pacific Ocean",
        color: "lightblue",
        description: "The Pacific Ocean borders the west coast of the United States.",
        facts: [
            "Largest ocean in the world",
            "US states like California, Oregon, and Washington touch it",
            "Hawaii and Alaska are also in the Pacific"
        ]
    }
};

// Quiz questions
const quizQuestions = [
    { question: "What country is north of the United States?", answer: "Canada", options: ["Canada", "Mexico", "Brazil"] },
    { question: "What country is south of the United States?", answer: "Mexico", options: ["Canada", "Mexico", "Cuba"] },
    { question: "What ocean is on the east coast of the US?", answer: "Atlantic Ocean", options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean"] },
    { question: "What ocean is on the west coast of the US?", answer: "Pacific Ocean", options: ["Pacific Ocean", "Atlantic Ocean", "Arctic Ocean"] },
    { question: "Which hemisphere is the United States in?", answer: "Northern", options: ["Northern", "Southern", "Both"] },
    { question: "Which US state is northwest of Canada?", answer: "Alaska", options: ["Alaska", "Hawaii", "Maine"] },
    { question: "Which US state is made of islands in the Pacific?", answer: "Hawaii", options: ["Alaska", "Hawaii", "Florida"] },
    { question: "What continent is the United States on?", answer: "North America", options: ["North America", "South America", "Europe"] }
];

// State variables
let map;
let infoControl;
let labelsVisible = true;
let quizMode = false;
let score = 0;
let currentQuestion = null;
let regionLayers = {};
let labelMarkers = [];
let countriesData = null;

// Quiz tracking
let shuffledQuestions = [];
let currentQuestionIndex = 0;
const TOTAL_QUESTIONS = 8;

// Country name mapping (Natural Earth uses different names)
const countryNameMap = {
    'United States of America': 'usa',
    'Canada': 'canada',
    'Mexico': 'mexico'
};

// Initialize the map
async function initMap() {
    map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

    // Add ocean background
    L.rectangle([[-60, -180], [85, 0]], {
        color: "transparent",
        fillColor: "lightblue",
        fillOpacity: 0.3,
        interactive: false
    }).addTo(map);

    // Add tile layer - light style without labels for cleaner look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> | <a href="https://www.naturalearthdata.com/">Natural Earth</a>',
        maxZoom: MAP_CONFIG.maxZoom
    }).addTo(map);

    // Initialize info control
    initInfoControl();

    // Load and add country boundaries
    await loadCountryBoundaries();

    // Add Alaska and Hawaii overlay regions
    addAlaskaHawaiiOverlays();

    // Add ocean labels
    addOceanLabels();

    // Add region labels
    addRegionLabels();

    // Setup controls
    setupControls();
}

// Load country boundaries from Natural Earth GeoJSON
async function loadCountryBoundaries() {
    try {
        const response = await fetch(COUNTRIES_GEOJSON_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        countriesData = await response.json();

        // Filter for North American countries we want to display
        const targetCountries = ['United States of America', 'Canada', 'Mexico'];

        countriesData.features.forEach(feature => {
            const countryName = feature.properties.NAME || feature.properties.ADMIN;

            if (targetCountries.includes(countryName)) {
                const regionId = countryNameMap[countryName];
                const region = regions[regionId];

                if (region) {
                    const layer = L.geoJSON(feature, {
                        style: {
                            fillColor: region.color,
                            fillOpacity: regionId === 'usa' ? 0.6 : 0.5,
                            color: 'white',
                            weight: 2
                        }
                    }).addTo(map);

                    // Add event handlers
                    layer.on('mouseover', () => highlightRegion(regionId, layer));
                    layer.on('mouseout', () => resetHighlight(regionId, layer));
                    layer.on('click', () => zoomToRegion(layer));

                    regionLayers[regionId] = layer;
                }
            }
        });

    } catch (error) {
        console.error('Error loading country boundaries:', error);
        // Fallback message
        document.getElementById('map').innerHTML +=
            '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;z-index:1000;">' +
            'Loading map data... If this persists, check your internet connection.</div>';
    }
}

// Add interactive overlay regions for Alaska and Hawaii
function addAlaskaHawaiiOverlays() {
    // Alaska bounding polygon (approximate)
    const alaskaBounds = [
        [71.5, -180], [71.5, -140], [70, -140], [68, -141],
        [60, -141], [55, -130], [51, -130], [52, -170],
        [52, -180], [71.5, -180]
    ];

    const alaskaOverlay = L.polygon(alaskaBounds, {
        fillColor: 'transparent',
        fillOpacity: 0,
        color: 'transparent',
        weight: 0
    }).addTo(map);

    alaskaOverlay.on('mouseover', (e) => {
        infoControl.update('alaska');
        // Highlight the Alaska portion visually
        if (regionLayers.usa) {
            regionLayers.usa.setStyle({
                fillOpacity: 0.85,
                weight: 3,
                color: '#333'
            });
        }
    });

    alaskaOverlay.on('mouseout', () => {
        infoControl.update();
        if (regionLayers.usa) {
            regionLayers.usa.setStyle({
                fillOpacity: 0.6,
                weight: 2,
                color: 'white'
            });
        }
    });

    alaskaOverlay.on('click', () => {
        map.setView([64, -153], 4);
    });

    // Hawaii marker with larger clickable area
    const hawaiiCenter = [21, -157];

    const hawaiiOverlay = L.circle(hawaiiCenter, {
        radius: 300000, // 300km radius for easier interaction
        fillColor: 'transparent',
        fillOpacity: 0,
        color: 'transparent',
        weight: 0
    }).addTo(map);

    // Also add a visible marker for Hawaii
    const hawaiiMarker = L.circleMarker(hawaiiCenter, {
        radius: 8,
        fillColor: regions.hawaii.color,
        color: 'white',
        weight: 2,
        fillOpacity: 0.8
    }).addTo(map);

    const hawaiiHover = (e) => {
        infoControl.update('hawaii');
        hawaiiMarker.setStyle({ fillOpacity: 1, weight: 3, radius: 10 });
    };

    const hawaiiOut = () => {
        infoControl.update();
        hawaiiMarker.setStyle({ fillOpacity: 0.8, weight: 2, radius: 8 });
    };

    const hawaiiClick = () => {
        map.setView([21, -157], 6);
    };

    hawaiiOverlay.on('mouseover', hawaiiHover);
    hawaiiOverlay.on('mouseout', hawaiiOut);
    hawaiiOverlay.on('click', hawaiiClick);

    hawaiiMarker.on('mouseover', hawaiiHover);
    hawaiiMarker.on('mouseout', hawaiiOut);
    hawaiiMarker.on('click', hawaiiClick);

    regionLayers.alaska = alaskaOverlay;
    regionLayers.hawaii = hawaiiOverlay;
}

// Info control panel
function initInfoControl() {
    infoControl = L.control({ position: 'topright' });

    infoControl.onAdd = function() {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    infoControl.update = function(regionId) {
        if (!regionId) {
            this._div.innerHTML = '<h4>North America</h4>' +
                '<p>Hover over a country or ocean label to learn about it!</p>';
            return;
        }

        const region = regions[regionId];
        if (!region) return;

        let html = `<h4>${region.name}</h4>`;
        html += `<p>${region.description}</p>`;
        html += '<p style="margin-top: 6px;"><strong>Key Facts:</strong></p>';
        html += '<ul style="margin: 4px 0 0 16px; padding: 0;">';
        region.facts.forEach(fact => {
            html += `<li style="font-size: 11px; margin: 2px 0;">${fact}</li>`;
        });
        html += '</ul>';
        this._div.innerHTML = html;
    };

    infoControl.addTo(map);
}

// Add text labels for regions
function addRegionLabels() {
    const labels = [
        { text: "United States", lat: 39, lng: -98, size: 14, id: 'usa' },
        { text: "Canada", lat: 56, lng: -106, size: 13, id: 'canada' },
        { text: "Mexico", lat: 24, lng: -102, size: 12, id: 'mexico' },
        { text: "Alaska", lat: 64, lng: -153, size: 10, id: 'usa' },
        { text: "Hawaii", lat: 20, lng: -156, size: 9, id: 'usa' }
    ];

    labels.forEach(label => {
        const marker = L.marker([label.lat, label.lng], {
            icon: L.divIcon({
                className: 'label-marker',
                html: `<div style="font-size: ${label.size}px; font-weight: bold; color: #333;
                       text-shadow: 1px 1px 2px white, -1px -1px 2px white, 1px -1px 2px white, -1px 1px 2px white;
                       white-space: nowrap; pointer-events: none;">${label.text}</div>`,
                iconSize: [100, 20],
                iconAnchor: [50, 10]
            }),
            interactive: false
        }).addTo(map);
        labelMarkers.push(marker);
    });
}

// Add ocean labels
function addOceanLabels() {
    const oceanLabels = [
        { text: "Atlantic Ocean", lat: 32, lng: -55, id: "atlantic" },
        { text: "Pacific Ocean", lat: 30, lng: -145, id: "pacific" }
    ];

    oceanLabels.forEach(label => {
        const marker = L.marker([label.lat, label.lng], {
            icon: L.divIcon({
                className: 'ocean-label',
                html: `<div style="font-size: 12px; font-style: italic; color: #2c5aa0;
                       text-shadow: 1px 1px 2px white; white-space: nowrap; cursor: pointer;">${label.text}</div>`,
                iconSize: [120, 20],
                iconAnchor: [60, 10]
            })
        }).addTo(map);

        marker.on('mouseover', () => infoControl.update(label.id));
        marker.on('mouseout', () => infoControl.update());

        labelMarkers.push(marker);
    });
}

// Highlight region on hover
function highlightRegion(regionId, layer) {
    infoControl.update(regionId);

    if (layer && layer.setStyle) {
        layer.setStyle({
            fillOpacity: 0.85,
            weight: 3,
            color: '#333'
        });
        layer.bringToFront();
    }
}

// Reset highlight
function resetHighlight(regionId, layer) {
    infoControl.update();

    if (layer && layer.setStyle) {
        const defaultOpacity = regionId === 'usa' ? 0.6 : 0.5;
        layer.setStyle({
            fillOpacity: defaultOpacity,
            weight: 2,
            color: 'white'
        });
    }
}

// Zoom to region
function zoomToRegion(layer) {
    if (layer.getBounds) {
        map.fitBounds(layer.getBounds(), { padding: [20, 20] });
    }
}

// Setup control buttons
function setupControls() {
    document.getElementById('quizBtn').addEventListener('click', toggleQuiz);
    document.getElementById('toggleLabelsBtn').addEventListener('click', toggleLabels);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

// Toggle quiz mode
function toggleQuiz() {
    quizMode = !quizMode;
    const quizPanel = document.getElementById('quizPanel');
    const quizBtn = document.getElementById('quizBtn');

    if (quizMode) {
        // Reset and start new quiz
        score = 0;
        currentQuestionIndex = 0;
        shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);

        document.getElementById('scoreDisplay').textContent = `Score: 0`;
        quizPanel.classList.remove('hidden');
        quizBtn.classList.add('active');
        quizBtn.textContent = 'Exit Quiz';

        // Clear any existing stars
        document.getElementById('starsDisplay').innerHTML = '';

        showNextQuestion();
    } else {
        quizPanel.classList.add('hidden');
        quizBtn.classList.remove('active');
        quizBtn.textContent = 'Quiz Me!';
        currentQuestion = null;
    }
}

// Show next quiz question
function showNextQuestion() {
    // Check if quiz is complete
    if (currentQuestionIndex >= TOTAL_QUESTIONS) {
        showQuizComplete();
        return;
    }

    currentQuestion = shuffledQuestions[currentQuestionIndex];

    // Update progress display
    document.getElementById('quizProgress').textContent = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;

    document.getElementById('quizQuestion').textContent = currentQuestion.question;
    document.getElementById('quizFeedback').textContent = '';
    document.getElementById('quizFeedback').className = 'quiz-feedback';

    const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(option, btn));
        optionsContainer.appendChild(btn);
    });
}

// Check quiz answer
function checkAnswer(answer, btn) {
    const feedback = document.getElementById('quizFeedback');
    const allOptions = document.querySelectorAll('.quiz-option');

    allOptions.forEach(opt => opt.style.pointerEvents = 'none');

    if (answer === currentQuestion.answer) {
        btn.classList.add('correct');
        feedback.textContent = 'Correct! Great job!';
        feedback.className = 'quiz-feedback correct';
        score++;
        document.getElementById('scoreDisplay').textContent = `Score: ${score}`;

        // Add gold star animation
        addGoldStar();
    } else {
        btn.classList.add('incorrect');
        allOptions.forEach(opt => {
            if (opt.textContent === currentQuestion.answer) {
                opt.classList.add('correct');
            }
        });
        feedback.textContent = `The correct answer is: ${currentQuestion.answer}`;
        feedback.className = 'quiz-feedback incorrect';
    }

    currentQuestionIndex++;

    setTimeout(() => {
        if (quizMode) {
            showNextQuestion();
        }
    }, 1500);
}

// Add a gold star for correct answer
function addGoldStar() {
    const starsDisplay = document.getElementById('starsDisplay');
    const star = document.createElement('span');
    star.className = 'gold-star';
    star.textContent = '★';
    starsDisplay.appendChild(star);

    // Trigger animation
    setTimeout(() => star.classList.add('animated'), 10);
}

// Show quiz completion
function showQuizComplete() {
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizFeedback = document.getElementById('quizFeedback');
    const quizProgress = document.getElementById('quizProgress');

    quizProgress.textContent = 'Quiz Complete!';
    quizOptions.innerHTML = '';

    if (score === TOTAL_QUESTIONS) {
        // Perfect score - show celebration!
        quizQuestion.textContent = '🎉 Perfect Score! 🎉';
        quizFeedback.textContent = `You got all ${TOTAL_QUESTIONS} questions correct!`;
        quizFeedback.className = 'quiz-feedback correct';

        // Trigger exploding stars celebration
        showCelebration();
    } else {
        quizQuestion.textContent = 'Quiz Complete!';
        quizFeedback.textContent = `You got ${score} out of ${TOTAL_QUESTIONS} correct.`;
        quizFeedback.className = 'quiz-feedback';
    }

    // Add restart button
    const restartBtn = document.createElement('button');
    restartBtn.className = 'quiz-option';
    restartBtn.textContent = 'Try Again';
    restartBtn.style.marginTop = '10px';
    restartBtn.addEventListener('click', () => {
        quizMode = false;
        toggleQuiz();
    });
    quizOptions.appendChild(restartBtn);
}

// Exploding stars celebration animation
function showCelebration() {
    const celebrationContainer = document.createElement('div');
    celebrationContainer.className = 'celebration-container';
    celebrationContainer.id = 'celebrationContainer';
    document.body.appendChild(celebrationContainer);

    // Create multiple exploding stars
    const colors = ['gold', 'orange', 'yellow', 'coral', 'khaki'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'exploding-star';
            star.textContent = '★';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.color = colors[Math.floor(Math.random() * colors.length)];
            star.style.fontSize = (Math.random() * 30 + 15) + 'px';
            star.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
            celebrationContainer.appendChild(star);

            // Remove star after animation
            setTimeout(() => star.remove(), 2000);
        }, i * 50);
    }

    // Remove celebration container after all animations
    setTimeout(() => {
        celebrationContainer.remove();
    }, 4000);
}

// Toggle labels visibility
function toggleLabels() {
    labelsVisible = !labelsVisible;
    const btn = document.getElementById('toggleLabelsBtn');

    labelMarkers.forEach(marker => {
        if (labelsVisible) {
            marker.addTo(map);
        } else {
            marker.remove();
        }
    });

    btn.textContent = labelsVisible ? 'Hide Labels' : 'Show Labels';
}

// Reset map view
function resetView() {
    map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initMap);
