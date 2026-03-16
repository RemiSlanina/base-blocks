// ************************* Vars *************************
const grid = document.querySelector('.grid-container');
const restartButton = document.getElementById('restart-button');
const levelDisplay = document.querySelector('.level');
// let trackFlips = true;
// TODO : use flipCount and time
let flipCount = 0;
let time = 0;

// face indices in gameControls.selectedBases in V1 (!!!)
const BIN_INDEX = 0;
const OCT_INDEX = 1;
const DEC_INDEX = 2;
const HEX_INDEX = 3;

// ***************************** Helper Functions *****************************

/**
 * @typedef {Object} SystemId
 * @property {string} label
 */

/**
 * @typedef {Object} Block
 * @property {number} number
 * @property {SystemId[]} systems
 */

/**
 * Write a helper function that converts one block of a pair to binary, if none is binary.
 * This is to avoid boredom with numbers below 8 (oct) or 10 (dec).
 * @param {Block[]} blocks
 * @returns {void}
 */
function flipToBinary(blocks) {
  // console.log(`param blocks: ${blocks}`);
  //do something
  const tempFlipTrack = gameControls.trackFlips;
  gameControls.trackFlips = false;
  const pairs = findMatches(blocks);
  // console.log(`pairs: ${pairs}`);
  pairs.forEach((p) => {
    if (
      p[0].systems[p[0].face].label == 'BIN' ||
      p[1].systems[p[1].face].label == 'BIN'
    ) {
      // if ONE of them is already binary, skip this step
      return;
    }
    // otherwise make one of them binary god grant me strength.
    // TODO
    // i guess i will find the binary number system and use a method called findNumberSystem
    while (p[0].face != 0) {
      p[0].flipAndRender();
    }
  });
  gameControls.trackFlips = tempFlipTrack;
}

/**
 * @typedef {Object} Block
 * @property {number} number
 */

/**
 * Find matching blocks with the same numeric value
 * @param {Block[]} blocks
 * @returns {[Block, Block][]}
 */
function findMatches(blocks) {
  // console.log(`param blocks: ${blocks}`);
  const matches = [];

  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      if (blocks[i].number === blocks[j].number) {
        // match
        matches.push([blocks[i], blocks[j]]);
      }
    }
  }

  return matches;
}

/**
 * @typedef {Object} Block
 * @property {number} number
 * @property {face} number
 */
/**
 * Helper function that returns duplicate matches (same base).
 * @param {Block[]} blocks
 * @returns {[Block, Block][]}
 */
function findDuplicateMatches(blocks) {
  if (!Array.isArray(blocks)) {
    console.log('Invalid type error! [] expected.');
    return [];
  }
  const duplicateMatches = [];
  // check if these are actually blocks...
  for (let i = 0; i < blocks.length - 1; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      if (blocks[i].number === blocks[j].number) {
        if (blocks[i].face === blocks[j].face) {
          duplicateMatches.push([blocks[i], blocks[j]]);
        }
      }
    }
  }
  // console.log(`duplicateMatches: ${duplicateMatches}`);
  return duplicateMatches;
}

/**
 * Helper function that resolves any duplicate matches (same base and number)
 * @param  {[BaseBlock, BaseBlock]} matches
 * @returns {void}
 */
function resolveDuplicateMatches(matches) {
  matches.forEach(flipDuplicatePair);
}

/**
 * Helper function that flips any duplicate matches/pairs (same base and number)
 * @param {[BaseBlock, BaseBlock]} pair
 * @returns {void}
 */
function flipDuplicatePair(pair) {
  if (!Array.isArray(pair) || pair.length !== 2) {
    console.error('Invalid pair: ', pair);
    return;
  }

  let [block1, block2] = pair; // destructuring
  if (!(block1 instanceof BaseBlock) || !(block2 instanceof BaseBlock)) {
    // can i do this?
    console.error('Invalid block type in pair: ', block1, block2);
    return;
  }

  const previous = gameControls.trackFlips;
  gameControls.trackFlips = false;

  // flip ONE block (if you flip both, they will both have the same base again)
  block1.flipAndRender();

  gameControls.trackFlips = previous;
}

