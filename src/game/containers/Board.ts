import * as THREE from "three";
import { GameEntity, Scene } from "engine";

import { Game } from "game";
import { Cell, Tetromino, TetrominoClearType } from "game/objects";
import { ScoreType } from "game/data";

import { lerp } from "three/src/math/MathUtils.js";

/**
 * An example layout of some possible tetrominos
 */
const TESTING_LAYOUT: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 2, 5, 0, 0],
  [0, 0, 0, 0, 0, 5, 5, 5, 0, 1],
  [0, 0, 0, 6, 0, 6, 3, 3, 3, 1],
  [0, 0, 0, 6, 6, 6, 6, 3, 7, 1],
  [0, 1, 0, 7, 6, 6, 6, 7, 7, 1],
  [0, 1, 7, 7, 3, 6, 6, 7, 2, 2],
  [0, 1, 7, 3, 3, 3, 6, 4, 2, 2],
  [0, 1, 0, 1, 1, 1, 1, 4, 4, 4],
].reverse();

const COLORS: { [id: string]: THREE.ColorRepresentation } = {
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
 * A game board, filled with placed tetraminos.
 */
export class Board extends GameEntity {
  /**
   * Layout of the overall board
   * 0 represents an empty square
   * 1-7 represent filled squares, each with different colors
   * 1 - I (light blue), 2 - O (yellow), 3 - T (pink), 4 - J (blue), 5 - L (orange),
   * 6 - S (green), 7 - Z (red)
   */
  private layout: number[][];

  /**
   * Cell objects that make up the visual representation of the board.
   */
  private layoutCells: Cell[][];

  //
  private backToBack: boolean = false;

  constructor(
    protected scene: Scene,
    public readonly game: Game,
    public readonly width: number = 10,
    public readonly height: number = 30,
    private pos: THREE.Vector3 = new THREE.Vector3(),
    testing: boolean = false
  ) {
    super(scene);
    // 22 rows, by 10 columns
    this.layout = !testing
      ? Array.from(Array(height), (_) => Array(width).fill(0))
      : TESTING_LAYOUT;

    // Initialize all cells to be null to start
    this.layoutCells = Array.from(Array(height), (_) =>
      Array(width).fill(null)
    );
  }

  initialize(): void {
    // Let's iterate through every cell in the layout
    for (let y = 0; y < this.layout.length; y++) {
      for (let x = 0; x < this.layout[y].length; x++) {
        const val = this.layout[y][x];
        // Skip if this box is supposed to be empty
        if (val == 0) continue;

        const cell = new Cell(this.scene, COLORS[val]);
        cell.obj.position.set(x, y, 0).add(this.pos);
        this.layoutCells[y][x] = cell;
      }
    }
  }

  /**
   * Place a given tetromino in the board at the given locations. Simply set the
   * values in place, and take the cells from the tetromino and add them to the
   * registered ones with the board.
   * @param positions Locations of cells to place
   * @param type Type of tetromino to place
   */
  place(tetromino: Tetromino): void {
    const positions = tetromino.getBoardPositions();
    for (let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      this.layout[pos.y][pos.x] = tetromino.type;
      this.layoutCells[pos.y][pos.x] = tetromino.cells[i];
    }
    // Remove this tetromino from the scene
    tetromino.destroy();

    // Check clear type before removing any lines
    const clearType = tetromino.checkClearType();
    // Check cleared lines, and whether or not this was a t-spin
    const cleared = this.checkLines();

    if (cleared > 0) {
      // "Punch" the render engine to make it do something funny
      this.scene.engine.renderEngine.punch(cleared, tetromino.getCellsCenter());
    }

    this.updateScore(cleared, clearType);
  }

  /**
   * Check if any lines have been completed, and if so, remove them and shift the
   * blocks above them appropriately. Return number of lines cleared.
   */
  checkLines(): number {
    let cleared = 0;
    for (let y = 0; y < this.layout.length; y++) {
      let filled = true;
      // If any of the cells in this line are empty, then this line is not filled
      for (let x = 0; x < this.layout[y].length; x++) {
        if (this.layout[y][x] == 0) {
          filled = false;
          break;
        }
      }

      if (!filled) continue;

      // Remove this line from layout and cells
      this.layout.splice(y, 1);
      const cells = this.layoutCells.splice(y, 1)[0];
      // Make sure to destroy all of the cells
      for (const cell of cells) {
        cell.destroy();
      }

      // Get all of the cells ABOVE this line and shift them down by 1
      // NOTE: We start at y because we just deleted it
      for (let dy = y; dy < this.layout.length; dy++) {
        for (let x = 0; x < this.layout[dy].length; x++) {
          if (this.layout[dy][x] == 0) continue;

          const cell = this.layoutCells[dy][x];
          cell.obj.position.y -= 1;
        }
      }

      // Replace new line of zeroes and null values along the top
      this.layout.push(Array(this.width).fill(0));
      this.layoutCells.push(Array(this.width).fill(null));
      // Check this line again since everything just shifted down
      y--;
      cleared++;
    }

    return cleared;
  }

  /**
   * Given number of lines cleared and the type of clear, update the score.
   * @param cleared Number of lines cleared
   * @param clearType Type of line clear that this would be (tspin, etc.)
   */
  updateScore(cleared: number, clearType: TetrominoClearType) {
    // @ts-ignore - This is a useful value to have, we just need to implement it later
    let difficult = false;
    let scoreType = null;
    switch (true) {
      case clearType == TetrominoClearType.NORMAL && cleared == 1:
        scoreType = ScoreType.SINGLE;
        break;
      case clearType == TetrominoClearType.NORMAL && cleared == 2:
        scoreType = ScoreType.DOUBLE;
        break;
      case clearType == TetrominoClearType.NORMAL && cleared == 3:
        scoreType = ScoreType.TRIPLE;
        break;
      case clearType == TetrominoClearType.NORMAL && cleared == 4:
        scoreType = ScoreType.TETRIS;
        difficult = true;
        break;
      case clearType == TetrominoClearType.TSPIN && cleared == 0:
        scoreType = ScoreType.TSPIN_NONE;
        break;
      case clearType == TetrominoClearType.TSPIN && cleared == 1:
        scoreType = ScoreType.TSPIN_SINGLE;
        difficult = true;
        break;
      case clearType == TetrominoClearType.TSPIN && cleared == 2:
        scoreType = ScoreType.TSPIN_DOUBLE;
        difficult = true;
        break;
      case clearType == TetrominoClearType.TSPIN && cleared == 3:
        scoreType = ScoreType.TSPIN_TRIPLE;
        difficult = true;
        break;
      case clearType == TetrominoClearType.TSPIN_MINI && cleared == 0:
        scoreType = ScoreType.TSPIN_MINI_NONE;
        break;
      case clearType == TetrominoClearType.TSPIN_MINI && cleared == 1:
        scoreType = ScoreType.TSPIN_MINI_SINGLE;
        difficult = true;
        break;
      case clearType == TetrominoClearType.TSPIN_MINI && cleared == 2:
        scoreType = ScoreType.TSPIN_MINI_DOUBLE;
        difficult = true;
        break;
    }

    if (scoreType == null) return;

    // Add the score to the final score
    this.game.addScore(scoreType, 0, cleared);

    // If back to back is true and the last line clear was difficult and more than 0 lines were cleared
    if (this.backToBack && difficult && cleared > 0) {
      // Add a back to back bonus
      console.log("HERE");
      this.game.addScore(ScoreType.BACK_TO_BACK, -1, 0);
    }

    // If the last line clear was difficult, enable back to back
    if (difficult) {
      this.backToBack = true;
    } else {
      // Otherwise disable it
      this.backToBack = false;
    }
  }

  /**
   * Converts a world position to a board position and returns the value at that position.
   */
  boardToWorld(x: number, y: number): THREE.Vector3 {
    return new THREE.Vector3(x, y, 0).add(this.pos);
  }

  /**
   * Returns true if the given position has a cell (a non-zero value in it).
   */
  isFilled(x: number, y: number): boolean {
    if (x < 0 || x >= this.width || y < 0) return true;

    return this.layout[y][x] != 0;
  }

  update(delta: number): void {
    // Diminish intensity of emissive material
    for (const c of this.layoutCells) {
      for (const cell of c) {
        if (cell == null) continue;

        cell.material.emissiveIntensity = lerp(
          cell.material.emissiveIntensity,
          1,
          delta
        );
      }
    }
  }
}
