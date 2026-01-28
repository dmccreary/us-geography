---
title: Bird's Eye View Comparison
description: Interactive comparison showing how maps represent places from above by matching 3D objects to their 2D map symbols
image: birds-eye-view.png
quality_score: 85
---

# Bird's Eye View Comparison

<iframe src="main.html" width="100%" height="462" scrolling="no" style="border: 1px solid #ccc; border-radius: 8px; overflow: hidden;"></iframe>

[View Fullscreen](main.html){ .md-button}

## About This MicroSim

This interactive simulation helps students understand the fundamental concept of how maps show places from a bird's eye view (looking down from above). The side-by-side comparison connects familiar 3D objects with their 2D map representations.

## Learning Objectives

After using this simulation, students will be able to:

- **Explain** how a map shows places from above (bird's eye view)
- **Compare** 3D objects to their corresponding map symbols
- **Identify** common map symbols for houses, trees, roads, and water features

## How to Use

1. **Click the colored buttons** (House, Tree, Road, Pond) to highlight that element in both views
2. **Click directly on objects** in either the 3D view or the map view to highlight them
3. **Toggle labels** on/off using the Labels button to see or hide element names
4. **Observe** how the same object looks different from the side (3D) versus from above (map)

## Key Concepts

| 3D Object | Map Symbol | Why It Looks Different |
|-----------|------------|------------------------|
| House with roof | Rectangle | You see the roof from above, not the walls |
| Tree with trunk | Circle | You see the round treetop from above |
| Road | Long rectangle | Roads look like strips from above |
| Pond | Circle/oval | Water appears as a flat shape |

## Discussion Questions

1. Why do houses look like rectangles on a map instead of houses?
2. If you were a bird flying overhead, what would your school look like?
3. How does the map legend (key) help you understand what the symbols mean?

---

## Lesson Plan

### Grade Level
3-6

### Duration
15-20 minutes

### Materials Needed
- Computer or tablet with web browser
- Projector for whole-class instruction (optional)

### Warm-Up (3 minutes)
Ask students: "If you were a bird flying high above our school, what would the playground look like? What about the parking lot?"

### Main Activity (10 minutes)

1. **Introduce the simulation** (2 min)
   - Show students both views side by side
   - Explain that the left shows how we normally see things, and the right shows how they look from above

2. **Guided exploration** (5 min)
   - Click each button together as a class
   - Ask students to predict what each element will look like before revealing
   - Discuss why shapes change when viewed from above

3. **Independent practice** (3 min)
   - Students explore on their own devices
   - Challenge: Can you highlight all four elements?

### Wrap-Up (5 minutes)
- Turn off labels and quiz students: "What does this symbol represent?"
- Have students draw a bird's eye view of their bedroom

### Assessment
- Can students correctly match 3D objects to map symbols?
- Can students explain WHY objects look different from above?

---

## References

- [National Geographic: How to Read a Map](https://education.nationalgeographic.org/resource/how-read-map/)
- [USGS Map Symbols](https://pubs.usgs.gov/gip/TopographicMapSymbols/topomapsymbols.pdf)
- Common Core Geography Standards for Grades 3-5

---

## Technical Details

**Library:** p5.js 1.9.0

**Canvas Size:** Responsive width × 460px height

**Features:**
- Click-to-highlight interaction pattern
- Synchronized highlighting across both views
- Toggle labels on/off
- Map legend display
- Direct object clicking in both views

## Source Code

- [birds-eye-view.js](birds-eye-view.js) - Main p5.js sketch
- [main.html](main.html) - HTML container

## Embedding

To embed this MicroSim in another page:

```html
<iframe
    src="main.html"
    width="100%"
    height="462"
    scrolling="no"
    style="border: 1px solid #ccc; border-radius: 8px;">
</iframe>
```