// ****************************** Classes ******************************
//            ****************** SystemId ******************

class SystemId {
  constructor(label, badge, base) {
    this.label = label; // e.g., "BIN", "DEC"
    this.badge = badge; // e.g., "₂", ""
    this.base = base; // the actual base (2, 10, 16, 8)
  }
  toDisplay(num) {
    return num.toString(this.base).toUpperCase() + this.badge;
  }
}
// collection of systemIds used in the game:
const supportedBases = [
  new SystemId('BIN', '₂', 2),
  new SystemId('3', '₃', 3),
  new SystemId('4', '₄', 4),
  new SystemId('5', '₅', 5),
  new SystemId('6', '₆', 6),
  new SystemId('7', '₇', 7),
  new SystemId('OCT', '₈', 8),
  new SystemId('9', '₉', 9),
  new SystemId('DEC', '', 10),
  new SystemId('11', '₁₁', 11),
  new SystemId('12', '₁₂', 12),
  new SystemId('13', '₁₃', 13),
  new SystemId('14', '₁₄', 14),
  new SystemId('15', '₁₅', 15),
  new SystemId('HEX', '₁₆', 16),
  new SystemId('17', '₁₇', 17),
  new SystemId('18', '₁₈', 18),
  new SystemId('19', '₁₉', 19),
  new SystemId('20', '₂₀', 20),
  new SystemId('21', '₂₁', 21),
  new SystemId('22', '₂₂', 22),
  new SystemId('23', '₂₃', 23),
  new SystemId('24', '₂₄', 24),
  new SystemId('25', '₂₅', 25),
  new SystemId('26', '₂₆', 26),
  new SystemId('27', '₂₇', 27),
  new SystemId('28', '₂₈', 28),
  new SystemId('29', '₂₉', 29),
  new SystemId('30', '₃₀', 30),
];

