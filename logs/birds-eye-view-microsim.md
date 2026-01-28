# Bird's Eye View Comparison MicroSim - Development Log

**Date:** 2026-01-28
**MicroSim:** birds-eye-view
**Location:** `/docs/sims/birds-eye-view/`

## Overview

Created an interactive MicroSim to help elementary students (grades 3-6) understand how maps show places from above by comparing a 3D isometric view with a 2D map view.

## Specification

From Chapter 1 (`docs/chapters/01-introduction-to-geography/index.md`):

- **Learning Objective:** Help students understand (L2) how maps show places from above by comparing a 3D scene to its map view
- **Bloom Level:** Understand
- **Bloom Verbs:** explain, compare

### Visual Elements

- Left panel: 3D isometric view of a simple neighborhood with houses, trees, roads, and a pond
- Right panel: Same neighborhood shown as a simple map from above
- Matching colors between 3D objects and map symbols

### Interactive Controls

- Highlight buttons for each element (House, Tree, Road, Pond)
- Toggle switch to show/hide labels on the map
- Clicking objects in either view highlights them in both views

## Files Created

1. `birds-eye-view.js` - Main p5.js sketch
2. `main.html` - HTML container
3. `index.md` - Documentation with lesson plan
4. `metadata.json` - Dublin Core metadata

## Development Issues and Solutions

### Issue 1: DOM Buttons Not Working in iframe

**Problem:** Initial implementation used p5.js DOM functions (`createButton()`) to create interactive buttons. These buttons did not respond to clicks when the MicroSim was embedded in an iframe.

**Symptoms:**
- Buttons rendered but clicks had no effect
- Labels toggle showed no change
- Restarting mkdocs serve did not help

**Root Cause:** p5.js DOM elements use absolute positioning relative to the page, which causes positioning issues when embedded in iframes within MkDocs pages.

**Solution:** Rewrote all controls to be canvas-based:
- Store button definitions as simple objects with x, y, w, h properties
- Draw buttons directly on canvas using `rect()` and `text()`
- Handle click detection in `mousePressed()` by checking if click coordinates fall within button bounds

```javascript
// Button definition
buttons.push({
    x: startX,
    y: buttonY,
    w: buttonWidth,
    h: buttonHeight,
    label: 'House',
    color: '#E74C3C',
    element: 'house',
    type: 'highlight'
});

// Click detection in mousePressed()
for (let btn of buttons) {
    if (mouseX >= btn.x && mouseX <= btn.x + btn.w &&
        mouseY >= btn.y && mouseY <= btn.y + btn.h) {
        // Handle click
    }
}
```

### Issue 2: Labels Toggle Logic

**Problem:** Initial implementation only showed labels when both `showLabels` was true AND the specific element was highlighted.

**Solution:** Changed logic to show all labels when `showLabels` is true, regardless of which element is highlighted.

### Issue 3: Label Positioning

**Problem:** House label was overlapping with the house symbol.

**Solution:** Adjusted y-coordinate from `centerY - 5` to `centerY + 30` to move label below the house.

## Style Changes

- Background changed from beige (`#F5F5DC`) to `aliceblue`
- Control area changed from gray (`#E8E8E8`) to white with 1px silver border

## Key Lesson Learned

**Always use canvas-based controls for p5.js MicroSims**, not p5.js DOM functions. This rule was added to `~/.claude/CLAUDE.md`:

> For p5.js MicroSims, always use canvas-based controls (draw buttons/sliders directly on the canvas using rect(), text(), etc. and handle interaction in mousePressed()/mouseDragged()). Do not use p5.js DOM functions like createButton(), createSlider(), createCheckbox(), etc. as they have positioning issues when embedded in iframes.

## Final Features

- Split-view comparison (50% isometric 3D, 50% 2D map)
- Four element highlight buttons (House, Tree, Road, Pond) with matching colors
- Labels toggle (ON/OFF) showing element names on the map
- Click directly on objects in either view to highlight
- Gold glow effect on highlighted elements
- Pulsing gold border around both views when element is selected
- Map legend always visible
- Responsive width design
- Canvas height: 460px (400px draw area + 60px controls)

## Navigation Updates

- Added to `mkdocs.yml` under MicroSims section
- Added to `docs/sims/index.md` table of available simulations
- iframe already present in Chapter 1 at correct path
