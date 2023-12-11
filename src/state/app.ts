import { atom } from "recoil";

export enum AppState {
  START,
  PLAYING,
  SUBMIT_SCORE,
  LEADERBOARD,
  SETTINGS,
}

export const appStateAtom = atom<AppState>({
  key: "appState",
  default: AppState.START,
});
