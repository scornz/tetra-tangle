import axios from "axios";
import { DREAMLO } from "constants";

/**
 * Note that these API requests return CORS policy errors, but still function.
 * Ignore these errors in the console, as I believe dreamlo was only intended to
 * be used with Unity.
 */

/**
 * Submit a score to the leaderboards
 * @param name Name of the player
 * @param score The final score attained
 */
export const submitScore = async (name: string, score: number) => {
  // Simple GET request to the dreamlo API
  await axios.get(
    `${DREAMLO.BASE_URL}${DREAMLO.PRIVATE_KEY}/add/${name}/${score}`
  );
};

// A single entry in the leaderboard
export type ScoreEntry = {
  name: string;
  score: number;
  seconds: number;
  text: string;
  date: string;
};

/**
 * Returns the top scores from the leaderboard.
 */
export const getScores = async (): Promise<ScoreEntry[]> => {
  const res = await axios.get(
    `${DREAMLO.BASE_URL}${DREAMLO.PUBLIC_KEY}/json/10`
  );
  return res.data.dreamlo.leaderboard.entry;
};
