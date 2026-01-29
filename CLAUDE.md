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

### Fractional Zoom Levels

Leaflet supports fractional zoom levels (e.g., 3.5, 4.2), but by default snaps to integers when users zoom. To enable smooth fractional zooming, add `zoomSnap` and `zoomDelta` to the map options:

```javascript
map = L.map('map', {
    center: [centerLat, centerLng],
    zoom: 3.5,
    zoomSnap: 0.5,    // Allow zoom to snap to 0.5 increments (3, 3.5, 4, 4.5, etc.)
    zoomDelta: 0.5    // Each zoom button/scroll changes zoom by 0.5
});
```

Without these options, setting `ZOOM = 3.5` will work for the initial view, but zooming will jump between integers (3, 4, 5...) causing jarring transitions.

### Map Instructions Footer

Always include a footer instruction area below the map that explains both hover and click interactions:

```html
<div class="hover-instruction">Hover over a state to see details. Click on a state to zoom in.</div>
```

This helps users discover the interactive features of the map.

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

### p5.js Celebration Implementation Guidelines

1. **Use a container div, not a canvas element** for p5.js celebrations:
   ```html
   <!-- Correct -->
   <div id="celebrationCanvas"></div>

   <!-- Wrong - p5.js can't parent to a canvas -->
   <canvas id="celebrationCanvas"></canvas>
   ```

2. **CSS for celebration overlay**:
   ```css
   #celebrationCanvas {
       position: fixed;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       pointer-events: none;
       z-index: 9999;
   }
   #celebrationCanvas canvas {
       position: fixed;
       top: 0;
       left: 0;
       pointer-events: none;
   }
   ```

3. **Two celebration types**:
   - **Mini celebration**: Small star burst from center (15-30 particles) - use for each correct answer
   - **Big celebration**: Confetti rain + multiple star bursts - use for completing a quiz/challenge

4. **Particle visibility**: Start confetti in the visible area (top 30% of screen), not off-screen at negative Y values, so users see immediate feedback

5. **Celebration triggers**:
   - Mini: After each correct answer during a quiz
   - Big: When the final question is answered correctly (not based on score percentage)

### Reference Example
- State Capitals: `docs/sims/capitals/script.js` - ConfettiParticle and StarParticle classes with p5.js instance mode

## Post-Generation Steps

After generating a new MicroSim or updating a MicroSim:
1. Run `~/.local/bin/bk-capture-screenshot` to create a screen image of the MicroSim
2. Run the `/microsim-utils` skill for standardization
3. Run the Claude skill `>/microsim-util update the microsim index`
