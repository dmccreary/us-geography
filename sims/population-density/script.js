/* US Population Density MicroSim */

// State population density data (people per square mile)
const stateData = [
    { name: 'New Jersey', abbr: 'NJ', lat: 40.2, lng: -74.7, density: 1263, pop: '9.3M', area: '7,354 sq mi' },
    { name: 'Rhode Island', abbr: 'RI', lat: 41.7, lng: -71.5, density: 1061, pop: '1.1M', area: '1,034 sq mi' },
    { name: 'Massachusetts', abbr: 'MA', lat: 42.3, lng: -71.8, density: 901, pop: '7M', area: '7,800 sq mi' },
    { name: 'Connecticut', abbr: 'CT', lat: 41.5, lng: -72.7, density: 738, pop: '3.6M', area: '4,842 sq mi' },
    { name: 'Maryland', abbr: 'MD', lat: 39.0, lng: -76.8, density: 636, pop: '6.2M', area: '9,707 sq mi' },
    { name: 'Delaware', abbr: 'DE', lat: 39.0, lng: -75.5, density: 508, pop: '1M', area: '1,949 sq mi' },
    { name: 'New York', abbr: 'NY', lat: 42.9, lng: -75.5, density: 421, pop: '19.3M', area: '47,126 sq mi' },
    { name: 'Florida', abbr: 'FL', lat: 28.5, lng: -82.5, density: 401, pop: '21.5M', area: '53,625 sq mi' },
    { name: 'Pennsylvania', abbr: 'PA', lat: 40.9, lng: -77.8, density: 291, pop: '13M', area: '44,743 sq mi' },
    { name: 'Ohio', abbr: 'OH', lat: 40.4, lng: -82.8, density: 289, pop: '11.8M', area: '40,861 sq mi' },
    { name: 'California', abbr: 'CA', lat: 36.8, lng: -119.4, density: 256, pop: '39.5M', area: '155,779 sq mi' },
    { name: 'Illinois', abbr: 'IL', lat: 40.0, lng: -89.2, density: 231, pop: '12.6M', area: '54,495 sq mi' },
    { name: 'Virginia', abbr: 'VA', lat: 37.5, lng: -78.8, density: 218, pop: '8.6M', area: '39,490 sq mi' },
    { name: 'North Carolina', abbr: 'NC', lat: 35.5, lng: -79.8, density: 218, pop: '10.4M', area: '48,618 sq mi' },
    { name: 'Indiana', abbr: 'IN', lat: 39.8, lng: -86.2, density: 189, pop: '6.8M', area: '35,826 sq mi' },
    { name: 'Georgia', abbr: 'GA', lat: 32.7, lng: -83.5, density: 185, pop: '10.7M', area: '57,513 sq mi' },
    { name: 'Michigan', abbr: 'MI', lat: 44.3, lng: -85.6, density: 177, pop: '10M', area: '56,539 sq mi' },
    { name: 'Tennessee', abbr: 'TN', lat: 35.8, lng: -86.3, density: 167, pop: '6.9M', area: '41,235 sq mi' },
    { name: 'Texas', abbr: 'TX', lat: 31.5, lng: -99.4, density: 114, pop: '29M', area: '261,232 sq mi' },
    { name: 'Washington', abbr: 'WA', lat: 47.4, lng: -120.5, density: 117, pop: '7.6M', area: '66,455 sq mi' },
    { name: 'Arizona', abbr: 'AZ', lat: 34.3, lng: -111.7, density: 64, pop: '7.3M', area: '113,594 sq mi' },
    { name: 'Colorado', abbr: 'CO', lat: 39.0, lng: -105.5, density: 57, pop: '5.8M', area: '103,642 sq mi' },
    { name: 'Oregon', abbr: 'OR', lat: 44.0, lng: -120.5, density: 44, pop: '4.2M', area: '95,988 sq mi' },
    { name: 'Nevada', abbr: 'NV', lat: 39.5, lng: -116.9, density: 29, pop: '3.1M', area: '109,781 sq mi' },
    { name: 'Montana', abbr: 'MT', lat: 47.0, lng: -110.5, density: 7.5, pop: '1.1M', area: '145,546 sq mi' },
    { name: 'Wyoming', abbr: 'WY', lat: 43.0, lng: -107.5, density: 5.8, pop: '577K', area: '97,093 sq mi' },
    { name: 'Alaska', abbr: 'AK', lat: 64.0, lng: -153.0, density: 1.3, pop: '733K', area: '570,641 sq mi' }
];

