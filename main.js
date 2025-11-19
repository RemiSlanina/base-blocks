// ****************************** Vars ******************************
const grid = document.querySelector('.grid-container');
let trackFlips = true;
let flipCount = 0;
const restartButton = document.getElementById('restart-button');
let lockBoard = false;
let score = 0;
let time = 0;
const blocks = [];
let startingRange = 1;
let setSize = 16; // number of blocks, must be even
let numberOfMatches = 2;
let firstBlock, secondBlock;

// ****************************** Helper Functions ******************************
// TO-DOs
function setSelectedBlocks(num) {
  // TO-DO: variable blocks instead of firstBlock, secondBlock
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
  generateInterface() {
    this.element.textContent = this.getCurrentDisplay();
    grid.appendChild(this.element);
    this.element.title = 'Right-click to flip the block';
  }
  getCurrentDisplay() {
    return this.systems[this.face].toDisplay(this.number);
  }
  flip() {
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
    //.log(`selected ${this.getCurrentDisplay()}`);
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
    //.log(`deselected ${this.getCurrentDisplay()}`);
  }
  disable() {
    /* this.element.classList.remove("selected");
    this.element.classList.add("deselected"); */
    //this.deselect();
    this.element.removeEventListener('click', this.selectBound);
    this.deselect();
    this.element.classList.add('disabled');
    //console.log(`disabled ${this.getCurrentDisplay()}`);
    //console.log('After disable:', this.element.classList);
    if (this.element.classList.contains('disabled')) {
      //console.log(
      //  `${this.getCurrentDisplay()} is disabled after calling disable()`
      //);
      return;
    }
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
          gameControls.getSelectedBases(),
          Math.floor(Math.random() * gameControls.getSelectedBases().length)
        );
        this.blocks.push(block);
        //.log(`debuggger value: ${debucgger} for number: ${i} match: ${j}`);
        debucgger++;
      }
      // const number = this.startRange + i;
      // const systems = this.createNumberSystems(number);
      // const block = new BaseBlock(i, number, systems);
      //this.blocks.push(block);
      //this.block.generateInterface();
    }
    this.shuffleBlocks();
    // generate blocks interface
    this.blocks.forEach((block) => {
      //.log(block);
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
  }

  restart() {
    console.log('gamecontrols.restart: Restarting the game...');
    // Clear existing blocks from the grid
    grid.innerHTML = '';
    // Reset score and time
    score = 0;
    time = 0;
    document.querySelector('.score').textContent = score;
    // Create a new BlockSet
    this.initializeBlockSet();
  }
}

// ************************ ENGINE ************************
/* 
function restart() {
  console.log('Restarting the game...');
  // Clear existing blocks from the grid
  grid.innerHTML = '';
  // Reset score and time
  score = 0;
  time = 0;
  document.querySelector('.score').textContent = score;
  // Create a new BlockSet
  const blockSet = new BlockSet(
    setSize,
    numberOfMatches,
    startingRange,
    gameControls.getSelectedBases()
  );
}
 */
function checkForMatch() {
  setTimeout(() => {
    // return if either block is null (safety check)
    if (!firstBlock || !secondBlock) return;
    if (firstBlock.number === secondBlock.number) {
      firstBlock.disable();
      secondBlock.disable();
      //lockBoard = false; in resetBoard (below)
      score += numberOfMatches * 20; // Reward for a match
      document.querySelector('.score').textContent = score;
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

// ************************ INSTANTIATE GAME CONTROLS ************************

const gameControls = new GameControls();
gameControls.createDefaultSystems();
gameControls.initializeBlockSet();

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
