/**
 * Movement control constants.
 */
export const MOVEMENT = {
  /**
   * Delayed auto shift. The time in milliseconds required to hold a key down
   * in order for ARR to begin.
   */
  DAS: 135,
  /**
   * Auto repeat rate. The time in milliseconds between each shift movement when
   * auto repeat is engage.
   */
  ARR: 20,
  /**
   * Soft drop speed. The time in milliseconds between each soft drop movement.
   * Only applies when tetromino speed is slower than this.
   */
  SD: 100,
  /**
   * The maximum number of times a tetromino can be moved down before the lock
   * down timer stops resetting
   */
  MAX_MOVE_LOCK_DOWN: 15,
};

/**
 * A list of all controls used in the game.
 */
export const ALL_CONTROLS = {
  moveLeft: "ArrowLeft",
  moveRight: "ArrowRight",
  rotateRight: "ArrowUp",
  rotateLeft: "KeyZ",
  rotate180: "KeyX",
  hold: "KeyC",
  softDrop: "ArrowDown",
  hardDrop: "Space",
};
