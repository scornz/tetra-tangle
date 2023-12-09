import { atom } from "recoil";

export const scoreAtom = atom<number>({
  key: "score",
  default: 0,
});

export const levelAtom = atom<number>({
  key: "level",
  default: 1,
});

export const linesClearedAtom = atom<number>({
  key: "linesCleared",
  default: 0,
});
