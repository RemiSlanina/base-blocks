/* The main functionality for base-blocks, a memory like game 
   for matching across bases 
   written in pure vanilla js 
   */
// ************************ VARS ************************

/* tasks: 
 - implement 3D logic without z-offset (branch: 3d-blocks?)
 - fix cheating detection
 - ensure win detection works with 4 bases and 4 matches
 - let user chose which bases to play with (not only choosing a number with predefined ones)
 - or at least randomize the bases selected for the number of bases chosen 
 - let users choose set size (number of blocks) from a given list 
 - adjust the css to fit variable set sizes (maybe more columns on wider screens)
 .- implement levels with increasing difficulty (range, bases, matches)
 - fix mobile layout issues (280 px width for smaller numbers, 440-450 for larger)
*/

//for testing that the file has been edited
//consoleassert(false, 'Remove this line after reading'); // temporary to mark the file as edited

const grid = document.querySelector('.grid-container');
let trackFlips = true; // whether to track flips for score penalty, currently unused
let flipCountGlobal = 0; // global flip count for all blocks
const restartButton = document.getElementById('restart-button');
const startGameButton = document.getElementById('start-game-button');
let lockBoard = false; // to prevent user from clicking when checking for match
let score = 0; // current score
let matchesFound = 0; // number of matches found
let time = 0; // elapsed time, currently unused
const blocks = []; // array of BaseBlock objects, delete, this has been replaced by blockSet
//let startingRange = 10;
const baseContainer = document.querySelector('base-buttons-container'); // let user select bases
let selectedSystems = []; // this should become selectedBases (a set instead of an array!!)
const selectedBases = new Set();

let setSize = 16; // number of blocks, must be even
let selectedBlocks = []; // array of BaseBlock objects selected by the user
let selectedCount = 0; // number of currently selected blocks
//const supportedBases = []; // created after class SystemId
// ATTENTION:
// selectionLimit = numberOfMatches; // how many blocks can be selected at once

// USER INPUT VARS:
let startingRange =
  document.getElementById('starting-range').valueAsNumber || 10; // USER INPUT, the starting point for numbers
let startingRangeOutput = document.getElementById('starting-range-output');
startingRangeOutput.textContent = startingRange;
let numberOfBases = document.getElementById('bases-count').valueAsNumber || 2; // USER INPUT, how many bases to use
const dropDownNumberOfBases = document.getElementById('bases-count');
let numberOfMatches =
  document.getElementById('matches-count').valueAsNumber || 2; // USER INPUT, how many blocks make a match
const slider = document.getElementById('starting-range');
// add selected systems to user input vars

// ************************ EVENT LISTENERS ************************
restartButton.addEventListener('click', restart);
startGameButton.addEventListener('click', startGame);
dropDownNumberOfBases.addEventListener('change', updateNumberOfBases);

// ****************************** Helper Functions ******************************

// Update the current slider value (each time you drag the slider)
slider.oninput = function () {
  startingRangeOutput.textContent = this.value;
};

function updateNumberOfBases() {
  numberOfBases = document.getElementById('bases-count').value || 2;
  console.log(`numberOfBases: ${numberOfBases}`);
}

// TO-DOs
function setSelectedBlocks(num) {
  // TO-DO: variable blocks instead of firstBlock, secondBlock
  // do I need this??
}

// ****************************** Classes ******************************

// ****************** NumberSystems ******************

// Represents a number system (base)
// exported for testing purposes
export class SystemId {
  constructor(label, badge, base) {
    this.label = label; // e.g., "BIN", "DEC", "22", ""
    this.badge = badge; // e.g., "₂", "₁₆", "" (empty for 10)
    this.base = base; // the actual base (2, 10, 16, etc.)
  }
  toDisplay(num) {
    const converted = num.toString(this.base).toUpperCase();
    return this.badge ? converted + this.badge : converted;
  }
}

// NEED TO CREATE AN ARRAY OF NUMBER SYSTEMS HERE TO USE IN BASEBLOCKS CLASS NEXT

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

