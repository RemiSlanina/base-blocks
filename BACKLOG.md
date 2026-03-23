# BACKLOG (aka "Things I’ll Do When I’m Not Hyperfixating")

## Other:

- [ ] test startup and safety
- [ ] delete redundant commented out code
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

## === DONE (2026-03-23) ===

- fix mobile
- add smaller blocks for mobile (reuse face-i classes in main.js to scale mobile)
- add layouts with 8, 6 or 4 columns
- fix font size etc. ...
- fix score display and buttons on mobile
- fix typo in initializeBlockSet that caused crash upon restart / newGame (needs more testing)

## === DONE (2026-03-22) ===

- Fix face alignment of hex and oct in 3D (angle sign)
- Flipping isn't actually swapped, just feels counterintuitive because of swiping
- Refactor redundant code in flipping (flip(isLeft) instead of flipLeft() and flipRight() function)
- Add a function flipToIndex
- Fixed extra flip in loadBoard() (was calling update3DRotation in generateInterface)
- Fix blockSet artifacts upon NewGame (grid issue)
- Debugged flipToIndex() logic (off-by-one error in angle calculation)
