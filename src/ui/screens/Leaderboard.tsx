import { Box, Button, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { Backdrop } from "ui/components";
import { useSetRecoilState } from "recoil";
import { ScoreEntry, getScores } from "api/leaderboard";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { AppState, appStateAtom } from "state/app";

/**
 * Displays top 10 scores from the leaderboard.
 */
function Leaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const setAppState = useSetRecoilState(appStateAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const scores = await getScores();

      // Pad scores to 10
      while (scores.length < 10) {
        scores.push({
          name: "N/A",
          score: 0,
          seconds: 0,
          date: "0",
          text: "N/A",
        });
      }

      setLoading(false);
      setScores(scores);
    };
    fetch();
  }, []);

  const getColor = (index: number) => {
    if (index === 0) return "#FFD700";
    if (index === 1) return "#C0C0C0";
    if (index === 2) return "#CD7F32";
    return "white";
  };

  return (
    <Box h="100%" display="flex" justifyContent="center">
      <Backdrop />
      <Stack
        h="100%"
        maxWidth="500px"
        width="100%"
        spacing={2}
        align="center"
        justify="center"
        direction="column"
      >
        <Text
          fontSize="100px"
          fontWeight="extrabold"
          fontFamily="special"
          color="white"
          textAlign="center"
          mb="auto"
          mt="20px"
        >
          LEADERBOARD
        </Text>
        <Stack
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
          mt="-3rem"
        >
          {!loading ? (
            scores.map((score, index) => {
              return (
                <HStack key={index} width="100%" mb="-10px">
                  <Text
                    fontSize="32px"
                    fontWeight="extrabold"
                    color={getColor(index)}
                    alignSelf="flex-start"
                  >
                    {index + 1}.{" "}
                  </Text>
                  <Text
                    key={index}
                    fontSize="32px"
                    fontFamily="body"
                    color="white"
                    textAlign="center"
                    alignSelf="flex-start"
                  >
                    {score.name}
                  </Text>

                  <Text
                    fontSize="32px"
                    fontWeight="extrabold"
                    color={getColor(index)}
                    ml="auto"
                  >
                    {score.score.toString().padStart(6, "0")}
                  </Text>
                </HStack>
              );
            })
          ) : (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.600"
              color="white"
              size="xl"
            />
          )}
        </Stack>
        <Button
          rightIcon={<ArrowLeftIcon />}
          mt="auto"
          mb="32px"
          height="60px"
          onClick={() => {
            setAppState(AppState.START);
          }}
        >
          Back to home
        </Button>
      </Stack>
    </Box>
  );
}

export default Leaderboard;
