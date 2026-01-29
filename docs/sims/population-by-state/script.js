/* US Population Map Script
 * Shows total population or population density by state
 */

// =============================================================================
// MAP VIEW CONFIGURATION
// =============================================================================
const HORIZONTAL_PAN = 5;
const VERTICAL_PAN = 0;
const ZOOM =3.5;

const BASE_CENTER_LAT = 39;
const BASE_CENTER_LNG = -98;

const MAP_CONFIG = {
    center: [BASE_CENTER_LAT + VERTICAL_PAN, BASE_CENTER_LNG + HORIZONTAL_PAN],
    zoom: ZOOM,
    minZoom: 3,
    maxZoom: 7
};

// Population data by state (2023 estimates)
// population in millions, area in square miles, density = people per square mile
const populationData = {
    'Alabama': { population: 5.1, area: 52420, density: 97 },
    'Alaska': { population: 0.73, area: 665384, density: 1 },
    'Arizona': { population: 7.4, area: 113990, density: 65 },
    'Arkansas': { population: 3.0, area: 53179, density: 57 },
    'California': { population: 39.0, area: 163695, density: 238 },
    'Colorado': { population: 5.9, area: 104094, density: 57 },
    'Connecticut': { population: 3.6, area: 5543, density: 649 },
    'Delaware': { population: 1.0, area: 2489, density: 402 },
    'Florida': { population: 22.6, area: 65758, density: 344 },
    'Georgia': { population: 11.0, area: 59425, density: 185 },
    'Hawaii': { population: 1.4, area: 10932, density: 128 },
    'Idaho': { population: 2.0, area: 83569, density: 24 },
    'Illinois': { population: 12.6, area: 57914, density: 218 },
    'Indiana': { population: 6.8, area: 36420, density: 187 },
    'Iowa': { population: 3.2, area: 56273, density: 57 },
    'Kansas': { population: 2.9, area: 82278, density: 35 },
    'Kentucky': { population: 4.5, area: 40408, density: 111 },
    'Louisiana': { population: 4.6, area: 52378, density: 88 },
    'Maine': { population: 1.4, area: 35380, density: 40 },
    'Maryland': { population: 6.2, area: 12406, density: 500 },
    'Massachusetts': { population: 7.0, area: 10554, density: 663 },
    'Michigan': { population: 10.0, area: 96714, density: 103 },
    'Minnesota': { population: 5.7, area: 86936, density: 66 },
    'Mississippi': { population: 2.9, area: 48432, density: 60 },
    'Missouri': { population: 6.2, area: 69707, density: 89 },
    'Montana': { population: 1.1, area: 147040, density: 7 },
    'Nebraska': { population: 2.0, area: 77348, density: 26 },
    'Nevada': { population: 3.2, area: 110572, density: 29 },
    'New Hampshire': { population: 1.4, area: 9349, density: 150 },
    'New Jersey': { population: 9.3, area: 8723, density: 1066 },
    'New Mexico': { population: 2.1, area: 121590, density: 17 },
    'New York': { population: 19.5, area: 54555, density: 358 },
    'North Carolina': { population: 10.7, area: 53819, density: 199 },
    'North Dakota': { population: 0.78, area: 70698, density: 11 },
    'Ohio': { population: 11.8, area: 44826, density: 263 },
    'Oklahoma': { population: 4.0, area: 69899, density: 57 },
    'Oregon': { population: 4.2, area: 98379, density: 43 },
    'Pennsylvania': { population: 13.0, area: 46054, density: 282 },
    'Rhode Island': { population: 1.1, area: 1545, density: 712 },
    'South Carolina': { population: 5.3, area: 32020, density: 166 },
    'South Dakota': { population: 0.91, area: 77116, density: 12 },
    'Tennessee': { population: 7.1, area: 42144, density: 168 },
    'Texas': { population: 30.5, area: 268596, density: 114 },
    'Utah': { population: 3.4, area: 84897, density: 40 },
    'Vermont': { population: 0.65, area: 9616, density: 68 },
    'Virginia': { population: 8.6, area: 42775, density: 201 },
    'Washington': { population: 7.8, area: 71298, density: 109 },
    'West Virginia': { population: 1.8, area: 24230, density: 74 },
    'Wisconsin': { population: 5.9, area: 65496, density: 90 },
    'Wyoming': { population: 0.58, area: 97813, density: 6 }
};

const STATES_GEOJSON_URL = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

let map, geojsonLayer, infoControl;
let currentMetric = 'population'; // 'population' or 'density'

function init() {
    initMap();
    loadStates();
    setupControls();
}

