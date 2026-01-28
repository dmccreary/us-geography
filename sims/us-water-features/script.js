/* US Rivers and Lakes MicroSim Script */

const MAP_CONFIG = { center: [39, -98], zoom: 4, minZoom: 3, maxZoom: 7 };

const rivers = {
    'Mississippi': { coords: [[47.2,-95.2],[44.9,-93.2],[41.5,-90.5],[38.6,-90.2],[35.1,-90.0],[32.3,-91.0],[29.9,-90.1]], length: 2340, info: 'Longest US river. Flows to Gulf of Mexico.' },
    'Missouri': { coords: [[47.5,-111.5],[46.8,-107.5],[43.0,-98.0],[41.3,-96.0],[39.1,-94.6],[38.8,-90.2]], length: 2341, info: 'Longest tributary. Joins Mississippi at St. Louis.' },
    'Colorado': { coords: [[40.5,-105.8],[39.0,-108.5],[37.0,-110.5],[36.0,-112.0],[35.0,-114.5],[32.7,-114.7]], length: 1450, info: 'Carved the Grand Canyon. Flows to Gulf of California.' },
    'Columbia': { coords: [[51.0,-117.0],[48.5,-118.0],[46.2,-119.3],[46.0,-122.8],[46.2,-124.0]], length: 1243, info: 'Most powerful US river. Flows to Pacific Ocean.' },
    'Ohio': { coords: [[40.4,-80.0],[39.1,-84.5],[38.0,-85.8],[37.0,-88.5],[37.0,-89.1]], length: 981, info: 'Major tributary. Joins Mississippi at Cairo, IL.' }
};

const lakes = {
    'Superior': { center: [47.5, -87.5], area: 31700, info: 'Largest Great Lake by area.' },
    'Michigan': { center: [43.8, -87.0], area: 22400, info: 'Only Great Lake entirely in US.' },
    'Huron': { center: [44.8, -82.5], area: 23000, info: 'Has over 30,000 islands.' },
    'Erie': { center: [42.2, -81.2], area: 9900, info: 'Shallowest Great Lake.' },
    'Ontario': { center: [43.7, -77.9], area: 7300, info: 'Smallest Great Lake by area.' },
    'Great Salt Lake': { center: [41.0, -112.5], area: 1700, info: 'Largest saltwater lake in Western Hemisphere.' }
};

const quizQuestions = [
    { question: "Which is the longest US river?", answer: "Mississippi", options: ["Mississippi", "Missouri", "Colorado"] },
    { question: "Which Great Lake is entirely in the US?", answer: "Michigan", options: ["Michigan", "Superior", "Erie"] },
    { question: "Which river carved the Grand Canyon?", answer: "Colorado", options: ["Colorado", "Columbia", "Missouri"] },
    { question: "What are the five Great Lakes called?", answer: "HOMES", options: ["HOMES", "LAKES", "GREAT"] },
    { question: "Which is the largest Great Lake?", answer: "Superior", options: ["Superior", "Michigan", "Huron"] },
    { question: "Where does the Mississippi River empty?", answer: "Gulf of Mexico", options: ["Gulf of Mexico", "Atlantic Ocean", "Pacific Ocean"] }
];

let map, infoControl, riverLayers = [], lakeLayers = [];
let showRivers = true, showLakes = true;
let quizMode = false, score = 0, currentQuestionIndex = 0, shuffledQuestions = [];
const TOTAL_QUESTIONS = 6;

function init() {
    initMap();
    addRivers();
    addLakes();
    setupControls();
}

