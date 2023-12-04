import * as THREE from "three";
import { GameEntity } from "engine/GameEntity";
import { Scene } from "engine/Scene";
import { Board } from "./containers/Board";

/**
 * Manages a game of Tetris, including the board, spawning tetrominos, and
 */
export class Game extends GameEntity {
  // The current speed that a tetromino is falling at
  speed: number = 1;

  public readonly board!: Board;

  constructor(protected scene: Scene) {
    super(scene);

    this.board = new Board(
      scene,
      this,
      10,
      22,
      new THREE.Vector3(-4.5, 0, 0),
      true
    );
    this.board.initialize();
  }

  update(delta: number): void {
    // throw new Error("Method not implemented.");
  }
}
