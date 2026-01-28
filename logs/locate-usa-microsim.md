# Locate USA MicroSim Development Log

**Date:** 2026-01-28
**MicroSim:** Locating the United States
**Location:** `docs/sims/locate-usa/`

## Overview

Created an interactive Leaflet.js map MicroSim for Chapter 1 (Introduction to Geography) that helps students learn the geographic position of the United States relative to neighboring countries and oceans.

## Files Created

| File | Purpose |
|------|---------|
| `main.html` | HTML shell with Leaflet CDN links, quiz panel, controls |
| `style.css` | Styling with aliceblue background, animations, responsive design |
| `script.js` | Interactive map logic, quiz system, celebrations |
| `index.md` | MkDocs documentation page with lesson plan |
| `metadata.json` | Dublin Core metadata |

## Development Timeline

### Initial Creation
- Used `microsim-generator` skill with `map-guide` reference
- Created basic Leaflet map with hover regions for USA, Canada, Mexico
- Added quiz mode, label toggle, and reset view controls

### Iteration 1: High-Quality Boundaries
**User Request:** Map outlines are too coarse, use high quality outlines from open maps

**Solution:** Replaced hand-drawn simplified polygons with Natural Earth 110m GeoJSON boundaries
- Source: `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson`
- Added note to `CLAUDE.md` to always prefer Natural Earth GeoJSON for map boundaries

### Iteration 2: Zoom Adjustment
**User Request:** Zoom out 20% so Hawaii is clearly shown

**Solution:** Changed zoom from 3 to 2.4, adjusted center from [45, -100] to [40, -110]

### Iteration 3: Separate Alaska/Hawaii Hover
**User Request:** Add separate hover items for Alaska and Hawaii

**Solution:**
- Added Alaska and Hawaii as separate entries in regions object with their own facts
- Created invisible overlay polygons that capture mouse events
- Alaska: bounding polygon covering Alaska region
- Hawaii: visible circle marker with larger invisible hover area
- Updated legend to show Continental US, Alaska, and Hawaii separately

### Iteration 4: Map Position
**User Request:** Move map left so info box doesn't cover the US

**Solution:** User adjusted center to [50, -70] with comment explaining the offset

### Iteration 5: Quiz Enhancement
**User Request:**
- Only ask 8 total questions
- Add progress bar (e.g., "4 of 8 questions")
- Add gold star animation for each correct answer
- Show exploding star celebration for perfect score
- Each question asked once, random order

**Solution:**
- Added quiz tracking: `shuffledQuestions`, `currentQuestionIndex`, `TOTAL_QUESTIONS`
- Shuffle questions at quiz start, iterate through without repeats
- Added quiz header with progress display and stars container
- Gold star animation: scale/rotate pop effect when earned
- Celebration: 50 exploding stars with varying colors for perfect score
- "Try Again" button at quiz completion

## Key Features

### Interactive Map
- High-quality Natural Earth country boundaries
- Hover over USA, Canada, Mexico, Alaska, Hawaii for info panel
- Ocean labels (Atlantic, Pacific) with hover info
- Click to zoom on regions
- Toggle labels on/off
- Reset view button

### Quiz System
- 8 questions total, each asked once
- Random order each time
- Progress indicator: "Question X of 8"
- Gold stars earned for correct answers
- Exploding star celebration for perfect score
- Score tracking

### Educational Design
- **Bloom Level:** Understand (L2)
- **Bloom Verbs:** locate, describe, identify
- **Target Audience:** Elementary School (Grades 3-5)

## Configuration

```javascript
const MAP_CONFIG = {
    center: [50, -70],
    zoom: 2.4,
    minZoom: 2,
    maxZoom: 8
};
```

## Data Sources
- Country boundaries: Natural Earth 110m admin_0_countries
- Base map tiles: CARTO light_nolabels

## CLAUDE.md Updates

Added new section for Map Boundaries:
```markdown
## Map Boundaries

- **Always use high-quality Natural Earth GeoJSON** for country/state boundaries
- Natural Earth 110m scale provides good detail with reasonable file sizes
- GeoJSON source: `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/`
- Never create coarse hand-drawn coordinate arrays for geographic boundaries
```

## Navigation Update

Added to `mkdocs.yml`:
```yaml
- Locate USA: sims/locate-usa/index.md
```

## Lessons Learned

1. Always use high-quality GeoJSON from reputable sources (Natural Earth) rather than hand-drawing simplified boundaries
2. For non-contiguous regions (Alaska, Hawaii), use invisible overlay polygons to capture mouse events separately from the main country boundary
3. Map center positioning matters when overlaying UI elements - offset to avoid coverage
4. Quiz systems benefit from clear progress indicators and reward animations for engagement
