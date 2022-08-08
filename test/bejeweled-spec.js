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

  it("checks for valid moves", () => {
    grid = [
      ['🍇', '🥝', '🍊','🍓', '🍊', '🍓','🍇', '🥥'],
      ['🍊', '🍊', '🥥','🍇', '🍇', '🥥','🍓', '🍊'],
      ['🍊', '🍓', '🍊','🍊', '🍊', '🍇','🥥', '🥥'],
      ['🥥', '🥥', '🍊','🥥', '🍓', '🍊','🥝', '🍇'],
      ['🥝', '🥥', '🍇','🥥', '🍓', '🍊','🍊', '🥝'],
      ['🥝', '🍇', '🍊','🍇', '🥥', '🍊','🥝', '🍇'],
      ['🥝', '🍊', '🥥','🍓', '🍊', '🍇','🥝', '🍊'],
      ['🥝', '🥥', '🍓','🥝', '🍓', '🍓','🥝', '🍓']];
    let result = Bejeweled.checkForMatches(grid);
    expect(result).to.not.be.false;
    expect(result.length).to.be.equal(13);
    expect(result).to.deep.include({ row: 6, col: 0 });
    expect(result).to.not.deep.include({ row: 0, col: 0 });
  });

  it("checks when there are no matches left", () => {
    grid = [
      ['🍇', '🥝', '🍊','🍓', '🍊', '🍓','🍇', '🥥'],
      ['🍊', '🍊', '🥥','🍇', '🍇', '🥥','🍓', '🍊'],
      ['🍊', '🍓', '🍊','🥝', '🍊', '🍇','🥥', '🥥'],
      ['🥥', '🥥', '🍊','🥥', '🍓', '🍓','🥝', '🍇'],
      ['🥝', '🥥', '🍇','🥥', '🍓', '🍊','🍊', '🥝'],
      ['🥥', '🍇', '🍊','🍇', '🥥', '🍊','🍇', '🍇'],
      ['🥝', '🍊', '🥥','🍓', '🍊', '🍇','🥝', '🍊'],
      ['🥝', '🥥', '🍓','🥝', '🍓', '🍓','🥝', '🍓']];
      let result = Bejeweled.checkForMatches(grid);
      expect(result).to.be.false;
  });

  it("should swap gems", () => {
    grid = [
      ['🍇', '🥝', '🍊','🍓', '🍊', '🍓','🍇', '🥥'],
      ['🍊', '🍊', '🥥','🍇', '🍇', '🥥','🍓', '🍊'],
      ['🍊', '🍓', '🍊','🥝', '🍊', '🍇','🥥', '🥥'],
      ['🥥', '🥥', '🍊','🥥', '🍓', '🍓','🥝', '🍇'],
      ['🥝', '🥥', '🍇','🥥', '🍓', '🍊','🍊', '🥝'],
      ['🥥', '🍇', '🍊','🍇', '🥥', '🍊','🍇', '🍇'],
      ['🥝', '🍊', '🥥','🍓', '🍊', '🍇','🥝', '🍊'],
      ['🥝', '🥥', '🍓','🥝', '🍓', '🍓','🥝', '🍓']];
    Bejeweled.swap(grid, [4, 0], [5, 0]);
    expect(grid).to.deep.equal([
      ['🍇', '🥝', '🍊','🍓', '🍊', '🍓','🍇', '🥥'],
      ['🍊', '🍊', '🥥','🍇', '🍇', '🥥','🍓', '🍊'],
      ['🍊', '🍓', '🍊','🥝', '🍊', '🍇','🥥', '🥥'],
      ['🥥', '🥥', '🍊','🥥', '🍓', '🍓','🥝', '🍇'],
      ['🥥', '🥥', '🍇','🥥', '🍓', '🍊','🍊', '🥝'],
      ['🥝', '🍇', '🍊','🍇', '🥥', '🍊','🍇', '🍇'],
      ['🥝', '🍊', '🥥','🍓', '🍊', '🍇','🥝', '🍊'],
      ['🥝', '🥥', '🍓','🥝', '🍓', '🍓','🥝', '🍓']])
  })

  it("should remove matched gems", () => {
    grid = [
      ['🥥', '🥥', '🍊','🥥', '🍓'],
      ['🥥', '🥥', '🍇','🥥', '🍓'],
      ['🥝', '🍇', '🍊','🍇', '🥥'],
      ['🥝', '🍊', '🥥','🍓', '🍊'],
      ['🥝', '🥥', '🍓','🥝', '🍓']]
    let result = Bejeweled.checkForMatches(grid);
    Bejeweled.removeMatches(grid, result, 1);
    expect(grid).to.deep.equal([
      ['🥥', '🥥', '🍊','🥥', '🍓'],
      ['🥥', '🥥', '🍇','🥥', '🍓'],
      [' ', '🍇', '🍊','🍇', '🥥'],
      [' ', '🍊', '🥥','🍓', '🍊'],
      [' ', '🥥', '🍓','🥝', '🍓']])
  })

  it("should make fruits drop down", () => {
    grid = [
      ['🥥', '🥥', '🍊','🥥', '🍓'],
      ['🥥', '🥥', '🍇','🥥', '🍓'],
      [' ', '🍇', '🍊','🍇', '🥥'],
      [' ', '🍊', '🥥','🍓', '🍊'],
      [' ', '🥥', '🍓','🥝', '🍓']];
    Bejeweled.gravityFruits(grid);
    expect(grid).to.deep.equal([
      [' ', '🥥', '🍊','🥥', '🍓'],
      [' ', '🥥', '🍇','🥥', '🍓'],
      [' ', '🍇', '🍊','🍇', '🥥'],
      ['🥥', '🍊', '🥥','🍓', '🍊'],
      ['🥥', '🥥', '🍓','🥝', '🍓']])
  })

  it("should fill up the grid with fruits again", () => {
    grid = [
      [' ', '🥥', '🍊','🥥', '🍓'],
      [' ', '🥥', '🍇','🥥', '🍓'],
      [' ', '🍇', '🍊','🍇', '🥥'],
      ['🥥', '🍊', '🥥','🍓', '🍊'],
      ['🥥', '🥥', '🍓','🥝', '🍓']]
    Bejeweled.newFruits(grid);
    let result = grid.every(row => row.every(val => fruits.includes(val)));
    expect(result).to.be.true;
  })

  it("should tell if there are no more valid moves", () => {
    grid = [
      ['🍇', '🥝', '🍊'],
      ['🍊', '🍓', '🥥'],
      ['🍊', '🍓', '🍊']];
    let result = Bejeweled.checkForMoves(grid);
    expect(result).to.be.false;
  })

  // Add tests for swaps that set up combos

});
