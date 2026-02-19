// ****************************** Vars ******************************
const grid = document.querySelector('.grid-container');
const restartButton = document.getElementById('restart-button');
const levelDisplay = document.querySelector('.level');
let trackFlips = true;
let flipCount = 0;
let lockBoard = false;
let score = 0;
let time = 0;
//const blocks = []; // didn't use that anymore, did I?
let startingRange = 1;
let setSize = 16; // number of blocks, must be even
let numberOfMatches = 2;

// ****************************** Helper Functions ******************************

function findDuplicateMatches(blocks) {
  if (!Array.isArray(blocks)) {
    console.log('Invalid type error! [] expected.');
    return;
  }
  const duplicateMatches = [];
  // check if these are actually blocks...
  for (let i = 0; i < blocks.length - 1; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      // if (i === j) {
      //   // the same element
      //   continue;
      // }
      if (blocks[i].number === blocks[j].number) {
        if (blocks[i].face === blocks[j].face) {
          duplicateMatches.push([blocks[i], blocks[j]]);
        }
      }
    }
  }
  console.log(`duplicateMatches: ${duplicateMatches}`);
  return duplicateMatches;
}

function resolveDuplicateMatches(matches) {
  // why is matches undefined?
  matches.forEach(flipDuplicatePair);
}

// i must be careful not to trigger the counter flipCount when flipping them, even though
// do not seem to use them right now. possibly disabling trackFlips temporarily.
function flipDuplicatePair(pair) {
  // TODO: check type of pair
  let [block1, block2] = pair; // destructuring
  if (!(block1 instanceof BaseBlock) || !(block2 instanceof BaseBlock)) {
    // can i do this?
    console.error('Invalid type error!');
    return;
  }

  const previous = trackFlips;
  trackFlips = false;

  // flip ONE block (if you flip both, they will both have the same base again)
  block1.flipAndRender();
  // block1.flip();
  // block1.element.textContent = block1.getCurrentDisplay();

  trackFlips = previous;
}

