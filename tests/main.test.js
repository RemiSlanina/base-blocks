import {
  SystemId,
  BaseBlock,
  BlockSet,
  startGame,
  checkWin,
  restart,
  checkForMatch,
  resetBoard,
} from '../main.js';
import { globalVar } from '../main.js';

// HALF BAKED TEST FILE
// CONTINUE IMPLEMENTING SOLVEGAME FUNCTION

/* Testing for main.js in base-blocks game */

//console.assert(false, 'Remove this line after reading'); // test

/* console.log(`score : ${score}`); // test

// Check if main.js is loaded
if (window.TEST_VARIABLE) {
  console.log('SUCCESS: main.test.js can access main.js!');
  console.log('TEST_VARIABLE =', window.TEST_VARIABLE);
} else {
  console.error('ERROR: main.test.js cannot access main.js!');
}
 */

console.log('lol');

console.log(`score : ${globalVar.score}`); // test
console.log('blockSet:', globalVar.blockSet); // test

// testing user controls from main.js - no UI interaction
//globalVar.numberOfBases = 2; // this will get overridden in startGame()
//globalVar.startingRange = 80; // this will get overridden in startGame()
//globalVar.numberOfMatches = 2; // this will get overridden in startGame()
// set in DOM instead of directly modifying globalVar
document.getElementById('starting-range').value = 14; // set the slider value for consistency
document.getElementById('bases-count').value = 4;
document.getElementById('matches-count').value = 2;
// test setSize as user input after implementation, via DOM
globalVar.setSize = 16;

startGame();
//console.log('After startGame, blockSet:', globalVar.blockSet); // test
//console.log(`startingRange : ${globalVar.startingRange}`); // test

// requirements:
// test functions

// requirements:
// test solving the game match by match...

function solveGame(start, base, match, s) {
  let starting = start; // startingRange
  let numBase = base; // numberOfBases
  let numMatch = match; // numberOfMatches
  let size = s; // setSize

  // find n blocks with matching number (where n = numberOfMatches)
  // do this i times (where i = setSize / numberOfMatches)
  let set = globalVar.blockSet.blocks;
  for (let i = starting; i < (starting + size) / numMatch; i++) {
    console.log(`i : ${i}`);
    // look at every block in set (blockSet)
    // if it matches the value for i, deactivate it and remove it from the set.
    // if not, skip it
    /* set = set.filter((block) => {
      if (block.number === i) {
        block.disableQuick();
        console.log(`set.length: ${set.length}`);
        return false; // remove matching block after disabling
      }
      return true; // keep in the array
    }); */
    // okay, this is pure nonsense

    // let's try doing the actual steps:

    // like finding n matching blocks and selecting them, plain and simple:

    // ATTENTION:
    // if the numberOfBases exceeds the number of matches
    // the algorithm needs a tweek: each number must be checked TWICE
    // for example: 2 mataches, 4 bases, number= 11 -> after finding a match, there's still another to find
    // TO DO : fix this!

    // this actually selects 2 blocks, but they do not seem to get disabled.
    // check if they actually get matched tomorrow
    // they _should_ match and disable automatically, but does not seem to work.
    for (let j = 0; j < set.length; j++) {
      if (set[j].number === i) {
        const rightClickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          button: 0, // 0 = left click
          view: window,
        });
        set[j].element.dispatchEvent(rightClickEvent);
        console.log(`current block after match: ${set[j].element.classList}`);
      }
    }
  }
}

solveGame(
  globalVar.startingRange,
  globalVar.numberOfBases,
  globalVar.numberOfMatches,
  globalVar.setSize
);

/* 

right mouse down 
const element = document.getElementById('your-element-id');
const rightClickEvent = new MouseEvent('contextmenu', {
  bubbles: true,
  cancelable: true,
  button: 2, // 2 represents the right mouse button
  view: window,
});

element.dispatchEvent(rightClickEvent);


--- 

middle mouse down (not used): 
const element = document.getElementById('your-element-id');
const middleClickEvent = new MouseEvent('auxclick', {
  bubbles: true,
  cancelable: true,
  button: 1, // 1 is the middle mouse button
  view: window,
});

element.dispatchEvent(middleClickEvent);
 

--- 

left mouse down: 
const element = document.getElementById('your-element-id');
const leftClickEvent = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
  button: 0, // 0 is the left mouse button, because why would it be consistent?
  view: window,
});

element.dispatchEvent(leftClickEvent);




*/
