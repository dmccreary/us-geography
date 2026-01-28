/* Alaska and Hawaii MicroSim */

const alaskaData = {
    name: 'Alaska',
    capital: 'Juneau',
    nickname: 'The Last Frontier',
    area: '663,300 sq mi',
    population: '733,000',
    highPoint: 'Denali (20,310 ft) - highest in North America',
    climate: 'Subarctic to Arctic',
    statehood: '1959 (49th state)',
    funFacts: [
        'Alaska is bigger than Texas, California, and Montana combined!',
        'The sun doesn\'t set for 84 days in summer in Barrow',
        'Alaska has more coastline than all other US states combined',
        'You can see Russia from parts of Alaska'
    ],
    features: [
        { name: 'Denali', lat: 63.07, lng: -151.01, icon: '🏔️', desc: 'Highest peak in North America at 20,310 feet' },
        { name: 'Juneau (Capital)', lat: 58.30, lng: -134.42, icon: '🏛️', desc: 'Only US capital not connected by road' },
        { name: 'Anchorage', lat: 61.22, lng: -149.90, icon: '🏙️', desc: 'Largest city, home to 40% of Alaskans' },
        { name: 'Glacier Bay', lat: 58.67, lng: -136.90, icon: '🧊', desc: 'Massive glaciers and marine wildlife' },
        { name: 'Arctic Circle', lat: 66.56, lng: -153.00, icon: '❄️', desc: 'Land of midnight sun and polar nights' },
        { name: 'Fairbanks', lat: 64.84, lng: -147.72, icon: '🌌', desc: 'Best place to see northern lights' }
    ]
};

const hawaiiData = {
    name: 'Hawaii',
    capital: 'Honolulu',
    nickname: 'The Aloha State',
    area: '10,932 sq mi',
    population: '1.4 million',
    highPoint: 'Mauna Kea (13,796 ft)',
    climate: 'Tropical',
    statehood: '1959 (50th state)',
    funFacts: [
        'Hawaii is the only US state made entirely of islands',
        'Hawaii is the only state that grows coffee commercially',
        'The Big Island is still growing from volcanic activity',
        'Hawaii has its own time zone (no daylight saving time)'
    ],
    islands: [
        { name: 'Hawaii (Big Island)', lat: 19.55, lng: -155.50, icon: '🌋', desc: 'Largest island with active volcanoes', size: '4,028 sq mi' },
        { name: 'Maui', lat: 20.80, lng: -156.32, icon: '🏝️', desc: 'Valley Isle known for Haleakala crater', size: '727 sq mi' },
        { name: 'Oahu', lat: 21.47, lng: -157.98, icon: '🏙️', desc: 'Home to Honolulu and Pearl Harbor', size: '597 sq mi' },
        { name: 'Kauai', lat: 22.05, lng: -159.50, icon: '🌴', desc: 'Garden Isle - oldest main island', size: '562 sq mi' },
        { name: 'Molokai', lat: 21.13, lng: -157.02, icon: '🏝️', desc: 'Friendly Isle with traditional culture', size: '260 sq mi' },
        { name: 'Lanai', lat: 20.83, lng: -156.92, icon: '🏝️', desc: 'Pineapple Isle', size: '141 sq mi' }
    ]
};

const quizQuestions = [
    { q: 'Which is the largest US state by area?', a: 'Alaska' },
    { q: 'Which state is made entirely of islands?', a: 'Hawaii' },
    { q: 'What is the highest peak in North America?', a: 'Denali', opts: ['Denali', 'Mount Whitney', 'Mauna Kea', 'Mount Rainier'] },
    { q: 'Which state has active volcanoes?', a: 'Hawaii' },
    { q: 'Which capital city is not connected by road?', a: 'Juneau', opts: ['Juneau', 'Honolulu', 'Anchorage', 'Fairbanks'] },
    { q: 'Which state joined the US in 1959 as the 49th state?', a: 'Alaska' },
    { q: 'Which Hawaiian island is the largest?', a: 'Big Island', opts: ['Big Island', 'Maui', 'Oahu', 'Kauai'] },
    { q: 'Where can you see the northern lights in the US?', a: 'Alaska' },
    { q: 'Which state has a tropical climate?', a: 'Hawaii' },
    { q: 'Which state has more coastline than all others combined?', a: 'Alaska' }
];

let map;
let markers = [];
let info;
let currentView = 'alaska';
let quizMode = false;
let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 6;

