# US Geography Project Instructions

## MicroSim Library Selection

- For MicroSims that involve maps or geographic visualizations, **strongly prefer Leaflet.js** (using map-guide.md) over vanilla p5.js
- Leaflet.js provides built-in map tiles, zoom/pan controls, markers, and geographic coordinate handling
- Reference: `/Users/dan/Documents/ws/claude-skills/skills/microsim-generator/references/map-guide.md`

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

After generating a MicroSim:
1. Run `~/.local/bin/bk-capture-screenshot` to create a screen image of the MicroSim
2. Run the `/microsim-utils` skill for standardization
