/* US Climate Zones MicroSim */

const climateData = [
    {
        name: 'Subarctic',
        color: '#1565C0',
        lat: 64.5,
        lng: -153.0,
        states: ['Alaska (interior)'],
        description: 'Very long, cold winters and short, cool summers.',
        temps: { winter: '-20°F to 0°F', summer: '50°F to 70°F' },
        precip: '10-20 inches/year',
        features: 'Permafrost, midnight sun in summer, northern lights'
    },
    {
        name: 'Humid Continental',
        color: '#42A5F5',
        lat: 44.0,
        lng: -89.0,
        states: ['Minnesota', 'Wisconsin', 'Michigan', 'New York', 'Maine'],
        description: 'Cold winters with snow and warm, humid summers.',
        temps: { winter: '10°F to 30°F', summer: '70°F to 85°F' },
        precip: '30-50 inches/year',
        features: 'Four distinct seasons, lake effect snow'
    },
    {
        name: 'Humid Subtropical',
        color: '#66BB6A',
        lat: 33.5,
        lng: -84.0,
        states: ['Georgia', 'Alabama', 'Louisiana', 'South Carolina', 'Florida (north)'],
        description: 'Hot, humid summers and mild winters.',
        temps: { winter: '40°F to 55°F', summer: '80°F to 95°F' },
        precip: '40-60 inches/year',
        features: 'Long growing season, occasional hurricanes, Spanish moss'
    },
    {
        name: 'Semi-Arid (Steppe)',
        color: '#FFA726',
        lat: 41.0,
        lng: -104.0,
        states: ['Wyoming', 'Montana', 'Colorado', 'Kansas', 'Nebraska'],
        description: 'Dry climate with hot summers and cold winters.',
        temps: { winter: '15°F to 35°F', summer: '75°F to 95°F' },
        precip: '10-20 inches/year',
        features: 'Grasslands, ranching country, dramatic temperature swings'
    },
    {
        name: 'Desert (Arid)',
        color: '#EF5350',
        lat: 34.0,
        lng: -112.0,
        states: ['Arizona', 'Nevada', 'New Mexico', 'Utah (south)'],
        description: 'Very hot, very dry with mild winters.',
        temps: { winter: '40°F to 60°F', summer: '95°F to 115°F' },
        precip: 'Less than 10 inches/year',
        features: 'Cacti, sand dunes, dramatic rock formations'
    },
    {
        name: 'Mediterranean',
        color: '#7E57C2',
        lat: 37.0,
        lng: -122.0,
        states: ['California (coast)'],
        description: 'Dry, warm summers and mild, wet winters.',
        temps: { winter: '45°F to 60°F', summer: '65°F to 85°F' },
        precip: '15-25 inches/year (mostly winter)',
        features: 'Year-round sunshine, vineyards, mild temperatures'
    },
    {
        name: 'Marine West Coast',
        color: '#26A69A',
        lat: 47.5,
        lng: -122.5,
        states: ['Washington', 'Oregon', 'Northern California'],
        description: 'Mild, rainy winters and cool, dry summers.',
        temps: { winter: '35°F to 50°F', summer: '60°F to 75°F' },
        precip: '30-60 inches/year',
        features: 'Rainforests, evergreen trees, frequent clouds'
    },
    {
        name: 'Tropical',
        color: '#EC407A',
        lat: 25.5,
        lng: -80.5,
        states: ['Hawaii', 'Florida (south)', 'Puerto Rico'],
        description: 'Warm and humid year-round with a wet season.',
        temps: { winter: '70°F to 80°F', summer: '80°F to 90°F' },
        precip: '40-100+ inches/year',
        features: 'Palm trees, beaches, hurricane season'
    }
];

const quizQuestions = [
    { q: 'Which climate has permafrost and northern lights?', a: 'Subarctic' },
    { q: 'Which climate is known for vineyards and dry summers?', a: 'Mediterranean' },
    { q: 'Where would you find cacti and sand dunes?', a: 'Desert (Arid)' },
    { q: 'Which climate has rainforests and frequent clouds?', a: 'Marine West Coast' },
    { q: 'Where are hurricanes most common?', a: 'Tropical' },
    { q: 'Which climate has four distinct seasons and lake effect snow?', a: 'Humid Continental' },
    { q: 'Where is the growing season longest in the Southeast?', a: 'Humid Subtropical' },
    { q: 'Which climate covers the Great Plains grasslands?', a: 'Semi-Arid (Steppe)' }
];

