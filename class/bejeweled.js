const Screen = require("./screen");
const Cursor = require("./cursor");

class Bejeweled {

  static score = 0;
  static selected = null;

  constructor() {

    // Initialize this
    this.grid = [[' ',' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ',' '],
                 [' ',' ',' ',' ',' ',' ',' ',' ']];

    this.cursor = new Cursor(8, 8);

    Screen.initialize(8, 8);
    Screen.setGridlines(false);
    Bejeweled.initBejewel(8, 8);
    Bejeweled.gameAuto(Bejeweled.checkForMatches(Screen.grid));

    Screen.addCommand('up', 'move cursor up', this.cursor.up.bind(this.cursor));
    Screen.addCommand('down', 'move cursor down', this.cursor.down.bind(this.cursor));
    Screen.addCommand('left', 'move cursor left', this.cursor.left.bind(this.cursor));
    Screen.addCommand('right', 'move cursor right', this.cursor.right.bind(this.cursor));
    Screen.addCommand('return', 'select or swap', Bejeweled.trySwap.bind(this.cursor));

    this.cursor.setBackgroundColor();
    Screen.render();
  }

  static trySwap() {
    const output = this.select();
    if (Bejeweled.selected === null) Bejeweled.selected = output;
    // check that selected fruit is different
    else if (JSON.stringify(Bejeweled.selected) !== JSON.stringify(output) && Array.isArray(Bejeweled.selected)) {
      const possibleMoves = Bejeweled.validMoves(Screen.grid, Bejeweled.selected);
      // check that move is valid
      if (possibleMoves.some(ele => JSON.stringify(ele) === JSON.stringify(output))) {
        // swap the fruit
        Bejeweled.swap(Screen.grid, Bejeweled.selected, output);
        // check that there is at least 1 three-in-a-row after swapping
        let check1 = Bejeweled.checkForMatches(Screen.grid);
        // reset swap if not valid
        if (check1 === false) {
          Bejeweled.swap(Screen.grid, Bejeweled.selected, output);
          Screen.setMessage('Not a valid move, try again')
          Screen.render();
        } else {
          // continue to count combos
          Bejeweled.gameAuto(check1);
          // reset selected tiles
          Screen.setBackgroundColor(Bejeweled.selected[0], Bejeweled.selected[1], 'black')
          Bejeweled.selected = null;
          Screen.render();
          while (Bejeweled.checkForMoves(Screen.grid) === false) {
            Bejeweled.initBejewel(8, 8);
            Bejeweled.gameAuto(Bejeweled.checkForMatches(Screen.grid));
          }
        }
      }
    }
    else {
      Bejeweled.selected = null;
    }
  }

  static swap(grid, firstCoord, secCoord) {
    const firstFruit = grid[firstCoord[0]][firstCoord[1]];
    const secondFruit = grid[secCoord[0]][secCoord[1]];
    if (grid === Screen.grid) {
      Screen.setGrid(firstCoord[0], firstCoord[1], secondFruit);
      Screen.setGrid(secCoord[0], secCoord[1], firstFruit);
      Screen.render();
    } else {
      grid[firstCoord[0]][firstCoord[1]] = secondFruit;
      grid[secCoord[0]][secCoord[1]] = firstFruit;
    }
  }

  static checkForMoves(grid) {
    let copyGrid = JSON.parse(JSON.stringify(grid));
    const len = grid.length;
    const width = grid[0].length;
    // iterate through grid
    for (let i=0; i<len; i++) {
      for (let j=0; j<width; j++) {
        const possibleMoves = Bejeweled.validMoves(grid, [i, j]);
        for (let k=0; k<possibleMoves.length; k++) {
          const testCoord = possibleMoves[k];
          Bejeweled.swap(copyGrid, [i, j], testCoord);
          const test = Bejeweled.checkForMatches(copyGrid);
          if (test !== false) return true;
          else {
            Bejeweled.swap(copyGrid, [i, j], testCoord);
          }
        }
      }
    }
    return false;
  }

  static gameAuto(matches) {
    let check = matches;
    let multiplier = 1;
    while (check !== false) {
      multiplier++;
      Bejeweled.removeMatches(Screen.grid, check, multiplier);
      Screen.setMessage(`Your score is ${Bejeweled.score} with a multiplier of ${multiplier}!`);
      setTimeout(() => Screen.render(), 500);
      Bejeweled.gravityFruits(Screen.grid);
      Bejeweled.newFruits(Screen.grid);
      check = Bejeweled.checkForMatches(Screen.grid);
    }
  }

