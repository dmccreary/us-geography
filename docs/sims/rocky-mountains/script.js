/* Rocky Mountains MicroSim */

const rockyMountainStates = [
    { name: 'Montana', abbr: 'MT', lat: 47.0, lng: -110.5, inRockies: true },
    { name: 'Idaho', abbr: 'ID', lat: 44.0, lng: -114.5, inRockies: true },
    { name: 'Wyoming', abbr: 'WY', lat: 43.0, lng: -107.5, inRockies: true },
    { name: 'Colorado', abbr: 'CO', lat: 39.0, lng: -105.5, inRockies: true },
    { name: 'Utah', abbr: 'UT', lat: 39.5, lng: -111.5, inRockies: true },
    { name: 'New Mexico', abbr: 'NM', lat: 34.5, lng: -106.0, inRockies: true }
];

const majorPeaks = [
    { name: 'Mt. Elbert', state: 'Colorado', lat: 39.12, lng: -106.45, elevation: '14,440 ft', desc: 'Highest peak in the Rocky Mountains' },
    { name: 'Mt. Massive', state: 'Colorado', lat: 39.19, lng: -106.48, elevation: '14,428 ft', desc: 'Second highest in the Rockies' },
    { name: 'Longs Peak', state: 'Colorado', lat: 40.26, lng: -105.62, elevation: '14,259 ft', desc: 'Iconic peak in Rocky Mountain National Park' },
    { name: 'Gannet Peak', state: 'Wyoming', lat: 43.18, lng: -109.65, elevation: '13,804 ft', desc: 'Highest in Wyoming' },
    { name: 'Grand Teton', state: 'Wyoming', lat: 43.74, lng: -110.80, elevation: '13,775 ft', desc: 'Famous pointed peak' },
    { name: 'Wheeler Peak', state: 'New Mexico', lat: 36.56, lng: -105.42, elevation: '13,167 ft', desc: 'Highest in New Mexico' },
    { name: 'Granite Peak', state: 'Montana', lat: 45.16, lng: -109.81, elevation: '12,807 ft', desc: 'Highest in Montana' },
    { name: 'Borah Peak', state: 'Idaho', lat: 44.14, lng: -113.78, elevation: '12,662 ft', desc: 'Highest in Idaho' },
    { name: 'Kings Peak', state: 'Utah', lat: 40.77, lng: -110.37, elevation: '13,534 ft', desc: 'Highest in Utah' }
];

// Rocky Mountain spine coordinates (simplified)
const rockyMountainPath = [
    [60, -125], [55, -120], [52, -117], [49, -114.5],
    [48, -114], [46, -112], [44, -110], [42, -108],
    [40, -106], [38, -106], [36, -106], [34, -106], [32, -107]
];

// Continental Divide coordinates
const continentalDividePath = [
    [49, -114], [47, -112.5], [45, -110], [43, -109.5],
    [41, -107], [40, -106], [39, -106], [38, -106],
    [36, -106], [35, -106.5], [33, -108], [31, -108]
];

const quizQuestions = [
    { q: 'Which peak is the highest in the Rocky Mountains?', a: 'Mt. Elbert' },
    { q: 'How many US states do the Rockies pass through?', a: '6', opts: ['4', '5', '6', '8'] },
    { q: 'What divides rivers flowing east from those flowing west?', a: 'Continental Divide' },
    { q: 'When did the Rocky Mountains form?', a: '80-55 million years ago', opts: ['80-55 million years ago', '1 million years ago', '480 million years ago', '10,000 years ago'] },
    { q: 'Which state has the most "fourteeners" (peaks over 14,000 ft)?', a: 'Colorado' },
    { q: 'What famous national park is in the Colorado Rockies?', a: 'Rocky Mountain National Park', opts: ['Rocky Mountain National Park', 'Yellowstone', 'Glacier', 'Grand Canyon'] },
    { q: 'Which is the highest peak in Wyoming?', a: 'Gannet Peak' },
    { q: 'What animals live in the Rocky Mountains?', a: 'All of these', opts: ['Elk', 'Grizzly bears', 'Bighorn sheep', 'All of these'] }
];

let map;
let mountainLine;
let divideLine;
let peakMarkers = [];
let showDivide = false;
let info;
let quizMode = false;
let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 6;