let map;
let markers = [];
let info;
let quizMode = false;
let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 5;

function init() {
    // Initialize map centered on US
    map = L.map('map', {
        center: [39.8, -98.5],
        zoom: 3,
        minZoom: 2,
        maxZoom: 6
    });

    // Add tile layer
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
    info.update = function(climate) {
        if (climate) {
            this._div.innerHTML = `
                <h4 style="color: ${climate.color}">${climate.name}</h4>
                <p>${climate.description}</p>
                <p><span class="stat">Winter:</span> ${climate.temps.winter}</p>
                <p><span class="stat">Summer:</span> ${climate.temps.summer}</p>
                <p><span class="stat">Precipitation:</span> ${climate.precip}</p>
                <p><span class="stat">Features:</span> ${climate.features}</p>
                <p><span class="stat">States:</span> ${climate.states.join(', ')}</p>
            `;
        } else {
            this._div.innerHTML = '<p style="color: #888; font-style: italic;">Click a marker to see climate details</p>';
        }
    };
    info.addTo(map);

    // Add climate zone markers
    addClimateMarkers();

    // Add climate region overlays (simplified polygons)
    addClimateRegions();

    // Setup controls
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

function addClimateMarkers() {
    climateData.forEach(climate => {
        const icon = L.divIcon({
            className: 'climate-marker',
            html: `<div style="
                background: ${climate.color};
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 10px;
                font-weight: bold;
            "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const marker = L.marker([climate.lat, climate.lng], { icon })
            .addTo(map)
            .on('click', () => {
                if (!quizMode) {
                    info.update(climate);
                    highlightRegion(climate.name);
                }
            });

        marker.bindTooltip(climate.name, {
            permanent: false,
            direction: 'top',
            offset: [0, -10]
        });

        markers.push({ marker, climate });
    });
}

function addClimateRegions() {
    // Simplified climate region polygons
    const regions = {
        'Subarctic': [[70, -170], [70, -140], [60, -140], [55, -165], [60, -170]],
        'Humid Continental': [[49, -95], [49, -67], [40, -67], [38, -80], [40, -95]],
        'Humid Subtropical': [[38, -100], [38, -75], [30, -75], [25, -85], [30, -100]],
        'Semi-Arid (Steppe)': [[49, -115], [49, -95], [35, -100], [35, -110], [40, -115]],
        'Desert (Arid)': [[40, -120], [40, -103], [30, -103], [30, -115], [35, -120]],
        'Mediterranean': [[42, -124], [42, -120], [34, -117], [32, -120], [35, -124]],
        'Marine West Coast': [[49, -125], [49, -120], [40, -120], [40, -125]],
        'Tropical': [[28, -82], [28, -79], [24, -79], [24, -82]]
    };

    Object.entries(regions).forEach(([name, coords]) => {
        const climate = climateData.find(c => c.name === name);
        if (climate) {
            L.polygon(coords, {
                color: climate.color,
                weight: 2,
                opacity: 0.8,
                fillColor: climate.color,
                fillOpacity: 0.2,
                className: `region-${name.replace(/[^a-zA-Z]/g, '')}`
            }).addTo(map)
            .on('click', () => {
                if (!quizMode) {
                    info.update(climate);
                }
            });
        }
    });
}

function highlightRegion(name) {
    // Visual feedback when a region is selected
    map.eachLayer(layer => {
        if (layer instanceof L.Polygon) {
            const climate = climateData.find(c => c.name === name);
            if (climate && layer.options.fillColor === climate.color) {
                layer.setStyle({ fillOpacity: 0.5 });
                setTimeout(() => layer.setStyle({ fillOpacity: 0.2 }), 500);
            }
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

    // Generate options
    const options = [q.a];
    const otherClimates = climateData.map(c => c.name).filter(n => n !== q.a);
    while (options.length < 4) {
        const random = otherClimates[Math.floor(Math.random() * otherClimates.length)];
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
    map.setView([39.8, -98.5], 3);
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