// Major cities by population
const majorCities = [
    { name: 'New York City', state: 'NY', lat: 40.71, lng: -74.01, pop: '8.3M', metro: '20M', rank: 1 },
    { name: 'Los Angeles', state: 'CA', lat: 34.05, lng: -118.24, pop: '3.9M', metro: '13M', rank: 2 },
    { name: 'Chicago', state: 'IL', lat: 41.88, lng: -87.63, pop: '2.7M', metro: '9.5M', rank: 3 },
    { name: 'Houston', state: 'TX', lat: 29.76, lng: -95.37, pop: '2.3M', metro: '7M', rank: 4 },
    { name: 'Phoenix', state: 'AZ', lat: 33.45, lng: -112.07, pop: '1.6M', metro: '4.9M', rank: 5 },
    { name: 'Philadelphia', state: 'PA', lat: 39.95, lng: -75.17, pop: '1.6M', metro: '6.2M', rank: 6 },
    { name: 'San Antonio', state: 'TX', lat: 29.42, lng: -98.49, pop: '1.5M', metro: '2.5M', rank: 7 },
    { name: 'San Diego', state: 'CA', lat: 32.72, lng: -117.16, pop: '1.4M', metro: '3.3M', rank: 8 },
    { name: 'Dallas', state: 'TX', lat: 32.78, lng: -96.80, pop: '1.3M', metro: '7.6M', rank: 9 },
    { name: 'San Jose', state: 'CA', lat: 37.34, lng: -121.89, pop: '1M', metro: '2M', rank: 10 },
    { name: 'Miami', state: 'FL', lat: 25.76, lng: -80.19, pop: '450K', metro: '6.2M', rank: 44 },
    { name: 'Seattle', state: 'WA', lat: 47.61, lng: -122.33, pop: '750K', metro: '4M', rank: 18 },
    { name: 'Denver', state: 'CO', lat: 39.74, lng: -104.99, pop: '715K', metro: '2.9M', rank: 19 },
    { name: 'Atlanta', state: 'GA', lat: 33.75, lng: -84.39, pop: '500K', metro: '6M', rank: 38 },
    { name: 'Boston', state: 'MA', lat: 42.36, lng: -71.06, pop: '675K', metro: '4.9M', rank: 24 }
];

const quizQuestions = [
    { q: 'Which state has the highest population density?', a: 'New Jersey', opts: ['New Jersey', 'Rhode Island', 'Massachusetts', 'New York'] },
    { q: 'Which is the largest US city by population?', a: 'New York City', opts: ['New York City', 'Los Angeles', 'Chicago', 'Houston'] },
    { q: 'Which state has the lowest population density?', a: 'Alaska', opts: ['Alaska', 'Wyoming', 'Montana', 'Nevada'] },
    { q: 'Which city has the largest metro area population?', a: 'New York City', opts: ['New York City', 'Los Angeles', 'Chicago', 'Dallas'] },
    { q: 'What is the population of California?', a: 'About 39 million', opts: ['About 39 million', 'About 29 million', 'About 19 million', 'About 49 million'] },
    { q: 'Which region of the US is most densely populated?', a: 'Northeast', opts: ['Northeast', 'Southeast', 'Midwest', 'West'] },
    { q: 'How many people live in the US?', a: 'About 330 million', opts: ['About 330 million', 'About 250 million', 'About 400 million', 'About 500 million'] },
    { q: 'Which Texas city is largest?', a: 'Houston', opts: ['Houston', 'Dallas', 'San Antonio', 'Austin'] }
];

let map;
let stateMarkers = [];
let cityMarkers = [];
let info;
let quizMode = false;
let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 6;
let currentView = 'states';

function getDensityColor(density) {
    if (density >= 1000) return '#B71C1C';
    if (density >= 500) return '#E65100';
    if (density >= 200) return '#FF9800';
    if (density >= 100) return '#FFCC80';
    if (density >= 50) return '#FFE0B2';
    return '#FFF3E0';
}

