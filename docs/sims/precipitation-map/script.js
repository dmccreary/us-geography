/* US Precipitation Map Script */

const MAP_CONFIG = {
    center: [39, -98],
    zoom: 4,
    minZoom: 3,
    maxZoom: 7
};

// Average annual precipitation by state (inches)
const precipitationData = {
    'Alabama': { value: 56, description: 'Humid subtropical' },
    'Alaska': { value: 34, description: 'Varies by region' },
    'Arizona': { value: 13, description: 'Desert climate' },
    'Arkansas': { value: 50, description: 'Humid subtropical' },
    'California': { value: 22, description: 'Varies widely' },
    'Colorado': { value: 17, description: 'Semi-arid' },
    'Connecticut': { value: 50, description: 'Humid continental' },
    'Delaware': { value: 45, description: 'Humid subtropical' },
    'Florida': { value: 54, description: 'Subtropical, rainy' },
    'Georgia': { value: 50, description: 'Humid subtropical' },
    'Hawaii': { value: 63, description: 'Tropical, very wet' },
    'Idaho': { value: 19, description: 'Semi-arid' },
    'Illinois': { value: 39, description: 'Humid continental' },
    'Indiana': { value: 41, description: 'Humid continental' },
    'Iowa': { value: 34, description: 'Humid continental' },
    'Kansas': { value: 28, description: 'Semi-arid plains' },
    'Kentucky': { value: 48, description: 'Humid subtropical' },
    'Louisiana': { value: 60, description: 'Humid subtropical' },
    'Maine': { value: 42, description: 'Humid continental' },
    'Maryland': { value: 43, description: 'Humid subtropical' },
    'Massachusetts': { value: 47, description: 'Humid continental' },
    'Michigan': { value: 32, description: 'Humid continental' },
    'Minnesota': { value: 27, description: 'Humid continental' },
    'Mississippi': { value: 56, description: 'Humid subtropical' },
    'Missouri': { value: 42, description: 'Humid continental' },
    'Montana': { value: 15, description: 'Semi-arid' },
    'Nebraska': { value: 23, description: 'Semi-arid plains' },
    'Nevada': { value: 10, description: 'Desert, driest state' },
    'New Hampshire': { value: 44, description: 'Humid continental' },
    'New Jersey': { value: 46, description: 'Humid subtropical' },
    'New Mexico': { value: 14, description: 'Semi-arid desert' },
    'New York': { value: 41, description: 'Humid continental' },
    'North Carolina': { value: 50, description: 'Humid subtropical' },
    'North Dakota': { value: 17, description: 'Semi-arid' },
    'Ohio': { value: 39, description: 'Humid continental' },
    'Oklahoma': { value: 36, description: 'Humid subtropical' },
    'Oregon': { value: 28, description: 'Varies, wet coast' },
    'Pennsylvania': { value: 42, description: 'Humid continental' },
    'Rhode Island': { value: 47, description: 'Humid continental' },
    'South Carolina': { value: 49, description: 'Humid subtropical' },
    'South Dakota': { value: 20, description: 'Semi-arid' },
    'Tennessee': { value: 54, description: 'Humid subtropical' },
    'Texas': { value: 28, description: 'Varies widely' },
    'Utah': { value: 12, description: 'Semi-arid desert' },
    'Vermont': { value: 42, description: 'Humid continental' },
    'Virginia': { value: 44, description: 'Humid subtropical' },
    'Washington': { value: 38, description: 'Wet west, dry east' },
    'West Virginia': { value: 45, description: 'Humid continental' },
    'Wisconsin': { value: 32, description: 'Humid continental' },
    'Wyoming': { value: 13, description: 'Semi-arid' }
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
            this._div.innerHTML = '<h4>US Precipitation</h4><p>Hover over a state</p>';
            return;
        }
        const data = precipitationData[name] || { value: 'N/A', description: '' };
        this._div.innerHTML = `
            <h4>${name}</h4>
            <p class="value">${data.value}" per year</p>
            <p class="description">${data.description}</p>
        `;
    };

    infoControl.addTo(map);
}

function getColor(value) {
    return value > 60 ? '#004529' :
           value > 45 ? '#006837' :
           value > 30 ? '#41ab5d' :
           value > 15 ? '#addd8e' :
                        '#f7fcb9';
}

function styleState(feature) {
    const name = feature.properties.name;
    const data = precipitationData[name];
    const value = data ? data.value : 30;

    return {
        fillColor: getColor(value),
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
