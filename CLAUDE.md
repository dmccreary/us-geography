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
