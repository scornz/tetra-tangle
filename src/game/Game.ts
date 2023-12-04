import * as THREE from "three";
import { GameEntity } from "engine/GameEntity";
import { Scene } from "engine/Scene";
import { Board } from "./containers/Board";
import { Preview } from "./containers";
import { Tetromino, TetrominoType } from "./objects";
import { shuffle } from "utils";

/**
 * Manages a game of Tetris, including the board, spawning tetrominos, and
 */
export class Game extends GameEntity {
  // The current speed that a tetromino is falling at
  speed: number = 1;
  numPreview: number = 5;

  public readonly board!: Board;
  public readonly preview!: Preview;
  private tetromino: Tetromino | null = null;

  private nextPieces: TetrominoType[] = [];
  private bag: TetrominoType[] = [];

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

    this.preview = new Preview(
      scene,
      this,
      this.numPreview,
      new THREE.Vector3(8, 20, 0)
    );

    for (let i = 0; i < this.numPreview; i++) {
      const piece = this.grab();
      this.preview.shiftAdd(piece);
      this.nextPieces.push(piece);
    }

    this.spawn();
  }

  spawn() {
    const piece = this.getNextPiece();
    this.tetromino = new Tetromino(this.scene, this.board, piece);
  }

  /**
   * Randomly initalize the bag of tetriminos and filter out the debug value (8)
   */
  fillBag() {
    this.bag = shuffle([
      TetrominoType.I,
      TetrominoType.O,
      TetrominoType.T,
      TetrominoType.J,
      TetrominoType.L,
      TetrominoType.S,
      TetrominoType.Z,
    ]);
  }

  /**
   * Grab the next piece from the bag, and do not replace it until the bag is
   * completely empty.
   * @returns The next tetromino in the bag
   */
  grab(): TetrominoType {
    // Fill bag if the bag is empty
    if (this.bag.length == 0) {
      this.fillBag();
    }
    return this.bag.pop()!;
  }

  /**
   * Used to get the next piece, usually for spawning in.
   * @returns The next piece to spawn in the preview selection
   */
  getNextPiece(): TetrominoType {
    const nextPiece = this.nextPieces.shift()!;

    const newPiece = this.grab();
    this.nextPieces.push(newPiece);
    this.preview.shiftAdd(newPiece);
    return nextPiece;
  }

  update(_delta: number): void {
    if (this.tetromino?.placed) {
      this.spawn();
    }
  }
}
