import { Box, Stack, Text } from "@chakra-ui/react";
import { Backdrop, EnterInput } from "ui/components";
import { useRecoilValue } from "recoil";
import { scoreAtom } from "state/game";
import { submitScore } from "api/leaderboard";

function SubmitScore() {
  const score = useRecoilValue(scoreAtom);

  // Induce callback and clear input
  const uploadScore = async (text: string) => {
    const name = text.trim();
    // Submit the score
    await submitScore(name, score);
    console.log(`Score submitted under name [${name}] and value [${score}]`);
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
        <EnterInput
          onEnter={uploadScore}
          placeholder="Enter your name, then press enter..."
        />
      </Stack>
    </Box>
  );
}

export default SubmitScore;
