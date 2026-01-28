---
title: US Precipitation Map
description: Interactive choropleth map showing average annual precipitation by state
image: precipitation-map.png
quality_score: 85
---

# US Precipitation Map

An interactive map showing average annual precipitation (rainfall) across the United States.

<iframe src="main.html" width="100%" height="450px" scrolling="no" style="overflow: hidden; border: 1px solid #ccc; border-radius: 8px;"></iframe>

[Run Full Screen MicroSim](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This choropleth map visualizes precipitation patterns:

- **Dark green** = Wettest states (60+ inches/year)
- **Light yellow** = Driest states (under 15 inches/year)
- Hover over any state to see exact precipitation data

## Key Concepts Demonstrated

- **Desert regions** (Southwest) receive the least precipitation
- **Gulf Coast and Southeast** receive the most rain
- **Pacific Northwest** coast is wet, but eastern Washington/Oregon are dry
- Precipitation affects what can grow and where people live

## Lesson Plan

**Learning Objective:** Students will analyze precipitation patterns and explain regional differences.

**Bloom's Taxonomy Level:** Analyze (L4)

**Activities:**

1. **Find Extremes (5 min)**: Identify the wettest and driest states
2. **Regional Patterns (5 min)**: Compare Southeast vs. Southwest precipitation
3. **Discussion (5 min)**: Why do coastal areas often get more rain?

## Technical Notes

- Built with Leaflet.js choropleth visualization
- State boundaries from PublicaMundi GeoJSON
- Data represents average annual precipitation

## Related Concepts

- Precipitation
- Climate Definition
- Regions Definition
- Physical Maps
