import * as THREE from "three";
import { Cell } from "game/objects";
import { Board } from "game/containers";
import {
  I_WALL_KICKS,
  JLTSZ_WALL_KICKS,
  TETRIMINO_SHAPES,
  MOVEMENT,
} from "game/data";
import { Game } from "game";
import { GameEntity, Input, InputType, Scene } from "engine";

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
  public readonly cells: Cell[] = new Array<Cell>();
  // The location of this tetromino on the board
  private pos: THREE.Vector2 = new THREE.Vector2(0, 0);
  // Reference to the game that this tetromino is a part of
  private game: Game;
  // Reference to engine's input handler
  private input: Input;

  /* The rotation of this tetromino
  0 - normal
  1 - 90 degrees
  2 - 180 degrees
  3 - 270 degrees
  */
  private rot: number = 0;

  private dropTime: number = 0;
  private lockDownTime: number = 0;
  private arrTime: number = MOVEMENT.ARR;

  // Move counters used for lock down timer
  private moveCounter: number = 0;
  private prevMoveCounter: number = 0;

  private _placed: boolean = false;
  get placed(): boolean {
    return this._placed;
  }

  // Callback for handling movement, store this for later removal
  private handleInputCallback: (input: InputType) => void;

  constructor(
    scene: Scene,
    public readonly board: Board,
    public readonly type: TetrominoType
  ) {
    super(scene);
    // Spawn the tetromino at the top middle of the board
    this.pos.set(3, 19);
    // Get the current game from the board
    this.game = board.game;
    // Event listener for input
    this.input = scene.engine.input;

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

    this.handleInputCallback = this.handleInput.bind(this);
    this.scene.engine.input.addListener(this.handleInputCallback);
  }

  handleInput(input: InputType): void {
    // Go through available input and handle accordingly
    switch (input) {
      case InputType.MOVE_LEFT:
        this.move(-1, 0);
        break;
      case InputType.MOVE_RIGHT:
        this.move(1, 0);
        break;
      case InputType.ROTATE_LEFT:
        this.rotate((this.rot + 3) % 4);
        break;
      case InputType.ROTATE_RIGHT:
        this.rotate((this.rot + 1) % 4);
        break;
      case InputType.ROTATE_180:
        // Rotate twice
        this.rotate((this.rot + 1) % 4);
        this.rotate((this.rot + 1) % 4);
        break;
      case InputType.HARD_DROP:
        this.place();
        break;
    }
  }

  /**
   * Check for obstructions, and move the tetromino by the given amount.
   * @param x The amount to move the tetromino in the x direction
   * @param y The amount to move the tetromino in the y direction
   * @returns True if the tetromino was moved, false otherwise
   */
  private move(x: number, y: number): boolean {
    const newPos = new THREE.Vector2(x, y).add(this.pos);
    // Check for a collision at the new position
    const collision = this.checkCollision(newPos, this.rot);

    // Do not move if there is a collision at the new position
    if (collision) return false;

    // Set the new position
    this.pos.copy(newPos);
    this.moveCounter++;
    return true;
  }

  /**
   * Rotate the tetromino to the given rotation, if possible. If not possible,
   * then offset using SRS (super rotation system).
   * @param rot The rotation to rotate the tetromino to
   */
  private rotate(rot: number): boolean {
    // We can always "rotate" an O tetromino, it just doesn't really do anything
    if (this.type == TetrominoType.O) {
      this.moveCounter++;
      return true;
    }

    const offsets =
      this.type == TetrominoType.I
        ? I_WALL_KICKS[this.rot][rot]
        : JLTSZ_WALL_KICKS[this.rot][rot];

    // Check each offset, and succeed at the first non-collision
    for (const offset of offsets) {
      // Check for a collision at the new position
      const newPos = this.pos.clone().add(offset);
      const collision = this.checkCollision(newPos, rot);

      if (collision) continue;

      // No collision!
      this.rot = rot;
      this.pos.copy(newPos);
      this.moveCounter++;
      return true;
    }

    // If NONE succeed, do nothing
    return false;
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

  /**
   * Check if the board has blocks immediatley below any of these cells. If so,
   * this should engage a lock down of the tetromino.
   */
  checkLockDown(): boolean {
    const positions = this.getBoardPositions(this.pos, this.rot);
    for (const pos of positions) {
      // Check to see if the position BELOW this cell is filled
      if (this.board.isFilled(pos.x, pos.y - 1)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Shift the tetromino down by 1 unit until there is a collision, then place the
   * tetromino on the board.
   */
  place(): void {
    // Keep moving until the piece stops
    while (this.move(0, -1));

    // Update the positions from the instantstaneous drop
    this.updateCellPositions();
    // Place the tetromino on the board
    this.board.place(this);
    // Note that this piece has been placed
    this._placed = true;
  }

  update(delta: number): void {
    this.dropTime += delta;
    // Handle falling of tetromino, use soft drop speed if soft drop key is held
    if (
      this.dropTime > this.game.speed ||
      (this.dropTime > MOVEMENT.SD && this.input.keyHeld == InputType.SOFT_DROP)
    ) {
      this.dropTime = 0;
      // Move this tetromino down
      this.move(0, -1);
    }

    // If the held key is movement to the right or left
    if (
      (this.scene.engine.input.keyHeld == InputType.MOVE_LEFT ||
        this.scene.engine.input.keyHeld == InputType.MOVE_RIGHT) &&
      this.scene.engine.input.keyHeldTime > MOVEMENT.DAS
    ) {
      if (this.arrTime >= MOVEMENT.ARR) {
        // Move the tetromino
        this.move(
          this.scene.engine.input.keyHeld == InputType.MOVE_LEFT ? -1 : 1,
          0
        );
        this.arrTime = 0;
      }
      this.arrTime += delta;
    } else {
      this.arrTime = 0;
    }

    if (this.checkLockDown()) {
      // Reset the counter if the tetromino has been moved and is less than max moves
      if (
        this.moveCounter != this.prevMoveCounter &&
        this.moveCounter <= MOVEMENT.MAX_MOVE_LOCK_DOWN
      ) {
        this.prevMoveCounter = this.moveCounter;
        this.lockDownTime = 0;
      }

      this.lockDownTime += delta;
      if (this.lockDownTime > 0.5) {
        // Lock down the tetromino
        this.place();
      }
    } else {
      // Reset move counters
      this.moveCounter = 0;
      this.prevMoveCounter = 0;
    }

    this.updateCellPositions();
  }

  destroy(): void {
    super.destroy();
    // Remove event listeners
    this.scene.engine.input.removeListener(this.handleInputCallback);
  }
}