//           ****************** BaseBlocks ******************
class BaseBlock {
  constructor(id, number, systems, face = 0, matched = false) {
    this.id = id;
    this.number = number; // the actual value (e.g., 10)
    this.systems = systems; // array of SystemId objects
    this.face = face; // index of the current system => systemId
    this.matched = matched;

    /*  Faces: (inernal note) */
    // for v1, stick to these 4 bases: (see global vars)
    // they should actually be in this order:
    // const BIN_INDEX = 0;
    // const OCT_INDEX = 1;
    // const DEC_INDEX = 2;
    // const HEX_INDEX = 3;
    /* for CSS manipulation:  */
    this.baseClasses = ['base1', 'base2', 'base3', 'base4', 'base5', 'base6']; // 5 and 6 are for v2
    this.element = document.createElement('div');
    this.element.setAttribute('role', 'button');
    this.element.setAttribute('tabindex', '0'); // Make it focusable
    this.element.classList.add('block', this.baseClasses[this.face]);
    this.element.setAttribute(
      'aria-label',
      `Block showing number ${this.getCurrentDisplay()}`
    );
    this.isFirst = false; // delete these and test later
    this.isSecond = false; // they are not used anywhere else

    // Event Listeners for interaction:
    // Play using the mouse: left click to select, right click to flip
    // Play using the keyboard: Enter to select, Space to flip

    /* ****************** Keyboard: ****************** */
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.select(); // Select on Enter
      } else if (e.key === ' ') {
        // Flip on Space
        e.preventDefault();
        this.flipAndRender();
      }
    });

    /* ****************** Mobile: ****************** */
    this.touchStartX = 0; // for swiping -
    this.touchEndX = 0; // range

    this.element.addEventListener(
      'touchstart',
      (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    this.element.addEventListener(
      'touchend',
      (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      },
      { passive: true }
    );

    /* ****************** Mouse: ****************** */

    /* ****************** RIGHT CLICK: ****************** */
    this.selectBound = this.select.bind(this);
    this.element.addEventListener('click', this.selectBound);
    /* ****************** LEFT CLICK: ****************** */
    this.element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.flip();
      this.element.textContent = this.getCurrentDisplay();
    });
  }

  /* ****************** Methods: ****************** */
  handleSwipe() {
    const swipeThreshold = 30; // Minimum 30 pixels for swipe
    if (this.touchEndX - this.touchStartX > swipeThreshold) {
      this.flipAndRender(); // swipe right
    } else if (this.touchStartX - this.touchEndX > swipeThreshold) {
      // swipe left
      this.flipLeft();
      this.render();
    }
  }
  generateInterface() {
    this.element.textContent = this.getCurrentDisplay();
    grid.appendChild(this.element);
    this.element.title = 'Right-click to flip the block';
  }
  getCurrentDisplay() {
    return this.systems[this.face].toDisplay(this.number);
  }
  flipAndRender() {
    this.flip();
    this.render();
  }
  render() {
    // update the textContent (the display)
    this.element.textContent = this.getCurrentDisplay();
    this.element.setAttribute(
      'aria-label',
      `Block with value ${this.getCurrentDisplay()}`
    );
  }
  flip() {
    // Remove the old class
    this.element.classList.remove(this.baseClasses[this.face]);
    // Update the face index unsing mod:
    this.face = (this.face + 1) % this.systems.length;
    // Add the new class
    this.element.classList.add(this.baseClasses[this.face]);
    if (gameControls.trackFlips) {
      gameControls.score = Math.max(0, gameControls.score - 1); // Penalty for flipping
      // document.querySelector('.score').textContent = gameControls.score;
      gameControls.updateScoreDisplay();
    }
  }
  flipLeft() {
    this.element.classList.remove(this.baseClasses[this.face]);
    this.face = (this.face - 1 + this.systems.length) % this.systems.length; // avoid negative mod
    // in JavaScript, modulo can be negative (f.e. divide by -1) -> add systems.length.
    this.element.classList.add(this.baseClasses[this.face]);
    if (gameControls.trackFlips) {
      gameControls.score = Math.max(0, gameControls.score - 1); // Penalty for flipping
      // document.querySelector('.score').textContent = gameControls.score;
      gameControls.updateScoreDisplay();
    }
  }
  select = () => {
    //console.trace();
    if (this.element.classList.contains('disabled')) {
      console.log('Block is disabled, cannot select');
      return;
    }
    if (gameControls.lockBoard) {
      console.log('Board is locked, cannot select');
      return;
    }
    if (this.element.classList.contains('selected')) {
      this.deselect();
      return;
    }

    if (gameControls.selectedBlocksCount === gameControls.numberOfMatches) {
      console.log('Selection limit reached, cannot select more blocks');
      return;
    }
    if (gameControls.selectedBlocksCount > gameControls.numberOfMatches) {
      console.error('Selected count exceeded limit, this should not happen!');
      return;
    }

    console.log(`selected ${this.getCurrentDisplay()}`);
    this.element.classList.remove('deselected');
    this.element.classList.add('selected');
    gameControls.selectedBlocks.push(this);
    gameControls.selectedBlocksCount++;

    this.element.setAttribute(
      'aria-label',
      `Selected block with value ${this.getCurrentDisplay()}`
    );

    if (gameControls.selectedBlocksCount === gameControls.numberOfMatches) {
      gameControls.lockBoard = true;
      gameControls.checkForMatch();
    }
  };
  deselect() {
    if (!this.element.classList.contains('selected')) {
      console.log('Block is not selected, cannot deselect');
      return;
    }
    if (gameControls.lockBoard) {
      console.log('Board is locked, cannot deselect');
      return;
    }
    if (gameControls.selectedBlocksCount < 0) {
      console.error(
        'Selected blocks count is negative, this should not happen!'
      );
      return;
    }

    this.element.classList.remove('selected');
    this.element.classList.add('deselected');
    gameControls.selectedBlocks = gameControls.selectedBlocks.filter(
      (block) => block !== this
    );
    gameControls.selectedBlocksCount--;
    console.log(`deselected ${this.getCurrentDisplay()}`);

    this.element.setAttribute(
      'aria-label',
      `Dselected block with value ${this.getCurrentDisplay()}`
    );
  }
  disable() {
    this.element.removeEventListener('click', this.selectBound);
    this.deselect();
    if (this.element.classList.contains('disabled')) {
      return;
    }
    this.element.classList.add('disabled');
  }

  shuffleFaces() {
    let randomness = Math.floor(
      Math.random() * gameControls.getSelectedBases().length
    );
    // console.log(`randomness: ${randomness}`);
    for (let i = 0; i < randomness; i++) {
      this.flipAndRender();
    }
  }
}