// ****************** GameControls ******************
// change and use this. seriously.
class GameControls {
  constructor() {
    this.selectedBases = new Set();
    this.numberOfBases = 2;
    this.init();
  }

  init() {
    this.renderBaseButtons();
    this.setupEventListeners();
  }

  renderBaseButtons() {
    // button creation logic
    supportedBases.forEach((base) => {
      const button = document.createElement('button');
      button.textContent = `${base.label}`;
      button.dataset.base = base.base;
      button.classList.add('base-button');
      // if (base.isCommon) button.classList.add('common-base'); // fix supportedBases - add isCommon

      button.addEventListener('click', () => {
        if (selectedBases.has(base.base)) {
          button.classList.remove('selected');
          selectedBases.delete(base.base);
        } else {
          if (selectedBases.size >= numberOfBases) {
            // change this to be responsive to NumberOfBases!! (not only 4, also 2)
            console.log('Maximum of bases reached');
            return;
          }
          selectedBases.add(base.base);
          button.classList.add('selected');
        }
        updateSelectedBases();
      });

      document.querySelector('.base-buttons-container').appendChild(button);
    });
  }

  setupEventListeners() {
    document.getElementById('bases-count').addEventListener('change', (e) => {
      this.numberOfBases = e.target.valueAsNumber || 2;
    });
  }
}

const gameControls = new GameControls();

// OLD CODE instead of GameControls, but still in use:

// CREATE BUTTONS FOR BASE SELECTION DYNAMICALLY
//const selectedBases = new Set(); // exchange selectedSystems with SelectedBases later! (TOP)
function createSystemButtons() {
  supportedBases.forEach((base) => {
    const button = document.createElement('button');
    button.textContent = `${base.label}`;
    button.dataset.base = base.base;
    button.classList.add('base-button');
    // if (base.isCommon) button.classList.add('common-base'); // fix supportedBases - add isCommon

    button.addEventListener('click', () => {
      if (selectedBases.has(base.base)) {
        button.classList.remove('selected');
        selectedBases.delete(base.base);
      } else {
        if (selectedBases.size >= numberOfBases) {
          // change this to be responsive to NumberOfBases!! (not only 4, also 2)
          console.log('Maximum of bases reached');
          return;
        }
        selectedBases.add(base.base);
        button.classList.add('selected');
      }
      updateSelectedBases();
    });

    document.querySelector('.base-buttons-container').appendChild(button);
  });
}
createSystemButtons();

function updateSelectedBases() {
  const selectedBasesContainer = document.querySelector('.selected-bases');
  selectedBasesContainer.innerHTML = '';
  selectedBases.forEach((base) => {
    const baseObj = supportedBases.find((opt) => opt.base === base);
    const tag = document.createElement('span');
    tag.textContent = `${baseObj.label}`;
    tag.classList.add('selected-tag');
    selectedBasesContainer.appendChild(tag);
  });
}

// ****************** BaseBlocks ******************

