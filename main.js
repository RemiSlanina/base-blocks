/* BASEBLOCKS = number puzzle game. 

a memory like puzzle game where you match 
numbers across bases by clicking on them.
 */
// ************************ VARS ************************
//const bases = ["bin", "oct", "dec", "hex"];

/* 
  ALLOWED SET SIZES for match 2: 
  2x2
  4x4
  4x5
  4x6
  6x6
  8x8
  8x10
*/
const grid = document.querySelector('.grid-container');
const blocks = [];
const selectedSystems = [];
let lockBoard = false;
let score = 0;
let time = 0;
let startingRange = 1;
let setSize = 16; // number of blocks, must be even
let numberOfMatches = 2;
let firstBlock, secondBlock;

// TO-DOs
function setSelectedBlocks(num) {
  // TO-DO: variable blocks instead of firstBlock, secondBlock?
}

function checkForMatch() {
  setTimeout(() => {
    console.log('check hello');
    if (firstBlock.number === secondBlock.number) {
      firstBlock.disable();
      secondBlock.disable();
      //lockBoard = false; in resetBoard (below)
      score++;
      document.querySelector('.score').textContent = score;
      console.log("It's a match!");
    } else {
      firstBlock.deselect();
      secondBlock.deselect();
    }
    resetBoard();
  }, 300);
}

function resetBoard() {
  //console.log(firstBlock.isSecond);
  //console.log(secondBlock.isSecond);
  //firstBlock.isFirst = false;
  firstBlock = null;
  //secondBlock.isFirst = false;
  secondBlock = null;
  lockBoard = false;
}

// ****************************** Classes ******************************

// ****************** NumberSystems ******************

/* manages a base that can be reused by different numbers throughout the puzzle */
class SystemId {
  /* Constructor Parameters: 
    id : random id, unrelated to system, f.e. 1 for binary, 2 for hex, ...,
    label : a short expressive label like "BIN" or "DEC" (or "")
    badge : the suffix for the number, like (2) or (10)...,
    base = 0 : the CURRENT base 
     */
  constructor(id, base, badge, label) {
    this.id = id; // e.g., 1 for binary, 2 for decimal, etc.
    this.label = label; // e.g., "BIN", "DEC"
    this.badge = badge; // e.g., "(2)", "(10)"
    this.base = base; // the current base
  }
  toDisplay(num) {
    return num.toString(this.base).toUpperCase() + this.badge;
  }
}

// ****************** BaseBlocks ******************

/* A block or cube that represents a number 
   it has a certain number of faces (f.e. 4) 
   that represent the same number in different numeral 
   systems. 
   Each Baseblock has a set of variables and methods 
   and manages an Array of SystemIds that represent the 
   number systems used in the puzzle 
   */