  static validMoves(grid, coord) {
    let moves = [];
    if (coord[0]-1 >= 0) moves.push([coord[0]-1, coord[1]]);
    if (coord[0]+1 < grid.length) moves.push([coord[0]+1, coord[1]]);
    if (coord[1]-1 >= 0) moves.push([coord[0], coord[1]-1]);
    if (coord[1]+1 < grid[0].length) moves.push([coord[0], coord[1]+1]);
    return moves;
  }

  static randomFruits(size) {
    const fruits = ['🥝', '🍓', '🥥', '🍇', '🍊'];
    const randFruit = () => (fruits[Math.floor(Math.random()*5)]);
    if (size === 1) return randFruit();
    else {
      let fruitArr = [];
      for (let i=0; i<size; i++) {
        fruitArr.push(randFruit());
      }
      return fruitArr;
    }
  }

  static initBejewel(len, width) {
    let grid = [];
    for (let i=0; i<len; i++) {
      grid.push(Bejeweled.randomFruits(width));
    }
    for (let j=0; j<len; j++) {
      for (let k=0; k<width; k++) {
        Screen.setGrid(j, k, grid[j][k]);
      }
    }
    Screen.render();
    return grid;
  }

  static checkForMatches(grid) {
    const len = grid[0].length;
    const ht = grid.length;
    let result = [];
    // check horizontal matches
    for (let i=0; i<ht; i++) {
      result = result.concat(Bejeweled.find3Consec(grid[i], i, null));
    }
    // check vertical matches
    for (let j=0; j<len; j++) {
      const workingCol = grid.map((row) => row[j]);
      result = result.concat(Bejeweled.find3Consec(workingCol, null, j))
    }
    // remove duplicates
    result = result.filter((val, idx) => {
      const _val = JSON.stringify(val);
      return idx === result.findIndex(obj => {
        return JSON.stringify(obj) === _val;
      });
    });
    return result.length ? result : false;
  }

  static find3Consec(arr, rowNum, colNum) {
    let pos = [];
    for (let i=0; i<arr.length-2; i++) {
      if (arr[i] !== ' ' && arr.slice(i, i+3).every((val) => val === arr[i])) {
        if (rowNum === null) {
          pos.push({row: i, col: colNum}, {row: i+1, col: colNum}, {row: i+2, col: colNum})
        }
        if (colNum === null) {
          pos.push({row: rowNum, col: i}, {row: rowNum, col: i+1}, {row: rowNum, col: i+2})
        }
      }
    }
    return pos;
  }

  static removeMatches(grid, result, multiplier) {
    for (let i=0; i<result.length; i++) {
      const pos = result[i];
      if (grid === Screen.grid) Screen.setGrid(pos.row, pos.col, ' ');
      else grid[pos.row][pos.col] = ' ';
      Bejeweled.score += multiplier;
      setTimeout(() => Screen.render(), 500);
    }
  }

  static gravityFruits(grid) {
    for (let j=0; j<grid[0].length; j++) {
      const workingCol = grid.map((row) => row[j]);
      const firstIdx = workingCol.indexOf(' ');
      const lastIdx = workingCol.lastIndexOf(' ');
      if (firstIdx !== -1 && lastIdx !== -1) {
        // remove empty blocks
        workingCol.splice(firstIdx, lastIdx - firstIdx + 1);
        // add empty blocks to the top of array
        workingCol.unshift(...Array(lastIdx - firstIdx + 1).fill(' '));
        // change the grid
        workingCol.forEach((ele, idx) => grid[idx][j] = ele);
        setTimeout(() => Screen.render(), 500)
      }
    }
  }

  static newFruits(grid) {
    for (let j=0; j<grid[0].length; j++) {
      const workingCol = grid.map((row) => row[j]);
      // drop new fruits
      workingCol.forEach((ele, idx, arr) => {
        if (ele === ' ') {
          arr[idx] = Bejeweled.randomFruits(1);
          grid[idx][j] = arr[idx];
        }
      });
      setTimeout(() => Screen.render(), 500);
    }
  }
}

module.exports = Bejeweled;
