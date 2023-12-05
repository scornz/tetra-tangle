import { useState } from "react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { Backdrop } from "ui/components";
import { useSetRecoilState } from "recoil";
import { AppState, appStateAtom } from "state/app";

function Home() {
  const setAppState = useSetRecoilState(appStateAtom);

  return (
    <Box h="100%">
      <Backdrop />
      <Stack
        h="100%"
        spacing={2}
        align="center"
        justify="center"
        direction="column"
      >
        <Text
          fontSize="10vmin"
          fontWeight="extrabold"
          fontFamily="heading"
          color="white"
        >
          Tetra Tangle
        </Text>
        <Button onClick={() => setAppState(AppState.PLAYING)}>Play</Button>
      </Stack>
    </Box>
  );
}

export default Home;
