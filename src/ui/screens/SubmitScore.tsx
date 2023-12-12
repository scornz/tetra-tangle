import { Box, Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { Backdrop, EnterInput } from "ui/components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { scoreAtom } from "state/game";
import { submitScore } from "api/leaderboard";
import { AppState, appStateAtom } from "state/app";
import { useState } from "react";

function SubmitScore() {
  const score = useRecoilValue(scoreAtom);
  const setAppState = useSetRecoilState(appStateAtom);
  const [loading, setLoading] = useState(false);

  // Induce callback and clear input
  const uploadScore = async (text: string) => {
    const name = text.trim();
    setLoading(true);
    // Submit the score
    await submitScore(name, score);
    console.log(`Score submitted under name [${name}] and value [${score}]`);
    localStorage.setItem("name", name);
    setAppState(AppState.LEADERBOARD);
  };

  return (
    <Box h="100%" display="flex" justifyContent="center">
      <Backdrop />
      <Stack
        h="100%"
        maxWidth="400px"
        spacing={2}
        align="center"
        justify="center"
        direction="column"
      >
        <Text
          fontSize="32px"
          fontFamily="body"
          color="white"
          textAlign="center"
          mb="-3rem"
        >
          FINAL SCORE:
        </Text>
        <Text
          fontSize="100px"
          fontWeight="extrabold"
          fontFamily="heading"
          color="white"
          textAlign="center"
        >
          {score.toString().padStart(6, "0")}
        </Text>
        <Box height="100px" width="100%" display="flex" justifyContent="center">
          {!loading ? (
            <EnterInput
              onEnter={uploadScore}
              initialValue={localStorage.getItem("name") || ""}
              placeholder="Enter your name, then press enter..."
            />
          ) : (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.600"
              color="white"
              size="xl"
            />
          )}
        </Box>

        <Button onClick={() => setAppState(AppState.LEADERBOARD)}>Skip</Button>
      </Stack>
    </Box>
  );
}

export default SubmitScore;
