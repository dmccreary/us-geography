/* US Agricultural Regions MicroSim */

const agriculturalRegions = [
    {
        name: 'Corn Belt',
        type: 'grain',
        color: '#FFD54F',
        coords: [
            [44, -96], [44, -86], [40, -82], [38, -84],
            [38, -92], [40, -96], [44, -96]
        ],
        states: 'Iowa, Illinois, Indiana, Ohio, Nebraska',
        crops: 'Corn, Soybeans',
        production: '40% of US corn',
        fact: 'The heartland of American agriculture',
        icon: '🌽'
    },
    {
        name: 'Wheat Belt',
        type: 'grain',
        color: '#FFCC80',
        coords: [
            [49, -104], [49, -97], [42, -96], [35, -97],
            [35, -103], [40, -104], [49, -104]
        ],
        states: 'Kansas, North Dakota, Montana, Oklahoma',
        crops: 'Winter Wheat, Spring Wheat',
        production: '50% of US wheat',
        fact: 'Great Plains breadbasket',
        icon: '🌾'
    },
    {
        name: 'Cotton Belt',
        type: 'other',
        color: '#81C784',
        coords: [
            [35, -100], [35, -78], [32, -78], [30, -82],
            [30, -95], [32, -100], [35, -100]
        ],
        states: 'Texas, Georgia, Mississippi, Alabama',
        crops: 'Cotton, Peanuts, Tobacco',
        production: '65% of US cotton',
        fact: 'Historic southern agriculture',
        icon: '🌿'
    },
    {
        name: 'Dairy Belt',
        type: 'other',
        color: '#64B5F6',
        coords: [
            [47, -93], [47, -72], [43, -72], [42, -78],
            [43, -87], [44, -93], [47, -93]
        ],
        states: 'Wisconsin, Minnesota, New York, Vermont',
        crops: 'Dairy Cattle, Hay, Corn Silage',
        production: '25% of US milk',
        fact: 'Americas Dairyland',
        icon: '🐄'
    },
    {
        name: 'Central Valley',
        type: 'other',
        color: '#BA68C8',
        coords: [
            [40, -122], [40, -119], [35, -118], [35, -121],
            [37, -122], [40, -122]
        ],
        states: 'California',
        crops: 'Fruits, Vegetables, Nuts, Wine Grapes',
        production: '25% of US food',
        fact: 'Most productive agricultural region',
        icon: '🍇'
    },
    {
        name: 'Citrus Region',
        type: 'other',
        color: '#FFB74D',
        coords: [
            [30, -82], [30, -80], [26, -80], [25, -81],
            [26, -82], [30, -82]
        ],
        states: 'Florida, California',
        crops: 'Oranges, Grapefruit, Lemons',
        production: '70% of US citrus',
        fact: 'Sunshine and citrus',
        icon: '🍊'
    },
    {
        name: 'Rice Belt',
        type: 'grain',
        color: '#A5D6A7',
        coords: [
            [35, -92], [35, -89], [31, -89], [30, -91],
            [30, -94], [33, -94], [35, -92]
        ],
        states: 'Arkansas, Louisiana, Mississippi',
        crops: 'Rice, Soybeans',
        production: '50% of US rice',
        fact: 'Delta rice country',
        icon: '🍚'
    },
    {
        name: 'Potato Region',
        type: 'other',
        color: '#BCAAA4',
        coords: [
            [47, -117], [47, -111], [42, -111], [42, -117],
            [44, -117], [47, -117]
        ],
        states: 'Idaho, Washington, Oregon',
        crops: 'Potatoes, Onions, Sugar Beets',
        production: '30% of US potatoes',
        fact: 'Famous Idaho potatoes',
        icon: '🥔'
    }
];

const quizQuestions = [
    { q: 'Which region produces 40% of US corn?', a: 'Corn Belt', opts: ['Corn Belt', 'Wheat Belt', 'Cotton Belt', 'Rice Belt'] },
    { q: 'Which state is famous for potatoes?', a: 'Idaho', opts: ['Idaho', 'Iowa', 'Kansas', 'Nebraska'] },
    { q: 'Where is most US citrus grown?', a: 'Florida and California', opts: ['Florida and California', 'Texas and Arizona', 'Georgia and Alabama', 'Louisiana and Mississippi'] },
    { q: 'Which region produces most US wheat?', a: 'Wheat Belt', opts: ['Wheat Belt', 'Corn Belt', 'Great Plains', 'Midwest'] },
    { q: 'What crop is the Cotton Belt famous for?', a: 'Cotton', opts: ['Cotton', 'Corn', 'Wheat', 'Rice'] },
    { q: 'Which valley produces 25% of US food?', a: 'Central Valley, California', opts: ['Central Valley, California', 'San Joaquin Valley', 'Great Valley, Virginia', 'Rio Grande Valley'] },
    { q: 'Wisconsin is known as "Americas ___"?', a: 'Dairyland', opts: ['Dairyland', 'Breadbasket', 'Cornfield', 'Farmland'] },
    { q: 'Where is most US rice grown?', a: 'Arkansas and Louisiana', opts: ['Arkansas and Louisiana', 'California', 'Texas', 'Mississippi'] }
];

