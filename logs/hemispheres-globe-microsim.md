# Earth's Hemispheres Interactive Globe MicroSim - Development Log

**Date:** 2026-01-28
**MicroSim:** hemispheres-globe
**Location:** `/docs/sims/hemispheres-globe/`

## Overview

Created an interactive Leaflet.js map to help elementary students (grades 3-6) understand how the Earth is divided into four hemispheres by the Equator and Prime Meridian.

## Specification

From Chapter 1 (`docs/chapters/01-introduction-to-geography/index.md`), lines 223-262:

- **Learning Objective:** Students will identify (L1) and explain (L2) the four hemispheres and how they divide the Earth
- **Bloom Level:** Understand
- **Bloom Verbs:** identify, explain, classify

### Visual Elements
- Simple circular Earth representation (2D projection)
- Equator line (horizontal) in red
- Prime Meridian line (vertical) in blue
- Four quadrants colored differently
- Labels for each hemisphere
- Small dot showing approximate US location

### Interactive Controls
- Buttons to highlight each hemisphere (North, South, East, West)
- Toggle to show/hide the dividing lines
- Hover over each section to see hemisphere name

## Files Created

1. `main.html` - HTML structure with Leaflet CDN links
2. `style.css` - Map and control panel styling
3. `script.js` - Leaflet map logic with hemisphere overlays
4. `index.md` - Documentation with lesson plan
5. `metadata.json` - Dublin Core metadata

## Development Process

### Initial Approach: p5.js (Rejected)

First attempted to create the MicroSim using p5.js with canvas-based controls. User rejected this approach.

### Second Approach: Vanilla JavaScript + SVG (Rejected)

Rewrote using vanilla JavaScript with SVG elements. User requested using the map template instead.

### Final Approach: Leaflet.js (Accepted)

Used the map-guide.md reference from `/Users/dan/Documents/ws/claude-skills/skills/microsim-generator/references/map-guide.md` to create a Leaflet-based implementation.

**Key Implementation Details:**

1. **World Map with Overlays**
   - Used OpenStreetMap tile layer
   - Created rectangle overlays for each hemisphere
   - Hemispheres defined by lat/lon bounds:
     - North: [[0, -180], [90, 180]]
     - South: [[-90, -180], [0, 180]]
     - East: [[-90, 0], [90, 180]]
     - West: [[-90, -180], [90, 0]]

2. **Dividing Lines**
   - Equator: Red polyline at latitude 0
   - Prime Meridian: Blue polyline at longitude 0
   - Labels using Leaflet divIcon markers

3. **US Marker**
   - Positioned at approximately [39, -98] (center of continental US)
   - Custom red marker with popup showing hemisphere info

4. **Control Panel**
   - HTML buttons outside the Leaflet map
   - Four hemisphere buttons with matching colors
   - Lines toggle button
   - "Show US Hemispheres" animated demonstration

## Style Adjustments

### Info Panel Position
- Initial: `top: 80px; left: 10px` (top-left)
- Changed to: `bottom: 90px; left: 10px` (lower-left, over southern Pacific)
- Adjusted to: `bottom: 20px` (moved down 70px)
- Final: `bottom: 40px` (moved up 20px)

### Button Position
- Added `margin-left: 100px` to `.button-row` to shift all buttons right

## Hemisphere Colors

| Hemisphere | Normal Color | Highlight Color |
|------------|--------------|-----------------|
| North | #AED6F1 | #5DADE2 |
| South | #ABEBC6 | #58D68D |
| East | #F9E79F | #F4D03F |
| West | #F5B7B1 | #EC7063 |

## Key Lesson Learned

**Use the appropriate visualization library for the content type:**
- For geographic/map visualizations → Use Leaflet.js (map-guide.md)
- For custom animations/simulations → Use p5.js with canvas-based controls
- For data charts → Use Chart.js
- For network diagrams → Use vis-network

The microsim-generator routing table in the skill helps identify the right library based on keywords in the request.

## Final Features

- Interactive world map using Leaflet.js
- Four hemisphere overlay rectangles with click-to-highlight
- Equator (red) and Prime Meridian (blue) dividing lines
- Toggle to show/hide dividing lines
- US location marker with popup
- "Show US Hemispheres" button for animated demonstration
- Info panel showing hemisphere name and description
- Responsive design with mobile breakpoints

## Navigation Updates

- Added to `mkdocs.yml` under MicroSims section
- Added to `docs/sims/index.md` table of available simulations
- iframe in Chapter 1 points to `../../sims/hemispheres-globe/main.html`

## References Used

- `/Users/dan/Documents/ws/claude-skills/skills/microsim-generator/references/map-guide.md`
- Leaflet.js documentation: https://leafletjs.com/
- OpenStreetMap tile layer
