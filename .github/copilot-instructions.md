# AI Coding Assistant Instructions for Base Blocks

This document guides AI coding assistants on the key patterns and practices for the Base Blocks project - a browser-based memory game where players match numbers across different number systems.

## Project Overview

Base Blocks is a vanilla JavaScript web application structured as:
- `index.html` - Entry point and game UI
- `main.js` - Core game logic and event handlers
- `styles.css` - Styling including theming system
- `assets/` - Images and screenshots
- `dev-notes/` - Development tracking and notes

## Key Architecture Patterns

### Game State Management
- Game state is managed through global variables in `main.js` including:
  - `blocks[]` - Array of game blocks
  - `lockBoard` - Prevents moves during animations
  - `score` - Current game score
  - `firstBlock`, `secondBlock` - Currently selected blocks

### Block Implementation
Blocks are rendered in a CSS grid layout with:
- Left click to select a block
- Right click to cycle through number bases
- Each block shows the same number in different bases (binary, decimal, hex, octal)

### Theming System 
The project uses CSS variables for theming (`styles.css`):
- Light/dark mode support via CSS custom properties
- Consistent color palette for block faces and UI elements
- Block appearance controlled through `--block-size` and face color variables

## Development Workflow

### Local Development
1. Clone repo and open `index.html` in browser - no build step required
2. Edit JavaScript/CSS and refresh browser to see changes

### Debugging Tips
- Use browser dev tools console to inspect game state variables
- Block matching logic can be traced through `checkForMatch()` function
- CSS classes control block states (selected, disabled, etc.)

## Common Tasks

### Adding New Number Systems
1. Add new base to number conversion logic in `main.js`
2. Define new face colors in CSS custom properties
3. Update block rotation handling

### Modifying Game Rules
- Grid size controlled by `setSize` variable (must be even)
- Number of matches per group set by `numberOfMatches`
- Valid grid configurations listed in `main.js` comments

## Integration Points
- Deployments handled through Vercel (see README)
- No external dependencies - pure HTML/CSS/JavaScript
- Browser compatibility relies on modern CSS Grid support