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
*/

const grid = document.querySelector('.grid-container');
const selectedSystems = [];
let trackFlips = true;
let flipCountGlobal = 0;
const restartButton = document.getElementById('restart-button');
const startGameButton = document.getElementById('start-game-button');
let startingRange =
  document.getElementById('starting-range').valueAsNumber || 10;
let startingRangeOutput = document.getElementById('starting-range-output');
startingRangeOutput.textContent = startingRange;
let numberOfBases = document.getElementById('bases-count').valueAsNumber || 2;
const slider = document.getElementById('starting-range');
let lockBoard = false;
let score = 0;
let matchesFound = 0;
let time = 0;
const blocks = [];
//let startingRange = 10;
let setSize = 16; // number of blocks, must be even
let numberOfMatches =
  document.getElementById('matches-count').valueAsNumber || 2;
let selectedBlocks = [];
let selectedCount = 0;
// ATTENTION:
// selectionLimit = numberOfMatches; // how many blocks can be selected at once
let firstBlock, secondBlock;

// Set initial output

// ************************ EVENT LISTENERS ************************
restartButton.addEventListener('click', restart);
startGameButton.addEventListener('click', startGame);

// ****************************** Helper Functions ******************************

// Update the current slider value (each time you drag the slider)
slider.oninput = function () {
  startingRangeOutput.textContent = this.value;
};

// TO-DOs
function setSelectedBlocks(num) {
  // TO-DO: variable blocks instead of firstBlock, secondBlock
  // do I need this??
}

// ****************************** Classes ******************************

// ****************** NumberSystems ******************

class SystemId {
  constructor(systemId, label, badge, base) {
    this.systemId = systemId; // e.g., 1 for binary, 2 for decimal, etc.
    this.label = label; // e.g., "BIN", "DEC"
    this.badge = badge; // e.g., "(2)", "(10)"
    this.base = base; // the actual base (2, 10, 16, 8)
  }
  toDisplay(num) {
    return num.toString(this.base).toUpperCase() + this.badge;
  }
}

// ****************** BaseBlocks ******************

class BaseBlock {
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
    }

    // OLD CODE:
    // delete later
    /* 
    if (this === firstBlock) {
      this.deselect();
      this.isFirst = false;
      return;
    }

    if (!firstBlock) {
      firstBlock = this;
      this.isFirst = true;
    } else if (!(firstBlock === this)) {
      secondBlock = this;
      this.isSecond = true;
    }
    this.element.classList.remove('deselected');
    this.element.classList.add('selected');

    // at the end!!
    if (secondBlock) {
      checkForMatch();
    }
     */
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

    // OLD CODE:
    /*
    if (this.isFirst) {
      firstBlock = null;
      this.isFirst = false;
    } else if (this.isSecond) {
      secondBlock = null;
      this.isSecond = false;
    } else return;
    this.element.classList.remove('selected');
    this.element.classList.add('deselected');
    */
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
class BlockSet {
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

  createDefaultSystems(number) {
    return [
      new SystemId(1, 'BIN', '(2)', 2),
      new SystemId(2, 'OCT', '(8)', 8),
      new SystemId(3, 'DEC', '(10)', 10),
      new SystemId(4, 'HEX', '(16)', 16),
    ];
  }
}

// ************************ ENGINE ************************

/* startGame with user settings */
function startGame() {
  // get user settings
  startingRange = document.getElementById('starting-range').valueAsNumber || 10;
  numberOfBases = parseInt(document.getElementById('bases-count').value, 10);
  numberOfMatches = parseInt(
    document.getElementById('matches-count').value,
    10
  );

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

function checkWin() {
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

  // OLD CODE:
  // to be deleted later
  /*   const totalMatches = blockSet.size / numberOfMatches;
  if (matchesFound === totalMatches) {
    // Find unmatched blocks (blocks that were not marked matched)
    const unmatchedBlocks = blockSet.blocks.filter((block) => !block.matched);

    // If there are no unmatched blocks, it's a normal win — celebrate and return
    if (unmatchedBlocks.length === 0) {
      console.log('You win!');
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
      });
      return;
    }

    // If all remaining unmatched blocks are showing the same face, warn about cheating
    const firstBase = unmatchedBlocks[0]?.face;
    const allSameBase = unmatchedBlocks.every(
      (block) => block.face === firstBase
    );

    if (allSameBase) {
      console.log(
        'All unmatched blocks are facing the same base — possible cheating detected.'
      );
      confetti({
        particleCount: 100,
        spread: 50,
        colors: ['#363636ff', '#888888ff', '#c5c5c5ff'],
      });
      alert(
        'Nice, but all unmatched blocks are facing the same base. Try matching different bases!'
      );
      return;
    }

    // Otherwise, normal win flow
    console.log('You win!');
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
    });
  } */
}

function restart() {
  // restart the game
  console.log('Restarting the game...');
  // Clear existing blocks from the grid
  grid.innerHTML = '';
  // Reset score and time
  score = 0;
  time = 0;
  document.querySelector('.score').textContent = score;
  // Create a new BlockSet
  selectedSystems.length = 0;
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
function checkForMatch() {
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

function resetBoard() {
  firstBlock = null;
  secondBlock = null;
  lockBoard = false;
}

// ************************ Testing ************************

// Common Number Systems (for first version):
const bin = new SystemId(1, 'BIN', '(2)', 2);
const dec = new SystemId(2, 'DEC', '(10)', 10);
const hex = new SystemId(3, 'HEX', '(16)', 16);
const oct = new SystemId(4, 'OCT', '(8)', 8);

// update the systems ( = bases ) the user selected:
// const selectedSystems = ["bin", "oct", "dec", "hex"];
selectedSystems.push(bin);
selectedSystems.push(dec);
selectedSystems.push(hex);
selectedSystems.push(oct);

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