function initMap() {
    map = L.map('map', {
        zoomControl: true,
        scrollWheelZoom: true,
        zoomSnap: 0.5,    // Allow fractional zoom levels (snaps to 0.5 increments)
        zoomDelta: 0.5    // Each zoom click/scroll changes by 0.5
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

    infoControl.update = function(name) {
        if (!name) {
            const title = currentMetric === 'population' ? 'US Population' : 'Population Density';
            this._div.innerHTML = `<h4>${title}</h4><p>Hover over a state</p>`;
            return;
        }
        const data = populationData[name] || { population: 0, density: 0 };
        if (currentMetric === 'population') {
            const popDisplay = data.population >= 1
                ? data.population.toFixed(1) + ' million'
                : (data.population * 1000).toFixed(0) + ' thousand';
            this._div.innerHTML = `
                <h4>${name}</h4>
                <p class="value">${popDisplay}</p>
                <p class="description">Total population</p>
            `;
        } else {
            this._div.innerHTML = `
                <h4>${name}</h4>
                <p class="value">${data.density} per sq mi</p>
                <p class="description">Population density</p>
            `;
        }
    };

    infoControl.addTo(map);
}

function setupControls() {
    document.getElementById('populationBtn').addEventListener('click', () => setMetric('population'));
    document.getElementById('densityBtn').addEventListener('click', () => setMetric('density'));
    document.getElementById('resetBtn').addEventListener('click', resetZoom);
}

function resetZoom() {
    map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
}

function setMetric(metric) {
    currentMetric = metric;

    // Update button states
    document.getElementById('populationBtn').classList.toggle('active', metric === 'population');
    document.getElementById('densityBtn').classList.toggle('active', metric === 'density');

    // Update legend
    updateLegend();

    // Restyle the map
    if (geojsonLayer) {
        geojsonLayer.setStyle(styleState);
    }

    // Update info panel
    infoControl.update();
}

function updateLegend() {
    const legendTitle = document.getElementById('legendTitle');
    const legendScale = document.getElementById('legendScale');

    if (currentMetric === 'population') {
        legendTitle.textContent = 'Population (millions)';
        legendScale.innerHTML = `
            <div class="legend-item"><i style="background: #fee5d9;"></i> &lt;1M</div>
            <div class="legend-item"><i style="background: #fcae91;"></i> 1-5M</div>
            <div class="legend-item"><i style="background: #fb6a4a;"></i> 5-10M</div>
            <div class="legend-item"><i style="background: #de2d26;"></i> 10-20M</div>
            <div class="legend-item"><i style="background: #a50f15;"></i> 20M+</div>
        `;
    } else {
        legendTitle.textContent = 'Density (people/sq mi)';
        legendScale.innerHTML = `
            <div class="legend-item"><i style="background: #fee5d9;"></i> &lt;25</div>
            <div class="legend-item"><i style="background: #fcae91;"></i> 25-100</div>
            <div class="legend-item"><i style="background: #fb6a4a;"></i> 100-300</div>
            <div class="legend-item"><i style="background: #de2d26;"></i> 300-500</div>
            <div class="legend-item"><i style="background: #a50f15;"></i> 500+</div>
        `;
    }
}

function getColorPopulation(value) {
    return value > 20 ? '#a50f15' :
           value > 10 ? '#de2d26' :
           value > 5  ? '#fb6a4a' :
           value > 1  ? '#fcae91' :
                        '#fee5d9';
}

function getColorDensity(value) {
    return value > 500 ? '#a50f15' :
           value > 300 ? '#de2d26' :
           value > 100 ? '#fb6a4a' :
           value > 25  ? '#fcae91' :
                         '#fee5d9';
}

function styleState(feature) {
    const name = feature.properties.name;
    const data = populationData[name];

    let fillColor;
    if (currentMetric === 'population') {
        fillColor = getColorPopulation(data ? data.population : 0);
    } else {
        fillColor = getColorDensity(data ? data.density : 0);
    }

    return {
        fillColor: fillColor,
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.8
    };
}

async function loadStates() {
    try {
        const response = await fetch(STATES_GEOJSON_URL);
        const data = await response.json();

        geojsonLayer = L.geoJSON(data, {
            style: styleState,
            onEachFeature: function(feature, layer) {
                layer.on({
                    mouseover: function(e) {
                        e.target.setStyle({ weight: 3, color: '#333', fillOpacity: 0.9 });
                        e.target.bringToFront();
                        infoControl.update(feature.properties.name);
                    },
                    mouseout: function(e) {
                        geojsonLayer.resetStyle(e.target);
                        infoControl.update();
                    },
                    click: function(e) {
                        map.fitBounds(e.target.getBounds());
                    }
                });
            }
        }).addTo(map);
    } catch (error) {
        console.error('Error loading states:', error);
    }
}

document.addEventListener('DOMContentLoaded', init);
