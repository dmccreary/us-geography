---
title: US Population Map
description: Interactive choropleth map showing population and population density by state
image: population-by-state.png
quality_score: 85
---

# US Population Map

An interactive map showing population statistics across the United States with a toggle to switch between total population and population density.

<iframe src="main.html" width="100%" height="500px" scrolling="no" style="overflow: hidden; border: 1px solid #ccc; border-radius: 8px;"></iframe>

[Run Full Screen MicroSim](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This choropleth map visualizes population patterns with two views:

**Total Population:**
- **Dark red** = Most populous states (20+ million)
- **Light pink** = Least populous states (under 1 million)

**Population Density:**
- **Dark red** = Most dense (500+ people per square mile)
- **Light pink** = Least dense (under 25 people per square mile)

Use the toggle buttons to switch between views. Hover over any state to see exact numbers.

## Key Concepts Demonstrated

- **California and Texas** have the largest total populations
- **New Jersey and Rhode Island** have the highest population density
- **Wyoming and Alaska** have both low population and low density
- Large states like Alaska and Montana can have many people but still be sparsely populated

## Lesson Plan

**Learning Objective:** Students will analyze the difference between total population and population density.

**Bloom's Taxonomy Level:** Analyze (L4)

**Activities:**

1. **Compare Views (5 min)**: Toggle between views - which states change color the most?
2. **Big vs Dense (5 min)**: Find states that are populous but not dense (Texas) and dense but not populous (Rhode Island)
3. **Discussion (5 min)**: Why might people live close together in some places but spread out in others?

## Technical Notes

- Built with Leaflet.js choropleth visualization
- State boundaries from PublicaMundi GeoJSON
- Population data from 2023 Census estimates

## Related Concepts

- Population
- Population Density
- Urban vs Rural
- Thematic Maps
