import * as THREE from "three";
import vertexShader from "./shader.vert";
import fragmentShader from "./shader.frag";
import { Cell } from "game/objects/Cell";
import { Engine } from "engine/Engine";
import { Entity } from "engine/Entity";
import { Scene } from "engine/Scene";
import { GameEntity } from "engine/GameEntity";
import { Game } from "game/Game";
import { Tetromino, TetrominoType } from "game/objects/Tetromino";

/**
 * An example layout of some possible tetrominos
 */
const TESTING_LAYOUT: number[][] = [
  [8, 8, 0, 0, 0, 0, 0, 0, 8, 8],
  [8, 0, 0, 0, 0, 0, 0, 0, 0, 8],
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
  [8, 1, 0, 1, 1, 1, 1, 4, 4, 4],
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

  constructor(
    protected scene: Scene,
    public readonly game: Game,
    public readonly width: number = 10,
    public readonly height: number = 22,
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
    return this.layout[y][x] != 0;
  }

  update(delta: number): void {
    // throw new Error("Method not implemented.");
  }
}
