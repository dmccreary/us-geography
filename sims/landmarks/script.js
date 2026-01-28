/* American Landmarks MicroSim */

const landmarks = [
    {
        name: 'Statue of Liberty',
        city: 'New York City',
        state: 'New York',
        lat: 40.6892,
        lng: -74.0445,
        type: 'monument',
        icon: '🗽',
        built: 1886,
        description: 'Gift from France welcoming immigrants to America',
        significance: 'Represents freedom, democracy, and opportunity',
        funFact: 'The torch was once used as a lighthouse!'
    },
    {
        name: 'Mount Rushmore',
        city: 'Keystone',
        state: 'South Dakota',
        lat: 43.8791,
        lng: -103.4591,
        type: 'monument',
        icon: '🗻',
        built: 1941,
        description: 'Four presidents carved into granite mountain',
        significance: 'Celebrates American history and leadership',
        funFact: 'Each face is 60 feet tall - as high as a 6-story building!'
    },
    {
        name: 'Golden Gate Bridge',
        city: 'San Francisco',
        state: 'California',
        lat: 37.8199,
        lng: -122.4783,
        type: 'bridge',
        icon: '🌉',
        built: 1937,
        description: 'Iconic suspension bridge spanning the Golden Gate strait',
        significance: 'Symbol of American engineering and the West',
        funFact: 'The bridge is painted "International Orange" not gold!'
    },
    {
        name: 'Lincoln Memorial',
        city: 'Washington',
        state: 'D.C.',
        lat: 38.8893,
        lng: -77.0502,
        type: 'monument',
        icon: '🏛️',
        built: 1922,
        description: 'Memorial honoring President Abraham Lincoln',
        significance: 'Site of Martin Luther King Jr.\'s "I Have a Dream" speech',
        funFact: 'Lincoln\'s statue is 19 feet tall and weighs 175 tons!'
    },
    {
        name: 'Washington Monument',
        city: 'Washington',
        state: 'D.C.',
        lat: 38.8895,
        lng: -77.0353,
        type: 'monument',
        icon: '🏛️',
        built: 1884,
        description: 'Obelisk honoring George Washington',
        significance: 'Tallest stone structure in the world',
        funFact: 'The monument is exactly 555 feet, 5 inches tall!'
    },
    {
        name: 'Gateway Arch',
        city: 'St. Louis',
        state: 'Missouri',
        lat: 38.6247,
        lng: -90.1848,
        type: 'monument',
        icon: '🏛️',
        built: 1965,
        description: 'Stainless steel arch celebrating westward expansion',
        significance: 'Gateway to the West monument',
        funFact: 'The Arch is 630 feet tall - the tallest monument in the US!'
    },
    {
        name: 'Independence Hall',
        city: 'Philadelphia',
        state: 'Pennsylvania',
        lat: 39.9489,
        lng: -75.1500,
        type: 'historic',
        icon: '🏛️',
        built: 1753,
        description: 'Where the Declaration of Independence was signed',
        significance: 'Birthplace of American democracy',
        funFact: 'Both the Declaration and Constitution were signed here!'
    },
    {
        name: 'Hoover Dam',
        city: 'Boulder City',
        state: 'Nevada/Arizona',
        lat: 36.0160,
        lng: -114.7377,
        type: 'engineering',
        icon: '🏗️',
        built: 1936,
        description: 'Massive concrete dam on the Colorado River',
        significance: 'Engineering marvel providing water and power',
        funFact: 'Enough concrete to pave a highway from San Francisco to New York!'
    },
    {
        name: 'Space Needle',
        city: 'Seattle',
        state: 'Washington',
        lat: 47.6205,
        lng: -122.3493,
        type: 'monument',
        icon: '🗼',
        built: 1962,
        description: 'Observation tower built for the 1962 World\'s Fair',
        significance: 'Symbol of Seattle and the Pacific Northwest',
        funFact: 'The Space Needle was built in less than 13 months!'
    },
    {
        name: 'Liberty Bell',
        city: 'Philadelphia',
        state: 'Pennsylvania',
        lat: 39.9496,
        lng: -75.1503,
        type: 'historic',
        icon: '🔔',
        built: 1752,
        description: 'Historic bell that symbolizes American independence',
        significance: 'Rang to mark the first reading of the Declaration',
        funFact: 'The famous crack appeared in the 1840s!'
    },
    {
        name: 'Alcatraz Island',
        city: 'San Francisco',
        state: 'California',
        lat: 37.8267,
        lng: -122.4230,
        type: 'historic',
        icon: '🏛️',
        built: 1934,
        description: 'Former maximum-security federal prison',
        significance: 'Held famous criminals like Al Capone',
        funFact: 'No prisoner ever successfully escaped from Alcatraz!'
    },
    {
        name: 'Pearl Harbor Memorial',
        city: 'Honolulu',
        state: 'Hawaii',
        lat: 21.3649,
        lng: -157.9500,
        type: 'memorial',
        icon: '⚓',
        built: 1962,
        description: 'Memorial over the sunken USS Arizona',
        significance: 'Honors those who died in the 1941 attack',
        funFact: 'Oil still leaks from the Arizona - about 2 quarts per day!'
    }
];

