/* US Time Zones MicroSim Script */

// Configuration
const MAP_CONFIG = {
    center: [39, -98],
    zoom: 4,
    minZoom: 3,
    maxZoom: 8
};

// Time zone colors matching the legend
const timeZoneColors = {
    pacific: '#4a90d9',
    mountain: '#f5a623',
    central: '#f8e71c',
    eastern: '#7ed321'
};

// Time zone offsets from Eastern (in hours)
const timeZoneOffsets = {
    pacific: -3,
    mountain: -2,
    central: -1,
    eastern: 0
};

// State to time zone mapping (continental US)
const stateTimeZones = {
    // Eastern Time
    'Maine': 'eastern', 'New Hampshire': 'eastern', 'Vermont': 'eastern',
    'Massachusetts': 'eastern', 'Rhode Island': 'eastern', 'Connecticut': 'eastern',
    'New York': 'eastern', 'New Jersey': 'eastern', 'Pennsylvania': 'eastern',
    'Delaware': 'eastern', 'Maryland': 'eastern', 'Virginia': 'eastern',
    'West Virginia': 'eastern', 'North Carolina': 'eastern', 'South Carolina': 'eastern',
    'Georgia': 'eastern', 'Florida': 'eastern', 'Ohio': 'eastern',
    'Michigan': 'eastern', 'Indiana': 'eastern', 'Kentucky': 'eastern',
    'District of Columbia': 'eastern',

    // Central Time
    'Wisconsin': 'central', 'Illinois': 'central', 'Minnesota': 'central',
    'Iowa': 'central', 'Missouri': 'central', 'Arkansas': 'central',
    'Louisiana': 'central', 'Mississippi': 'central', 'Alabama': 'central',
    'Tennessee': 'central', 'Oklahoma': 'central', 'Kansas': 'central',
    'Nebraska': 'central', 'South Dakota': 'central', 'North Dakota': 'central',
    'Texas': 'central',

    // Mountain Time
    'Montana': 'mountain', 'Wyoming': 'mountain', 'Colorado': 'mountain',
    'New Mexico': 'mountain', 'Utah': 'mountain', 'Arizona': 'mountain',
    'Idaho': 'mountain', 'Nevada': 'mountain',

    // Pacific Time
    'Washington': 'pacific', 'Oregon': 'pacific', 'California': 'pacific'
};

// Major cities for reference
const majorCities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060, zone: 'eastern' },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298, zone: 'central' },
    { name: 'Denver', lat: 39.7392, lng: -104.9903, zone: 'mountain' },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, zone: 'pacific' },
    { name: 'Miami', lat: 25.7617, lng: -80.1918, zone: 'eastern' },
    { name: 'Dallas', lat: 32.7767, lng: -96.7970, zone: 'central' },
    { name: 'Phoenix', lat: 33.4484, lng: -112.0740, zone: 'mountain' },
    { name: 'Seattle', lat: 47.6062, lng: -122.3321, zone: 'pacific' }
];

// Quiz questions
const quizQuestions = [
    { question: "If it's 3:00 PM in New York, what time is it in Los Angeles?", answer: "12:00 PM", options: ["12:00 PM", "6:00 PM", "3:00 PM"] },
    { question: "If it's noon in Chicago, what time is it in Denver?", answer: "11:00 AM", options: ["11:00 AM", "1:00 PM", "10:00 AM"] },
    { question: "Which time zone is California in?", answer: "Pacific", options: ["Pacific", "Mountain", "Central"] },
    { question: "Which time zone is Texas in?", answer: "Central", options: ["Central", "Mountain", "Eastern"] },
    { question: "How many hours behind Eastern Time is Pacific Time?", answer: "3 hours", options: ["3 hours", "2 hours", "4 hours"] },
    { question: "If it's 9:00 AM in Seattle, what time is it in Miami?", answer: "12:00 PM", options: ["12:00 PM", "6:00 AM", "9:00 AM"] }
];

// State variables
let map;
let infoControl;
let currentEasternHour = 12;
let quizMode = false;
let score = 0;
let shuffledQuestions = [];
let currentQuestionIndex = 0;
const TOTAL_QUESTIONS = 6;

// GeoJSON URL
const STATES_GEOJSON_URL = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

// Initialize
async function init() {
    initMap();
    await loadStates();
    addCityMarkers();
    setupControls();
    updateAllClocks(currentEasternHour);
}

function initMap() {
    map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
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

    infoControl.update = function(state, zone) {
        if (!state) {
            this._div.innerHTML = '<h4>US Time Zones</h4><p>Hover over a state</p>';
            return;
        }
        const zoneName = zone.charAt(0).toUpperCase() + zone.slice(1);
        const offset = timeZoneOffsets[zone];
        const offsetStr = offset === 0 ? 'Eastern (base)' : `${offset} hours from Eastern`;
        this._div.innerHTML = `<h4>${state}</h4><p><strong>${zoneName} Time</strong></p><p>${offsetStr}</p>`;
    };

    infoControl.addTo(map);
}

