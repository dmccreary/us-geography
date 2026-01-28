/* National Parks MicroSim */

const nationalParks = [
    {
        name: 'Great Smoky Mountains',
        state: 'Tennessee/North Carolina',
        lat: 35.6,
        lng: -83.5,
        type: 'mountains',
        icon: '🏔️',
        visitors: '12+ million',
        famousFor: 'Misty mountains, diverse wildlife, wildflowers',
        established: 1934,
        funFact: 'Most visited national park in America!'
    },
    {
        name: 'Grand Canyon',
        state: 'Arizona',
        lat: 36.1,
        lng: -112.1,
        type: 'canyon',
        icon: '🏜️',
        visitors: '6+ million',
        famousFor: 'Deep colorful canyon carved by Colorado River',
        established: 1919,
        funFact: 'The canyon is over a mile deep and 277 miles long!'
    },
    {
        name: 'Zion',
        state: 'Utah',
        lat: 37.3,
        lng: -113.0,
        type: 'canyon',
        icon: '🏜️',
        visitors: '4+ million',
        famousFor: 'Towering red rock cliffs, narrow canyons',
        established: 1919,
        funFact: 'The Narrows hiking trail goes through a river!'
    },
    {
        name: 'Yellowstone',
        state: 'Wyoming/Montana/Idaho',
        lat: 44.4,
        lng: -110.5,
        type: 'volcanic',
        icon: '🌋',
        visitors: '4+ million',
        famousFor: 'Old Faithful geyser, hot springs, wildlife',
        established: 1872,
        funFact: 'First national park in the world!'
    },
    {
        name: 'Yosemite',
        state: 'California',
        lat: 37.8,
        lng: -119.5,
        type: 'mountains',
        icon: '🏔️',
        visitors: '4+ million',
        famousFor: 'Granite cliffs, waterfalls, giant sequoias',
        established: 1890,
        funFact: 'El Capitan is one of the tallest granite monoliths in the world!'
    },
    {
        name: 'Rocky Mountain',
        state: 'Colorado',
        lat: 40.3,
        lng: -105.7,
        type: 'mountains',
        icon: '🏔️',
        visitors: '4+ million',
        famousFor: 'High peaks, alpine lakes, elk herds',
        established: 1915,
        funFact: 'Trail Ridge Road reaches over 12,000 feet elevation!'
    },
    {
        name: 'Acadia',
        state: 'Maine',
        lat: 44.3,
        lng: -68.2,
        type: 'coastal',
        icon: '🌊',
        visitors: '3+ million',
        famousFor: 'Rocky coastline, Cadillac Mountain',
        established: 1919,
        funFact: 'First place to see sunrise in the United States!'
    },
    {
        name: 'Grand Teton',
        state: 'Wyoming',
        lat: 43.8,
        lng: -110.7,
        type: 'mountains',
        icon: '🏔️',
        visitors: '3+ million',
        famousFor: 'Jagged mountain peaks, Jackson Hole',
        established: 1929,
        funFact: 'The Teton Range is one of the youngest mountain ranges in North America!'
    },
    {
        name: 'Glacier',
        state: 'Montana',
        lat: 48.7,
        lng: -113.8,
        type: 'mountains',
        icon: '🏔️',
        visitors: '3+ million',
        famousFor: 'Glaciers, Going-to-the-Sun Road, wildlife',
        established: 1910,
        funFact: 'Called the "Crown of the Continent" for its beauty!'
    },
    {
        name: 'Olympic',
        state: 'Washington',
        lat: 47.8,
        lng: -123.6,
        type: 'forest',
        icon: '🌲',
        visitors: '3+ million',
        famousFor: 'Rainforests, mountains, and beaches',
        established: 1938,
        funFact: 'One of the wettest places in the continental US!'
    },
    {
        name: 'Joshua Tree',
        state: 'California',
        lat: 33.9,
        lng: -115.9,
        type: 'desert',
        icon: '🏜️',
        visitors: '3+ million',
        famousFor: 'Unique Joshua trees, rock formations',
        established: 1994,
        funFact: 'Named after the unusual Joshua trees that look like people praying!'
    },
    {
        name: 'Bryce Canyon',
        state: 'Utah',
        lat: 37.6,
        lng: -112.2,
        type: 'canyon',
        icon: '🏜️',
        visitors: '2+ million',
        famousFor: 'Colorful hoodoo rock formations',
        established: 1928,
        funFact: 'Hoodoos are tall rock spires formed by erosion!'
    },
    {
        name: 'Arches',
        state: 'Utah',
        lat: 38.7,
        lng: -109.6,
        type: 'canyon',
        icon: '🏜️',
        visitors: '1.5+ million',
        famousFor: 'Over 2,000 natural stone arches',
        established: 1971,
        funFact: 'Delicate Arch is on Utah license plates!'
    },
    {
        name: 'Hawaii Volcanoes',
        state: 'Hawaii',
        lat: 19.4,
        lng: -155.2,
        type: 'volcanic',
        icon: '🌋',
        visitors: '1.3+ million',
        famousFor: 'Active volcanoes, lava flows',
        established: 1916,
        funFact: 'One of the only places to see active lava in the US!'
    },
    {
        name: 'Denali',
        state: 'Alaska',
        lat: 63.1,
        lng: -151.0,
        type: 'mountains',
        icon: '🏔️',
        visitors: '600,000',
        famousFor: 'Highest peak in North America (20,310 ft)',
        established: 1917,
        funFact: 'Denali means "The High One" in the native Athabascan language!'
    }
];

