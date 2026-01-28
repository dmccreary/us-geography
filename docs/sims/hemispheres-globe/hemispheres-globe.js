// Earth's Hemispheres Interactive Globe MicroSim
// Vanilla JavaScript with SVG

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('main');
    const width = container.offsetWidth || 500;
    const height = 470;
    const drawHeight = 400;
    const controlHeight = 70;

    // Globe dimensions
    const globeCenterX = width / 2;
    const globeCenterY = drawHeight / 2;
    const globeRadius = Math.min(width, drawHeight) / 2 - 60;

    // State
    let highlightedHemisphere = null;
    let showLines = true;

    // Colors
    const colors = {
        north: { normal: '#AED6F1', highlight: '#5DADE2', name: 'Northern Hemisphere' },
        south: { normal: '#ABEBC6', highlight: '#58D68D', name: 'Southern Hemisphere' },
        east: { normal: '#F9E79F', highlight: '#F4D03F', name: 'Eastern Hemisphere' },
        west: { normal: '#F5B7B1', highlight: '#EC7063', name: 'Western Hemisphere' }
    };

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.display = 'block';
    svg.style.background = 'aliceblue';
    container.appendChild(svg);

    // Create defs for clip paths
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);

    // Clip path for globe
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.setAttribute('id', 'globe-clip');
    const clipCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    clipCircle.setAttribute('cx', globeCenterX);
    clipCircle.setAttribute('cy', globeCenterY);
    clipCircle.setAttribute('r', globeRadius);
    clipPath.appendChild(clipCircle);
    defs.appendChild(clipPath);

    // Title
    const title = createText('Earth\'s Hemispheres', globeCenterX, 25, '18px', '#333', 'middle');
    svg.appendChild(title);

    // Globe group
    const globeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    globeGroup.setAttribute('clip-path', 'url(#globe-clip)');
    svg.appendChild(globeGroup);

    // Globe background
    const globeBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    globeBg.setAttribute('cx', globeCenterX);
    globeBg.setAttribute('cy', globeCenterY);
    globeBg.setAttribute('r', globeRadius);
    globeBg.setAttribute('fill', '#E8F6F3');
    globeBg.setAttribute('stroke', '#85C1E9');
    globeBg.setAttribute('stroke-width', '2');
    svg.appendChild(globeBg);

    // Create hemisphere sections
    const hemispheres = {
        north: createHemisphere('north', globeCenterX, globeCenterY, globeRadius, 180, 360),
        south: createHemisphere('south', globeCenterX, globeCenterY, globeRadius, 0, 180),
        west: createHemisphere('west', globeCenterX, globeCenterY, globeRadius, 90, 270),
        east: createHemisphere('east', globeCenterX, globeCenterY, globeRadius, 270, 450)
    };

    // Add hemispheres to globe group
    Object.values(hemispheres).forEach(h => globeGroup.appendChild(h));

    // Dividing lines group
    const linesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    linesGroup.setAttribute('id', 'dividing-lines');
    svg.appendChild(linesGroup);

    // Equator (horizontal red line)
    const equator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    equator.setAttribute('x1', globeCenterX - globeRadius);
    equator.setAttribute('y1', globeCenterY);
    equator.setAttribute('x2', globeCenterX + globeRadius);
    equator.setAttribute('y2', globeCenterY);
    equator.setAttribute('stroke', '#E74C3C');
    equator.setAttribute('stroke-width', '3');
    linesGroup.appendChild(equator);

    // Prime Meridian (vertical blue line)
    const meridian = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    meridian.setAttribute('x1', globeCenterX);
    meridian.setAttribute('y1', globeCenterY - globeRadius);
    meridian.setAttribute('x2', globeCenterX);
    meridian.setAttribute('y2', globeCenterY + globeRadius);
    meridian.setAttribute('stroke', '#3498DB');
    meridian.setAttribute('stroke-width', '3');
    linesGroup.appendChild(meridian);

    // Line labels
    const equatorLabel = createText('Equator', globeCenterX + globeRadius + 10, globeCenterY + 4, '11px', '#E74C3C', 'start');
    linesGroup.appendChild(equatorLabel);

    const meridianLabel1 = createText('Prime', globeCenterX, globeCenterY - globeRadius - 20, '11px', '#3498DB', 'middle');
    const meridianLabel2 = createText('Meridian', globeCenterX, globeCenterY - globeRadius - 8, '11px', '#3498DB', 'middle');
    linesGroup.appendChild(meridianLabel1);
    linesGroup.appendChild(meridianLabel2);

    // US location marker
    const usX = globeCenterX - globeRadius * 0.3;
    const usY = globeCenterY - globeRadius * 0.25;

    const usMarker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    usMarker.setAttribute('cx', usX);
    usMarker.setAttribute('cy', usY);
    usMarker.setAttribute('r', 6);
    usMarker.setAttribute('fill', '#E74C3C');
    usMarker.setAttribute('stroke', 'white');
    usMarker.setAttribute('stroke-width', '2');
    svg.appendChild(usMarker);

    const usLabel = createText('US', usX + 12, usY + 4, '10px', '#333', 'start');
    svg.appendChild(usLabel);

    // Hemisphere labels around globe
    const labelNorth = createText('NORTH', globeCenterX, globeCenterY - globeRadius - 30, '12px', '#333', 'middle');
    const labelSouth = createText('SOUTH', globeCenterX, globeCenterY + globeRadius + 20, '12px', '#333', 'middle');
    const labelEast = createText('EAST', globeCenterX + globeRadius + 10, globeCenterY + globeRadius / 2, '12px', '#333', 'start');
    const labelWest = createText('WEST', globeCenterX - globeRadius - 10, globeCenterY + globeRadius / 2, '12px', '#333', 'end');
    svg.appendChild(labelNorth);
    svg.appendChild(labelSouth);
    svg.appendChild(labelEast);
    svg.appendChild(labelWest);

    // Info panel
    const infoPanel = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    infoPanel.setAttribute('id', 'info-panel');
    infoPanel.style.display = 'none';
    svg.appendChild(infoPanel);

    const infoBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    infoBg.setAttribute('x', 10);
    infoBg.setAttribute('y', 40);
    infoBg.setAttribute('width', 200);
    infoBg.setAttribute('height', 60);
    infoBg.setAttribute('fill', 'rgba(255,255,255,0.95)');
    infoBg.setAttribute('stroke', '#333');
    infoBg.setAttribute('rx', 5);
    infoPanel.appendChild(infoBg);

    const infoTitle = createText('', 20, 58, '12px', '#333', 'start');
    infoTitle.setAttribute('font-weight', 'bold');
    infoTitle.setAttribute('id', 'info-title');
    infoPanel.appendChild(infoTitle);

    const infoDesc = createText('', 20, 78, '10px', '#333', 'start');
    infoDesc.setAttribute('id', 'info-desc');
    infoPanel.appendChild(infoDesc);

    // Control area background
    const controlBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    controlBg.setAttribute('x', 0);
    controlBg.setAttribute('y', drawHeight);
    controlBg.setAttribute('width', width);
    controlBg.setAttribute('height', controlHeight);
    controlBg.setAttribute('fill', 'white');
    controlBg.setAttribute('stroke', 'silver');
    svg.appendChild(controlBg);

    // Create buttons
    const buttonY = drawHeight + 12;
    const buttonWidth = 65;
    const buttonHeight = 25;
    const buttonSpacing = 8;
    const hemisphereNames = ['north', 'south', 'east', 'west'];
    const totalWidth1 = 4 * buttonWidth + 3 * buttonSpacing;
    const startX1 = (width - totalWidth1) / 2;

    hemisphereNames.forEach((hemi, i) => {
        const btn = createButton(
            startX1 + i * (buttonWidth + buttonSpacing),
            buttonY,
            buttonWidth,
            buttonHeight,
            hemi.charAt(0).toUpperCase() + hemi.slice(1),
            colors[hemi].normal,
            '#333'
        );
        btn.setAttribute('data-hemisphere', hemi);
        btn.addEventListener('click', () => toggleHemisphere(hemi));
        svg.appendChild(btn);
    });

    // Second row buttons
    const row2Y = buttonY + buttonHeight + 8;
    const toggleBtn = createButton((width - 220) / 2, row2Y, 100, buttonHeight, 'Lines: ON', '#2ECC71', 'white');
    toggleBtn.setAttribute('id', 'toggle-btn');
    toggleBtn.addEventListener('click', toggleLines);
    svg.appendChild(toggleBtn);

    const usBtn = createButton((width - 220) / 2 + 110, row2Y, 110, buttonHeight, 'Show US Location', '#3498DB', 'white');
    usBtn.addEventListener('click', showUSHemispheres);
    svg.appendChild(usBtn);

    // Helper functions
    function createText(content, x, y, fontSize, fill, anchor) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.setAttribute('font-size', fontSize);
        text.setAttribute('fill', fill);
        text.setAttribute('text-anchor', anchor);
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.textContent = content;
        return text;
    }

    function createHemisphere(name, cx, cy, r, startAngle, endAngle) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;

        const x1 = cx + r * Math.cos(startRad);
        const y1 = cy + r * Math.sin(startRad);
        const x2 = cx + r * Math.cos(endRad);
        const y2 = cy + r * Math.sin(endRad);

        const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;

        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        path.setAttribute('d', d);
        path.setAttribute('fill', colors[name].normal);
        path.setAttribute('fill-opacity', '0.6');
        path.setAttribute('data-hemisphere', name);
        path.style.cursor = 'pointer';

        path.addEventListener('click', () => toggleHemisphere(name));
        path.addEventListener('mouseenter', () => {
            if (!highlightedHemisphere) {
                path.setAttribute('fill-opacity', '0.8');
            }
        });
        path.addEventListener('mouseleave', () => {
            if (!highlightedHemisphere) {
                path.setAttribute('fill-opacity', '0.6');
            }
        });

        return path;
    }

    function createButton(x, y, w, h, label, bgColor, textColor) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.style.cursor = 'pointer';

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', w);
        rect.setAttribute('height', h);
        rect.setAttribute('fill', bgColor);
        rect.setAttribute('rx', 5);
        rect.setAttribute('stroke', 'rgba(0,0,0,0.2)');
        group.appendChild(rect);

        const text = createText(label, x + w / 2, y + h / 2 + 4, '11px', textColor, 'middle');
        group.appendChild(text);

        return group;
    }

    function toggleHemisphere(hemi) {
        if (highlightedHemisphere === hemi) {
            highlightedHemisphere = null;
            updateHighlight();
            infoPanel.style.display = 'none';
        } else {
            highlightedHemisphere = hemi;
            updateHighlight();
            showInfo(hemi);
        }
    }

    function updateHighlight() {
        Object.keys(hemispheres).forEach(hemi => {
            const path = hemispheres[hemi];
            if (highlightedHemisphere === hemi) {
                path.setAttribute('fill', colors[hemi].highlight);
                path.setAttribute('fill-opacity', '0.9');
            } else if (highlightedHemisphere) {
                path.setAttribute('fill', colors[hemi].normal);
                path.setAttribute('fill-opacity', '0.3');
            } else {
                path.setAttribute('fill', colors[hemi].normal);
                path.setAttribute('fill-opacity', '0.6');
            }
        });

        // Update button styles
        document.querySelectorAll('[data-hemisphere]').forEach(el => {
            if (el.tagName === 'g') {
                const rect = el.querySelector('rect');
                const hemi = el.getAttribute('data-hemisphere');
                if (highlightedHemisphere === hemi) {
                    rect.setAttribute('stroke', 'gold');
                    rect.setAttribute('stroke-width', '3');
                } else {
                    rect.setAttribute('stroke', 'rgba(0,0,0,0.2)');
                    rect.setAttribute('stroke-width', '1');
                }
            }
        });
    }

    function showInfo(hemi) {
        const descriptions = {
            north: 'Everything north of the Equator. The US is here!',
            south: 'Everything south of the Equator. Australia is here.',
            east: 'Everything east of Prime Meridian. Europe & Asia are here.',
            west: 'Everything west of Prime Meridian. The US is here!'
        };

        document.getElementById('info-title').textContent = colors[hemi].name;
        document.getElementById('info-desc').textContent = descriptions[hemi];
        infoPanel.style.display = 'block';
    }

    function toggleLines() {
        showLines = !showLines;
        linesGroup.style.display = showLines ? 'block' : 'none';
        const btnText = document.querySelector('#toggle-btn text');
        const btnRect = document.querySelector('#toggle-btn rect');
        btnText.textContent = showLines ? 'Lines: ON' : 'Lines: OFF';
        btnRect.setAttribute('fill', showLines ? '#2ECC71' : '#95A5A6');
    }

    function showUSHemispheres() {
        highlightedHemisphere = 'north';
        updateHighlight();
        showInfo('north');

        setTimeout(() => {
            highlightedHemisphere = 'west';
            updateHighlight();
            showInfo('west');
        }, 1500);

        setTimeout(() => {
            highlightedHemisphere = null;
            updateHighlight();
            infoPanel.style.display = 'none';
        }, 3000);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = container.offsetWidth;
        svg.setAttribute('width', newWidth);
        // For a full responsive implementation, we'd need to recalculate all positions
    });
});
