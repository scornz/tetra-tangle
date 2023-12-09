import { useEffect, useState } from "react";
import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { Backdrop } from "ui/components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { AppState, appStateAtom } from "state/app";
import { levelAtom, linesClearedAtom, scoreAtom } from "state/game";

function Game() {
  const score = useRecoilValue(scoreAtom);
  const linesCleared = useRecoilValue(linesClearedAtom);
  const level = useRecoilValue(levelAtom);

  return (
    <Box h="100%">
      <Text
        fontSize="12vmin"
        fontWeight="extrabold"
        fontFamily="emphasis"
        color="white"
        position="absolute"
        top="0"
        right="0"
        textAlign="right"
        letterSpacing="0.1em"
        my="-1rem"
      >
        {score.toString().padStart(7, "0")}
      </Text>

      <Stack position="absolute" top="0" left="0">
        <Text
          fontSize="60px"
          fontWeight="extrabold"
          fontFamily="special"
          color="white"
          textAlign="left"
          mx="1rem"
        >
          Level {level}
        </Text>
        <HStack justifyContent="start" mt="-2rem">
          <Text
            fontSize="50px"
            fontWeight="bold"
            fontFamily="special"
            color="white"
            textAlign="left"
            mx="1rem"
          >
            {linesCleared % 10}/10
          </Text>
          <Text
            fontSize="26px"
            fontWeight="bold"
            fontFamily="special"
            color="white"
            textAlign="left"
            mt="1rem"
            ml="-1rem"
          >
            lines cleared
          </Text>
        </HStack>
      </Stack>
    </Box>
  );
}

export default Game;