// ****************** BlockSet ******************
class BlockSet {
  constructor(size, matches, gameRange, systemIds) {
    this.size = size || 16; // total number of blocks
    this.matches = matches || 2; // number of matches per group
    this.gameRange = gameRange || 12; // starting range for numbers
    this.blocks = [];
    this.createBlocks();
  }

  ceateAndPushBlock(i) {
    let block = new BaseBlock(
      Math.floor(Math.random() * 900) + 100,
      i,
      gameControls.getSelectedBases()
    );
    this.blocks.push(block);
    return block;
  }

  createContinuousBlocks() {
    /**
     * Create Blocks from gameRange to gameRange + 7
     * No "big bad numbers" sprinkled in.
     */

    for (
      let i = this.gameRange;
      i < this.size / this.matches + this.gameRange;
      i++
    ) {
      for (let j = 0; j < this.matches; j++) {
        let block = new BaseBlock(
          Math.floor(Math.random() * 900) + 100,
          i,
          gameControls.getSelectedBases()
        );

        this.blocks.push(block);
      }
    }

    this.shuffleFacesOfBlockSet();
    this.shuffleBlocks();
    // generate blocks interface
    this.blocks.forEach((block) => {
      block.generateInterface();
    });
  }

  /**
   * Generate Blocks without any difficult numbers sprinkled in.
   */
  createSimpleBlocks() {
    // class BaseBlock {
    // constructor(id, number, systems, face = 0, matched = false) {
    //create blocks
    for (
      let i = this.gameRange;
      i < this.size / this.matches + this.gameRange;
      i++
    ) {
      for (let j = 0; j < this.matches; j++) {
        let block = new BaseBlock(
          Math.floor(Math.random() * 900) + 100,
          i,
          gameControls.getSelectedBases()
        );

        this.blocks.push(block);
        // debucgger++;
      }
    }

    this.shuffleFacesOfBlockSet();
    this.shuffleBlocks();
    // generate blocks interface
    this.blocks.forEach((block) => {
      block.generateInterface();
    });
  }

  createBlocks() {
    /**
     * Create Blocks for balanced difficulty
     * from gameRange to gameRange + 7, but bigger numbers get
     * sprinkled in as the game progresses.
     */

    // reminder: BaseBlock(id, number, systems, face = 0, matched = false)

    const level = gameControls.currentLevelData;
    const difficultNumbers = level.allowedDifficultNumbers;
    const howManyDifficult = level.howManyDifficultPairs;

    // create "normal" blocks
    for (
      let i = level.min;
      i < level.min + (this.size / this.matches - howManyDifficult);
      i++
    ) {
      for (let j = 0; j < this.matches; j++) {
        let block = new BaseBlock(
          Math.floor(Math.random() * 900) + 100,
          i,
          gameControls.getSelectedBases()
        );
        this.blocks.push(block);
      }
    }

    // create difficult numbers
    for (let i = 0; i < howManyDifficult; i++) {
      const index = Math.floor(Math.random() * difficultNumbers.length);
      for (let j = 0; j < this.matches; j++) {
        let block = new BaseBlock(
          Math.floor(Math.random() * 900) + 100,
          difficultNumbers[index],
          gameControls.getSelectedBases()
        );
        this.blocks.push(block);
      }
    }

    this.shuffleFacesOfBlockSet();
    this.shuffleBlocks();
    this.blocks.forEach((block) => {
      block.generateInterface();
    });
  }