// Represents a single block in the game
// exported for testing purposes
export class BaseBlock {
  constructor(id, number, systems, face = 0, matched = false) {
    this.id = id;
    this.number = number; // the actual value (e.g., 10)
    this.systems = systems; // array of SystemId objects
    this.face = face; // index of the current system => systemId
    this.matched = matched;
    this.flipCount = 0;
    /* for CSS manipulation:  */
    this.baseClasses = ['base1', 'base2', 'base3', 'base4', 'base5', 'base6'];
    this.element = document.createElement('div');
    this.element.classList.add('block', this.baseClasses[this.face]);
    //this.isFirst = false; // delete this later
    //this.isSecond = false; // delete this later

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
  flip() {
    this.flipCount++;
    flipCountGlobal++;
    // Remove the old class
    this.element.classList.remove(this.baseClasses[this.face]);
    // Update the face index (cycle back to 0 if at the end)
    this.face = (this.face + 1) % this.systems.length;
    // Add the new class
    this.element.classList.add(this.baseClasses[this.face]);
    // you pay for flipping with score penalty:

    if (trackFlips) {
      score = Math.max(0, score - 1); // Penalty for flipping
    }
    document.querySelector('.score').textContent = score;
    if (this.flipCount > 5) {
      console.log(
        `Block ID ${this.id} has been flipped ${this.flipCount} times.`
      );
      console.log(`Global flip count is ${flipCountGlobal}.`);
      console.log('Consider strategizing your flips to minimize penalties.');
      console.log('Need help? Nudge Remi to add tips! Thanks :)');
    }
  }
  select = () => {
    //console.trace();
    // first check if block is disabled
    if (this.element.classList.contains('disabled')) {
      console.log('Block is disabled, cannot select');
      return;
    }
    // then check if board is locked
    if (lockBoard) {
      console.log('Board is locked, cannot select');
      return;
    }
    // then check if already selected
    if (this.element.classList.contains('selected')) {
      // deselect in this case
      console.log('Block is already selected, deselecting now');
      this.deselect(); // DESELECT SHOULD DECREASE THE COUNTER TO ALLOW NEW SELECTIONS
      return;
    }
    // then check if selection limit reached
    if (selectedCount === numberOfMatches) {
      console.log('Selection limit reached, cannot select more blocks');
      return;
    }
    if (selectedCount > numberOfMatches) {
      console.error('Selected count exceeded limit, this should not happen!');
      return;
    }
    // proceed with selection
    selectedCount++;
    //console.log(`Block selected. Current selected count: ${selectedCount}`);

    // do the actual selection
    selectedBlocks.push(this);
    this.element.classList.remove('deselected');
    this.element.classList.add('selected');

    // at the end!!
    // check for match it the array is full
    if (selectedCount === numberOfMatches) {
      checkForMatch();
      // TO DO:  (#todoaftertest)
      // LOCK BOARD !!!
      // happens in checkForMatch, on the other hand.
    }
  };
  deselect() {
    if (selectedCount <= 0) {
      console.error('Selected count is already zero, cannot deselect more!');
      return;
    }

    // remove from selectedBlocks array
    const index = selectedBlocks.indexOf(this);
    if (index > -1) {
      selectedBlocks.splice(index, 1);
      this.element.classList.remove('selected');
      this.element.classList.add('deselected');
      selectedCount--;
      //console.log(`Block deselected. Current selected count: ${selectedCount}`);
    } else {
      console.error('Block not found in selectedBlocks array!');
    }
  }
  disableQuick() {
    // Fast-disable: mark matched, remove event listener and update classes.
    // Use this during normal gameplay where cloning the element is unnecessary.
    this.matched = true;
    this.element.removeEventListener('click', this.selectBound);
    this.element.classList.remove('selected');
    this.element.classList.add('disabled');
  }

  // FOR TROUBLESHOOTING: clone the node so all event listeners are removed.
  // This is more heavy-weight but guarantees no event handlers remain.
  disableClone() {
    const newElement = this.element.cloneNode(true);
    this.element.parentNode.replaceChild(newElement, this.element);
    this.element = newElement;
    this.element.classList.add('disabled');
    this.matched = true;
    this.element.classList.remove('selected');
  }

  // Deprecated wrappers for backwards compatibility; prefer the new names.
  disableBypassed() {
    console.warn(
      'BaseBlock.disableBypassed() is deprecated — use disableQuick() instead.'
    );
    return this.disableQuick();
  }

  disable() {
    console.warn(
      'BaseBlock.disable() is deprecated — use disableClone() instead.'
    );
    return this.disableClone();
  }
}

// ****************** BlockSet ******************

// Represents the entire set of blocks in the game
// exported for testing purposes
export class BlockSet {
  constructor(size, matches, startingRange, systemIds) {
    this.size = size || 16; // total number of blocks
    this.matches = matches || 2; // number of matches per group
    this.startingRange = startingRange || 12; // starting range for numbers
    this.blocks = [];
    this.systemIds = systemIds || this.createDefaultSystems();
    this.createBlocks();
    this.selectedBlocks = [];
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
          selectedSystems,
          Math.floor(Math.random() * selectedSystems.length)
        );
        this.blocks.push(block);
        //.log(`debuggger value: ${debucgger} for number: ${i} match: ${j}`);
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