function init() {
    map = L.map('map', {
        center: [64, -153],
        zoom: 3,
        minZoom: 2,
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
    info.update = function(data) {
        if (data) {
            if (data.type === 'state') {
                this._div.innerHTML = `
                    <h4>${data.name}</h4>
                    <p><span class="stat">Capital:</span> ${data.capital}</p>
                    <p><span class="stat">Nickname:</span> ${data.nickname}</p>
                    <p><span class="stat">Area:</span> ${data.area}</p>
                    <p><span class="stat">Population:</span> ${data.population}</p>
                    <p><span class="stat">Highest Point:</span> ${data.highPoint}</p>
                    <p><span class="stat">Climate:</span> ${data.climate}</p>
                    <p><span class="stat">Fun Fact:</span> ${data.funFacts[0]}</p>
                `;
            } else {
                this._div.innerHTML = `
                    <h4>${data.icon} ${data.name}</h4>
                    <p>${data.desc}</p>
                    ${data.size ? `<p><span class="stat">Size:</span> ${data.size}</p>` : ''}
                `;
            }
        } else {
            this._div.innerHTML = '<p style="color: #888; font-style: italic;">Click on a feature to see details</p>';
        }
    };
    info.addTo(map);

    // Show Alaska initially
    showAlaska();

    // Setup controls
    document.getElementById('alaskaBtn').addEventListener('click', showAlaska);
    document.getElementById('hawaiiBtn').addEventListener('click', showHawaii);
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
}

function clearMarkers() {
    markers.forEach(({ marker }) => map.removeLayer(marker));
    markers = [];
}

function showAlaska() {
    currentView = 'alaska';
    document.getElementById('alaskaBtn').classList.add('active');
    document.getElementById('hawaiiBtn').classList.remove('active');

    clearMarkers();
    map.setView([64, -153], 3);

    // Add Alaska outline (simplified)
    const alaskaBounds = [
        [71, -168], [71, -141], [60, -141], [55, -130],
        [54, -164], [52, -172], [57, -170], [65, -168]
    ];

    const alaskaPolygon = L.polygon(alaskaBounds, {
        color: '#5C6BC0',
        weight: 2,
        fillColor: '#5C6BC0',
        fillOpacity: 0.2
    }).addTo(map);

    alaskaPolygon.on('click', () => {
        if (!quizMode) {
            info.update({ type: 'state', ...alaskaData });
        }
    });

    markers.push({ marker: alaskaPolygon, data: alaskaData });

    // Add feature markers
    alaskaData.features.forEach(feature => {
        const icon = L.divIcon({
            className: 'feature-marker',
            html: `<span style="font-size: 20px;">${feature.icon}</span>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([feature.lat, feature.lng], { icon })
            .addTo(map)
            .on('click', () => {
                if (!quizMode) info.update(feature);
            });

        marker.bindTooltip(feature.name, { permanent: false, direction: 'top' });
        markers.push({ marker, data: feature });
    });

    info.update({ type: 'state', ...alaskaData });
}

function showHawaii() {
    currentView = 'hawaii';
    document.getElementById('hawaiiBtn').classList.add('active');
    document.getElementById('alaskaBtn').classList.remove('active');

    clearMarkers();
    map.setView([20.5, -157], 6);

    // Add island markers
    hawaiiData.islands.forEach(island => {
        const icon = L.divIcon({
            className: 'island-marker',
            html: `<span style="font-size: 20px;">${island.icon}</span>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([island.lat, island.lng], { icon })
            .addTo(map)
            .on('click', () => {
                if (!quizMode) info.update(island);
            });

        marker.bindTooltip(island.name, { permanent: false, direction: 'top' });

        // Add island circle representation
        const circle = L.circle([island.lat, island.lng], {
            color: '#26A69A',
            fillColor: '#26A69A',
            fillOpacity: 0.3,
            radius: Math.sqrt(parseFloat(island.size) * 1000000)
        }).addTo(map);

        circle.on('click', () => {
            if (!quizMode) info.update(island);
        });

        markers.push({ marker, data: island });
        markers.push({ marker: circle, data: island });
    });

    info.update({ type: 'state', ...hawaiiData });
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
    let options;
    if (q.opts) {
        options = [...q.opts];
    } else {
        options = [q.a, 'Alaska', 'Hawaii'].filter((v, i, a) => a.indexOf(v) === i);
        while (options.length < 3) {
            const extras = ['Texas', 'California', 'Florida'];
            options.push(extras[options.length - 2]);
        }
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

    if (score === TOTAL_QUESTIONS) celebrate();
}

function resetQuiz() {
    quizMode = false;
    document.getElementById('quizBtn').classList.remove('active');
    document.getElementById('quizPanel').classList.add('hidden');
    if (currentView === 'alaska') showAlaska();
    else showHawaii();
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
