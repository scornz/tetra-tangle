import { useCallback, useEffect, useState } from "react";
import { Box, Button, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { Backdrop, SettingsInput } from "ui/components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { AppState, appStateAtom } from "state/app";
import { MainScene } from "game/scenes";
import { Engine, INPUT_NAMES, InputType, REVERSE_INPUT_MAP } from "engine";
import { SettingsInputType } from "ui/components/SettingsInput";
import { convertCodeToText } from "utils";

type Props = {
  onClickBack: () => void;
};

function Settings({ onClickBack }: Props) {
  const setAppState = useSetRecoilState(appStateAtom);
  const [currentInput, setCurrentInput] = useState<null | InputType>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
    <Box
      h="100%"
      position="absolute"
      left="0"
      right="0"
      top="0"
      bottom="0"
      zIndex={1}
    >
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
        {Object.entries(InputType)
          .filter(([name, _]) => isNaN(Number(name)))
          .map(([_, value]) => (
            <HStack key={value} width="100%" maxWidth="400px">
              <Text
                fontSize="30px"
                fontWeight="bold"
                fontFamily="heading"
                color="white"
              >
                {INPUT_NAMES[value as InputType]}
              </Text>
              <Button
                onClick={() => {
                  setCurrentInput(value as InputType);
                }}
                ml="auto"
                width="130px"
              >
                {currentInput === value
                  ? "Press a key"
                  : convertCodeToText(REVERSE_INPUT_MAP[value as InputType])}
              </Button>
            </HStack>
          ))}
        <HStack width="100%" maxWidth="400px">
          <Text
            fontSize="30px"
            fontWeight="bold"
            fontFamily="heading"
            color="white"
          >
            ARR
          </Text>
          <SettingsInput type={SettingsInputType.ARR} ml="auto" />
        </HStack>
        <HStack width="100%" maxWidth="400px">
          <Text
            fontSize="30px"
            fontWeight="bold"
            fontFamily="heading"
            color="white"
          >
            DAS
          </Text>
          <SettingsInput type={SettingsInputType.DAS} ml="auto" />
        </HStack>
        <HStack width="100%" maxWidth="400px">
          <Text
            fontSize="30px"
            fontWeight="bold"
            fontFamily="heading"
            color="white"
          >
            SD
          </Text>
          <SettingsInput type={SettingsInputType.SD} ml="auto" />
        </HStack>
        <Button onClick={onClickBack}>Back</Button>
      </Stack>
    </Box>
  );
}

export default Settings;
