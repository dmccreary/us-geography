---
title: Latitude and Longitude Grid
description: Interactive world map for learning to locate places using latitude and longitude coordinates
image: lat-long-grid.png
quality_score: 85
---

# Latitude and Longitude Grid

An interactive world map that helps students understand how latitude and longitude create a grid system for locating any place on Earth.

<iframe src="main.html" width="100%" height="500px" scrolling="no" style="overflow: hidden; border: 1px solid #ccc; border-radius: 8px;"></iframe>

[Run Full Screen MicroSim](./main.html){ .md-button .md-button--primary }

## About This MicroSim

This interactive map teaches the coordinate system:

- **Latitude lines** run east-west and measure north/south position
- **Longitude lines** run north-south and measure east/west position
- The **Equator** (red line) is 0° latitude
- The **Prime Meridian** (blue line) is 0° longitude

## How to Use

1. **Move your mouse** across the map to see live coordinates
2. **Click anywhere** to place a marker and see exact coordinates
3. **Toggle the grid** to show/hide latitude and longitude lines
4. **Show Cities** to see major world cities with their coordinates
5. **Quiz Me!** to test your ability to find locations by coordinates

## Key Concepts Demonstrated

- **Latitude** ranges from 90°S to 90°N (the Equator is 0°)
- **Longitude** ranges from 180°W to 180°E (the Prime Meridian is 0°)
- The grid creates four hemispheres: Northern, Southern, Eastern, Western
- Any place on Earth can be located using two numbers

## Lesson Plan

**Learning Objective:** Students will locate places using latitude and longitude coordinates on an interactive globe.

**Bloom's Taxonomy Level:** Apply (L3)

**Activities:**

1. **Explore (5 min)**: Move the mouse around and observe how coordinates change
2. **Find the Lines (5 min)**: Click on the Equator, then the Prime Meridian
3. **Hemisphere Hunt (5 min)**: Click in each of the four hemispheres
4. **Quiz Challenge (10 min)**: Complete the 6-question location quiz

**Assessment:** Students should correctly click within 5° of given coordinates.

## Technical Notes

- Built with Leaflet.js for interactive mapping
- Grid lines drawn at 30° intervals
- Real-time coordinate display on mouse movement
- Quiz validates click locations with tolerance

## Related Concepts

- Latitude
- Longitude
- Equator
- Prime Meridian
- Hemispheres
- Coordinates