  shuffleBlocks() {
    // Fisher-Yates Shuffle Algorithm
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.blocks[i], this.blocks[j]] = [this.blocks[j], this.blocks[i]];
    }
  }
  shuffleFacesOfBlockSet() {
    this.blocks.forEach((b) => b.shuffleFaces());
  }
}

// ****************** Level ******************

class Level {
  constructor(levelNumber, difficulty = 'chilled') {
    this.level = levelNumber;
    this.difficulty = difficulty;
    this.setSize = 16;
    this.min = 2;
    this.max = 9;
    this.howManyDifficultPairs = 0;
    this.allowedDifficultNumbers = [];
  }

  async fetchLevel(levelsData) {
    // Accept levelsData as a parameter instead of fetching it internally
    const levelData = levelsData.levels.find(
      (l) => l.level === this.level && l.difficulty === this.difficulty
    );

    // Hardcoded fallback for levels > 20
    if (this.level > 20 && levelsData.numbersPool) {
      this.setSize = 32;
      this.min = 1;
      this.max = 8;
      this.howManyDifficultPairs = 8;
      this.allowedDifficultNumbers = levelsData.numbersPool;
      console.log(
        `Level ${this.level} has ${this.howManyDifficultPairs} difficult pairs.`
      );
      return;
    }

    // Populate from levelsData for levels 1-20
    if (levelData) {
      ({
        setSize: this.setSize,
        min: this.min,
        max: this.max,
        howManyDifficultPairs: this.howManyDifficultPairs,
        allowedDifficultNumbers: this.allowedDifficultNumbers,
      } = levelData);
    } else {
      console.error(
        `Level ${this.level} (${this.difficulty}) not found in levels.json`
      );
    }
  }
}

// ****************** GameControls ******************
class GameControls {
  constructor() {
    this.selectedBases = []; // 0 should be binary, 1 oct, 2 dec, 4 hex
    this.blockSet = null;
    this.levels = [];
    this.selectedBlocks = [];
    this.selectedBlocksCount = 0;
    this.hasFiredConfettiFor42 = false;
    this.currentLevel = 1;
    this.score = 0;
    this.highScore =
      JSON.parse(localStorage.getItem('baseBlocksHighScore')) || 0;
    this.updateHighScoreDisplay();
    this.currentLevelData = null;
    this.gameRange = 2; // 2- 9
    this.setSize = 16; // number of blocks, must be even
    this.numberOfMatches = 2;
    this.trackFlips = true;
    this.lockBoard = false;
    this.countAlerts = 0;
    this.maxAlerts = 2;
  }

  // ****************** GameControls Methods ******************

  // Fetch levels and initialize the current level
  async fetchLevels() {
    try {
      const response = await fetch('./data/levels.json');
      if (!response.ok)
        throw new Error(`Error fetching json: ${response.status}`);
      this.levels = await response.json();
      await this.loadCurrentLevel();
    } catch (e) {
      console.error('Error fetching json: ', e);
    }
  }

  // Load the current level's data into this.currentLevelData
  async loadCurrentLevel() {
    this.currentLevelData = new Level(this.currentLevel);
    await this.currentLevelData.fetchLevel(this.levels);
    this.applyLevelStats();
  }

  // Apply the current level's stats to the game
  applyLevelStats() {
    if (!this.currentLevelData) {
      throw new Error('No level data loaded!');
    }
    this.setSize = this.currentLevelData.setSize;
    this.gameRange = this.currentLevelData.min;
    this.numberOfMatches = 2; // Default, or fetch from level data if needed
    console.log(
      `Level ${this.currentLevel}: setSize=${this.setSize}, gameRange=${this.gameRange}`
    );
  }

  updateScoreDisplay() {
    document.querySelector('.score').textContent = this.score;
  }

  updateHighScoreDisplay() {
    document.querySelector('.high-score').textContent = this.highScore;
  }
  updateLevelDisplay() {
    document.querySelector('.level').textContent = this.currentLevel;
  }

  setHighScore(h) {
    if (h > this.highScore) {
      this.highScore = h;
      localStorage.setItem(
        'baseBlocksHighScore',
        JSON.stringify(this.highScore)
      );
      this.updateHighScoreDisplay();
    }
  }
  clearHighScore() {
    this.highScore = 0;
    this.updateHighScoreDisplay();
  }