class BaseBlock {
  /* Constructor Parameters: 
    id :  integer value representing an ID,
    number : integer value representing the number of the cube,
    systems : systems = an Array [] of SystemIds  ,
    face = 0 : the index of the current face  ,
    matched = false : has this cube been matched  */
  constructor(
    id,
    number,
    systems /* systems = SystemId [] */,
    face = 0 /* current face */,
    matched = false
  ) {
    this.id = id;
    this.number = number; // the actual value (e.g., 10)
    this.systems = systems; // assume 4 systems for now (front/right/back/left)
    // index of the current system => systemId
    this.face = face; // 0..3 (front=0, right=1, back=2, left=3)
    this.isFirst = false;
    this.isSecond = false;
    this.matched = matched;

    /* for CSS manipulation:  */
    // using only the first 4 color schemes from base1 ... base 4 for the first version:
    this.baseColorClasses = [
      'base-color-1',
      'base-color-2',
      'base-color-3',
      'base-color-4',
      'base-color-5',
      'base-color-6',
    ]; // contain color schemes for bin, dec...
    this.element = document.createElement('div'); // the cube
    //this.element.classList.add('block', this.baseColorClasses[this.face]);

    // the faces in CSS (4 for now)
    this.faces = [];
    const faceCount = Math.min(systems.length, 4); // 4 or more / 4-6(?) faces
    for (let i = 0; i < faceCount; i++) {
      const faceElement = document.createElement('div');
      faceElement.classList.add('face', `face-${i}`, this.baseColorClasses[i]);
      faceElement.textContent = this.getDisplayFor(i);
      this.element.appendChild(faceElement);
      this.faces.push(faceElement);
    }

    /* ****************** LEFT CLICK: ****************** */
    // left click = select
    this.selectBound = this.select.bind(this);
    this.element.addEventListener('click', this.selectBound);

    /* ****************** RIGHT CLICK: ****************** */
    // right click = flip cube
    this.element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.flip();
      //this.element.textContent = this.getCurrentDisplay();
    });

    // initial rotation
    this.updateRotation();
  }

  /* ****************** BB METHODS: ****************** */

  // get the Display for ANY face of the cube
  getDisplayFor(i) {
    return this.systems[i].toDisplay(this.number);
  }

  // get the display for the CURRENTLY SHOWN face of the cube
  getCurrentDisplay() {
    return this.getDisplayFor(this.face);
    //older code:
    //return this.systems[this.face].toDisplay(this.number);
  }
  flip() {
    /*   // Remove the old class
    this.element.classList.remove(this.baseColorClasses[this.face]);
    // Update the face index (cycle back to 0 if at the end)
    this.face = (this.face + 1) % this.systems.length;
    // Add the new class
    this.element.classList.add(this.baseColorClasses[this.face]); */

    this.face = (this.face + 1) % this.systems.length;
  }

  // Rotate the cube container
  // -90° steps
  updateRotation() {
    const deg = -90 * this.face;
    this.element.style.transform = `rotateY(${deg}deg)`;
  }

  // called if number or systems change
  rerender() {
    this.faces.forEach((f, i) => {
      f.textContent = this.getDisplayFor(i);
    });
  }

  select = () => {
    console.trace();
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
    console.log(`selected ${this.getCurrentDisplay()}`);

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
    console.log(`deselected ${this.getCurrentDisplay()}`);
  }
  disableBypassed() {
    /* this.element.classList.remove("selected");
    this.element.classList.add("deselected"); */
    //this.deselect();
    this.element.removeEventListener('click', this.selectBound);
    this.deselect();
    this.element.classList.add('disabled');
    console.log(`disabled ${this.getCurrentDisplay()}`);
    console.log('After disable:', this.element.classList);
    if (this.element.classList.contains('disabled')) {
      console.log(
        `${this.getCurrentDisplay()} is disabled after calling disable()`
      );
      return;
    }
  }

  // FOR TROUBLESHOOTING:
  disable() {
    // Clone the element to remove all listeners (nuclear option)
    const newElement = this.element.cloneNode(true);
    this.element.parentNode.replaceChild(newElement, this.element);
    this.element = newElement;
    this.element.classList.add('disabled');
    this.deselect();
  }
}

// ************************ ENGINE ************************

// create 4 systems and push them to selectedSystems []

// Common Number Systems (for first version):
const bin = new SystemId(1, 2, '(2)', 'BIN');
const dec = new SystemId(2, 10, '(10)', 'DEC');
const hex = new SystemId(3, 16, '(16)', 'HEX');
const oct = new SystemId(4, 8, '(8)', 'OCT');
// update the systems ( = bases ) the user selected:
// const selectedSystems = ["bin", "oct", "dec", "hex"];
selectedSystems.push(bin);
selectedSystems.push(dec);
selectedSystems.push(hex);
selectedSystems.push(oct);

// lets say the user selects 4 bases: bin, oct, dec, hex
for (
  let i = startingRange;
  i < setSize / numberOfMatches + startingRange;
  i++
) {
  for (let j = 0; j < numberOfMatches; j++) {
    let block = new BaseBlock(
      Math.floor(Math.random() * 900) + 100,
      i,
      selectedSystems,
      Math.floor(Math.random() * selectedSystems.length)
    );
    blocks.push(block);
  }
}

// Shuffle the blocks for the game
// -0.5 to +0.5 -> negative switch element
blocks.sort(() => Math.random() - 0.5);

blocks.forEach((block) => {
  block.element.textContent = block.getCurrentDisplay();
  grid.appendChild(block.element);
});

// ************************ Testing ************************
/* 
console.log(`--------------- TEST ---------------`);

const blocksTesting = [];
let setSizeTesting = 2;
let startingRangeTesting = 10;

for (
  let i = startingRangeTesting;
  i < setSizeTesting / numberOfMatches + startingRangeTesting;
  i++
) {
  for (let j = 0; j < numberOfMatches; j++) {
    let block = new BaseBlock(
      Math.floor(Math.random() * 900) + 100,
      i,
      selectedSystems,
      Math.floor(Math.random() * selectedSystems.length)
    );
    blocksTesting.push(block);
  }
}

blocksTesting.forEach((block, i) => {
  block.element.textContent = block.getCurrentDisplay();

  console.log(`--------- Block ${i} ---------`);

  console.log(block.getDisplayFor(0));
  console.log(block.getDisplayFor(1));
  console.log(block.getDisplayFor(2));

  console.log(block.getCurrentDisplay());

  block.getDisplayFor(0); // "10(2)"   e.g., binary
  block.getDisplayFor(1); // "A(16)"   e.g., hex
  block.getDisplayFor(2); // "12(10)"  decimal

  block.getCurrentDisplay(); // whichever of the above matches block.face

  grid.appendChild(block.element);
});

console.log(`--------------- TEST ---------------`);
 */

// ************************ Others (Dark Mode ...) ************************

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
