import * as THREE from "three";
import { GameEntity } from "engine/GameEntity";
import { Scene } from "engine/Scene";
import { Cell, TETROMINO_COLORS, TetrominoType } from "game/objects";
import { Game } from "game";
import { TETRIMINO_PREVIEW_SHAPES } from "game/data";

/**
 * Manages a game of Tetris, including the board, spawning tetrominos, and
 */
export class Preview extends GameEntity {
  // The current speed that a tetromino is falling at
  speed: number = 1;

  // A collection of cells that will be shifted upwards as pieces are popped
  pieces: Cell[][] = [];

  constructor(
    protected scene: Scene,
    private game: Game,
    private numPreview: number,
    private pos: THREE.Vector3
  ) {
    super(scene);

    // Initialize the array of pieces
    this.pieces = new Array<Cell[]>(numPreview);
  }

  /**
   * Shift all tetriminos up three units and add a new one to the bottom. Delete
   * the one at the top
   * @param type The tetromino type to add to the preview
   */
  shiftAdd(type: TetrominoType) {
    const old = this.pieces.shift();
    // If there is an old piece
    if (old) {
      old.forEach((cell) => {
        cell.destroy();
      });
    }

    // Shift all pieces up by 3 units
    for (let i = 0; i < this.pieces.length; i++) {
      if (!this.pieces[i]) continue;

      this.pieces[i].forEach((cell) => {
        cell.obj.position.y += 3;
      });
    }

    // Add a new piece to the bottom
    const cells: Cell[] = [];
    const shape = TETRIMINO_PREVIEW_SHAPES[type];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] != 0) {
          const cell = new Cell(this.scene, TETROMINO_COLORS[type]);
          cell.obj.position.set(x, y, 0);
          cell.obj.position.add(this.pos);
          cell.obj.position.y -= (this.numPreview - 1) * 3;
          cells.push(cell);
        }
      }
    }

    this.pieces[this.numPreview - 1] = cells;
  }

  /**
   * Show the pieces in the preview.
   */
  display() {}

  update(delta: number): void {
    // throw new Error("Method not implemented.");
  }
}
