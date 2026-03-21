# BACKLOG (aka "Things I’ll Do When I’m Not Hyperfixating")

## 3D issues:

- [ ] commented out mobile (fix mobile)
- [ ] test
- [ ] delete redundant commented out code

## Other:

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
- [ ] PLAYTHROUGH: (notes):
  - it's way more fun to play with 3D blocks. Keep them!
  - ifx 1000 0000 instead of 10000000 (now blocks are smaller -> more needed)
  - AND FOR GODS SAKE STOP HITTING SAVE WHILE TESTING!!!!!!!
- [ ] maybe even up to 256 (hex values, binary up to (64?))

```
  "numbersPool": [
    1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
    29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64
  ],
```

## TODO-List main.js:

- [ ] ...

## TO-DO-list index.html:

- [ ] ...

## TO-DO list styles.css :

- [ ] ...

## === DONE (2026-03-22) ===

- Fix face alignment of hex and oct in 3D (angle sign)
- Flipping isn't actually swapped, just feels counterintuitive because of swiping
- Refactor redundant code in flipping (flip(isLeft) instead of flipLeft() and flipRight() function)
- Add a function flipToIndex
- Fixed extra flip in loadBoard() (was calling update3DRotation in generateInterface)
- Fix blockSet artifacts upon NewGame (grid issue)
- Debugged flipToIndex() logic (off-by-one error in angle calculation)
