/* Major US Rivers MicroSim Script */

const MAP_CONFIG = {
    center: [39, -98],
    zoom: 4,
    minZoom: 3,
    maxZoom: 7
};

// Major US Rivers data
const rivers = {
    'Mississippi': {
        coords: [[47.2, -95.2], [44.9, -93.2], [41.5, -90.5], [38.6, -90.2], [35.1, -90.0], [32.3, -91.0], [29.9, -90.1]],
        length: 2340,
        system: 'mississippi',
        facts: 'Longest river in North America. Drains 31 states. Major shipping route.',
        mouth: 'Gulf of Mexico',
        source: 'Lake Itasca, Minnesota'
    },
    'Missouri': {
        coords: [[47.5, -111.5], [46.8, -107.5], [43.0, -98.0], [41.3, -96.0], [39.1, -94.6], [38.8, -90.2]],
        length: 2341,
        system: 'mississippi',
        facts: 'Longest tributary in North America. Lewis and Clark followed it west.',
        mouth: 'Mississippi River near St. Louis',
        source: 'Montana Rockies'
    },
    'Colorado': {
        coords: [[40.5, -105.8], [39.0, -108.5], [37.0, -110.5], [36.0, -112.0], [35.0, -114.5], [32.7, -114.7]],
        length: 1450,
        system: 'other',
        facts: 'Carved the Grand Canyon. Provides water to 40 million people.',
        mouth: 'Gulf of California (Mexico)',
        source: 'Rocky Mountains, Colorado'
    },
    'Columbia': {
        coords: [[51.0, -117.0], [48.5, -118.0], [46.2, -119.3], [46.0, -122.8], [46.2, -124.0]],
        length: 1243,
        system: 'other',
        facts: 'Most powerful river in North America by volume. Major hydroelectric source.',
        mouth: 'Pacific Ocean',
        source: 'British Columbia, Canada'
    },
    'Ohio': {
        coords: [[40.4, -80.0], [39.1, -84.5], [38.0, -85.8], [37.0, -88.5], [37.0, -89.1]],
        length: 981,
        system: 'mississippi',
        facts: 'Most water by volume of any Mississippi tributary. Forms borders of 6 states.',
        mouth: 'Mississippi River at Cairo, IL',
        source: 'Pittsburgh, Pennsylvania'
    },
    'Rio Grande': {
        coords: [[37.5, -105.5], [35.0, -106.5], [31.8, -106.4], [29.5, -104.4], [26.0, -97.5]],
        length: 1896,
        system: 'other',
        facts: 'Forms the border between Texas and Mexico. Fifth longest in North America.',
        mouth: 'Gulf of Mexico',
        source: 'Colorado Rockies'
    }
};

const quizQuestions = [
    { question: "Which is the longest river in North America?", answer: "Mississippi", options: ["Mississippi", "Missouri", "Colorado"] },
    { question: "Which river carved the Grand Canyon?", answer: "Colorado", options: ["Colorado", "Rio Grande", "Columbia"] },
    { question: "Which river forms the Texas-Mexico border?", answer: "Rio Grande", options: ["Rio Grande", "Colorado", "Mississippi"] },
    { question: "Lewis and Clark followed which river west?", answer: "Missouri", options: ["Missouri", "Columbia", "Ohio"] },
    { question: "Which river is the most powerful by water volume?", answer: "Columbia", options: ["Columbia", "Mississippi", "Ohio"] }
];

let map, infoControl;
let quizMode = false, score = 0, currentQuestionIndex = 0;
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 5;

function init() {
    initMap();
    addRivers();
    setupControls();
}

function initMap() {
    map = L.map('map', { zoomControl: true, scrollWheelZoom: true })
        .setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        maxZoom: MAP_CONFIG.maxZoom
    }).addTo(map);

    initInfoControl();
}

function initInfoControl() {
    infoControl = L.control({ position: 'topright' });
    infoControl.onAdd = function() {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };
    infoControl.update = function(riverName) {
        if (!riverName) {
            this._div.innerHTML = '<h4>US Rivers</h4><p>Click on a river to learn about it!</p>';
            return;
        }
        const r = rivers[riverName];
        this._div.innerHTML = `
            <h4>${riverName} River</h4>
            <p><span class="stat">Length:</span> ${r.length.toLocaleString()} miles</p>
            <p><span class="stat">Source:</span> ${r.source}</p>
            <p><span class="stat">Mouth:</span> ${r.mouth}</p>
            <p style="margin-top:8px;">${r.facts}</p>
        `;
    };
    infoControl.addTo(map);
}