let map;
let regionLayers = [];
let info;
let quizMode = false;
let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 6;
let currentView = 'all';

function init() {
    map = L.map('map', {
        center: [39, -96],
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
    info.update = function(data) {
        if (data) {
            this._div.innerHTML = `
                <h4>${data.icon} ${data.name}</h4>
                <p><span class="stat">States:</span> ${data.states}</p>
                <p><span class="stat">Main Crops:</span> ${data.crops}</p>
                <p><span class="stat">Production:</span> ${data.production}</p>
                <p>${data.fact}</p>
            `;
        } else {
            this._div.innerHTML = `
                <h4>US Agriculture</h4>
                <p><span class="stat">Value:</span> $400+ billion/year</p>
                <p><span class="stat">Farmland:</span> 900 million acres</p>
                <p><span class="stat">Farms:</span> 2 million</p>
                <p>Click regions to explore crops</p>
            `;
        }
    };
    info.addTo(map);

    // Add agricultural regions
    addRegions();

    // Setup controls
    document.getElementById('allBtn').addEventListener('click', () => showView('all'));
    document.getElementById('grainBtn').addEventListener('click', () => showView('grain'));
    document.getElementById('otherBtn').addEventListener('click', () => showView('other'));
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);

    info.update(null);
}

function addRegions() {
    agriculturalRegions.forEach(region => {
        const layer = L.polygon(region.coords, {
            color: region.color,
            weight: 2,
            fillColor: region.color,
            fillOpacity: 0.5
        });

        layer.on('click', () => {
            if (!quizMode) {
                info.update(region);
                highlightRegion(region.name);
            }
        });

        layer.bindTooltip(`${region.icon} ${region.name}`, {
            permanent: false,
            direction: 'center'
        });

        // Add label marker
        const center = getPolygonCenter(region.coords);
        const labelIcon = L.divIcon({
            className: 'region-label',
            html: `<div style="
                background: rgba(255,255,255,0.9);
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
                color: #333;
                border: 1px solid ${region.color};
                white-space: nowrap;
            ">${region.icon} ${region.name}</div>`,
            iconSize: [80, 20],
            iconAnchor: [40, 10]
        });

        const labelMarker = L.marker(center, { icon: labelIcon, interactive: false });

        regionLayers.push({
            polygon: layer,
            label: labelMarker,
            type: region.type,
            data: region
        });
    });

    showView('all');
}

function getPolygonCenter(coords) {
    let latSum = 0, lngSum = 0;
    coords.forEach(([lat, lng]) => {
        latSum += lat;
        lngSum += lng;
    });
    return [latSum / coords.length, lngSum / coords.length];
}

function highlightRegion(name) {
    regionLayers.forEach(({ polygon, data }) => {
        if (data.name === name) {
            polygon.setStyle({ weight: 4, fillOpacity: 0.7 });
            setTimeout(() => {
                polygon.setStyle({ weight: 2, fillOpacity: 0.5 });
            }, 800);
        }
    });
}

function showView(view) {
    currentView = view;

    // Update button states
    document.getElementById('allBtn').classList.toggle('active', view === 'all');
    document.getElementById('grainBtn').classList.toggle('active', view === 'grain');
    document.getElementById('otherBtn').classList.toggle('active', view === 'other');

    // Clear all layers
    regionLayers.forEach(({ polygon, label }) => {
        map.removeLayer(polygon);
        map.removeLayer(label);
    });

    // Add appropriate layers
    regionLayers.forEach(({ polygon, label, type }) => {
        if (view === 'all' || view === type) {
            polygon.addTo(map);
            label.addTo(map);
        }
    });

    info.update(null);
}

function startQuiz() {
    quizMode = true;
    currentQuestion = 0;
    score = 0;
    shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);

    document.getElementById('quizBtn').classList.add('active');
    document.getElementById('quizPanel').classList.remove('hidden');
    document.getElementById('starsDisplay').innerHTML = '';

    showView('all');
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
    map.setView([39, -96], 4);
    showView('all');
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
