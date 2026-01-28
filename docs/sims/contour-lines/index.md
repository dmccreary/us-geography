---
title: Understanding Contour Lines
description: Interactive 3D terrain and 2D contour map visualization
image: contour-lines.png
quality_score: 85
---

# Understanding Contour Lines

Learn how flat maps represent elevation using contour lines by comparing 3D terrain with its 2D contour map representation.

<iframe src="main.html" width="100%" height="430px" scrolling="no" style="overflow: hidden; border: 1px solid #ccc; border-radius: 8px;"></iframe>

[Run Full Screen MicroSim](./main.html){ .md-button .md-button--primary }

## About This MicroSim

Explore three different terrain types and see how contour lines represent them:

**Hill**: Concentric circles with the smallest circle at the peak

**Valley**: V-shaped contour lines that point uphill (upstream)

**Ridge**: Elongated contour lines running along the high ground

## How to Use

1. **Select terrain type** - Hill, Valley, or Ridge
2. **Drag the 3D view** - Rotate to see terrain from different angles
3. **Toggle Labels** - Show/hide elevation numbers on contour lines
4. **Quiz Me!** - Test your understanding of contour patterns

## Key Concepts Demonstrated

- Contour lines connect points of equal elevation
- Closer contour lines indicate steeper slopes
- The contour interval is the elevation change between lines
- V-shapes in contours point upstream in valleys
- Concentric circles often indicate hills or depressions

## Lesson Plan

**Learning Objective:** Students will interpret contour lines to describe terrain features and slope steepness.

**Bloom's Taxonomy Level:** Understand/Apply (L2/L3)

**Activities:**

1. **Explore Hills (4 min)**: Rotate the 3D view and notice how circular contours represent the hill
2. **Compare Terrain (5 min)**: Switch between Hill, Valley, and Ridge to compare contour patterns
3. **Predict (3 min)**: Before switching terrain types, predict what the contour map will look like
4. **Quiz (6 min)**: Answer 6 questions about reading contour lines

## Technical Notes

- Built with p5.js
- Custom isometric 3D rendering
- Interactive rotation via mouse drag
- Canvas-based controls

## Related Concepts

- Topographic Maps
- Elevation
- Slope
- Relief Maps