  /*   createDefaultSystems(number) {
    return [
      new SystemId('BIN', '₂', 2),
      new SystemId('OCT', '₈', 8),
      new SystemId('DEC', '', 10),
      new SystemId('HEX', '₁₆', 16),
    ];
  } */

  // delete this code:
  // I don't actually need this anymore.
  createDefaultSystems() {
    return [
      supportedBases[0], // BIN (base 2)
      supportedBases[6], // OCT (base 8)
      supportedBases[8], // DEC (base 10)
      supportedBases[14], // HEX (base 16)
    ];
  }
}

// ************************ ENGINE ************************

// startGame with user settings
// called when user clicks "Start Game" button
// expoted for testing purposes
// TO-DO:
// let user change setSize
// sanitize inputs
// write input checks and/or error messages (unlinkly, but numberOfBases = -400 is eeevil)
export function startGame() {
  // get user settings
  startingRange = document.getElementById('starting-range').valueAsNumber || 10;
  numberOfBases = parseInt(document.getElementById('bases-count').value, 10);
  numberOfMatches = parseInt(
    document.getElementById('matches-count').value,
    10
  );

  // reset selected systems
  selectedSystems.length = 0;

  // quick fix, refactor later:
  selectedSystems = Array.from(selectedBases).map((base) =>
    supportedBases.find((system) => system.base === base)
  );

  // a temporary array, later to be substituted by user input:
  const chosenBases = [1, 2, 5];
  // for loop through all the bases i got:
  supportedBases.forEach((system, i) => {
    for (let j = 0; j < chosenBases.length; j++) {
      if (system.base === chosenBases[j]) {
        selectedSystems.push(system);
      }
    }
  });

  console.log(
    `Starting game with range: ${startingRange}, bases: ${numberOfBases}, matches: ${numberOfMatches}`
  );
  // restart the game with new settings
  restart();
}

// DEBUGGING: checkWin with detailed logging
// doesnot detect cheating after refactor (I probly messed it up now, too)
// also
// does not detect win given 4 bases and 4 matches
// TO-DO: fix cheating detection
// expoted for testing purposes

export function checkWin() {
  console.log('Checking for win condition...');

  if (typeof blockSet === 'undefined') {
    // defensive: blockSet may not be created yet
    console.warn('checkWin called before blockSet exists; skipping');
    return;
  }

  if (matchesFound === setSize / numberOfMatches) {
    // CHEATING DETECTION (disabled for now) BROKEN !
    /*  
    // CHEATING DETECTION
    // is my cheating logic broken?
    // first check for cheating (all blocks are matched and show the same face)
    const allMatched = blockSet.blocks.filter((block) => block.matched);
    const firstFace = blockSet.blocks[0].face;
    const allSameFace = allMatched.every((block) => block.face === firstFace);

    if (allSameFace) {
      console.warn('All blocks matched and showing same face!');
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
      });
      alert('');

      return;
    }
 */
    // then check for normal win condition

    console.log('All matches found! You win!');
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
    });
    //alert(`Congratulations! You found all matches! Your score: ${score}`);
    // restart();
  } else {
    console.log(
      `Matches found: ${matchesFound}/${setSize / numberOfMatches}. Keep going!`
    );
  }
}

// restart the game with the old settings
// expoted for testing purposes

export function restart() {
  // restart the game
  console.log('Restarting the game...');
  // Clear existing blocks from the grid
  grid.innerHTML = '';
  // Reset score and time
  score = 0;
  time = 0;
  document.querySelector('.score').textContent = score;
  // Create a new BlockSet
  //selectedSystems.length = 0;

  // use old selected sytems here. pass new selected sytems in startGame() // start with new values

  /* // DELETE OLD CODE 
  // update the systems ( = bases ) the user selected:
  for (let i = 0; i < numberOfBases; i++) {
    // For now, just cycle through the common systems
    switch (i) {
      case 0:
        selectedSystems.push(new SystemId(1, 'BIN', '(2)', 2));
        break;
      case 1:
        selectedSystems.push(new SystemId(3, 'HEX', '(16)', 16));
        break;
      case 2:
        selectedSystems.push(new SystemId(2, 'DEC', '(10)', 10));
        break;
      case 3:
        selectedSystems.push(new SystemId(4, 'OCT', '(8)', 8));
        break;
      default:
        // For more than 4 bases, just repeat DEC
        selectedSystems.push(new SystemId(2, 'DEC', '(10)', 10));
        console.warn(
          `Number of bases (${numberOfBases}) exceeds predefined systems in restart(). Repeating DEC for extra bases.`
        );
        break;
    }
  }
 */

  const blockSet = new BlockSet(
    setSize,
    numberOfMatches,
    startingRange,
    selectedSystems
  );
}

