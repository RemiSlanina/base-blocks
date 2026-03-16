# BACKLOG (aka "Things I’ll Do When I’m Not Hyperfixating")

- [ ] Add proper impressum (DACH requirements)
- [ ] Test current game logic (especially BlockSet.createBlocks())
- [ ] Replace global level vars (setSize, gameRange, etc.) with Level class (see down below)
- [ ] Update GameControls to use Level instances
- [ ] Test edge cases (e.g., missing levels, wrong difficulty)
- [ ] implement fliptohex():
- [ ] substitute "you reached level 5" with bouncing blocks or colorful background.

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
