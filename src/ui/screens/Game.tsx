import { useEffect, useState } from "react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { Backdrop } from "ui/components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AppState, appStateAtom } from "state/app";
import { scoreAtom } from "state/game";

function Game() {
  const score = useRecoilValue(scoreAtom);

  useEffect(() => {
    console.log(score);
  }, [score]);

  return (
    <Box h="100%">
      <Text
        fontSize="10vmin"
        fontWeight="extrabold"
        fontFamily="heading"
        color="white"
        position="absolute"
        top="0"
        right="0"
        textAlign="right"
        my="-1rem"
        mx="1rem"
      >
        {score.toString().padStart(6, "0")}
      </Text>
    </Box>
  );
}

export default Game;
