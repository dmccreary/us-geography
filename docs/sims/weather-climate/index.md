---
title: Weather vs Climate
description: Interactive comparison showing the difference between daily weather variation and long-term climate patterns
image: weather-climate.png
quality_score: 85
---

# Weather vs Climate

An interactive visualization that helps students understand the difference between weather (short-term) and climate (long-term patterns).

<iframe src="main.html" width="100%" height="400px" scrolling="no" style="overflow: hidden; border: 1px solid #ccc; border-radius: 8px;"></iframe>

[Run Full Screen MicroSim](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This side-by-side comparison shows:

- **Today's Weather** (left): Random daily conditions that change each time you click
- **Climate Pattern** (right): The consistent monthly average temperatures that stay the same

## How to Use

1. **Select a city** using the buttons at the bottom
2. Click **Change Day** to see how weather varies randomly
3. Notice that the **Climate Pattern** chart stays the same
4. Compare how today's temperature can be different from the average

## Key Concepts Demonstrated

- **Weather** changes daily - it can be hotter or colder than normal
- **Climate** is the long-term pattern - it's what you can expect on average
- Different cities have different climate patterns (desert, tropical, continental)
- Today's weather might differ from the climate average by 15+ degrees!

## Lesson Plan

**Learning Objective:** Students will distinguish between weather and climate through interactive examples.

**Bloom's Taxonomy Level:** Understand (L2)

**Activities:**

1. **Explore (5 min)**: Click "Change Day" 5-10 times for Phoenix. Notice how temperature varies but always tends toward hot.
2. **Compare Cities (5 min)**: Switch between cities and observe their different climate patterns.
3. **Discussion (5 min)**: Why does Seattle have more rain? Why is Phoenix so hot?
4. **Prediction (5 min)**: Before clicking "Change Day," predict if today will be hotter or colder than average.

## Technical Notes

- Built with p5.js for canvas-based rendering
- Real climate data for US cities (average monthly temperatures)
- Weather varies randomly but is influenced by climate probability

## Related Concepts

- Climate Definition
- Precipitation
- Seasons
- Regions Definition
