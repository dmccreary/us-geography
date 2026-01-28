/* US Oceans MicroSim */

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
        features: 'Warm Gulf Stream, hurricane formation, important fishing grounds'
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
        features: 'Cool California Current, abundant marine life, volcanic islands'
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
        features: 'Warm water year-round, oil platforms, shrimp fishing, barrier islands'
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
        features: 'Sea ice, permafrost coast, polar wildlife, midnight sun'
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

function init() {
    // Initialize map centered on US and oceans
    map = L.map('map', {
        center: [35, -100],
        zoom: 3,
        minZoom: 2,
        maxZoom: 6
    });

    // Add tile layer with water emphasis
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

    // Add ocean regions
    addOceanRegions();

    // Add markers for each ocean
    addOceanMarkers();

    // Setup controls
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

function addOceanRegions() {
    // Simplified ocean boundary polygons
    const oceanBounds = {
        'Atlantic Ocean': [
            [50, -80], [50, -50], [25, -40], [10, -60],
            [25, -80], [35, -75], [45, -75]
        ],
        'Pacific Ocean': [
            [60, -180], [60, -120], [35, -115], [20, -120],
            [10, -150], [20, -180], [40, -180]
        ],
        'Gulf of Mexico': [
            [30, -98], [30, -82], [22, -84], [18, -88],
            [20, -98], [25, -98]
        ],
        'Arctic Ocean': [
            [72, -180], [72, -130], [68, -130], [68, -180]
        ]
    };

    oceanData.forEach(ocean => {
        const bounds = oceanBounds[ocean.name];
        if (bounds) {
            const polygon = L.polygon(bounds, {
                color: ocean.color,
                weight: 3,
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
