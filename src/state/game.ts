import { atom } from "recoil";

/**
 * The current score.
 */
export const scoreAtom = atom<number>({
  key: "score",
  default: 0,
});

/**
 * The current level.
 */
export const levelAtom = atom<number>({
  key: "level",
  default: 1,
});

/**
 * The number of lines cleared.
 */
export const linesClearedAtom = atom<number>({
  key: "linesCleared",
  default: 0,
});
