# BACKLOG (aka "Things I’ll Do When I’m Not Hyperfixating")

- [ ] Add proper impressum (DACH requirements)
- [ ] Add delete highscore
- [ ] Add difficulty picking (2 modes)
- [ ] Test edge cases (e.g., missing levels, wrong difficulty)
- [ ] implement fliptohex():
- [ ] substitute "you reached level 5" with bouncing blocks or colorful background.
- [ ] growing set vs. normal mode (4x4 or 8x8) with arrow keys
- [ ] legal note (impressum) + GDPR
- [ ] add some animation on levels 5, 10, 20 and so on checkWinCondition()

```
    if (this.gameRange > 20) {
      // change this to collect all pairs <8 instead of gameRange
      flipToHex(this.blockSet.blocks);
    }

```

- [ ]change difficultNumbersPool to numbersPool in levels.json and update it in main
- [ ] maybe even up to 256 (hex values, binary up to (64?))

```
  "difficultNumbersPool": [
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
    29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64
  ],

  --->

  "difficultNumbersPool": [
    1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
    29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47,
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64
  ],


```

// ******\*\*******\*\*******\*\******* TODO List ******\*\*******\*\*******\*\*******

// TODO-List main.js:

// change game logic:

// add penalty for wrong guesses

// change game progression:
// stay with easier blocks for beginners
// only sprinkle in bigger blocks to avoid frustration
// maybe vary set size instead

// 1. write two functions:
// shuffle colors vs. fixed colors
// bin = yellow
// oct = purple-ish
// dec = orange-ish
// hex = green
// beginner: more blocks / sprinkled larger nums
// advanced: scale up or start with larger number (optional)

// TODO: use a class for levels and destructuring
// adapt the levels: there are 20 chilled levels, and there are 20 "challenge"
// fill in sensible data for the challenge levels
// TODO:

<!-- TO-DO-list index.html:
    ADD interactive demo
    A tiny interactive demo in the accordion
    (e.g., click +1 in binary, watch it go 1, 10, 11, 100…).
    ADD Timer Button + logic
    ADD a Demo for the game (How to play)
    change fonts to something like Roboto or Quattrocento Sans
    -->
