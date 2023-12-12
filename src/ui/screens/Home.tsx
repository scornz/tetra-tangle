import { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  styled,
} from "@chakra-ui/react";
import { Backdrop } from "ui/components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { AppState, appStateAtom } from "state/app";
import { MainScene } from "game/scenes";
import { Engine } from "engine";

import logo from "assets/tetra-tangle.png";
import backgroundVideo from "assets/tetra-tangle-background.mp4";
import { SettingsIcon } from "@chakra-ui/icons";

function Home() {
  const setAppState = useSetRecoilState(appStateAtom);

  return (
    <Box h="100%">
      <Box width="100%" height="100%" position="absolute" left="0" top="0">
        <Box
          as="video"
          controls={false}
          autoPlay={true}
          loop={true}
          src={backgroundVideo}
          muted={true}
          position="absolute"
          left="0"
          bottom="0"
          width="100%"
          height="100%"
          objectFit="cover"
          sx={{
            aspectRatio: "16/9",
            filter: "blur(20px)",
          }}
          zIndex="-1"
        />
      </Box>
      <Stack
        h="100%"
        spacing={2}
        align="center"
        justify="center"
        direction="column"
      >
        <Image maxWidth="850px" minWidth="400px" width="100vmin" src={logo} />
        <HStack
          maxWidth="450px"
          width="100%"
          height="100px"
          justifyContent="center"
          mx="1rem"
        >
          <Button
            height="100%"
            flexGrow={1}
            rounded="20"
            onClick={() => {
              Engine.instance.setScene(MainScene);
              setAppState(AppState.PLAYING);
            }}
          >
            <Text fontSize="55px" fontFamily="special">
              Play
            </Text>
          </Button>
          <Button
            width="50px"
            height="100%"
            rounded="20"
            onClick={() => {
              setAppState(AppState.SETTINGS);
            }}
          >
            <SettingsIcon />
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}

export default Home;