function initMap() {
    map = L.map('map', { zoomControl: true, scrollWheelZoom: true }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO', maxZoom: MAP_CONFIG.maxZoom }).addTo(map);
    initInfoControl();
}

function initInfoControl() {
    infoControl = L.control({ position: 'topright' });
    infoControl.onAdd = function() { this._div = L.DomUtil.create('div', 'info'); this.update(); return this._div; };
    infoControl.update = function(name, type, data) {
        if (!name) { this._div.innerHTML = '<h4>Water Features</h4><p>Click to learn more!</p>'; return; }
        if (type === 'river') {
            this._div.innerHTML = `<h4>${name} River</h4><p><span class="stat">Length:</span> ${data.length.toLocaleString()} mi</p><p>${data.info}</p>`;
        } else {
            this._div.innerHTML = `<h4>Lake ${name}</h4><p><span class="stat">Area:</span> ${data.area.toLocaleString()} sq mi</p><p>${data.info}</p>`;
        }
    };
    infoControl.addTo(map);
}

function addRivers() {
    Object.keys(rivers).forEach(name => {
        const r = rivers[name];
        const line = L.polyline(r.coords, { color: '#1e88e5', weight: 4, opacity: 0.7 }).addTo(map);
        const mid = r.coords[Math.floor(r.coords.length / 2)];
        const label = L.marker(mid, { icon: L.divIcon({ className: 'river-label', html: `<div style="font-size:9px;font-weight:bold;color:#1565c0;text-shadow:1px 1px 1px white;">${name}</div>`, iconSize: [60, 12], iconAnchor: [30, 6] }) }).addTo(map);
        line.on('click', () => { infoControl.update(name, 'river', r); line.setStyle({ weight: 6 }); setTimeout(() => line.setStyle({ weight: 4 }), 2000); });
        line.on('mouseover', () => line.setStyle({ weight: 5 }));
        line.on('mouseout', () => line.setStyle({ weight: 4 }));
        riverLayers.push(line, label);
    });
}

function addLakes() {
    Object.keys(lakes).forEach(name => {
        const l = lakes[name];
        const marker = L.circleMarker(l.center, { radius: 10, fillColor: '#64b5f6', color: 'white', weight: 2, fillOpacity: 0.8 }).addTo(map);
        const label = L.marker(l.center, { icon: L.divIcon({ className: 'lake-label', html: `<div style="font-size:9px;font-weight:bold;color:#1565c0;text-shadow:1px 1px 1px white;">${name}</div>`, iconSize: [60, 12], iconAnchor: [30, -8] }) }).addTo(map);
        marker.on('click', () => { infoControl.update(name, 'lake', l); marker.setStyle({ radius: 13 }); setTimeout(() => marker.setStyle({ radius: 10 }), 2000); });
        marker.on('mouseover', () => marker.setStyle({ radius: 12 }));
        marker.on('mouseout', () => marker.setStyle({ radius: 10 }));
        lakeLayers.push(marker, label);
    });
}

function setupControls() {
    document.getElementById('showRiversBtn').addEventListener('click', function() {
        showRivers = !showRivers; this.classList.toggle('active', showRivers);
        riverLayers.forEach(l => showRivers ? l.addTo(map) : map.removeLayer(l));
    });
    document.getElementById('showLakesBtn').addEventListener('click', function() {
        showLakes = !showLakes; this.classList.toggle('active', showLakes);
        lakeLayers.forEach(l => showLakes ? l.addTo(map) : map.removeLayer(l));
    });
    document.getElementById('quizBtn').addEventListener('click', toggleQuiz);
    document.getElementById('resetBtn').addEventListener('click', () => { map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom); infoControl.update(); });
}

function toggleQuiz() {
    quizMode = !quizMode;
    const panel = document.getElementById('quizPanel'), btn = document.getElementById('quizBtn');
    if (quizMode) {
        score = 0; currentQuestionIndex = 0;
        shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
        document.getElementById('starsDisplay').innerHTML = '';
        panel.classList.remove('hidden'); btn.classList.add('active'); btn.textContent = 'Exit Quiz';
        showNextQuestion();
    } else { panel.classList.add('hidden'); btn.classList.remove('active'); btn.textContent = 'Quiz Me!'; }
}

function showNextQuestion() {
    if (currentQuestionIndex >= TOTAL_QUESTIONS) { showComplete(); return; }
    const q = shuffledQuestions[currentQuestionIndex];
    document.getElementById('quizProgress').textContent = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;
    document.getElementById('quizQuestion').textContent = q.question;
    document.getElementById('quizFeedback').textContent = '';
    const opts = document.getElementById('quizOptions'); opts.innerHTML = '';
    [...q.options].sort(() => Math.random() - 0.5).forEach(o => {
        const b = document.createElement('button'); b.className = 'quiz-option'; b.textContent = o;
        b.onclick = () => checkAnswer(o, b, q.answer); opts.appendChild(b);
    });
}

function checkAnswer(ans, btn, correct) {
    document.querySelectorAll('.quiz-option').forEach(b => b.style.pointerEvents = 'none');
    const fb = document.getElementById('quizFeedback');
    if (ans === correct) {
        btn.classList.add('correct'); fb.textContent = 'Correct!'; fb.className = 'quiz-feedback correct'; score++;
        const s = document.createElement('span'); s.className = 'gold-star'; s.textContent = '★';
        document.getElementById('starsDisplay').appendChild(s); setTimeout(() => s.classList.add('animated'), 10);
    } else {
        btn.classList.add('incorrect');
        document.querySelectorAll('.quiz-option').forEach(b => { if (b.textContent === correct) b.classList.add('correct'); });
        fb.textContent = `Answer: ${correct}`; fb.className = 'quiz-feedback incorrect';
    }
    currentQuestionIndex++; setTimeout(() => { if (quizMode) showNextQuestion(); }, 1500);
}

function showComplete() {
    document.getElementById('quizProgress').textContent = 'Complete!';
    document.getElementById('quizQuestion').textContent = score === TOTAL_QUESTIONS ? '🎉 Perfect! 🎉' : 'Quiz Complete!';
    document.getElementById('quizFeedback').textContent = `${score}/${TOTAL_QUESTIONS} correct`;
    document.getElementById('quizOptions').innerHTML = '<button class="quiz-option" onclick="quizMode=false;toggleQuiz()">Try Again</button>';
    if (score === TOTAL_QUESTIONS) showCelebration();
}

function showCelebration() {
    const c = document.createElement('div'); c.className = 'celebration-container'; document.body.appendChild(c);
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const s = document.createElement('div'); s.className = 'exploding-star'; s.textContent = '★';
            s.style.left = Math.random()*100+'%'; s.style.top = Math.random()*100+'%';
            s.style.color = ['gold','#1e88e5','cyan'][Math.floor(Math.random()*3)];
            s.style.fontSize = (Math.random()*20+15)+'px'; c.appendChild(s);
            setTimeout(() => s.remove(), 2000);
        }, i*50);
    }
    setTimeout(() => c.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', init);
