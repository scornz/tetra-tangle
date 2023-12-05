import { atom } from "recoil";

export const scoreAtom = atom<number>({
  key: "score",
  default: 0,
});
