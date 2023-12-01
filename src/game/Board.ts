import * as THREE from "three";
import vertexShader from "./shader.vert";
import fragmentShader from "./shader.frag";
import { Entity } from "engine/Entity";

/**
 * A game board, filled with placed tetraminos.
 */
export class Board implements Entity {
  /**
   * Layout of the overall board
   * 0 represents an empty square
   * 1-7 represent filled squares, each with different colors
   */
  private layout: number[][];

  constructor(width: number = 10, height: number = 22) {
    // 22 rows, by 10 columns
    this.layout = Array.from(Array(height), (_) => Array(width).fill(0));
  }

  update(delta: number): void {
    throw new Error("Method not implemented.");
  }
}