function init() {
    map = L.map('map', {
        center: [39, -96],
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
            if (data.type === 'state') {
                this._div.innerHTML = `
                    <h4>${data.name} (${data.abbr})</h4>
                    <p><span class="stat">Density:</span> ${data.density} people/sq mi</p>
                    <p><span class="stat">Population:</span> ${data.pop}</p>
                    <p><span class="stat">Area:</span> ${data.area}</p>
                `;
            } else if (data.type === 'city') {
                this._div.innerHTML = `
                    <h4>● ${data.name}</h4>
                    <p><span class="stat">State:</span> ${data.state}</p>
                    <p><span class="stat">City Pop:</span> ${data.pop}</p>
                    <p><span class="stat">Metro Pop:</span> ${data.metro}</p>
                    <p><span class="stat">US Rank:</span> #${data.rank}</p>
                `;
            } else if (data.type === 'overview') {
                this._div.innerHTML = `
                    <h4>US Population</h4>
                    <p><span class="stat">Total:</span> ~330 million</p>
                    <p><span class="stat">Density:</span> 94 people/sq mi</p>
                    <p><span class="stat">Most Dense:</span> NJ (1,263/sq mi)</p>
                    <p><span class="stat">Least Dense:</span> AK (1.3/sq mi)</p>
                `;
            }
        } else {
            this._div.innerHTML = '<p style="color: #888; font-style: italic;">Click on states or cities</p>';
        }
    };
    info.addTo(map);

    // Add state markers
    addStateMarkers();

    // Add city markers
    addCityMarkers();

    // Setup controls
    document.getElementById('statesBtn').addEventListener('click', () => showView('states'));
    document.getElementById('citiesBtn').addEventListener('click', () => showView('cities'));
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);

    showView('states');
}

function addStateMarkers() {
    stateData.forEach(state => {
        const color = getDensityColor(state.density);
        const icon = L.divIcon({
            className: 'state-marker',
            html: `<div style="
                background: ${color};
                padding: 3px 6px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: bold;
                color: ${state.density >= 200 ? 'white' : '#333'};
                border: 1px solid #666;
                text-shadow: ${state.density >= 200 ? '1px 1px rgba(0,0,0,0.3)' : 'none'};
            ">${state.abbr}</div>`,
            iconSize: [30, 20],
            iconAnchor: [15, 10]
        });

        const marker = L.marker([state.lat, state.lng], { icon })
            .on('click', () => {
                if (!quizMode) info.update({ type: 'state', ...state });
            });

        marker.bindTooltip(`${state.name}: ${state.density}/sq mi`, { 
            permanent: false, 
            direction: 'top' 
        });

        stateMarkers.push(marker);
    });
}

function addCityMarkers() {
    majorCities.forEach(city => {
        // Size based on rank
        const size = city.rank <= 5 ? 16 : city.rank <= 10 ? 12 : 10;
        const icon = L.divIcon({
            className: 'city-marker',
            html: `<span style="font-size: ${size}px; color: #C62828; text-shadow: 1px 1px white;">●</span>`,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
        });

        const marker = L.marker([city.lat, city.lng], { icon })
            .on('click', () => {
                if (!quizMode) info.update({ type: 'city', ...city });
            });

        marker.bindTooltip(`${city.name} (#${city.rank})`, { 
            permanent: false, 
            direction: 'top' 
        });

        cityMarkers.push(marker);
    });
}

function showView(view) {
    currentView = view;

    // Update button states
    document.getElementById('statesBtn').classList.toggle('active', view === 'states');
    document.getElementById('citiesBtn').classList.toggle('active', view === 'cities');

    // Clear all markers
    stateMarkers.forEach(m => map.removeLayer(m));
    cityMarkers.forEach(m => map.removeLayer(m));

    // Add appropriate markers
    if (view === 'states') {
        stateMarkers.forEach(m => m.addTo(map));
        info.update({ type: 'overview' });
    } else {
        cityMarkers.forEach(m => m.addTo(map));
        info.update(null);
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
    
    // Show both views during quiz
    stateMarkers.forEach(m => m.addTo(map));
    cityMarkers.forEach(m => m.addTo(map));
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
    showView('states');
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
