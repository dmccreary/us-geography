/* Great Lakes System MicroSim Script */

const MAP_CONFIG = {
    center: [44.5, -84],
    zoom: 5,
    minZoom: 4,
    maxZoom: 8
};

// Great Lakes data
const lakes = {
    'Superior': {
        center: [47.5, -87.5],
        area: 31700,
        maxDepth: 1332,
        facts: 'Largest by surface area. Cold, deep, and the cleanest of the Great Lakes.',
        border: 'US (Minnesota, Wisconsin, Michigan) and Canada'
    },
    'Michigan': {
        center: [43.8, -87.0],
        area: 22400,
        maxDepth: 925,
        facts: 'Only Great Lake entirely within the US. Chicago is on its shore.',
        border: 'US only (Michigan, Wisconsin, Illinois, Indiana)'
    },
    'Huron': {
        center: [44.8, -82.5],
        area: 23000,
        maxDepth: 750,
        facts: 'Has over 30,000 islands! Second largest by surface area.',
        border: 'US (Michigan) and Canada (Ontario)'
    },
    'Erie': {
        center: [42.2, -81.2],
        area: 9900,
        maxDepth: 210,
        facts: 'Shallowest and warmest. Most fish of any Great Lake.',
        border: 'US (Michigan, Ohio, Pennsylvania, New York) and Canada'
    },
    'Ontario': {
        center: [43.7, -77.9],
        area: 7300,
        maxDepth: 802,
        facts: 'Smallest by surface area but very deep. Niagara Falls flows into it.',
        border: 'US (New York) and Canada (Ontario)'
    }
};

// Quiz questions
const quizQuestions = [
    { question: "Which is the largest Great Lake?", answer: "Superior", options: ["Superior", "Michigan", "Huron"] },
    { question: "Which Great Lake is entirely in the US?", answer: "Michigan", options: ["Michigan", "Erie", "Ontario"] },
    { question: "Which Great Lake has Niagara Falls?", answer: "Ontario", options: ["Ontario", "Erie", "Huron"] },
    { question: "Which Great Lake is the shallowest?", answer: "Erie", options: ["Erie", "Ontario", "Michigan"] },
    { question: "What word helps remember the lakes? (HOMES)", answer: "HOMES", options: ["HOMES", "LAKES", "GREAT"] }
];

let map, infoControl;
let quizMode = false;
let score = 0;
let shuffledQuestions = [];
let currentQuestionIndex = 0;
const TOTAL_QUESTIONS = 5;

function init() {
    initMap();
    addLakeMarkers();
    setupControls();
}

function initMap() {
    map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

    // Use a satellite/terrain hybrid for better lake visibility
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
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

    infoControl.update = function(lakeName) {
        if (!lakeName) {
            this._div.innerHTML = '<h4>Great Lakes</h4><p>Click on a lake marker to learn about it!</p>' +
                '<p style="margin-top:8px;font-size:11px;">Together they hold 21% of the world\'s fresh surface water.</p>';
            return;
        }

        const lake = lakes[lakeName];
        this._div.innerHTML = `
            <h4>Lake ${lakeName}</h4>
            <p><span class="stat">Area:</span> ${lake.area.toLocaleString()} sq miles</p>
            <p><span class="stat">Max Depth:</span> ${lake.maxDepth} feet</p>
            <p><span class="stat">Borders:</span> ${lake.border}</p>
            <p style="margin-top:8px;">${lake.facts}</p>
        `;
    };

    infoControl.addTo(map);
}

