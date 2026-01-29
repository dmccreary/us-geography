# Celebration Animations Library

Self-contained celebration animations for educational MicroSims. Each animation is a single JavaScript file that can be copied into any MicroSim folder.

## Available Animations

| File | Animation | Description |
|------|-----------|-------------|
| `book-burst.js` | Book Burst | Colorful closed books shooting upward |
| `yellow-stars.js` | Yellow Stars | Classic golden stars floating upward |
| `rainbow-sparkle-burst.js` | Rainbow Sparkle Burst | Colorful sparkles exploding from center |
| `happy-star-sprinkle.js` | Happy Star Sprinkle | Smiling stars with faces falling down |
| `alphabet-fireworks.js` | Alphabet Fireworks | Letters shooting up and exploding |
| `super-reader-confetti.js` | Super Reader Confetti | Rectangular confetti tumbling down |
| `magic-book-bloom.js` | Magic Book Bloom | Glowing particles blooming outward |
| `giggle-glitter-pop.js` | Giggle Glitter Pop | Bouncy circles that pop into sparkles |
| `storytime-spark-shower.js` | Storytime Spark Shower | Colorful sparks falling like rain |
| `bright-buddy-balloons.js` | Bright Buddy Balloons | Colorful balloons floating upward |
| `reading-rocket-zoom.js` | Reading Rocket Zoom | Rockets zooming across with flame trails |
| `baseball-explosion.js` | Baseball Explosion | Baseballs exploding upward with red stitching |
| `flying-frisbees.js` | Flying Frisbees | Colorful frisbees flying upward with spin |
| `soccer-explosion.js` | Soccer Explosion | Soccer balls exploding upward with pentagon pattern |
| `celebration-sounds.js` | Sound Effects | Optional audio feedback utilities |

## Quick Start

### 1. Copy the animation file(s) you need

```bash
cp docs/sims/shared/animations/book-burst.js docs/sims/my-game/
```

### 2. Include in your main.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <script src="https://cdn.jsdelivr.net/npm/p5@1.11.10/lib/p5.js"></script>
    <script src="book-burst.js"></script>
    <script src="my-game.js"></script>
</head>
<body>
    <main></main>
</body>
</html>
```

### 3. Trigger the animation in your game

```javascript
// In your game code (my-game.js)

function onPlayerWins() {
  // Trigger celebration from bottom center
  createBookBurst(canvasWidth / 2, drawHeight);
}

function draw() {
  // ... your game drawing code ...

  // Always call the update/draw function (draws nothing if no particles)
  updateAndDrawBookBurst();
}
```

## API Reference

Each animation file provides these functions:

| Function | Purpose |
|----------|---------|
| `create[Name](x, y, speedMultiplier)` | Start the animation at position (x, y) |
| `updateAndDraw[Name]()` | Update physics and render particles |
| `is[Name]Active()` | Returns true if animation is still playing |
| `clear[Name]()` | Immediately stop and clear all particles |

### Speed Multiplier

All animations accept an optional `speedMultiplier` parameter:
- `0.5` = Slow (animations last ~4 seconds)
- `1.0` = Medium/Default (animations last ~2 seconds)
- `1.8` = Fast (animations last ~1 second)

```javascript
// Slow celebration
createBookBurst(canvasWidth / 2, drawHeight, 0.5);

