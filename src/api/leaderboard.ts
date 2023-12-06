import axios from "axios";
import { DREAMLO } from "constants";

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
