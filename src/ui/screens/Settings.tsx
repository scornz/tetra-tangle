import { useCallback, useEffect, useState } from "react";
import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { Backdrop, SettingsInput } from "ui/components";
import { Engine, INPUT_NAMES, InputType, REVERSE_INPUT_MAP } from "engine";
import { SettingsInputType } from "ui/components/SettingsInput";
import { convertCodeToText } from "utils";
import { ArrowLeftIcon } from "@chakra-ui/icons";

type Props = {
  onClickBack: () => void;
};

function Settings({ onClickBack }: Props) {
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
          fontSize="80px"
          fontWeight="extrabold"
          fontFamily="special"
          color="white"
          mb="-1.5rem"
          mt="-1rem"
        >
          Settings
        </Text>
        <HStack h="100%" spacing={20} padding="2rem" align="flex-start">
          <Stack>
            <Text
              fontSize="50px"
              fontWeight="extrabold"
              fontFamily="special"
              color="white"
              width="400px"
              mb="-1rem"
            >
              Controls
            </Text>
            {Object.entries(InputType)
              .filter(([name, _]) => isNaN(Number(name)))
              .map(([_, value]) => (
                <HStack key={value} width="100%" maxWidth="400px">
                  <Text
                    fontSize="25px"
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
                    height="40px"
                  >
                    {currentInput === value
                      ? "Press a key"
                      : convertCodeToText(
                          REVERSE_INPUT_MAP[value as InputType]
                        )}
                  </Button>
                </HStack>
              ))}
          </Stack>
          <Stack>
            <Text
              fontSize="50px"
              fontWeight="extrabold"
              fontFamily="special"
              color="white"
              width="400px"
              mb="-1rem"
              mt="-0.5rem"
            >
              Movement
            </Text>
            <HStack width="100%" maxWidth="400px">
              <Text
                fontSize="25px"
                fontWeight="bold"
                fontFamily="heading"
                color="white"
              >
                ARR
              </Text>
              <Text
                fontSize="15px"
                fontWeight="bold"
                fontFamily="heading"
                color="white"
              >
                (Auto Repeat Rate)
              </Text>
              <SettingsInput type={SettingsInputType.ARR} ml="auto" />
            </HStack>
            <HStack width="100%" maxWidth="400px">
              <Text
                fontSize="25px"
                fontWeight="bold"
                fontFamily="heading"
                color="white"
              >
                DAS
              </Text>
              <Text
                fontSize="15px"
                fontWeight="bold"
                fontFamily="heading"
                color="white"
              >
                (Delayed Auto Shift)
              </Text>
              <SettingsInput type={SettingsInputType.DAS} ml="auto" />
            </HStack>
            <HStack width="100%" maxWidth="400px">
              <Text
                fontSize="25px"
                fontWeight="bold"
                fontFamily="heading"
                color="white"
              >
                SD
              </Text>
              <Text
                fontSize="15px"
                fontWeight="bold"
                fontFamily="heading"
                color="white"
              >
                (Soft Drop)
              </Text>
              <SettingsInput type={SettingsInputType.SD} ml="auto" />
            </HStack>
          </Stack>
        </HStack>
        <Button
          height="70px"
          width="200px"
          onClick={onClickBack}
          rightIcon={<ArrowLeftIcon />}
        >
          Back
        </Button>
      </Stack>
    </Box>
  );
}

export default Settings;
