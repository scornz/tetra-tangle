import * as THREE from "three";
import { Scene, GameEntity, InputType } from "engine";
import { Hold, Preview, Board } from "./containers";
import { Tetromino, TetrominoType } from "./objects";
import { shuffle } from "utils";
import { setRecoil } from "recoil-nexus";
import { scoreAtom } from "state/game";

/**
 * Manages a game of Tetris, including the board, spawning tetrominos, and
 */
export class Game extends GameEntity {
  // The current speed that a tetromino is falling at
  speed: number = 1;
  numPreview: number = 5;

  public readonly board!: Board;
  public readonly preview!: Preview;
  public readonly hold!: Hold;

  private tetromino: Tetromino | null = null;
  private heldTetromino: TetrominoType | null = null;
  private alreadyHeld: boolean = false;

  private nextPieces: TetrominoType[] = [];
  private bag: TetrominoType[] = [];

  private score: number = 0;

  // Whether or not the game is active
  active: boolean = true;

  // Callback for handling movement, store this for later removal
  private handleInputCallback: (input: InputType) => void;

  constructor(protected scene: Scene) {
    super(scene);

    this.board = new Board(
      scene,
      this,
      10,
      22,
      new THREE.Vector3(-4.5, 0, 0),
      false
    );
    this.board.initialize();

    this.preview = new Preview(
      scene,
      this,
      this.numPreview,
      new THREE.Vector3(8, 18, 0)
    );

    for (let i = 0; i < this.numPreview; i++) {
      const piece = this.grab();
      this.preview.shiftAdd(piece);
      this.nextPieces.push(piece);
    }

    this.hold = new Hold(scene, new THREE.Vector3(-10, 18, 0));
    this.spawn();

    this.handleInputCallback = this.handleInput.bind(this);
    this.scene.engine.input.addListener(this.handleInputCallback);
  }

  handleInput(input: InputType) {
    if (input == InputType.HOLD && !this.alreadyHeld) {
      if (this.heldTetromino) {
        // If there is already a held tetromino, then swap it with the current
        const temp = this.heldTetromino;
        this.heldTetromino = this.tetromino!.type;
        this.hold.set(this.tetromino!.type);
        this.tetromino!.demolish();
        this.tetromino = new Tetromino(this.scene, this.board, temp);
      } else {
        // If there is no held tetromino, then simply hold the current one
        this.heldTetromino = this.tetromino!.type;
        this.hold.set(this.heldTetromino);
        this.tetromino!.demolish();
        this.spawn();
      }
      // Prevent user from holding another piece until another one spawns
      this.alreadyHeld = true;
    }
  }

  addScore(amount: number) {
    this.score += amount;
    setRecoil(scoreAtom, this.score);
  }

  spawn() {
    const piece = this.getNextPiece();
    this.tetromino = new Tetromino(this.scene, this.board, piece);

    // Allow for the user to hold another piece
    this.alreadyHeld = false;

    // If this tetromino collides with the board, then the game is over
    if (this.tetromino.checkCollision()) {
      // Immediatley destroy the tetromino, but leave the cells
      this.tetromino.destroy();
      // GAME OVER condition
      this.active = false;
    }
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
    if (this.tetromino?.placed && this.active) {
      this.spawn();
    }
  }
}
