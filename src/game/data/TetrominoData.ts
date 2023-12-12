import * as THREE from "three";

import { TetrominoType } from "game/objects";

/*
 * Information about the shape of a tetromino. Each tetromino has 4 possible
  rotations, each represented by a 2D matrix.
 */
type TetriminoShapeData = {
  [key: number]: number[][];
};

/*
 * Information about the offset of a tetromino used when rotating.
 */
type TetriminoOffsetData = {
  [key: number]: THREE.Vector2[];
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

/**
 * 2x4 matrix for each tetromino type available. These will be used to display
 * the next tetromino to spawn in the preview selection.
 */
export const TETRIMINO_PREVIEW_SHAPES: { [id in TetrominoType]: number[][] } = {
  1: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ].reverse(),
  2: [
    [0, 2, 2, 0],
    [0, 2, 2, 0],
  ].reverse(),
  3: [
    [0, 3, 0, 0],
    [3, 3, 3, 0],
  ].reverse(),
  4: [
    [4, 0, 0, 0],
    [4, 4, 4, 0],
  ].reverse(),
  5: [
    [0, 0, 5, 0],
    [5, 5, 5, 0],
  ].reverse(),
  6: [
    [0, 6, 6, 0],
    [6, 6, 0, 0],
  ].reverse(),
  7: [
    [7, 7, 0, 0],
    [0, 7, 7, 0],
  ].reverse(),
  8: [
    [8, 0, 0, 8],
    [0, 0, 0, 8],
  ].reverse(),
};

/**
 * When rotating a J, L, T, S, or Z tetromino, the tetromino may not be able to rotate
 * completely within the constraints of the board. These are sequential offsets
 * to attempt to move the tetromino to a valid position according to the SRS.
 */
export const JLTSZ_WALL_KICKS: { [id: number]: TetriminoOffsetData } = {
  0: {
    1: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(-1, 0),
      new THREE.Vector2(-1, 1),
      new THREE.Vector2(0, -2),
      new THREE.Vector2(-1, -2),
    ],
    3: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1, 0),
      new THREE.Vector2(1, 1),
      new THREE.Vector2(0, -2),
      new THREE.Vector2(1, -2),
    ],
  },
  1: {
    0: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1, 0),
      new THREE.Vector2(1, -1),
      new THREE.Vector2(0, 2),
      new THREE.Vector2(1, 2),
    ],
    2: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1, 0),
      new THREE.Vector2(1, -1),
      new THREE.Vector2(0, 2),
      new THREE.Vector2(1, 2),
    ],
  },
  2: {
    1: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(-1, 0),
      new THREE.Vector2(-1, 1),
      new THREE.Vector2(0, -2),
      new THREE.Vector2(-1, -2),
    ],
    3: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1, 0),
      new THREE.Vector2(1, 1),
      new THREE.Vector2(0, -2),
      new THREE.Vector2(1, -2),
    ],
  },
  3: {
    0: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(-1, 0),
      new THREE.Vector2(-1, -1),
      new THREE.Vector2(0, 2),
      new THREE.Vector2(-1, 2),
    ],
    2: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(-1, 0),
      new THREE.Vector2(-1, -1),
      new THREE.Vector2(0, 2),
      new THREE.Vector2(-1, 2),
    ],
  },
};

/**
 * When rotating an I tetromino, the tetromino may not be able to rotate completely,
 * due to the length of the tetromino. These are sequential offsets to attempt to
 * move the tetromino to a valid position according to the SRS.
 */
export const I_WALL_KICKS: { [id: number]: TetriminoOffsetData } = {
  0: {
    1: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(-2, 0),
      new THREE.Vector2(1, 0),
      new THREE.Vector2(-2, -1),
      new THREE.Vector2(1, 2),
    ],
    3: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(-1, 0),
      new THREE.Vector2(2, 0),
      new THREE.Vector2(-1, 2),
      new THREE.Vector2(2, -1),
    ],
  },
  1: {
    0: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(2, 0),
      new THREE.Vector2(-1, 0),
      new THREE.Vector2(2, 1),
      new THREE.Vector2(-1, -2),
    ],
    2: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(-1, 0),
      new THREE.Vector2(2, 0),
      new THREE.Vector2(-1, 2),
      new THREE.Vector2(2, -1),
    ],
  },
  2: {
    1: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1, 0),
      new THREE.Vector2(-2, 0),
      new THREE.Vector2(1, -2),
      new THREE.Vector2(-2, 1),
    ],
    3: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(2, 0),
      new THREE.Vector2(-1, 0),
      new THREE.Vector2(2, 1),
      new THREE.Vector2(-1, -2),
    ],
  },
  3: {
    0: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1, 0),
      new THREE.Vector2(-2, 0),
      new THREE.Vector2(1, -2),
      new THREE.Vector2(-2, 1),
    ],
    2: [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(-2, 0),
      new THREE.Vector2(1, 0),
      new THREE.Vector2(-2, -1),
      new THREE.Vector2(1, 2),
    ],
  },
};
