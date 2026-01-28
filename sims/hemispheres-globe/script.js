// Earth's Hemispheres Interactive Map
// Using Leaflet.js

// Map configuration
const MAP_CONFIG = {
    center: [20, 0],  // Slightly north to show US better
    zoom: 1,
    minZoom: 1,
    maxZoom: 5
};

// Hemisphere colors
const HEMISPHERE_COLORS = {
    north: { normal: '#AED6F1', highlight: '#5DADE2', name: 'Northern Hemisphere' },
    south: { normal: '#ABEBC6', highlight: '#58D68D', name: 'Southern Hemisphere' },
    east: { normal: '#F9E79F', highlight: '#F4D03F', name: 'Eastern Hemisphere' },
    west: { normal: '#F5B7B1', highlight: '#EC7063', name: 'Western Hemisphere' }
};

// Hemisphere descriptions
const HEMISPHERE_DESCRIPTIONS = {
    north: 'Everything north of the Equator (0° latitude). The United States is in this hemisphere!',
    south: 'Everything south of the Equator. Australia, most of South America, and Antarctica are here.',
    east: 'Everything east of the Prime Meridian (0° longitude). Europe, Asia, Africa, and Australia are here.',
    west: 'Everything west of the Prime Meridian. North and South America are in this hemisphere!'
};

// State
let map;
let highlightedHemisphere = null;
let showLines = true;
let hemisphereOverlays = {};
let lineOverlays = [];
let usMarker;

// Initialize map
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    createHemisphereOverlays();
    createDividingLines();
    createUSMarker();
    setupEventListeners();
});

function initMap() {
    map = L.map('map', {
        center: MAP_CONFIG.center,
        zoom: MAP_CONFIG.zoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        worldCopyJump: true
    });

    // Add tile layer (simple world map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        noWrap: false
    }).addTo(map);
}

function createHemisphereOverlays() {
    // Northern Hemisphere (lat 0 to 90)
    hemisphereOverlays.north = L.rectangle(
        [[0, -180], [90, 180]],
        {
            color: HEMISPHERE_COLORS.north.normal,
            weight: 0,
            fillColor: HEMISPHERE_COLORS.north.normal,
            fillOpacity: 0
        }
    ).addTo(map);

    // Southern Hemisphere (lat -90 to 0)
    hemisphereOverlays.south = L.rectangle(
        [[-90, -180], [0, 180]],
        {
            color: HEMISPHERE_COLORS.south.normal,
            weight: 0,
            fillColor: HEMISPHERE_COLORS.south.normal,
            fillOpacity: 0
        }
    ).addTo(map);

    // Eastern Hemisphere (lon 0 to 180)
    hemisphereOverlays.east = L.rectangle(
        [[-90, 0], [90, 180]],
        {
            color: HEMISPHERE_COLORS.east.normal,
            weight: 0,
            fillColor: HEMISPHERE_COLORS.east.normal,
            fillOpacity: 0
        }
    ).addTo(map);

    // Western Hemisphere (lon -180 to 0)
    hemisphereOverlays.west = L.rectangle(
        [[-90, -180], [90, 0]],
        {
            color: HEMISPHERE_COLORS.west.normal,
            weight: 0,
            fillColor: HEMISPHERE_COLORS.west.normal,
            fillOpacity: 0
        }
    ).addTo(map);
}

function createDividingLines() {
    // Equator (horizontal line at latitude 0)
    const equator = L.polyline(
        [[0, -180], [0, 180]],
        {
            color: '#E74C3C',
            weight: 3,
            opacity: 1,
            dashArray: null
        }
    ).addTo(map);
    lineOverlays.push(equator);

    // Equator label
    const equatorLabel = L.marker([5, 160], {
        icon: L.divIcon({
            className: 'line-label equator-label',
            html: 'Equator (0°)',
            iconSize: [80, 20]
        })
    }).addTo(map);
    lineOverlays.push(equatorLabel);

    // Prime Meridian (vertical line at longitude 0)
    const meridian = L.polyline(
        [[-90, 0], [90, 0]],
        {
            color: '#3498DB',
            weight: 3,
            opacity: 1,
            dashArray: null
        }
    ).addTo(map);
    lineOverlays.push(meridian);

    // Prime Meridian label
    const meridianLabel = L.marker([70, 5], {
        icon: L.divIcon({
            className: 'line-label meridian-label',
            html: 'Prime Meridian (0°)',
            iconSize: [120, 20]
        })
    }).addTo(map);
    lineOverlays.push(meridianLabel);
}

function createUSMarker() {
    // US marker (approximately center of continental US)
    const usIcon = L.divIcon({
        className: 'us-marker-container',
        html: '<div class="us-marker"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });

    usMarker = L.marker([39, -98], { icon: usIcon })
        .bindPopup('<b>United States</b><br>Northern & Western Hemispheres')
        .addTo(map);
}

function setupEventListeners() {
    // Hemisphere buttons
    document.querySelectorAll('.hemi-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const hemi = this.dataset.hemisphere;
            toggleHemisphere(hemi);
        });
    });

    // Lines toggle
    document.getElementById('btn-lines').addEventListener('click', toggleLines);

    // Show US hemispheres
    document.getElementById('btn-us').addEventListener('click', showUSHemispheres);
}

function toggleHemisphere(hemi) {
    // Update button states
    document.querySelectorAll('.hemi-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    if (highlightedHemisphere === hemi) {
        // Deselect
        highlightedHemisphere = null;
        hideInfo();
        updateOverlays();
    } else {
        // Select new hemisphere
        highlightedHemisphere = hemi;
        document.querySelector(`[data-hemisphere="${hemi}"]`).classList.add('active');
        showInfo(hemi);
        updateOverlays();
    }
}

function updateOverlays() {
    Object.keys(hemisphereOverlays).forEach(hemi => {
        const overlay = hemisphereOverlays[hemi];

        if (highlightedHemisphere === hemi) {
            // Highlight selected hemisphere
            overlay.setStyle({
                fillColor: HEMISPHERE_COLORS[hemi].highlight,
                fillOpacity: 0.4
            });
        } else if (highlightedHemisphere) {
            // Dim non-selected hemispheres
            overlay.setStyle({
                fillColor: HEMISPHERE_COLORS[hemi].normal,
                fillOpacity: 0.1
            });
        } else {
            // No selection - hide all overlays
            overlay.setStyle({
                fillOpacity: 0
            });
        }
    });
}

function showInfo(hemi) {
    const panel = document.getElementById('info-panel');
    document.getElementById('info-title').textContent = HEMISPHERE_COLORS[hemi].name;
    document.getElementById('info-desc').textContent = HEMISPHERE_DESCRIPTIONS[hemi];
    panel.classList.add('visible');
}

function hideInfo() {
    document.getElementById('info-panel').classList.remove('visible');
}

function toggleLines() {
    showLines = !showLines;
    const btn = document.getElementById('btn-lines');

    if (showLines) {
        btn.textContent = 'Lines: ON';
        btn.classList.add('active');
        lineOverlays.forEach(line => line.addTo(map));
    } else {
        btn.textContent = 'Lines: OFF';
        btn.classList.remove('active');
        lineOverlays.forEach(line => map.removeLayer(line));
    }
}

function showUSHemispheres() {
    // First show Northern
    toggleHemisphere('north');

    // Then show Western after delay
    setTimeout(() => {
        toggleHemisphere('west');
    }, 1500);

    // Then clear after another delay
    setTimeout(() => {
        toggleHemisphere('west'); // This will deselect since it's already selected
    }, 3000);

    // Open US marker popup
    usMarker.openPopup();
}
