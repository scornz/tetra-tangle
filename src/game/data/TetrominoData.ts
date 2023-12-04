import { TetrominoType } from "game/objects/Tetromino";

/*
 * Information about the shape of a tetromino. Each tetromino has 4 possible
  rotations, each represented by a 2D matrix.
 */
type TetriminoShapeData = {
  [key: number]: number[][];
};

/**
 * Matrices for each tetromino type available. These will
 * be inserted into the board layout when a tetromino is placed. Position of
 * these tetrominos will be relative to bottom left corner of the matrix. Each
 * matrix has basic rotation data for each of the 4 possible rotations. The rotations
 * and matrices are based on the SRS (super rotation system) from modern Tetris games.
 */
export const TETRIMINO_SHAPES: { [id in TetrominoType]: TetriminoShapeData } = {
  // I
  1: {
    0: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ].reverse(),
    1: [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ].reverse(),
    2: [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ].reverse(),
    3: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ].reverse(),
  },
  // O
  2: {
    0: [
      [0, 2, 2, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
    ].reverse(),
    1: [
      [0, 2, 2, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
    ].reverse(),
    2: [
      [0, 2, 2, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
    ].reverse(),
    3: [
      [0, 2, 2, 0],
      [0, 2, 2, 0],
      [0, 0, 0, 0],
    ].reverse(),
  },
  // T
  3: {
    0: [
      [0, 3, 0],
      [3, 3, 3],
      [0, 0, 0],
    ].reverse(),
    1: [
      [0, 3, 0],
      [0, 3, 3],
      [0, 3, 0],
    ].reverse(),
    2: [
      [0, 0, 0],
      [3, 3, 3],
      [0, 3, 0],
    ].reverse(),
    3: [
      [0, 3, 0],
      [3, 3, 0],
      [0, 3, 0],
    ].reverse(),
  },
  // J
  4: {
    0: [
      [4, 0, 0],
      [4, 4, 4],
      [0, 0, 0],
    ].reverse(),
    1: [
      [0, 4, 4],
      [0, 4, 0],
      [0, 4, 0],
    ].reverse(),
    2: [
      [0, 0, 0],
      [4, 4, 4],
      [0, 0, 4],
    ].reverse(),
    3: [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ].reverse(),
  },
  // L
  5: {
    0: [
      [0, 0, 5],
      [5, 5, 5],
      [0, 0, 0],
    ].reverse(),
    1: [
      [0, 5, 0],
      [0, 5, 0],
      [0, 5, 5],
    ].reverse(),
    2: [
      [0, 0, 0],
      [5, 5, 5],
      [5, 0, 0],
    ].reverse(),
    3: [
      [5, 5, 0],
      [0, 5, 0],
      [0, 5, 0],
    ].reverse(),
  },
  // S
  6: {
    0: [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ].reverse(),
    1: [
      [0, 6, 0],
      [0, 6, 6],
      [0, 0, 6],
    ].reverse(),
    2: [
      [0, 0, 0],
      [0, 6, 6],
      [6, 6, 0],
    ].reverse(),
    3: [
      [6, 0, 0],
      [6, 6, 0],
      [0, 6, 0],
    ].reverse(),
  },
  // Z
  7: {
    0: [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ].reverse(),
    1: [
      [0, 0, 7],
      [0, 7, 7],
      [0, 7, 0],
    ].reverse(),
    2: [
      [0, 0, 0],
      [7, 7, 0],
      [0, 7, 7],
    ].reverse(),
    3: [
      [0, 7, 0],
      [7, 7, 0],
      [7, 0, 0],
    ].reverse(),
  },
  // Debug
  8: {
    0: [
      [8, 0, 8],
      [0, 0, 0],
      [8, 0, 8],
    ].reverse(),
    1: [
      [8, 0, 8],
      [0, 0, 0],
      [8, 0, 8],
    ].reverse(),
    2: [
      [8, 0, 8],
      [0, 0, 0],
      [8, 0, 8],
    ].reverse(),
    3: [
      [8, 0, 8],
      [0, 0, 0],
      [8, 0, 8],
    ].reverse(),
  },
};
