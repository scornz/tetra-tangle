import { atom } from "recoil";

/**
 * The possible states of the app.
 */
export enum AppState {
  START,
  PLAYING,
  SUBMIT_SCORE,
  LEADERBOARD,
}

/**
 * The current state of the app. This is used to determine which screen to show
 * in the UI. This is updated via UI controls and within the actual game.
 */
export const appStateAtom = atom<AppState>({
  key: "appState",
  default: AppState.START,
});
