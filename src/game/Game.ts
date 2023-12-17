import * as THREE from "three";
import { setRecoil } from "recoil-nexus";

import { Scene, GameEntity, InputType, Engine } from "engine";

import { Hold, Preview, Board } from "./containers";
import { LevelBar, Tetromino, TetrominoType } from "./objects";
import { SCORE_VALUES, ScoreType } from "./data";
import { MainScene } from "./scenes";

import { levelAtom, linesClearedAtom, scoreAtom } from "state/game";
import { AppState, appStateAtom } from "state/app";

import { shuffle } from "utils";

/**
 * Quick helper function to load a scene, reset atoms, and begin a new game.
 */
export const beginGame = () => {
  // Change the scene
  Engine.instance.setScene(MainScene);

  // Update the atoms
  setRecoil(levelAtom, 1);
  setRecoil(linesClearedAtom, 0);
  setRecoil(scoreAtom, 0);

  // Swap the app state to playing
  setRecoil(appStateAtom, AppState.PLAYING);
};

/**
 * Manages a game of Tetris, including the board, spawning tetrominos, and
 */
export class Game extends GameEntity {
  // The current speed that a tetromino is falling at
  speed: number = 1;
  level: number = 1;
  linesCleared: number = 0;

  numPreview: number = 5;

  public readonly board!: Board;
  public readonly preview!: Preview;
  public readonly hold!: Hold;
  public readonly levelBar!: LevelBar;

  private tetromino: Tetromino | null = null;
  private heldTetromino: TetrominoType | null = null;
  private alreadyHeld: boolean = false;

  private nextPieces: TetrominoType[] = [];
  private bag: TetrominoType[] = [];

  private score: number = 0;

  // Whether or not the game is active
  active: boolean = true;

  private lastScoreAmount: ScoreType = 0;

  /**
   * How many seconds has this game been running for?
   */
  private timer: number = 0;

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

    this.levelBar = new LevelBar(
      scene,
      0xffff00,
      1,
      new THREE.Vector3(-8, -1.5, 0),
      17.5
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
    // Only allow a quick reset a second after the game has started
    if (input == InputType.QUICK_RESET && this.active && this.timer > 1) {
      this.active = false;
      // Quickly reload the scene, resetting the game
      beginGame();
    }

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
      this.scene.engine.audio.play("hold");
      // Prevent user from holding another piece until another one spawns
      this.alreadyHeld = true;
    }
  }

  /**
   * Add a score to the current score, and update the recoil atom
   * @param scoreType The type of score that this is (changes how the amount is calculated)
   * @param val An additional value to add to the score (usually the number of cells dropped)
   */
  addScore(scoreType: ScoreType, val: number = 0, lines: number = 0) {
    // val in this case is the number of cells dropped
    if (scoreType == ScoreType.SOFT_DROP || scoreType == ScoreType.HARD_DROP) {
      this.score += val * SCORE_VALUES[scoreType];
    } else if (scoreType == ScoreType.BACK_TO_BACK) {
      // Add the back to back multiplier to the last score type
      this.score += SCORE_VALUES[ScoreType.BACK_TO_BACK] * this.lastScoreAmount;
    } else if (scoreType == ScoreType.COMBO) {
      // score value * combo count * current level
      this.score += SCORE_VALUES[ScoreType.COMBO] * val * this.level;
    }
    // val does not matter, so we just multiply by the score value
    else {
      const amt = SCORE_VALUES[scoreType] * this.level;
      this.score += amt;
      this.lastScoreAmount = amt;
    }
    // Update level and speed after adding score
    this.linesCleared += lines;
    this.updateLevelandSpeed(lines);
    // Update atom
    setRecoil(scoreAtom, this.score);
  }

  updateLevelandSpeed(lines: number) {
    // Fixed goal system, shorter games
    this.level = Math.floor(this.linesCleared / 10) + 1;
    this.levelBar.addProgress(lines / 10);

    setRecoil(levelAtom, this.level);
    setRecoil(linesClearedAtom, this.linesCleared);

    // Cap the level so we don't get infinite speed
    // Game starts to break at level 32
    const cappedLevel = Math.min(this.level, 30);
    // Use the level to calculate the speed
    // Taken from 2009 Tetris Design Guideline
    this.speed = (0.8 - (cappedLevel - 1) * 0.007) ** (cappedLevel - 1);

    console.log(`Current level (${this.level}) and speed (${this.speed})`);
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
      this.gameOver();
      this.active = false;
    }
  }

  /**
   * The player has topped out, and the game is over.
   */
  gameOver() {
    // Change app state to submit a score
    setRecoil(appStateAtom, AppState.SUBMIT_SCORE);
    this.scene.engine.audio.play("topout");
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

  update(delta: number): void {
    this.timer += delta;
    if (this.tetromino?.placed && this.active) {
      this.spawn();
    }
  }

  destroy(): void {
    super.destroy();
    // Remove the listener
    this.scene.engine.input.removeListener(this.handleInputCallback);
  }
}