  getHighScore() {
    return JSON.parse(localStorage.getItem('baseBlocksHighScore')) || 0;
  }

  addBase(systemId) {
    this.selectedBases.push(systemId);
  }
  removeBase(systemId) {
    this.selectedBases = this.selectedBases.filter((base) => base !== systemId);
  }

  createDefaultSystems() {
    this.selectedBases = [
      new SystemId('BIN', '₂', 2),
      new SystemId('OCT', '₈', 8),
      new SystemId('DEC', '', 10),
      new SystemId('HEX', '₁₆', 16),
    ];
  }
  getSelectedBases() {
    return [...this.selectedBases];
  }

  initializeBlockSet() {
    this.blockSet = new BlockSet(
      this.setSize,
      this.numberOfMatches,
      this.gameRange,
      this.getSelectedBases()
    );

    // resolve duplicates every time a new set is initializied:
    try {
      let duplicates;
      do {
        duplicates = findDuplicateMatches(gameControls.blockSet.blocks);
        // duplicates = 'pizza'; // testing...
        if (duplicates.length === 0) break; // to be sure;
        if (this.countAlerts > this.maxAlerts) {
          console.error(
            `Something's not right: countAlerts exceeded limits! GameControls: initializeBlockSet()`
          );
          break; // prevent endless loops
        }
        resolveDuplicateMatches(duplicates);
      } while (findDuplicateMatches(gameControls.blockSet.blocks).length > 0); // while the array it is not empty
    } catch (e) {
      console.log('Failed to resolve duplicates: ', e);
      // Alert the user:
      alert('Something went wrong. Restarting the level...');
      this.countAlerts++;
      this.restart();
    }

    if (this.gameRange <= 7) {
      // change this to collect all pairs <8 instead of gameRange
      flipToBinary(this.blockSet.blocks);
    }
  }

  start() {
    console.log('Starting the game...');
    this.initializeBlockSet();
    this.updateScoreDisplay();
  }

  restart() {
    console.log('Restarting the current level...');
    grid.innerHTML = '';
    this.score = 0;
    this.updateScoreDisplay();
    this.hasFiredConfettiFor42 = false;
    const lifeUniverseElement = document.querySelector(
      '.life-universe-everything'
    );
    if (lifeUniverseElement) {
      lifeUniverseElement.style.display = 'none';
      lifeUniverseElement.textContent = '';
    }
    this.initializeBlockSet(); // Reinitialize blocks for the current level
  }

  async continue(retries = 0) {
    if (retries > 3) {
      alert('Too many errors. Restarting from level 1.');
      this.currentLevel = 1;
      await this.loadCurrentLevel();
      this.restart();
      return;
    }
    try {
      if (this.currentLevel >= this.levels.levels.length) {
        alert('You beat the game! 🎉');
        return;
      }
      this.currentLevel++;

      this.updateLevelDisplay();

      await this.loadCurrentLevel();
      this.restart();
    } catch (e) {
      console.error('Level load failed, retrying...', e);
      this.continue(retries + 1);
    }
  }