// ****************************** Classes ******************************
// ****************** SystemId ******************
class SystemId {
  constructor(label, badge, base) {
    this.label = label; // e.g., "BIN", "DEC"
    this.badge = badge; // e.g., "(2)", "(10)"
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

// ****************** BaseBlocks ******************
class BaseBlock {
  constructor(id, number, systems, face = 0, matched = false) {
    this.id = id;
    this.number = number; // the actual value (e.g., 10)
    this.systems = systems; // array of SystemId objects
    this.face = face; // index of the current system => systemId
    this.matched = matched;
    /* for CSS manipulation:  */
    this.baseClasses = ['base1', 'base2', 'base3', 'base4', 'base5', 'base6'];
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
        this.select(); // Select on Enter or Space
      } else if (e.key === ' ') {
        e.preventDefault();
        this.flipAndRender();
        // this.flip(); // Flip on Space
        // this.element.textContent = this.getCurrentDisplay();
      }
    });

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
    // update css
    // Remove the old class
    this.element.classList.remove(this.baseClasses[this.face]);
    // Update the face index (cycle back to 0 if at the end)
    this.face = (this.face + 1) % this.systems.length;
    // Add the new class
    this.element.classList.add(this.baseClasses[this.face]);
    // you pay for flipping with socre penalty:
    //score--; // Penalty for flipping
    // In BaseBlock.flip():
    if (trackFlips) {
      score = Math.max(0, score - 1); // Penalty for flipping
    }
    document.querySelector('.score').textContent = score;
  }
  select = () => {
    //console.trace();
    if (this.element.classList.contains('disabled')) {
      console.log('Block is disabled, cannot select');
      return;
    }
    if (lockBoard) {
      console.log('Board is locked, cannot select');
      return;
    }
    if (this.element.classList.contains('selected')) {
      this.deselect();
      return;
    }

    if (gameControls.selectedBlocksCount === numberOfMatches) {
      console.log('Selection limit reached, cannot select more blocks');
      return;
    }
    if (gameControls.selectedBlocksCount > numberOfMatches) {
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

    if (gameControls.selectedBlocksCount === numberOfMatches) {
      lockBoard = true;
      gameControls.checkForMatch();
    }
  };
  deselect() {
    if (!this.element.classList.contains('selected')) {
      console.log('Block is not selected, cannot deselect');
      return;
    }
    if (lockBoard) {
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
}

// ****************** BlockSet ******************
class BlockSet {
  constructor(size, matches, startingRange, systemIds) {
    this.size = size || 16; // total number of blocks
    this.matches = matches || 2; // number of matches per group
    this.startingRange = startingRange || 12; // starting range for numbers
    this.blocks = [];
    this.createBlocks();
  }
  createBlocks() {
    let debucgger = 0;
    //create blocks
    for (
      let i = this.startingRange;
      i < this.size / this.matches + this.startingRange;
      i++
    ) {
      for (let j = 0; j < this.matches; j++) {
        let block = new BaseBlock(
          Math.floor(Math.random() * 900) + 100,
          i,
          gameControls.getSelectedBases(),
          Math.floor(Math.random() * gameControls.getSelectedBases().length)
        );
        this.blocks.push(block);
        debucgger++;
      }
    }
    this.shuffleBlocks();
    // generate blocks interface
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
}

// ****************** GameControls ******************
class GameControls {
  constructor() {
    this.selectedBases = [];
    this.blockSet = null;
    this.selectedBlocks = [];
    this.selectedBlocksCount = 0;
    this.hasFiredConfettiFor42 = false; // to avoid multiple confetti firings
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
      setSize,
      numberOfMatches,
      startingRange,
      this.getSelectedBases()
    );

    //works, but only at startup, not at level up:
    let duplicates;
    do {
      duplicates = findDuplicateMatches(gameControls.blockSet.blocks);
      resolveDuplicateMatches(duplicates);
    } while (findDuplicateMatches(gameControls.blockSet.blocks).length > 0); // while the array it is not empty
  }
  start() {
    console.log('Starting the game...');
    this.initializeBlockSet();
  }

  restart() {
    console.log('Restarting the game...');
    // Clear existing blocks from the grid
    grid.innerHTML = '';
    // Reset score and time
    this.hasFiredConfettiFor42 = false; // Reset confetti flag on restart
    // reset life-universe-everything message
    const lifeUniverseElement = document.querySelector(
      '.life-universe-everything'
    );
    if (lifeUniverseElement) {
      lifeUniverseElement.style.display = 'none';
      lifeUniverseElement.textContent = '';
    }
    startingRange = 1; // 36 for testing otherwise 1
    levelDisplay.textContent = startingRange;
    score = 0;
    time = 0;
    document.querySelector('.score').textContent = score;
    // Create a new BlockSet
    this.start();
  }

  continue() {
    console.log('Continuing with higher values...');
    // Clear existing blocks from the grid
    grid.innerHTML = '';
    // Update starting range
    startingRange++;
    levelDisplay.textContent = startingRange;
    //time = 0;
    //score = 0;
    //document.querySelector('.score').textContent = score;
    // Create a new BlockSet
    this.start();
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

      lockBoard = true;
      let allMatch = true;
      const firstNumber = this.selectedBlocks[0].number;
      for (let i = 1; i < this.selectedBlocks.length; i++) {
        if (this.selectedBlocks[i].number !== firstNumber) {
          allMatch = false;
          break;
        }
      }

      if (allMatch) {
        lockBoard = false;
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

          // actually this would be a pain if this happens multiple times...

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
        lockBoard = true; // Keep the board locked after a successful match
        score += numberOfMatches * 20; // Reward for a match
        document.querySelector('.score').textContent = score;
      } else {
        lockBoard = false;
        console.log('Blocks do not match.');
        this.selectedBlocks.forEach((block) => block.deselect());
      }

      this.checkWinCondition();

      this.resetBoard();
    }, 300);
  }
  checkWinCondition() {
    const allDisabled = this.blockSet.blocks.every((block) =>
      block.element.classList.contains('disabled')
    );
    if (allDisabled) {
      //console.log('Congratulations! You have matched all blocks!');
      //alert('Congratulations! You have matched all blocks!');
      // Optionally, you can restart the game or offer to restart
      this.continue();
      if (startingRange == 8) {
        alert('Great job! You have reached Level ' + startingRange + '!');
      } else if (startingRange == 16) {
        alert('Fantastic! You have reached Level ' + startingRange + '!');
      } else if (startingRange == 32) {
        alert('Amazing! You have reached Level ' + startingRange + '!');
      } else if (startingRange == 64) {
        alert(
          'Incredible! You have reached Level ' +
            startingRange +
            '!\nYou completed the game! Proceed at your own risk!'
        );
      }
    }
  }

  resetBoard() {
    this.selectedBlocks = [];
    this.selectedBlocksCount = 0;
    lockBoard = false;
  }
}

// ************************ ENGINE ************************

// ************************ INSTANTIATE GAME CONTROLS ************************

const gameControls = new GameControls();
gameControls.createDefaultSystems();
gameControls.initializeBlockSet();
// const duplicates = findDuplicateMatches(gameControls.blockSet.blocks); // this is ugly and should be gameControls methods
// resolveDuplicateMatches(duplicates);

// //works, but only at startup, not at level up:
// let duplicates;
// do {
//   duplicates = findDuplicateMatches(gameControls.blockSet.blocks);
//   resolveDuplicateMatches(duplicates);
// } while (findDuplicateMatches(gameControls.blockSet.blocks).length > 0); // while the array it is not empty
// ************************ EVENT LISTENERS ************************

restartButton.addEventListener(
  'click',
  gameControls.restart.bind(gameControls)
);
// ************************ Run Test Game ************************

// ************************ Dark Mode ************************
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
// ************************ ACCORDION ************************
const accordions = document.getElementsByClassName('accordion');
//console.log(accordions);
for (let i = 0; i < accordions.length; i++) {
  accordions[i].addEventListener('click', (e) => {
    // button: stay active
    e.target.classList.toggle('active');
    // toggle accordion panels
    //let panel = this.nextElementSibling;
    let panel = e.target.nextElementSibling;
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'block';
    }
  });
}
