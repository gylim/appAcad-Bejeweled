const { expect } = require('chai');

const Bejeweled = require("../class/bejeweled.js");

describe ('Bejeweled', function () {

  let grid;
  const fruits = ['🥝', '🍓', '🥥', '🍇', '🍊'];
  // Add tests for setting up a basic board
  it("sets up a board of the right dimensions filled with fruits", () => {
    grid = Bejeweled.initBejewel(7, 6);
    expect(grid.length).to.be.equal(7);
    expect(grid[0].length).to.be.equal(6);
    let result = grid.every(row => row.every(val => fruits.includes(val)));
    expect(result).to.be.true;
  });

  it("")

  // Add tests for a valid swap that matches 3

  // Add tests for swaps that set up combos

  // Add tests to check if there are no possible valid moves

});