function init() {
    map = L.map('map', {
        center: [42, -108],
        zoom: 4,
        minZoom: 3,
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
            if (data.type === 'peak') {
                this._div.innerHTML = `
                    <h4>▲ ${data.name}</h4>
                    <p><span class="stat">State:</span> ${data.state}</p>
                    <p><span class="stat">Elevation:</span> ${data.elevation}</p>
                    <p>${data.desc}</p>
                `;
            } else if (data.type === 'divide') {
                this._div.innerHTML = `
                    <h4>Continental Divide</h4>
                    <p>The Continental Divide runs along the Rocky Mountains.</p>
                    <p><span class="stat">West side:</span> Rivers flow to the Pacific Ocean</p>
                    <p><span class="stat">East side:</span> Rivers flow to the Atlantic Ocean or Gulf of Mexico</p>
                `;
            } else {
                this._div.innerHTML = `
                    <h4>Rocky Mountains</h4>
                    <p>America's largest mountain range stretching from Canada to New Mexico.</p>
                    <p><span class="stat">Age:</span> 80-55 million years old</p>
                    <p><span class="stat">States:</span> MT, ID, WY, CO, UT, NM</p>
                    <p><span class="stat">Highest Peak:</span> Mt. Elbert (14,440 ft)</p>
                `;
            }
        } else {
            this._div.innerHTML = '<p style="color: #888; font-style: italic;">Click on mountains or peaks</p>';
        }
    };
    info.addTo(map);

    // Add Rocky Mountain range
    addMountainRange();

    // Add peak markers
    addPeakMarkers();

    // Add state labels for Rocky Mountain states
    addStateLabels();

    // Setup controls
    document.getElementById('divideBtn').addEventListener('click', toggleDivide);
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);

    info.update({ type: 'range' });
}

function addMountainRange() {
    // Mountain range as a thick line with gradient effect
    mountainLine = L.polyline(rockyMountainPath, {
        color: '#8B4513',
        weight: 12,
        opacity: 0.7,
        lineCap: 'round',
        lineJoin: 'round'
    }).addTo(map);

    mountainLine.on('click', () => {
        if (!quizMode) info.update({ type: 'range' });
    });

    // Add a buffer zone to show the mountain area
    const mountainArea = [
        [60, -127], [55, -122], [52, -119], [49, -116.5],
        [48, -116], [46, -114], [44, -112], [42, -110],
        [40, -108], [38, -108], [36, -108], [34, -108], [32, -109],
        [32, -105], [34, -104], [36, -104], [38, -104],
        [40, -104], [42, -106], [44, -108], [46, -110],
        [48, -112], [49, -112.5], [52, -115], [55, -118], [60, -123]
    ];

    L.polygon(mountainArea, {
        color: '#8B4513',
        weight: 1,
        fillColor: '#A1887F',
        fillOpacity: 0.2
    }).addTo(map).on('click', () => {
        if (!quizMode) info.update({ type: 'range' });
    });

    // Continental Divide (hidden initially)
    divideLine = L.polyline(continentalDividePath, {
        color: '#FF5722',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5'
    });

    divideLine.on('click', () => {
        if (!quizMode) info.update({ type: 'divide' });
    });
}

function addPeakMarkers() {
    majorPeaks.forEach(peak => {
        const icon = L.divIcon({
            className: 'peak-marker',
            html: '<span style="font-size: 16px; color: #5D4037; text-shadow: 1px 1px white;">▲</span>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        const marker = L.marker([peak.lat, peak.lng], { icon })
            .addTo(map)
            .on('click', () => {
                if (!quizMode) {
                    info.update({ type: 'peak', ...peak });
                    highlightPeak(peak.name);
                }
            });

        marker.bindTooltip(`${peak.name} (${peak.elevation})`, {
            permanent: false,
            direction: 'top'
        });

        peakMarkers.push({ marker, peak });
    });
}

function addStateLabels() {
    rockyMountainStates.forEach(state => {
        const icon = L.divIcon({
            className: 'state-label',
            html: `<div style="
                background: rgba(255,255,255,0.8);
                padding: 2px 5px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
                color: #5D4037;
                border: 1px solid #8D6E63;
            ">${state.abbr}</div>`,
            iconSize: [25, 18],
            iconAnchor: [12, 9]
        });

        L.marker([state.lat, state.lng], { icon, interactive: false }).addTo(map);
    });
}

function highlightPeak(name) {
    peakMarkers.forEach(({ marker, peak }) => {
        if (peak.name === name) {
            const origIcon = marker.getIcon();
            const highlightIcon = L.divIcon({
                className: 'peak-marker-highlight',
                html: '<span style="font-size: 24px; color: #D84315; text-shadow: 2px 2px white;">▲</span>',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });
            marker.setIcon(highlightIcon);
            setTimeout(() => marker.setIcon(origIcon), 800);
        }
    });
}

function toggleDivide() {
    showDivide = !showDivide;
    const btn = document.getElementById('divideBtn');
    btn.classList.toggle('active', showDivide);

    if (showDivide) {
        divideLine.addTo(map);
        info.update({ type: 'divide' });
    } else {
        map.removeLayer(divideLine);
        info.update({ type: 'range' });
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
        options = [q.a];
        const otherPeaks = majorPeaks.map(p => p.name).filter(n => n !== q.a);
        while (options.length < 4) {
            const random = otherPeaks[Math.floor(Math.random() * otherPeaks.length)];
            if (!options.includes(random)) options.push(random);
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

function resetView() {
    quizMode = false;
    showDivide = false;
    document.getElementById('quizBtn').classList.remove('active');
    document.getElementById('divideBtn').classList.remove('active');
    document.getElementById('quizPanel').classList.add('hidden');
    if (map.hasLayer(divideLine)) map.removeLayer(divideLine);
    map.setView([42, -108], 4);
    info.update({ type: 'range' });
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
