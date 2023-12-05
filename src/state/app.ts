import { atom } from "recoil";

export enum AppState {
  START,
  PLAYING,
}

export const appStateAtom = atom<AppState>({
  key: "appState",
  default: AppState.START,
});
