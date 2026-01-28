/* Latitude and Longitude Grid MicroSim Script */

const MAP_CONFIG = {
    center: [20, 0],
    zoom: 2,
    minZoom: 1,
    maxZoom: 8
};

// Major cities for reference
const cities = [
    { name: 'New York', lat: 40.7, lng: -74.0 },
    { name: 'London', lat: 51.5, lng: -0.1 },
    { name: 'Tokyo', lat: 35.7, lng: 139.7 },
    { name: 'Sydney', lat: -33.9, lng: 151.2 },
    { name: 'Cairo', lat: 30.0, lng: 31.2 },
    { name: 'Rio de Janeiro', lat: -22.9, lng: -43.2 },
    { name: 'Los Angeles', lat: 34.1, lng: -118.2 },
    { name: 'Moscow', lat: 55.8, lng: 37.6 }
];

// Quiz questions (find the location)
const quizQuestions = [
    { question: "Click on the Equator (0° Latitude)", type: 'lat', target: 0, tolerance: 5 },
    { question: "Click on the Prime Meridian (0° Longitude)", type: 'lng', target: 0, tolerance: 10 },
    { question: "Click on 30° North latitude", type: 'lat', target: 30, tolerance: 5 },
    { question: "Click somewhere in the Northern Hemisphere", type: 'hemisphere', target: 'north' },
    { question: "Click somewhere in the Western Hemisphere", type: 'hemisphere', target: 'west' },
    { question: "Click on approximately 60° West longitude", type: 'lng', target: -60, tolerance: 10 }
];

let map;
let gridLines = [];
let cityMarkers = [];
let currentMarker = null;
let gridVisible = true;
let citiesVisible = false;
let quizMode = false;
let score = 0;
let shuffledQuestions = [];
let currentQuestionIndex = 0;
const TOTAL_QUESTIONS = 6;

function init() {
    initMap();
    drawGridLines();
    createCityMarkers();
    setupControls();
    setupMapEvents();
}

function initMap() {
    map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true,
        worldCopyJump: true
    }).setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; CARTO',
        maxZoom: MAP_CONFIG.maxZoom,
        noWrap: false
    }).addTo(map);
}

function drawGridLines() {
    // Clear existing
    gridLines.forEach(line => map.removeLayer(line));
    gridLines = [];

    // Latitude lines (horizontal)
    for (let lat = -60; lat <= 60; lat += 30) {
        const color = lat === 0 ? 'red' : 'gray';
        const weight = lat === 0 ? 3 : 1;
        const opacity = lat === 0 ? 0.8 : 0.5;

        const line = L.polyline([
            [lat, -180], [lat, 180]
        ], { color, weight, opacity, dashArray: lat === 0 ? null : '5,5' }).addTo(map);

        // Label
        const label = L.marker([lat, -170], {
            icon: L.divIcon({
                className: 'grid-label',
                html: `<span style="font-size:10px;color:${color};font-weight:bold;">${lat}°</span>`,
                iconSize: [30, 15]
            })
        }).addTo(map);

        gridLines.push(line, label);
    }

    // Longitude lines (vertical)
    for (let lng = -180; lng <= 180; lng += 30) {
        const color = lng === 0 ? 'blue' : 'gray';
        const weight = lng === 0 ? 3 : 1;
        const opacity = lng === 0 ? 0.8 : 0.5;

        const line = L.polyline([
            [-85, lng], [85, lng]
        ], { color, weight, opacity, dashArray: lng === 0 ? null : '5,5' }).addTo(map);

        // Label at top
        if (lng !== -180) {
            const label = L.marker([75, lng], {
                icon: L.divIcon({
                    className: 'grid-label',
                    html: `<span style="font-size:10px;color:${color};font-weight:bold;">${lng}°</span>`,
                    iconSize: [35, 15]
                })
            }).addTo(map);
            gridLines.push(label);
        }

        gridLines.push(line);
    }
}

function createCityMarkers() {
    cities.forEach(city => {
        const marker = L.circleMarker([city.lat, city.lng], {
            radius: 5,
            fillColor: '#e74c3c',
            color: 'white',
            weight: 2,
            fillOpacity: 0.8
        });

        marker.bindTooltip(`${city.name}<br>${city.lat.toFixed(1)}°, ${city.lng.toFixed(1)}°`, {
            permanent: false
        });

        cityMarkers.push(marker);
    });
}

