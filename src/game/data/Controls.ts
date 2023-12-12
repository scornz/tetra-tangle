/**
 * Movement control constants.
 */
export const MOVEMENT = {
  /**
   * Delayed auto shift. The time in milliseconds required to hold a key down
   * in order for ARR to begin.
   */
  DAS: 135 / 1000,
  /**
   * Auto repeat rate. The time in milliseconds between each shift movement when
   * auto repeat is engage.
   */
  ARR: 10 / 1000,
  /**
   * Soft drop speed. The time in milliseconds between each soft drop movement.
   * Only applies when tetromino speed is slower than this.
   */
  SD: 30 / 1000,
  /**
   * The maximum number of times a tetromino can be moved down before the lock
   * down timer stops resetting
   */
  MAX_MOVE_LOCK_DOWN: 15,
};

/* NOTE: This is not the ideal place (nor the correct place to be loading
      these values, but it's where they are, and where they will be, so I am doing
      it here for ease of use.) */
const savedARR = localStorage.getItem("arr");
const savedDAS = localStorage.getItem("das");
const savedSoftDrop = localStorage.getItem("sd");
MOVEMENT.ARR = savedARR ? parseFloat(savedARR) : MOVEMENT.ARR;
MOVEMENT.DAS = savedDAS ? parseFloat(savedDAS) : MOVEMENT.DAS;
MOVEMENT.SD = savedSoftDrop ? parseFloat(savedSoftDrop) : MOVEMENT.SD;
