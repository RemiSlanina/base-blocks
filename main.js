
/* The main functionality for base-blocks, a memory like game 
   for matching across bases 
   written in pure vanilla js 
   */
// ************************ VARS ************************

const grid = document.querySelector('.grid-container'); 
const selectedSystems = []; 
let trackFlips = true; 
let flipCountGlobal = 0;
const restartButton = document.getElementById('restart-button');
let lockBoard = false;
let score = 0;
let matchesFound = 0;
let time = 0;
const blocks = [];
let startingRange = 10;
let setSize = 16; // number of blocks, must be even
let numberOfMatches = 2;
let firstBlock, secondBlock; 


restartButton.addEventListener('click', restart);
// ****************************** Helper Functions ******************************

// TO-DOs
function setSelectedBlocks(num) {
  // TO-DO: variable blocks instead of firstBlock, secondBlock 
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
    this.isFirst = false;
    this.isSecond = false;

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
  generateInterface(){
  this.element.textContent = this.getCurrentDisplay();
  grid.appendChild(this.element);
  this.element.title = "Right-click to flip the block";
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
      console.log(`Block ID ${this.id} has been flipped ${this.flipCount} times.`);
      console.log(`Global flip count is ${flipCountGlobal}.`);  
      console.log('Consider strategizing your flips to minimize penalties.');
      console.log('Need help? Nudge Remi to add tips! Thanks :)'); 
    }
  }
  select = () => {
    //console.trace();
    if (this.element.classList.contains('disabled')) {
      console.log('Block is disabled, cannot select');
      return;
    }
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
  };
  deselect() {
    if (this.isFirst) {
      firstBlock = null;
      this.isFirst = false;
    } else if (this.isSecond) {
      secondBlock = null;
      this.isSecond = false;
    } else return;
    this.element.classList.remove('selected');
    this.element.classList.add('deselected');
  }
  disableBypassed() {

    this.element.removeEventListener('click', this.selectBound);
    this.deselect();
    this.element.classList.add('disabled');
    if (this.element.classList.contains('disabled')) {
      return;
    }
  }
  // FOR TROUBLESHOOTING:
  disable() {
    const newElement = this.element.cloneNode(true);
    this.element.parentNode.replaceChild(newElement, this.element);
    this.element = newElement;
    this.element.classList.add('disabled');
    this.deselect();
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
    for (let i = this.startingRange;i < (this.size / this.matches) + this.startingRange; i++) {
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
      new SystemId(1, "BIN", "(2)", 2),
      new SystemId(2, "OCT", "(8)", 8),
      new SystemId(3, "DEC", "(10)", 10),
      new SystemId(4, "HEX", "(16)", 16),
    ];
  }
}


// ************************ ENGINE ************************ 

function checkWin() {
  // TO-DO: implement win check
  console.log('Checking for win condition...');
  if (matchesFound === setSize / numberOfMatches) {
    // check if all blocks got the same base facing up?? 
    // then someone probably cheated :) 

    // implement cheat detection here later

    const unmatchedBlocks = blocks.filter(block => !block.matched); 
    const firstBase = unmatchedBlocks[0]?.face; 
    const allSameBase = unmatchedBlocks.every(block => block.face === firstBase);

    if (allSameBase) {
      console.log('All blocks are facing the same base! Possible cheating detected. Or player confused? Implement better instructions?');
      confetti({ particleCount: 100, spread: 50, colors: ['#363636ff', '#888888ff', '#c5c5c5ff'] }); // Shame confetti
      alert('Nice, but all unmatched blocks are facing the same base. Try matching different bases!');
      return;
    }

    console.log('You win!');
    // Trigger confetti animation
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 }
    });
    // more celebration or win message here
    //const thankYouMessage = document.querySelector('.thank-you-message');
    //thankYouMessage.textContent = '🎉 Congratulations! You matched all blocks! 🎉';
  }
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
  const blockSet = new BlockSet(setSize, numberOfMatches, startingRange, selectedSystems);
}

function checkForMatch() {
  setTimeout(() => {
    console.log('check hello');
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

const blockSet = new BlockSet(setSize, numberOfMatches, startingRange, selectedSystems); 
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
