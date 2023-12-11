import { useCallback, useEffect, useState } from "react";
import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { Backdrop } from "ui/components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { AppState, appStateAtom } from "state/app";
import { MainScene } from "game/scenes";
import { Engine, InputType, REVERSE_INPUT_MAP } from "engine";

function Settings() {
  const setAppState = useSetRecoilState(appStateAtom);
  const [currentInput, setCurrentInput] = useState<null | InputType>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      console.log(e);
      if (currentInput === null) return;

      if (e.key === "Escape") {
        setCurrentInput(null);
        return;
      }

      // Change the key
      Engine.instance.input.changeKey(currentInput, e.code);
      setCurrentInput(null);
    },
    [currentInput]
  );

  useEffect(() => {
    // Add key down listener
    document.addEventListener("keydown", onKeyDown);
    return () => {
      // Clean up when removed
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  return (
    <Box h="100%">
      <Backdrop />
      <Stack
        h="100%"
        spacing={2}
        padding="2rem"
        align="center"
        justify="center"
        direction="column"
      >
        <Text
          fontSize="60px"
          fontWeight="extrabold"
          fontFamily="heading"
          color="white"
        >
          Settings
        </Text>
        <Button
          onClick={() => {
            setAppState(AppState.START);
          }}
        >
          Back
        </Button>
        {Object.entries(InputType)
          .filter(([name, _]) => isNaN(Number(name)))
          .map(([name, value]) => (
            <HStack key={value} width="100%" maxWidth="400px">
              <Text
                fontSize="30px"
                fontWeight="bold"
                fontFamily="heading"
                color="white"
              >
                {name}
              </Text>
              <Button
                onClick={() => {
                  setCurrentInput(value as InputType);
                }}
                ml="auto"
              >
                {currentInput === value
                  ? "Press a key"
                  : Engine.instance.input.getKey(value as InputType)}
              </Button>
            </HStack>
          ))}
      </Stack>
    </Box>
  );
}

export default Settings;
