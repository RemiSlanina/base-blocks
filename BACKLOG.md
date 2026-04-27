# BACKLOG

## Daily logs

### === (2026-04-27) ===

**Log (done)**

- arrow key navigation continued 🐱
- focus now highlights child faces instead of block
- ran into edge bugs with first/last elements
- fixed first element not highlighted
- fixed last elements missing highlight

**Next (todo)**

- arrow navigation: wrap for incomplete last row
- focus: unify highlight update into one function
- fix overdone styling (in focused-face)
- fix add Arrow-Down even when there is an empty slot below 🥹🌷

**Later (todo): Structure (not urgent)**

- move focus styling from block → face
- use Face class consistently (currently unused)
- move highlight logic into helper / class

Note: LAST ROW is incomplete (still needs wrapping)
Note: Navigation logic may need refinement for incomplete rows

### === (2026-04-24) ===

- refine keyboard navigation to respect grid rows (no snake movement)
- prevent horizontal wrap into next/previous row
- add handling for incomplete last row (no focus into empty cells)
- improve grid-based index logic (row/column reasoning)

Note: LAST ROW is incomplete (still needs wrapping)
Note: Navigation logic may need refinement for incomplete rows

### === (2026-04-23) ===

- add keyboard navigation (ArrowLeft / ArrowRight)
- implement wrap-around for horizontal navigation
- basic grid-aware navigation (ArrowUp / ArrowDown via column count)
- integrate DOM focus handling (`tabindex`, `document.activeElement`)
- use computed CSS grid data via `getComputedStyle`
- document grid → column calculation in code comments
- reduce console.log noise (commented out for now)

### === (2026-03-28) ===

- delete some comments

### === (2026-03-25) ===

- make selected block outline visible

### === (2026-03-23) ===

- fix mobile
- add smaller blocks for mobile (reuse face-i classes in main.js to scale mobile)
- add layouts with 8, 6 or 4 columns
- fix font size etc. ...
- fix score display and buttons on mobile
- fix typo in initializeBlockSet that caused crash upon restart / newGame (needs more testing)
- prefers-reduced-motion added in css (so maybe i can delete the 2D remanants later on.)

### === (2026-03-22) ===

- Fix face alignment of hex and oct in 3D (angle sign)
- Flipping isn't actually swapped, just feels counterintuitive because of swiping
- Refactor redundant code in flipping (flip(isLeft) instead of flipLeft() and flipRight() function)
- Add a function flipToIndex
- Fixed extra flip in loadBoard() (was calling update3DRotation in generateInterface)
- Fix blockSet artifacts upon NewGame (grid issue)
- Debugged flipToIndex() logic (off-by-one error in angle calculation)

## Other:

- [ ] debug .deselected-face (redundant .deselected-face CSS)
- [ ] test startup and safety
- [ ] Add delete highscore
- [ ] refactor: grid should become a property of game controls
- [ ] Add difficulty picking (2 modes)
- [ ] Test edge cases (e.g., missing levels, wrong difficulty)
- [ ] implement fliptohex()
- [ ] update penalty for wrong guesses and flips
- [ ] ADD interactive demo (How to play)
      (e.g., for clicking and flipping blocks,...).
- [ ] ADD Timer Button + logic
- [ ] change fonts to something fitting (Roboto or Quattrocento Sans)
- [ ]1. write two functions:
  // shuffle colors vs. fixed colors
  // bin = yellow
  // oct = purple-ish
  // dec = orange-ish
  // hex = green
- [ ] substitute "you reached level 5" with bouncing blocks or colorful background.
- [ ] growing set vs. normal mode (4x4 or 8x8) with arrow keys
- [ ] add some animation on levels 5, 10, 20 and so on checkWinCondition()
- [ ] sometimes pairs are doubles due to new logic
- [ ] add divided numbers (i.e. 1001 1000 instead of 10011000)
- [ ] you beat the game notification arrives 1 level early (got it after finishing level 19)
- [ ] after finishing all 20 levels and getting numbers fom numbersPool, it actually feels like it is getting easier. i must remove "1" though. maybe really go up to 256 who knows. must check block size.
- [ ] add a "cookie" notification for dark mode etc
- [ ] update privacy policy once i use sql

```
    if (this.gameRange > 20) {
      // change this to collect all pairs <8 instead of gameRange
      flipToHex(this.blockSet.blocks);
    }
```

### PLAYTHROUGH

- [ ] at level 23, I get multiple blocks upon (re)load. Hitting reset sometimes helps(?)
      might be the game logic in fetchLevel (?)

## TODO-List main.js:

- [ ] ...

## TO-DO-list index.html:

- [ ] ...

## TO-DO list styles.css :

- [ ] ...
