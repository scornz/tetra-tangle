import * as THREE from "three";
import { GameEntity, Scene } from "engine";
import { Board } from "game/containers";
import { TETRIMINO_SHAPES } from "game/data";
import { Cell, TETROMINO_COLORS, TetrominoType } from ".";

export class GhostTetromino extends GameEntity {
  private cells: Cell[] = [];

  constructor(
    scene: Scene,
    public readonly board: Board,
    public readonly type: TetrominoType
  ) {
    super(scene);

    // Create cells that make up this tetromino
    const shape = TETRIMINO_SHAPES[type][0];
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] != 0) {
          const cell = new Cell(scene, TETROMINO_COLORS[type], 0.3);
          this.cells.push(cell);
        }
      }
    }
  }

  updateCellPositions(positions: THREE.Vector2[]): void {
    // Deep copy the positions
    positions = positions.map((pos) => pos.clone());
    // Update the position of the tetromino based on board positions
    while (true) {
      let filled = false;
      for (const pos of positions) {
        // Check to see if the position on the board is filled
        if (this.board.isFilled(pos.x, pos.y)) {
          filled = true;
          break;
        }
      }

      if (filled) break;

      // If we didn't break out of the loop, then we can continue
      for (const pos of positions) {
        pos.y--;
      }
    }

    // Add 1 back to each position, since positions are currently where there
    // was a collision
    for (const pos of positions) {
      pos.y++;
    }

    // Update the position of the tetromino based on board positions
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const cell = this.cells[i];
      // Get the position of the cell in world space, and set the position of the cell
      cell.obj.position.copy(this.board.boardToWorld(pos.x, pos.y));
    }
  }

  destroy(): void {
    super.destroy();
    // Destroy all children cells
    for (const cell of this.cells) {
      cell.destroy();
    }
  }
}
