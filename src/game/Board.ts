import * as THREE from "three";
import vertexShader from "./shader.vert";
import fragmentShader from "./shader.frag";
import { Entity } from "engine/Entity";
import { Box } from "demo/Box";
import { Engine } from "engine/Engine";

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
  [0, 0, 0, 0, 0, 2, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 2, 5, 0, 0],
  [0, 0, 0, 0, 0, 5, 5, 5, 0, 1],
  [0, 0, 0, 6, 0, 6, 3, 3, 3, 1],
  [0, 2, 2, 6, 6, 6, 6, 3, 7, 1],
  [0, 2, 2, 7, 6, 6, 6, 7, 7, 1],
  [0, 5, 7, 7, 3, 6, 6, 7, 2, 2],
  [0, 5, 7, 3, 3, 3, 6, 4, 2, 2],
  [0, 5, 5, 1, 1, 1, 1, 4, 4, 4],
];

/**
 * A game board, filled with placed tetraminos.
 */
export class Board implements Entity {
  /**
   * Layout of the overall board
   * 0 represents an empty square
   * 1-7 represent filled squares, each with different colors
   * 1 - I (light blue), 2 - O (yellow), 3 - T (pink), 4 - J (blue), 5 - L (orange),
   * 6 - S (green), 7 - Z (red)
   */
  private layout: number[][];

  constructor(
    private width: number = 10,
    private height: number = 22,
    testing: boolean = false,
    private engine: Engine
  ) {
    // 22 rows, by 10 columns
    this.layout = !testing
      ? Array.from(Array(height), (_) => Array(width).fill(0))
      : TESTING_LAYOUT;
  }

  initialize(): void {
    // Let's iterate through every cell in the layout
    for (let y = 0; y < this.layout.length; y++) {
      for (let x = 0; x < this.layout[y].length; x++) {
        const val = this.layout[y][x];
        // Skip if this box is supposed to be empty
        if (val == 0) continue;

        const box = new Box();
        box.position.set(this.width - x, this.height - y, 0);
        this.engine.scene.add(box);
      }
    }
  }

  update(delta: number): void {
    // throw new Error("Method not implemented.");
  }
}