// Fast celebration
createYellowStars(canvasWidth / 2, drawHeight - 50, 200, 1.8);
```

## Animation Details

### Book Burst
```javascript
createBookBurst(centerX, startY, speedMultiplier = 1.0)
```
Books shoot upward in an arc from the specified center point.

### Yellow Stars
```javascript
createYellowStars(centerX, startY, spreadWidth = 200, speedMultiplier = 1.0)
```
Golden stars float upward from a horizontal spread area.

### Rainbow Sparkle Burst
```javascript
createRainbowSparkleBurst(centerX, centerY, speedMultiplier = 1.0)
```
Sparkles explode outward from the center point.

### Happy Star Sprinkle
```javascript
createHappyStarSprinkle(areaWidth, floorY, speedMultiplier = 1.0)
```
Smiling stars fall from the top across the full width.

### Alphabet Fireworks
```javascript
createAlphabetFireworks(areaWidth, startY, speedMultiplier = 1.0)
```
Letters launch upward and explode into particles.

### Super Reader Confetti
```javascript
createSuperReaderConfetti(areaWidth, floorY, speedMultiplier = 1.0)
```
Colorful rectangular confetti falls from above.

### Magic Book Bloom
```javascript
createMagicBookBloom(centerX, centerY, speedMultiplier = 1.0)
```
Soft glowing particles bloom outward from center.

### Giggle Glitter Pop
```javascript
createGiggleGlitterPop(areaWidth, areaHeight, speedMultiplier = 1.0)
```
Bouncy circles appear randomly and pop into sparkles.

### Storytime Spark Shower
```javascript
createStorytimeSparkShower(areaWidth, floorY, speedMultiplier = 1.0)
```
Colorful sparks with trails fall like gentle rain.

### Bright Buddy Balloons
```javascript
createBrightBuddyBalloons(areaWidth, startY, speedMultiplier = 1.0)
```
Balloons with strings float upward from the bottom.

### Reading Rocket Zoom
```javascript
createReadingRocketZoom(areaWidth, areaHeight, speedMultiplier = 1.0)
```
Rockets zoom across the screen from both sides.

### Baseball Explosion
```javascript
createBaseballExplosion(centerX, startY, speedMultiplier = 1.0)
```
Baseballs explode upward from the center point with realistic red stitching.

### Flying Frisbees
```javascript
createFlyingFrisbees(areaWidth, startY, speedMultiplier = 1.0)
```
Colorful frisbees fly upward with spinning motion and trails.

### Soccer Explosion
```javascript
createSoccerExplosion(centerX, startY, speedMultiplier = 1.0)
```
Soccer balls explode upward from the center point with black pentagon pattern.

## Sound Effects (Optional)

Include `celebration-sounds.js` for audio feedback:

```javascript
// Play celebration sound
playCelebrationSound();           // Default chime
playCelebrationSound('fanfare');  // Triumphant fanfare
playCelebrationSound('pop');      // Quick pop
playCelebrationSound('whoosh');   // Rising whoosh

// Game feedback sounds
playCorrectSound();    // Pleasant ding for correct answers
playTryAgainSound();   // Gentle tone for incorrect attempts
```

## Example: Multiple Animations

You can use multiple animations in the same MicroSim:

```html
<script src="book-burst.js"></script>
<script src="yellow-stars.js"></script>
<script src="celebration-sounds.js"></script>
```

```javascript
function onLevelComplete() {
  createBookBurst(canvasWidth / 2, drawHeight);
  playCelebrationSound('fanfare');
}

function onCorrectAnswer() {
  createYellowStars(mouseX, mouseY, 100, 1.5);
  playCorrectSound();
}

function draw() {
  // ... game code ...
  updateAndDrawBookBurst();
  updateAndDrawYellowStars();
}
```

## Testing

Use the [Celebration Animation Tester](../celebration-animation-tester/index.md) MicroSim to preview all animations and experiment with different speeds.

## File Sizes

Each animation file is approximately 80-120 lines (~3-4 KB), making them lightweight to include.

| File | Lines | Size |
|------|-------|------|
| book-burst.js | ~115 | ~3.5 KB |
| yellow-stars.js | ~90 | ~2.8 KB |
| rainbow-sparkle-burst.js | ~95 | ~3.0 KB |
| happy-star-sprinkle.js | ~110 | ~3.4 KB |
| alphabet-fireworks.js | ~120 | ~3.8 KB |
| super-reader-confetti.js | ~85 | ~2.6 KB |
| magic-book-bloom.js | ~90 | ~2.8 KB |
| giggle-glitter-pop.js | ~130 | ~4.0 KB |
| storytime-spark-shower.js | ~100 | ~3.2 KB |
| bright-buddy-balloons.js | ~95 | ~3.0 KB |
| reading-rocket-zoom.js | ~115 | ~3.6 KB |
| baseball-explosion.js | ~120 | ~3.8 KB |
| flying-frisbees.js | ~110 | ~3.4 KB |
| soccer-explosion.js | ~120 | ~3.8 KB |
| celebration-sounds.js | ~120 | ~3.5 KB |