const quizQuestions = [
    { q: 'Which landmark was a gift from France?', a: 'Statue of Liberty' },
    { q: 'Where is Mount Rushmore located?', a: 'South Dakota', opts: ['South Dakota', 'California', 'Arizona', 'Montana'] },
    { q: 'What color is the Golden Gate Bridge painted?', a: 'International Orange', opts: ['International Orange', 'Gold', 'Red', 'Silver'] },
    { q: 'Which landmark has four presidents\' faces?', a: 'Mount Rushmore' },
    { q: 'Where was the Declaration of Independence signed?', a: 'Independence Hall' },
    { q: 'What is the tallest monument in the US?', a: 'Gateway Arch' },
    { q: 'Which city has the Space Needle?', a: 'Seattle', opts: ['Seattle', 'Portland', 'San Francisco', 'Los Angeles'] },
    { q: 'Which landmark honors Abraham Lincoln?', a: 'Lincoln Memorial' },
    { q: 'Where is the Liberty Bell located?', a: 'Philadelphia', opts: ['Philadelphia', 'Boston', 'New York', 'Washington D.C.'] },
    { q: 'Which landmark is on an island in San Francisco Bay?', a: 'Alcatraz Island' }
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
    info.update = function(landmark) {
        if (landmark) {
            this._div.innerHTML = `
                <h4>${landmark.icon} ${landmark.name}</h4>
                <p><span class="stat">Location:</span> ${landmark.city}, ${landmark.state}</p>
                <p><span class="stat">Built:</span> ${landmark.built}</p>
                <p>${landmark.description}</p>
                <p><span class="stat">Significance:</span> ${landmark.significance}</p>
                <p><span class="stat">Fun Fact:</span> ${landmark.funFact}</p>
            `;
        } else {
            this._div.innerHTML = '<p style="color: #888; font-style: italic;">Click a landmark to see details</p>';
        }
    };
    info.addTo(map);

    // Add landmark markers
    addLandmarkMarkers();

    // Setup controls
    document.getElementById('quizBtn').addEventListener('click', startQuiz);
    document.getElementById('resetBtn').addEventListener('click', resetView);
}

function addLandmarkMarkers() {
    landmarks.forEach(landmark => {
        const icon = L.divIcon({
            className: 'landmark-marker',
            html: `<span style="font-size: 22px; text-shadow: 1px 1px 2px white;">${landmark.icon}</span>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        const marker = L.marker([landmark.lat, landmark.lng], { icon })
            .addTo(map)
            .on('click', () => {
                if (!quizMode) {
                    info.update(landmark);
                    highlightLandmark(landmark.name);
                }
            });

        marker.bindTooltip(landmark.name, { permanent: false, direction: 'top', offset: [0, -10] });

        markers.push({ marker, landmark });
    });
}

function highlightLandmark(name) {
    markers.forEach(({ marker, landmark }) => {
        if (landmark.name === name) {
            const origIcon = marker.getIcon();
            const highlightIcon = L.divIcon({
                className: 'landmark-marker-highlight',
                html: `<span style="font-size: 30px; text-shadow: 2px 2px 4px gold;">${landmark.icon}</span>`,
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
    let options;
    if (q.opts) {
        options = [...q.opts];
    } else {
        options = [q.a];
        const otherLandmarks = landmarks.map(l => l.name).filter(n => n !== q.a);
        while (options.length < 4) {
            const random = otherLandmarks[Math.floor(Math.random() * otherLandmarks.length)];
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

    // Highlight the correct landmark if it exists
    const landmark = landmarks.find(l => l.name === correct);
    if (landmark) highlightLandmark(correct);

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
