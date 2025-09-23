//import { nanoid } from "nanoid"; // generate IDs

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

  //console.log(firstBlock.getCurrentDisplay());
  //console.log(secondBlock.isSecond);
  resetBoard();
  //console.log(firstBlock.getCurrentDisplay());
  //console.log(secondBlock.getCurrentDisplay());
  // If I stop the code here, the blocks behave as they should
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

    /*  if (!firstBlock) {
      firstBlock = this;
    } else if (!firstBlock === this) {
      secondBlock = this;
      lockBoard = true;
      checkForMatch();
    } */
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

// ************************ Testing ************************
/* 
for (let i = 1; i <= 16; i++) {
  // random ID
  //let randomId = Math.floor(Math.random() * 900) + 100;
  //TO DO : ADD SYSTEMID
  let blockOne = new BaseBlock(Math.floor(Math.random() * 900) + 100, i, bases);
  console.log(blockOne);
  let blockTwo = new BaseBlock(Math.floor(Math.random() * 900) + 100, i, bases);
  console.log(blockTwo);
  let block = document.createElement("div");
  block.classList.add("block");
  grid.appendChild(block);
  blocks.push(block);
}

const systems = [binary, decimal, hex, octal];
let block = new BaseBlock(Math.floor(Math.random() * 900) + 100, 10, systems);
console.log(block.currentDisplay); // "1010(2)"
block.flip();
console.log(block.currentDisplay); // "10(10)"
block.flip();
console.log(block.currentDisplay); // "a(16)" 

 */

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

/* console.log(binary.toDisplay(10)); // "1010(2)"
console.log(decimal.toDisplay(10)); // "10(10)"
console.log(hex.toDisplay(10)); // "a(16)"
console.log(octal.toDisplay(10)); // "12(8)" */

// oooold code:

/* 
// An array of SystemId instances
const systems = [bin, dec, hex, oct];
// Each Base gets the systems-array as an argument
// Each array item represents a face of the block = a base
for (let i = 1; i <= 16; i++) {
  // Create two blocks for each number
  for (let j = 0; j < 2; j++) {
    let block = new BaseBlock(
      Math.floor(Math.random() * 900) + 100,
      i,
      systems,
      Math.floor(Math.random() * 4) // random starting face
    );
    blocks.push(block);
  }
}
 */

// Shuffle the blocks for the game
// -0.5 to +0.5 -> negative switch element
blocks.sort(() => Math.random() - 0.5);

blocks.forEach((block) => {
  block.element.textContent = block.getCurrentDisplay();
  /* 
  // ****************** LEFT CLICK: ****************** 
  block.element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    block.flip();
    block.element.textContent = block.getCurrentDisplay();
  });
  // ****************** RIGHT CLICK: ****************** 
  block.element.addEventListener("click", () => {
    block.select();
  });
 */
  //block.element.addEventListener("click", block.select.bind(block));

  //block.element.addEventListener("click", block.select);

  grid.appendChild(block.element);
});

// ************************ Dark Mode ************************

//const html = document.documentElement;
//const toggle = document.getElementById("theme-toggle");

// load saved theme if there is any
// or fall back to system preference (dark or light)
//const savedTheme = localStorage.getItem("theme");
if (localStorage.getItem('theme')) {
  document.documentElement('data-theme', localStorage.getItem('theme'));
}

// for accessibility :
// let the user toggle the theme manually
// toggle theme and save preference
document.getElementById('theme-toggle').addEventListener('click', () => {
  /* e.preventDefault(); */
  //document.documentElement.classList.toggle("dark");
  document.documentElement.setAttribute(
    'data-theme',
    document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'light'
      : 'dark'
  );
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});
/* 
const currentTheme = document.documentElement.getAttribute("data-theme");
console.log(currentTheme); // "dark" or null (if not set) */

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
