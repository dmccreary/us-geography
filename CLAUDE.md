# US Geography Project Instructions

## MicroSim Library Selection

- For MicroSims that involve maps or geographic visualizations, **strongly prefer Leaflet.js** (using map-guide.md) over vanilla p5.js
- Leaflet.js provides built-in map tiles, zoom/pan controls, markers, and geographic coordinate handling
- Reference: `/Users/dan/Documents/ws/claude-skills/skills/microsim-generator/references/map-guide.md`

## Map Boundaries

- **Always use high-quality Natural Earth GeoJSON** for country/state boundaries instead of hand-drawn simplified polygons
- Natural Earth 110m scale provides good detail with reasonable file sizes
- GeoJSON source: `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/`
  - Countries: `ne_110m_admin_0_countries.geojson`
  - US States: `ne_110m_admin_1_states_provinces.geojson`
- Never create coarse hand-drawn coordinate arrays for geographic boundaries

### Implementation Pattern for Leaflet + Natural Earth GeoJSON

1. **Define the GeoJSON URL** at the top of the script:
   ```javascript
   const STATES_GEOJSON_URL = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_1_states_provinces.geojson';
   ```

2. **Create an async loading function** that fetches and filters the GeoJSON:
   ```javascript
   async function loadStateBoundaries() {
       const response = await fetch(STATES_GEOJSON_URL);
       const geoData = await response.json();

       geoData.features.forEach(feature => {
           const stateName = feature.properties.name;  // Natural Earth uses 'name' property

           if (targetStateNames.includes(stateName)) {
               const layer = L.geoJSON(feature, {
                   style: { fillColor: color, fillOpacity: 0.3, color: color, weight: 2 }
               }).addTo(map);

               // Add event handlers
               layer.on('click', () => handleClick(stateName));
               layer.on('mouseover', () => layer.setStyle({ fillOpacity: 0.5 }));
               layer.on('mouseout', () => layer.setStyle({ fillOpacity: 0.3 }));
           }
       });
   }
   ```

3. **Make init() async** and await the boundary loading:
   ```javascript
   async function init() {
       // ... map setup ...
       await loadStateBoundaries();
       // ... rest of initialization ...
   }
   ```

4. **Add error handling** with a user-friendly loading message for network failures

5. **Update attribution** to credit Natural Earth:
   ```javascript
   L.tileLayer('...', {
       attribution: '© OpenStreetMap © CARTO | <a href="https://www.naturalearthdata.com/">Natural Earth</a>'
   })
   ```

### Map View Configuration

Always define configurable pan and zoom variables at the top of map scripts:

```javascript
// HORIZONTAL_PAN: Shifts the map east or west
//   - Negative values move the map CENTER west (states appear to shift RIGHT)
//   - Positive values move the map CENTER east (states appear to shift LEFT)
//
// VERTICAL_PAN: Shifts the map north or south
//   - Positive values move the map CENTER north (states appear to shift DOWN)
//   - Negative values move the map CENTER south (states appear to shift UP)
//
// ZOOM: Controls the zoom level
//   - Higher values = more zoomed in (closer view)
//   - Lower values = more zoomed out (wider view)
const HORIZONTAL_PAN = 8;   // Adjust to prevent info box from covering states
const VERTICAL_PAN = 0;
const ZOOM = 4;

const BASE_CENTER_LAT = 42;
const BASE_CENTER_LNG = -90;
```

Then use in `init()` and `resetView()`:
```javascript
const centerLat = BASE_CENTER_LAT + VERTICAL_PAN;
const centerLng = BASE_CENTER_LNG + HORIZONTAL_PAN;
map.setView([centerLat, centerLng], ZOOM);
```

### Reference Examples
- Countries: `docs/sims/locate-usa/script.js` - filters `ne_110m_admin_0_countries.geojson` for USA, Canada, Mexico
- US States: `docs/sims/midwest-states/script.js` - filters `ne_110m_admin_1_states_provinces.geojson` for Midwest states

## MicroSim Controls

- For p5.js MicroSims, always use canvas-based controls (draw buttons/sliders directly on the canvas using rect(), text(), etc. and handle interaction in mousePressed()/mouseDragged())
- Do not use p5.js DOM functions like createButton(), createSlider(), createCheckbox(), etc. as they have positioning issues when embedded in iframes

## MicroSim Styling

- Use **aliceblue** for the background of all MicroSims
- Place all controls at the bottom of the canvas with a **white background**
- Always use color names (e.g., `aliceblue`, `white`, `red`) instead of hex codes

## Celebration Animations

- Add celebration animations at the end of quizzes or when students complete difficult tasks
- Use the `celebration-animation-generator` skill for all p5.js MicroSims that need reward feedback
- Common triggers: completing all quiz questions, achieving a high score, finishing a challenge
- Reference: `/Users/dan/.claude/skills/microsim-generator/references/celebration-guide.md`

## Post-Generation Steps

After generating a new MicroSim or updating a MicroSim:
1. Run `~/.local/bin/bk-capture-screenshot` to create a screen image of the MicroSim
2. Run the `/microsim-utils` skill for standardization
3. Run the Claude skill `>/microsim-util update the microsim index`
