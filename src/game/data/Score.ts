/**
 * Score constants
 */
export const SCORE_VALUES = {
  /* Basic line clears */
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,

  /* T-Spin line clears */
  TSPIN_MINI_NONE: 100,
  TSPIN_NONE: 400,
  TSPIN_MINI_SINGLE: 200,
  TSPIN_SINGLE: 800,
  TSPIN_MINI_DOUBLE: 400,
  TSPIN_DOUBLE: 1200,
  TSPIN_TRIPLE: 1600,

  /* Back-to-back difficult line clear multiplier */
  BACK_TO_BACK: 1.5,

  /* Points per consecutive combo */
  COMBO: 50,

  /* Points per cell moved in soft drop */
  SOFT_DROP: 1,
  /* Points per cell moved in hard drop */
  HARD_DROP: 2,
};
