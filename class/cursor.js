const Screen = require("./screen");

class Cursor {

  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;

    this.row = 0;
    this.col = 0;

    this.state = "move";

    this.gridColor = 'black';
    this.cursorColor = 'yellow';
    this.selectColor = 'cyan';
    this.mixColor = 'green';
  }

  resetBackgroundColor() {
    const currColor = Screen.backgroundColors[this.row][this.col];
    // color is yellow, switch to black (moving)
    if (currColor === '\x1b[43m') {
      Screen.setBackgroundColor(this.row, this.col, this.gridColor);
    }
    // color is green, switch to blue (swap)
    if (currColor === '\x1b[42m') {
      Screen.setBackgroundColor(this.row, this.col, this.selectColor);
    }

  }

  setBackgroundColor() {
    const currColor = Screen.backgroundColors[this.row][this.col];
    // color is black
    if (currColor === '\x1b[40m') {
      Screen.setBackgroundColor(this.row, this.col, this.cursorColor);
    }
    // color is cyan && status is move
    else if (currColor === '\x1b[46m' && this.state === "move") {
      Screen.setBackgroundColor(this.row, this.col, this.mixColor);
    }
    // color is yellow && status is swap
    else if (currColor === '\x1b[43m' && this.state === "swap") {
      Screen.setBackgroundColor(this.row, this.col, this.mixColor);
    }
    // color is blue && status is swap
    // else if (currColor === '\x1b[44m' && this.status === "swap") {
    //   break;
    // }
  }

  up() {
    if (this.row > 0) {
      this.resetBackgroundColor();
      this.row -= 1;
      this.setBackgroundColor();
      Screen.render();
    }
  }

  down() {
    if (this.row < this.numRows - 1) {
      this.resetBackgroundColor();
      this.row += 1;
      this.setBackgroundColor();
      Screen.render();
    }
  }

  left() {
    if (this.col > 0) {
      this.resetBackgroundColor();
      this.col -= 1;
      this.setBackgroundColor();
      Screen.render();
    }
  }

  right() {
    if (this.col < this.numCols - 1) {
      this.resetBackgroundColor();
      this.col += 1;
      this.setBackgroundColor();
      Screen.render();
    }
  }

  select() {
    this.state = this.state === "move" ? "swap" : "move";
    this.setBackgroundColor();
    Screen.setMessage(`Swapping ${Screen.grid[this.row][this.col]} at row ${this.row} col ${this.col}`)
    Screen.render();
    return [this.row, this.col];
  }

}


module.exports = Cursor;
