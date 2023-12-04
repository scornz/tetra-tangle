import * as THREE from "three";
import { GameEntity } from "engine/GameEntity";
import { Board } from "game/Board";
import { Cell } from "game/objects/Cell";
import { Scene } from "engine/Scene";
import {
  I_WALL_KICKS,
  JLTSZ_WALL_KICKS,
  TETRIMINO_SHAPES,
} from "game/data/TetrominoData";
import { ALL_CONTROLS } from "game/data/Controls";

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
 * A falling tetromino in the game that is rotatable and placeable on the board.
 */
export class Tetromino extends GameEntity {
  // Objects that make up this tetromino
  private cells: Cell[] = new Array<Cell>();
  // The location of this tetromino on the board
  private pos: THREE.Vector2 = new THREE.Vector2(0, 0);

  /* The rotation of this tetromino
  0 - normal
  1 - 90 degrees
  2 - 180 degrees
  3 - 270 degrees
  */
  private rot: number = 0;

  private moveTime: number = 0;

  constructor(scene: Scene, private board: Board, private type: TetrominoType) {
    super(scene);
    // Spawn the tetromino at the top middle of the board
    this.pos.set(3, 19);

    // Create cells that make up this tetromino
    const shape = TETRIMINO_SHAPES[type][this.rot];

    // Create the necessary cells
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] != 0) {
          const cell = new Cell(scene, TETROMINO_COLORS[type]);
          this.cells.push(cell);
        }
      }
    }

    // Set positions of cells
    this.updateCellPositions();
    this.scene.engine.canvas.addEventListener(
      "keydown",
      this.handleMovement.bind(this),
      false
    );
  }

  handleMovement(e: KeyboardEvent): void {
    // Left and right arrow keys move piece left and right
    if (e.key == ALL_CONTROLS.moveLeft) {
      // Move 1 unit to the left
      this.move(-1, 0);
    } else if (e.key == ALL_CONTROLS.moveRight) {
      // Move 1 unit to the right
      this.move(1, 0);
    } else if (e.key == ALL_CONTROLS.rotateRight) {
      // Rotate the tetromino
      this.rotate((this.rot + 1) % 4);
    } else if (e.key == ALL_CONTROLS.rotateLeft) {
      // Rotate the tetromino left
      this.rotate((this.rot + 3) % 4);
    }
  }

  /**
   * Check for obstructions, and move the tetromino by the given amount.
   * @param x The amount to move the tetromino in the x direction
   * @param y The amount to move the tetromino in the y direction
   */
  private move(x: number, y: number): void {
    const newPos = new THREE.Vector2(x, y).add(this.pos);
    // Check for a collision at the new position
    const collision = this.checkCollision(newPos, this.rot);

    // Do not move if there is a collision at the new position
    if (collision) return;

    // Set the new position
    this.pos.copy(newPos);
  }

  /**
   * Rotate the tetromino to the given rotation, if possible. If not possible,
   * then offset using SRS (super rotation system).
   * @param rot The rotation to rotate the tetromino to
   */
  private rotate(rot: number): void {
    // Do not rotate if this is an O tetromino
    if (this.type == TetrominoType.O) return;

    const offsets =
      this.type == TetrominoType.I
        ? I_WALL_KICKS[this.rot][rot]
        : JLTSZ_WALL_KICKS[this.rot][rot];

    // Check each offset, and succeed at the first non-collision
    for (const offset of offsets) {
      // Check for a collision at the new position
      console.log(offset);
      const newPos = this.pos.clone().add(offset);
      const collision = this.checkCollision(newPos, rot);

      if (collision) continue;

      // No collision!
      this.rot = rot;
      this.pos.copy(newPos);
      break;
    }

    // If NONE succeed, do nothing
  }

  /**
   * Check to see if this tetromino would collide with any other cells on the board
   * if it were to be moved to the given position.
   * @param pos The position to check for collision
   * @returns True if there is a collision, false otherwise
   */
  checkCollision(
    pos: THREE.Vector2 = this.pos,
    rot: number = this.rot
  ): boolean {
    // Check if any of the cells would now be out of bounds
    const positions = this.getBoardPositions(pos, rot);
    for (const pos of positions) {
      // Check if out of bounds
      if (pos.x < 0 || pos.x >= this.board.width) {
        return true;
      }

      // Check to see if the position on the board is filled
      if (this.board.isFilled(pos.x, pos.y)) {
        return true;
      }
    }

    return false;
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
  getBoardPositions(
    pos: THREE.Vector2 = this.pos,
    rot: number = this.rot
  ): THREE.Vector2[] {
    const shape = TETRIMINO_SHAPES[this.type][rot];
    const positions: THREE.Vector2[] = [];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] != 0) {
          positions.push(new THREE.Vector2(x, y).add(pos));
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
      this.move(0, -1);
    }

    this.updateCellPositions();
  }
}
