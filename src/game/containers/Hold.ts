import * as THREE from "three";
import { GameEntity } from "engine/GameEntity";
import { Scene } from "engine/Scene";
import { Cell, TETROMINO_COLORS, TetrominoType } from "game/objects";
import { TETRIMINO_PREVIEW_SHAPES } from "game/data";

/**
 * Manages a the hold container, which can hold a single tetromino for later
 * use at the press of a button.
 */
export class Hold extends GameEntity {
  // A collection of cells that represent the held piece
  piece: Cell[] = [];

  constructor(protected scene: Scene, private pos: THREE.Vector3) {
    super(scene);
  }

  /**
   * Set the new tetromino to display in the hold.
   * @param type The tetromino type to add to the hold
   */
  set(type: TetrominoType) {
    // Destroy each cell in the existing piece
    this.piece.forEach((cell) => {
      cell.destroy();
    });

    this.piece = [];
    // Create the preview at the location
    const shape = TETRIMINO_PREVIEW_SHAPES[type];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] != 0) {
          const cell = new Cell(this.scene, TETROMINO_COLORS[type]);
          cell.obj.position.set(x, y, 0);
          cell.obj.position.add(this.pos);
          this.piece.push(cell);
        }
      }
    }
  }
}
