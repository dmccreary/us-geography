/* US Population Density Map Script */

const MAP_CONFIG = {
    center: [39, -98],
    zoom: 4,
    minZoom: 3,
    maxZoom: 7
};

// Population density by state (people per square mile, 2020 census)
const populationData = {
    'Alabama': { density: 99, population: '5.0M', rank: 27 },
    'Alaska': { density: 1, population: '733K', rank: 50 },
    'Arizona': { density: 64, population: '7.2M', rank: 33 },
    'Arkansas': { density: 58, population: '3.0M', rank: 34 },
    'California': { density: 253, population: '39.5M', rank: 11 },
    'Colorado': { density: 56, population: '5.8M', rank: 37 },
    'Connecticut': { density: 738, population: '3.6M', rank: 4 },
    'Delaware': { density: 508, population: '990K', rank: 6 },
    'Florida': { density: 410, population: '21.5M', rank: 8 },
    'Georgia': { density: 185, population: '10.7M', rank: 18 },
    'Hawaii': { density: 226, population: '1.5M', rank: 13 },
    'Idaho': { density: 22, population: '1.9M', rank: 44 },
    'Illinois': { density: 228, population: '12.8M', rank: 12 },
    'Indiana': { density: 189, population: '6.8M', rank: 16 },
    'Iowa': { density: 57, population: '3.2M', rank: 36 },
    'Kansas': { density: 36, population: '2.9M', rank: 40 },
    'Kentucky': { density: 113, population: '4.5M', rank: 23 },
    'Louisiana': { density: 107, population: '4.7M', rank: 25 },
    'Maine': { density: 44, population: '1.4M', rank: 38 },
    'Maryland': { density: 636, population: '6.2M', rank: 5 },
    'Massachusetts': { density: 901, population: '7.0M', rank: 3 },
    'Michigan': { density: 177, population: '10.0M', rank: 17 },
    'Minnesota': { density: 71, population: '5.7M', rank: 31 },
    'Mississippi': { density: 63, population: '3.0M', rank: 32 },
    'Missouri': { density: 89, population: '6.2M', rank: 28 },
    'Montana': { density: 8, population: '1.1M', rank: 48 },
    'Nebraska': { density: 25, population: '2.0M', rank: 43 },
    'Nevada': { density: 28, population: '3.1M', rank: 42 },
    'New Hampshire': { density: 153, population: '1.4M', rank: 21 },
    'New Jersey': { density: 1263, population: '9.3M', rank: 1 },
    'New Mexico': { density: 17, population: '2.1M', rank: 45 },
    'New York': { density: 411, population: '20.2M', rank: 7 },
    'North Carolina': { density: 218, population: '10.4M', rank: 15 },
    'North Dakota': { density: 11, population: '779K', rank: 47 },
    'Ohio': { density: 288, population: '11.8M', rank: 10 },
    'Oklahoma': { density: 58, population: '4.0M', rank: 35 },
    'Oregon': { density: 44, population: '4.2M', rank: 39 },
    'Pennsylvania': { density: 291, population: '13.0M', rank: 9 },
    'Rhode Island': { density: 1061, population: '1.1M', rank: 2 },
    'South Carolina': { density: 170, population: '5.1M', rank: 19 },
    'South Dakota': { density: 12, population: '887K', rank: 46 },
    'Tennessee': { density: 167, population: '6.9M', rank: 20 },
    'Texas': { density: 111, population: '29.1M', rank: 24 },
    'Utah': { density: 39, population: '3.3M', rank: 41 },
    'Vermont': { density: 69, population: '643K', rank: 30 },
    'Virginia': { density: 218, population: '8.6M', rank: 14 },
    'Washington': { density: 117, population: '7.6M', rank: 22 },
    'West Virginia': { density: 74, population: '1.8M', rank: 29 },
    'Wisconsin': { density: 108, population: '5.9M', rank: 26 },
    'Wyoming': { density: 6, population: '577K', rank: 49 }
};

const STATES_GEOJSON_URL = 'https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json';

let map, geojsonLayer, infoControl;

function init() {
    initMap();
    loadStates();
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

    infoControl.update = function(name) {
        if (!name) {
            this._div.innerHTML = '<h4>US Population</h4><p>Hover over a state</p>';
            return;
        }
        const data = populationData[name] || { density: 'N/A', population: 'N/A', rank: 'N/A' };
        this._div.innerHTML = `
            <h4>${name}</h4>
            <p class="value">${data.density} people/sq mi</p>
            <p>Population: ${data.population}</p>
            <p class="rank">Density rank: #${data.rank} of 50</p>
        `;
    };

    infoControl.addTo(map);
}

function getColor(density) {
    return density > 500 ? '#006837' :
           density > 250 ? '#31a354' :
           density > 100 ? '#78c679' :
           density > 25  ? '#c2e699' :
                           '#ffffcc';
}

function styleState(feature) {
    const name = feature.properties.name;
    const data = populationData[name];
    const density = data ? data.density : 50;

    return {
        fillColor: getColor(density),
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