async function loadStates() {
    try {
        const response = await fetch(STATES_GEOJSON_URL);
        const data = await response.json();

        L.geoJSON(data, {
            style: styleState,
            onEachFeature: onEachState
        }).addTo(map);
    } catch (error) {
        console.error('Error loading states:', error);
    }
}

function styleState(feature) {
    const stateName = feature.properties.name;
    const zone = stateTimeZones[stateName] || 'eastern';
    return {
        fillColor: timeZoneColors[zone],
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

function onEachState(feature, layer) {
    const stateName = feature.properties.name;
    const zone = stateTimeZones[stateName] || 'eastern';

    layer.on({
        mouseover: function(e) {
            e.target.setStyle({ weight: 3, color: '#333', fillOpacity: 0.9 });
            e.target.bringToFront();
            infoControl.update(stateName, zone);
        },
        mouseout: function(e) {
            e.target.setStyle({ weight: 1, color: 'white', fillOpacity: 0.7 });
            infoControl.update();
        }
    });
}

function addCityMarkers() {
    majorCities.forEach(city => {
        const marker = L.circleMarker([city.lat, city.lng], {
            radius: 5,
            fillColor: '#333',
            color: 'white',
            weight: 2,
            fillOpacity: 0.8
        }).addTo(map);

        marker.bindTooltip(city.name, { permanent: false, direction: 'top' });
    });
}

function setupControls() {
    const slider = document.getElementById('timeSlider');
    slider.addEventListener('input', function() {
        currentEasternHour = parseInt(this.value);
        updateAllClocks(currentEasternHour);
        document.getElementById('sliderValue').textContent = formatTime(currentEasternHour);
    });

    document.getElementById('quizBtn').addEventListener('click', toggleQuiz);
}

function updateAllClocks(easternHour) {
    Object.keys(timeZoneOffsets).forEach(zone => {
        let hour = easternHour + timeZoneOffsets[zone];
        if (hour < 0) hour += 24;
        if (hour >= 24) hour -= 24;
        updateClock(zone, hour);
    });
}

function updateClock(zone, hour) {
    const hourHand = document.getElementById(`hour-${zone}`);
    const minuteHand = document.getElementById(`minute-${zone}`);
    const timeDisplay = document.getElementById(`time-${zone}`);

    // Hour hand: 30 degrees per hour (360/12)
    const hourDeg = (hour % 12) * 30;
    hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;

    // Minute hand at 12 (0 degrees)
    minuteHand.style.transform = `translateX(-50%) rotate(0deg)`;

    // Update digital time
    timeDisplay.textContent = formatTime(hour);
}

function formatTime(hour) {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${h}:00 ${ampm}`;
}

// Quiz functions
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
        feedback.textContent = `Correct answer: ${correctAnswer}`;
        feedback.className = 'quiz-feedback incorrect';
    }

    currentQuestionIndex++;
    setTimeout(() => {
        if (quizMode) showNextQuestion();
    }, 1500);
}

function addGoldStar() {
    const star = document.createElement('span');
    star.className = 'gold-star';
    star.textContent = '★';
    document.getElementById('starsDisplay').appendChild(star);
    setTimeout(() => star.classList.add('animated'), 10);
}

function showQuizComplete() {
    const quizQuestion = document.getElementById('quizQuestion');
    const quizOptions = document.getElementById('quizOptions');
    const quizFeedback = document.getElementById('quizFeedback');
    document.getElementById('quizProgress').textContent = 'Quiz Complete!';

    if (score === TOTAL_QUESTIONS) {
        quizQuestion.textContent = '🎉 Perfect Score! 🎉';
        quizFeedback.textContent = `You got all ${TOTAL_QUESTIONS} correct!`;
        quizFeedback.className = 'quiz-feedback correct';
        showCelebration();
    } else {
        quizQuestion.textContent = 'Quiz Complete!';
        quizFeedback.textContent = `You got ${score} of ${TOTAL_QUESTIONS} correct.`;
        quizFeedback.className = 'quiz-feedback';
    }

    quizOptions.innerHTML = '';
    const restartBtn = document.createElement('button');
    restartBtn.className = 'quiz-option';
    restartBtn.textContent = 'Try Again';
    restartBtn.addEventListener('click', () => { quizMode = false; toggleQuiz(); });
    quizOptions.appendChild(restartBtn);
}

function showCelebration() {
    const container = document.createElement('div');
    container.className = 'celebration-container';
    document.body.appendChild(container);

    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'exploding-star';
            star.textContent = '★';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.color = ['gold', 'orange', 'yellow'][Math.floor(Math.random() * 3)];
            star.style.fontSize = (Math.random() * 25 + 15) + 'px';
            container.appendChild(star);
            setTimeout(() => star.remove(), 2000);
        }, i * 50);
    }

    setTimeout(() => container.remove(), 3500);
}

document.addEventListener('DOMContentLoaded', init);