// works mostly, but needs to be tested more
// once I matched a block with itself (should not be possible)
// TO-DO: fix that
// expoted for testing purposes
export function checkForMatch() {
  setTimeout(() => {
    //console.log('checking for match...');

    lockBoard = true;

    let allMatch = true;
    const firstNumber = selectedBlocks[0].number;

    for (let i = 1; i < selectedBlocks.length; i++) {
      if (selectedBlocks[i].number !== firstNumber) {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      // It's a match
      // Disable all selected blocks
      lockBoard = true;
      //console.log(`selectedblocks length: ${selectedBlocks.length}`); // Debugging line
      //console.log(`selectedBlocks: ${JSON.stringify(selectedBlocks)}`); // Debugging line
      // iterate a shallow copy so we don't mutate the array while looping
      selectedBlocks.slice().forEach((block) => {
        block.disableQuick();
        //console.log(`Disabled block ID: ${block.id}`); // Debugging line
      });

      // clear selectedBlocks array and reset the selected counter
      selectedBlocks.length = 0; // this clears the array with O(1) complexity
      selectedCount = 0;
      //lockBoard = false; in resetBoard (below)
      score += numberOfMatches * 20; // Reward for a match
      matchesFound++;
      document.querySelector('.score').textContent = score;
      console.log("It's a match!");
      checkWin();
    } else {
      selectedBlocks.forEach((block) => {
        block.deselect();
      });
    }

    // Old code:
    /* 
    if (firstBlock.number === secondBlock.number) {
      firstBlock.disable();
      secondBlock.disable();
      //lockBoard = false; in resetBoard (below)
      score += numberOfMatches * 20; // Reward for a match
      matchesFound++;
      document.querySelector('.score').textContent = score;
      console.log("It's a match!");
      checkWin();
    } else {
      firstBlock.deselect();
      secondBlock.deselect();
    }
 */

    resetBoard();
  }, 300);
}

// reset the selection state
// exported for testing purposes
export function resetBoard() {
  firstBlock = null;
  secondBlock = null;
  lockBoard = false;
}

// ************************ Quick Tests ************************

console.assert(true, 'Testing setup works!'); // node js assert module, perhaps?

// delete old code:
/* // Common Number Systems (for first version):
const bin = new SystemId('BIN', '(2)', 2);
const dec = new SystemId('DEC', '(10)', 10);
const hex = new SystemId('HEX', '(16)', 16);
const oct = new SystemId('OCT', '(8)', 8);
 */

// update the systems ( = bases ) the user selected:
// const selectedSystems = ["bin", "oct", "dec", "hex"];
selectedSystems.push(supportedBases[0]);
selectedSystems.push(supportedBases[6]);
selectedSystems.push(supportedBases[8]);
selectedSystems.push(supportedBases[14]);

const blockSet = new BlockSet(
  setSize,
  numberOfMatches,
  startingRange,
  selectedSystems
);
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

// ************************ Testing ************************

// for testing:
export const globalVar = {
  grid,
  selectedSystems,
  trackFlips,
  flipCountGlobal,
  restartButton,
  startGameButton,
  startingRange,
  startingRangeOutput,
  numberOfBases,
  slider,
  lockBoard,
  score,
  matchesFound,
  time,
  blocks,
  setSize,
  numberOfMatches,
  selectedBlocks,
  selectedCount,
  blockSet,
};