function setupControls() {
    document.getElementById('quizBtn').addEventListener('click', toggleQuiz);
    document.getElementById('toggleGridBtn').addEventListener('click', toggleGrid);
    document.getElementById('toggleCitiesBtn').addEventListener('click', toggleCities);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

function setupMapEvents() {
    map.on('mousemove', function(e) {
        const lat = e.latlng.lat.toFixed(1);
        const lng = e.latlng.lng.toFixed(1);
        const latDir = e.latlng.lat >= 0 ? 'N' : 'S';
        const lngDir = e.latlng.lng >= 0 ? 'E' : 'W';

        document.getElementById('latDisplay').textContent = `Lat: ${Math.abs(lat)}° ${latDir}`;
        document.getElementById('lngDisplay').textContent = `Lng: ${Math.abs(lng)}° ${lngDir}`;
    });

    map.on('click', function(e) {
        // Remove previous marker
        if (currentMarker) map.removeLayer(currentMarker);

        // Add new marker
        currentMarker = L.marker(e.latlng, {
            icon: L.divIcon({
                className: 'click-marker',
                html: '<div style="width:12px;height:12px;background:orange;border:2px solid white;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,0.3);"></div>',
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            })
        }).addTo(map);

        // Check quiz answer if in quiz mode
        if (quizMode) {
            checkQuizAnswer(e.latlng.lat, e.latlng.lng);
        }
    });
}

function toggleGrid() {
    gridVisible = !gridVisible;
    const btn = document.getElementById('toggleGridBtn');

    gridLines.forEach(item => {
        if (gridVisible) {
            item.addTo(map);
        } else {
            map.removeLayer(item);
        }
    });

    btn.textContent = gridVisible ? 'Hide Grid' : 'Show Grid';
}

function toggleCities() {
    citiesVisible = !citiesVisible;
    const btn = document.getElementById('toggleCitiesBtn');

    cityMarkers.forEach(marker => {
        if (citiesVisible) {
            marker.addTo(map);
        } else {
            map.removeLayer(marker);
        }
    });

    btn.textContent = citiesVisible ? 'Hide Cities' : 'Show Cities';
    btn.classList.toggle('active', citiesVisible);
}

function resetView() {
    map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
    if (currentMarker) {
        map.removeLayer(currentMarker);
        currentMarker = null;
    }
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
    document.getElementById('quizInstruction').textContent = 'Click on the map to answer';
    document.getElementById('quizFeedback').textContent = '';
    document.getElementById('quizFeedback').className = 'quiz-feedback';
}

function checkQuizAnswer(lat, lng) {
    const q = shuffledQuestions[currentQuestionIndex];
    const feedback = document.getElementById('quizFeedback');
    let correct = false;

    if (q.type === 'lat') {
        correct = Math.abs(lat - q.target) <= q.tolerance;
    } else if (q.type === 'lng') {
        correct = Math.abs(lng - q.target) <= q.tolerance;
    } else if (q.type === 'hemisphere') {
        if (q.target === 'north') correct = lat > 0;
        else if (q.target === 'south') correct = lat < 0;
        else if (q.target === 'east') correct = lng > 0;
        else if (q.target === 'west') correct = lng < 0;
    }

    if (correct) {
        feedback.textContent = 'Correct! Great job!';
        feedback.className = 'quiz-feedback correct';
        score++;
        addGoldStar();
    } else {
        feedback.textContent = `Not quite. You clicked ${lat.toFixed(1)}°, ${lng.toFixed(1)}°`;
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
    document.getElementById('quizProgress').textContent = 'Quiz Complete!';
    document.getElementById('quizInstruction').textContent = '';

    if (score === TOTAL_QUESTIONS) {
        document.getElementById('quizQuestion').textContent = '🎉 Perfect Score! 🎉';
        document.getElementById('quizFeedback').textContent = `You got all ${TOTAL_QUESTIONS} correct!`;
        document.getElementById('quizFeedback').className = 'quiz-feedback correct';
        showCelebration();
    } else {
        document.getElementById('quizQuestion').textContent = 'Quiz Complete!';
        document.getElementById('quizFeedback').textContent = `You got ${score} of ${TOTAL_QUESTIONS} correct.`;
        document.getElementById('quizFeedback').className = 'quiz-feedback';
    }
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