const quizQuestions = [
    { q: 'Which is the most visited national park?', a: 'Great Smoky Mountains' },
    { q: 'Which park has Old Faithful geyser?', a: 'Yellowstone' },
    { q: 'Which was the first national park in the world?', a: 'Yellowstone' },
    { q: 'Which park is home to the Grand Canyon?', a: 'Grand Canyon' },
    { q: 'Which park has El Capitan granite cliff?', a: 'Yosemite' },
    { q: 'Which park has the highest peak in North America?', a: 'Denali' },
    { q: 'Which park is in Maine?', a: 'Acadia' },
    { q: 'Which park has over 2,000 natural arches?', a: 'Arches' },
    { q: 'Which park has active volcanoes?', a: 'Hawaii Volcanoes' },
    { q: 'Which park is called "Crown of the Continent"?', a: 'Glacier' }
];

let map;
let markers = [];
let info;
let quizMode = false;
let currentQuestion = 0;
let score = 0;
let shuffledQuestions = [];
const TOTAL_QUESTIONS = 6;

function init() {
    map = L.map('map', {
        center: [39, -98],
        zoom: 3,
        minZoom: 2,
        maxZoom: 10
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
    info.update = function(park) {
        if (park) {
            this._div.innerHTML = `
                <h4>${park.icon} ${park.name}</h4>
                <p><span class="stat">State:</span> ${park.state}</p>
                <p><span class="stat">Established:</span> ${park.established}</p>
                <p><span class="stat">Visitors/Year:</span> ${park.visitors}</p>
                <p><span class="stat">Famous for:</span> ${park.famousFor}</p>
                <p><span class="stat">Fun Fact:</span> ${park.funFact}</p>
            `;
        } else {
            this._div.innerHTML = '<p style="color: #888; font-style: italic;">Click a park marker to see details</p>';
        }
    };
    info.addTo(map);

    // Add park markers
    addParkMarkers();

    // Setup controls
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

function addParkMarkers() {
    nationalParks.forEach(park => {
        const icon = L.divIcon({
            className: 'park-marker',
            html: `<span style="font-size: 22px; text-shadow: 1px 1px 2px white;">${park.icon}</span>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const marker = L.marker([park.lat, park.lng], { icon })
            .addTo(map)
            .on('click', () => {
                if (!quizMode) {
                    info.update(park);
                    highlightPark(park.name);
                } else {
                    handleQuizClick(park.name);
                }
            });

        marker.bindTooltip(park.name, { permanent: false, direction: 'top', offset: [0, -10] });

        markers.push({ marker, park });
    });
}

function highlightPark(name) {
    markers.forEach(({ marker, park }) => {
        if (park.name === name) {
            const origIcon = marker.getIcon();
            const highlightIcon = L.divIcon({
                className: 'park-marker-highlight',
                html: `<span style="font-size: 30px; text-shadow: 2px 2px 4px gold;">${park.icon}</span>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });
            marker.setIcon(highlightIcon);
            setTimeout(() => marker.setIcon(origIcon), 800);
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

    // Generate options
    const options = [q.a];
    const otherParks = nationalParks.map(p => p.name).filter(n => n !== q.a);
    while (options.length < 4) {
        const random = otherParks[Math.floor(Math.random() * otherParks.length)];
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

function handleQuizClick(parkName) {
    // Optional: Allow clicking on map markers as alternative
    if (!quizMode || currentQuestion >= TOTAL_QUESTIONS) return;

    const q = shuffledQuestions[currentQuestion];
    const isCorrect = parkName === q.a;

    highlightPark(parkName);
    if (!isCorrect) highlightPark(q.a);

    if (isCorrect) {
        score++;
        document.getElementById('quizFeedback').textContent = 'Correct!';
        document.getElementById('quizFeedback').classList.add('correct');
        addStar();
    } else {
        document.getElementById('quizFeedback').textContent = `The answer is: ${q.a}`;
        document.getElementById('quizFeedback').classList.add('incorrect');
    }

    // Disable buttons
    document.querySelectorAll('.quiz-option').forEach(b => b.disabled = true);

    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1500);
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

    highlightPark(correct);

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
    map.setView([39, -98], 3);
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

document.addEventListener('DOMContentLoaded', init);