function addLakeMarkers() {
    Object.keys(lakes).forEach(lakeName => {
        const lake = lakes[lakeName];

        const marker = L.circleMarker(lake.center, {
            radius: 12,
            fillColor: '#2196f3',
            color: 'white',
            weight: 3,
            fillOpacity: 0.8
        }).addTo(map);

        // Add label
        const label = L.marker(lake.center, {
            icon: L.divIcon({
                className: 'lake-label',
                html: `<div style="font-size:11px;font-weight:bold;color:#1565c0;
                       text-shadow:1px 1px 2px white,-1px -1px 2px white;white-space:nowrap;">
                       ${lakeName}</div>`,
                iconSize: [80, 20],
                iconAnchor: [40, -10]
            })
        }).addTo(map);

        marker.on('click', () => {
            infoControl.update(lakeName);
            marker.setStyle({ fillOpacity: 1, radius: 15 });

            // Reset other markers
            setTimeout(() => marker.setStyle({ fillOpacity: 0.8, radius: 12 }), 2000);
        });

        marker.on('mouseover', () => {
            marker.setStyle({ fillOpacity: 1, radius: 14 });
        });

        marker.on('mouseout', () => {
            marker.setStyle({ fillOpacity: 0.8, radius: 12 });
        });
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
    const quizPanel = document.getElementById('quizPanel');
    const quizBtn = document.getElementById('quizBtn');

    if (quizMode) {
        score = 0;
        currentQuestionIndex = 0;
        shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
        document.getElementById('starsDisplay').innerHTML = '';
        quizPanel.classList.remove('hidden');
        quizBtn.classList.add('active');
        quizBtn.textContent = 'Exit Quiz';
        showNextQuestion();
    } else {
        quizPanel.classList.add('hidden');
        quizBtn.classList.remove('active');
        quizBtn.textContent = 'Quiz Me!';
    }
}

function showNextQuestion() {
    if (currentQuestionIndex >= TOTAL_QUESTIONS) {
        showQuizComplete();
        return;
    }

    const q = shuffledQuestions[currentQuestionIndex];
    document.getElementById('quizProgress').textContent = `Question ${currentQuestionIndex + 1} of ${TOTAL_QUESTIONS}`;
    document.getElementById('quizQuestion').textContent = q.question;
    document.getElementById('quizFeedback').textContent = '';
    document.getElementById('quizFeedback').className = 'quiz-feedback';

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(option, btn, q.answer));
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(answer, btn, correctAnswer) {
    const feedback = document.getElementById('quizFeedback');
    const allOptions = document.querySelectorAll('.quiz-option');
    allOptions.forEach(opt => opt.style.pointerEvents = 'none');

    if (answer === correctAnswer) {
        btn.classList.add('correct');
        feedback.textContent = 'Correct!';
        feedback.className = 'quiz-feedback correct';
        score++;
        addGoldStar();
    } else {
        btn.classList.add('incorrect');
        allOptions.forEach(opt => {
            if (opt.textContent === correctAnswer) opt.classList.add('correct');
        });
        feedback.textContent = `Answer: ${correctAnswer}`;
        feedback.className = 'quiz-feedback incorrect';
    }

    currentQuestionIndex++;
    setTimeout(() => { if (quizMode) showNextQuestion(); }, 1500);
}

function addGoldStar() {
    const star = document.createElement('span');
    star.className = 'gold-star';
    star.textContent = '★';
    document.getElementById('starsDisplay').appendChild(star);
    setTimeout(() => star.classList.add('animated'), 10);
}

function showQuizComplete() {
    document.getElementById('quizProgress').textContent = 'Quiz Complete!';

    if (score === TOTAL_QUESTIONS) {
        document.getElementById('quizQuestion').textContent = '🎉 Perfect Score! 🎉';
        document.getElementById('quizFeedback').textContent = 'You know your Great Lakes!';
        document.getElementById('quizFeedback').className = 'quiz-feedback correct';
        showCelebration();
    } else {
        document.getElementById('quizQuestion').textContent = 'Quiz Complete!';
        document.getElementById('quizFeedback').textContent = `${score} of ${TOTAL_QUESTIONS} correct`;
    }

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    const restartBtn = document.createElement('button');
    restartBtn.className = 'quiz-option';
    restartBtn.textContent = 'Try Again';
    restartBtn.addEventListener('click', () => { quizMode = false; toggleQuiz(); });
    optionsContainer.appendChild(restartBtn);
}

function showCelebration() {
    const container = document.createElement('div');
    container.className = 'celebration-container';
    document.body.appendChild(container);

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'exploding-star';
            star.textContent = '★';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.color = ['gold', '#2196f3', 'cyan'][Math.floor(Math.random() * 3)];
            star.style.fontSize = (Math.random() * 20 + 15) + 'px';
            container.appendChild(star);
            setTimeout(() => star.remove(), 2000);
        }, i * 50);
    }
    setTimeout(() => container.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', init);