function addRivers() {
    Object.keys(rivers).forEach(name => {
        const r = rivers[name];
        const color = r.system === 'mississippi' ? '#1e88e5' : '#43a047';

        // Draw river line
        const line = L.polyline(r.coords, {
            color: color,
            weight: 4,
            opacity: 0.7
        }).addTo(map);

        // Add label at midpoint
        const mid = r.coords[Math.floor(r.coords.length / 2)];
        const label = L.marker(mid, {
            icon: L.divIcon({
                className: 'river-label',
                html: `<div style="font-size:10px;font-weight:bold;color:${color};
                       text-shadow:1px 1px 1px white;white-space:nowrap;">${name}</div>`,
                iconSize: [80, 15],
                iconAnchor: [40, 7]
            })
        }).addTo(map);

        line.on('click', () => {
            infoControl.update(name);
            line.setStyle({ weight: 6, opacity: 1 });
            setTimeout(() => line.setStyle({ weight: 4, opacity: 0.7 }), 2000);
        });

        line.on('mouseover', () => line.setStyle({ weight: 5, opacity: 0.9 }));
        line.on('mouseout', () => line.setStyle({ weight: 4, opacity: 0.7 }));
    });
}

function setupControls() {
    document.getElementById('quizBtn').addEventListener('click', toggleQuiz);
    document.getElementById('resetBtn').addEventListener('click', () => {
        map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
        infoControl.update();
    });
}

function toggleQuiz() {
    quizMode = !quizMode;
    const panel = document.getElementById('quizPanel');
    const btn = document.getElementById('quizBtn');

    if (quizMode) {
        score = 0; currentQuestionIndex = 0;
        shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
        document.getElementById('starsDisplay').innerHTML = '';
        panel.classList.remove('hidden');
        btn.classList.add('active');
        btn.textContent = 'Exit Quiz';
        showNextQuestion();
    } else {
        panel.classList.add('hidden');
        btn.classList.remove('active');
        btn.textContent = 'Quiz Me!';
    }
}

function showNextQuestion() {
    if (currentQuestionIndex >= TOTAL_QUESTIONS) { showComplete(); return; }
    const q = shuffledQuestions[currentQuestionIndex];
    document.getElementById('quizProgress').textContent = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;
    document.getElementById('quizQuestion').textContent = q.question;
    document.getElementById('quizFeedback').textContent = '';

    const opts = document.getElementById('quizOptions');
    opts.innerHTML = '';
    [...q.options].sort(() => Math.random() - 0.5).forEach(o => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = o;
        btn.onclick = () => checkAnswer(o, btn, q.answer);
        opts.appendChild(btn);
    });
}

function checkAnswer(ans, btn, correct) {
    document.querySelectorAll('.quiz-option').forEach(b => b.style.pointerEvents = 'none');
    const fb = document.getElementById('quizFeedback');
    if (ans === correct) {
        btn.classList.add('correct');
        fb.textContent = 'Correct!'; fb.className = 'quiz-feedback correct';
        score++;
        const star = document.createElement('span');
        star.className = 'gold-star'; star.textContent = '★';
        document.getElementById('starsDisplay').appendChild(star);
        setTimeout(() => star.classList.add('animated'), 10);
    } else {
        btn.classList.add('incorrect');
        document.querySelectorAll('.quiz-option').forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
        fb.textContent = `Answer: ${correct}`; fb.className = 'quiz-feedback incorrect';
    }
    currentQuestionIndex++;
    setTimeout(() => { if (quizMode) showNextQuestion(); }, 1500);
}

function showComplete() {
    document.getElementById('quizProgress').textContent = 'Complete!';
    document.getElementById('quizQuestion').textContent = score === TOTAL_QUESTIONS ? '🎉 Perfect! 🎉' : 'Quiz Complete!';
    document.getElementById('quizFeedback').textContent = `${score}/${TOTAL_QUESTIONS} correct`;
    document.getElementById('quizOptions').innerHTML = '<button class="quiz-option" onclick="quizMode=false;toggleQuiz()">Try Again</button>';
    if (score === TOTAL_QUESTIONS) showCelebration();
}

function showCelebration() {
    const c = document.createElement('div'); c.className = 'celebration-container';
    document.body.appendChild(c);
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const s = document.createElement('div'); s.className = 'exploding-star'; s.textContent = '★';
            s.style.left = Math.random()*100+'%'; s.style.top = Math.random()*100+'%';
            s.style.color = ['gold','#1e88e5','cyan'][Math.floor(Math.random()*3)];
            s.style.fontSize = (Math.random()*20+15)+'px';
            c.appendChild(s);
            setTimeout(() => s.remove(), 2000);
        }, i*50);
    }
    setTimeout(() => c.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', init);
