import * as THREE from "three";
import { GameEntity } from "engine/GameEntity";
import { Engine } from "engine/Engine";
import { Board } from "game/Board";
import { Cell } from "game/objects/Cell";

/**
 * The 7 tetromino types (plus an 8th debuggable)
 */
export enum TetrominoType {
  I = 1,
  O = 2,
  T = 3,
  J = 4,
  L = 5,
  S = 6,
  Z = 7,
  // Debugging tetromino type
  X = 8,
}

export const TETROMINO_COLORS: {
  [id in TetrominoType]: THREE.ColorRepresentation;
} = {
  1: 0x6e9fbe,
  2: 0xc1c16c,
  3: 0xa762bc,
  4: 0x5f63bb,
  5: 0xb98c64,
  6: 0x81bf6a,
  7: 0xcb596e,
  // Purple color used for debugging
  8: 0x924dbf,
};

/**
 * 2 row by 4 column matrices for each tetromino type available. These will
 * be inserted into the board layout when a tetromino is placed. Position of
 * these tetrominos will be relative to bottom left corner of the 2x4 matrix.
 */
export const TETRIMINO_SHAPES: { [id in TetrominoType]: number[][] } = {
  // I
  1: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
  ].reverse(),
  // O
  2: [
    [0, 2, 2, 0],
    [0, 2, 2, 0],
  ].reverse(),
  // T
  3: [
    [0, 3, 0, 0],
    [3, 3, 3, 0],
  ].reverse(),
  // J
  4: [
    [4, 0, 0, 0],
    [4, 4, 4, 0],
  ].reverse(),
  // L
  5: [
    [0, 0, 5, 0],
    [5, 5, 5, 0],
  ].reverse(),
  // S
  6: [
    [0, 6, 6, 0],
    [6, 6, 0, 0],
  ].reverse(),
  // Z
  7: [
    [7, 7, 0, 0],
    [0, 7, 7, 0],
  ].reverse(),
  // Debug
  8: [
    [8, 8, 8, 8],
    [8, 8, 8, 8],
  ].reverse(),
};

/**
 * A falling tetromino in the game that is rotatable and placeable on the board.
 */
export class Tetromino extends GameEntity {
  // Objects that make up this tetromino
  private cells: Cell[] = new Array<Cell>();
  // The location of this tetromino on the board
  private pos: THREE.Vector2 = new THREE.Vector2(0, 0);

  private moveTime: number = 0;

  constructor(
    engine: Engine,
    private board: Board,
    private type: TetrominoType
  ) {
    //
    super(engine);
    // Spawn the tetromino at the top middle of the board
    this.pos.set(0, 21);

    // Create cells that make up this tetromino
    const shape = TETRIMINO_SHAPES[type];

    // Create the necessary cells
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] != 0) {
          const cell = new Cell(engine, TETROMINO_COLORS[type]);
          this.cells.push(cell);
        }
      }
    }

    // Set positions of cells
    this.updateCellPositions();
  }

  /**
   * Update the positions of the cells that make up this tetromino.
   */
  updateCellPositions(): void {
    // Update the position of the tetromino based on board positions
    const positions = this.getBoardPositions();
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const cell = this.cells[i];
      // Get the position of the cell in world space, and set the position of the cell
      cell.obj.position.copy(this.board.boardToWorld(pos.x, pos.y));
    }
  }

  /**
   * Based on the position of this tetromino, get the board positions that are
   * occupied by cells.
   * @returns The board positions that this tetromino occupies
   */
  getBoardPositions(): THREE.Vector2[] {
    const shape = TETRIMINO_SHAPES[this.type];
    const positions: THREE.Vector2[] = [];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] != 0) {
          positions.push(new THREE.Vector2(x, y).add(this.pos));
        }
      }
    }
    return positions;
  }

  update(delta: number): void {
    // Handle falling of tetromino
    this.moveTime += delta;
    if (this.moveTime > 1) {
      this.moveTime = 0;
      this.pos.y--;
    }
  }
}