  checkForMatch() {
    console.log('Checking for match...');
    setTimeout(() => {
      if (this.selectedBlocks.length !== 2) {
        console.error(
          'checkForMatch called with incorrect number of selected blocks'
        );
        return;
      }

      this.lockBoard = true;
      let allMatch = true;
      const firstNumber = this.selectedBlocks[0].number;
      for (let i = 1; i < this.selectedBlocks.length; i++) {
        if (this.selectedBlocks[i].number !== firstNumber) {
          allMatch = false;
          break;
        }
      }

      if (allMatch) {
        this.lockBoard = false;
        if (
          this.selectedBlocks[0].number === 42 &&
          !this.hasFiredConfettiFor42
        ) {
          this.hasFiredConfettiFor42 = true;
          // actually this would be a pain if this happens multiple times...
          // so maybe only show once per game?
          const lifeUniverseElement = document.querySelector(
            '.life-universe-everything'
          );
          if (lifeUniverseElement) {
            lifeUniverseElement.textContent =
              'You found the answer to life, the universe and everything! (42)';
          }
          lifeUniverseElement.style.display = 'block';

          confetti({
            particleCount: 126,
            angle: 42,
            spread: 42,
            origin: { x: 0, y: 0.6 },
            colors: ['#ff0000', '#00ff00', '#0000ff'],
            shapes: ['circle', 'square'],
            scalar: 1.2,
            zIndex: 1000,
          });

          console.log('The answer to life, the universe and everything!');
        }
        console.log('Blocks match!');
        this.selectedBlocks.forEach((block) => block.disable());
        this.lockBoard = true; // Keep the board locked after a successful match
        gameControls.score += this.numberOfMatches * 20; // Reward for a match

        gameControls.updateScoreDisplay();
      } else {
        this.lockBoard = false;
        console.log('Blocks do not match.');
        this.selectedBlocks.forEach((block) => block.deselect());
      }

      this.checkWinCondition();
      this.countAlerts = 0; // assuming the game was running fine for a minute

      this.resetBoard();
    }, 300);
  }
  checkWinCondition() {
    const allDisabled = this.blockSet.blocks.every((block) =>
      block.element.classList.contains('disabled')
    );
    if (allDisabled) {
      this.continue();
      // TO-DO add some animation on levels 5, 10, 20 and so on
      switch (this.currentLevel) {
        case 10:
          alert('Great job! You have reached Level ' + this.currentLevel + '!');
          break;
        case 21:
          alert(
            'Fantastic! You have reached Level ' +
              this.currentLevel +
              '!\nYou completed the game! Proceed at your own risk!'
          );
          break;
      }

      if (gameControls.highScore < gameControls.score)
        gameControls.setHighScore(gameControls.score);
    }
  }

  resetBoard() {
    this.selectedBlocks = [];
    this.selectedBlocksCount = 0;
    this.lockBoard = false;
  }

  // for testing/debugging:
  setLevel(n) {
    this.currentLevel = n;
    this.loadCurrentLevel().then(() => this.restart());
    this.updateLevelDisplay();
  }
}

// ************************ ENGINE ************************

// ************************ INSTANTIATE GAME CONTROLS ************************

const gameControls = new GameControls();
gameControls.createDefaultSystems();

async function startGame() {
  try {
    await gameControls.fetchLevels();
    gameControls.initializeBlockSet();
  } catch (error) {
    console.error('Error starting game:', error);
    alert('Failed to start the game. Please try again.');
  }
}

startGame();

// ************************ EVENT LISTENERS ************************

restartButton.addEventListener(
  'click',
  gameControls.restart.bind(gameControls)
);
// ************************ Run Test Game ************************

// ************************ Dark Mode ************************
// Load saved theme if there is any
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}
// Toggle theme and save preference
document.getElementById('theme-toggle').addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});
const currentTheme = document.documentElement.getAttribute('data-theme');
console.log(currentTheme); // "dark", "light", or null

// // ************************ ACCORDION ************************
// const accordions = document.getElementsByClassName('accordion');
// //console.log(accordions);
// for (let i = 0; i < accordions.length; i++) {
//   accordions[i].addEventListener('click', (e) => {
//     // button: stay active
//     e.target.classList.toggle('active');
//     // toggle accordion panels
//     //let panel = this.nextElementSibling;
//     let panel = e.target.nextElementSibling;
//     if (panel.style.display === 'block') {
//       panel.style.display = 'none';
//     } else {
//       panel.style.display = 'block';
//     }
//   });
// }

// ****************************** Debug Mode ******************************

// comment out after testing:

// gameControls.gameRange = 3; // 2- 9 base game starting
// gameControls.currentLevel = 21;
// gameControls.setLevelStats();
// gameControls.restart();
// highScore = 4535;
// document.querySelector('.high-score').textContent = highScore;
// localStorage.setItem('basBlocksHighScore', JSON.stringify(highScore));
// setSize = 2; // number of blocks, must be even
// gameControls.setLevel(19);
