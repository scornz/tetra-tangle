/**
 * All possible ways to score points in the game
 */
export enum ScoreType {
  SINGLE,
  DOUBLE,
  TRIPLE,
  TETRIS,
  TSPIN_MINI_NONE,
  TSPIN_NONE,
  TSPIN_MINI_SINGLE,
  TSPIN_SINGLE,
  TSPIN_MINI_DOUBLE,
  TSPIN_DOUBLE,
  TSPIN_TRIPLE,
  BACK_TO_BACK,
  COMBO,
  SOFT_DROP,
  HARD_DROP,
}

/**
 * Score constants
 */
export const SCORE_VALUES: { [key in ScoreType]: number } = {
  /* Basic line clears */
  [ScoreType.SINGLE]: 100,
  [ScoreType.DOUBLE]: 300,
  [ScoreType.TRIPLE]: 500,
  [ScoreType.TETRIS]: 800,

  /* T-Spin line clears */
  [ScoreType.TSPIN_MINI_NONE]: 0,
  [ScoreType.TSPIN_NONE]: 400,
  [ScoreType.TSPIN_MINI_SINGLE]: 200,
  [ScoreType.TSPIN_SINGLE]: 800,
  [ScoreType.TSPIN_MINI_DOUBLE]: 400,
  [ScoreType.TSPIN_DOUBLE]: 1200,
  [ScoreType.TSPIN_TRIPLE]: 1600,

  /* Back-to-back difficult line clear multiplier */
  [ScoreType.BACK_TO_BACK]: 0.5,

  /* Points per consecutive combo */
  [ScoreType.COMBO]: 50,

  /* Points per cell moved in soft drop */
  [ScoreType.SOFT_DROP]: 1,
  /* Points per cell moved in hard drop */
  [ScoreType.HARD_DROP]: 2,
};
