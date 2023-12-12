import { useState } from "react";
import {
  HStack,
  Text,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { MOVEMENT } from "game/data";

// eslint-disable-next-line react-refresh/only-export-components
export enum SettingsInputType {
  ARR,
  DAS,
  SD,
}

type Props = {
  type: SettingsInputType;
};

/**
 * Used to control millisecond values in the settings page, this includes ARR,
 * DAS, and SD.
 */
function SettingsInput({
  type,
  ...props
}: Props & React.ComponentProps<typeof HStack>) {
  let initialValue = 0;
  switch (type) {
    case SettingsInputType.ARR:
      initialValue = MOVEMENT.ARR;
      break;
    case SettingsInputType.DAS:
      initialValue = MOVEMENT.DAS;
      break;
    case SettingsInputType.SD:
      initialValue = MOVEMENT.SD;
      break;
  }
  const [input, setInput] = useState((initialValue * 1000).toString());

  return (
    <HStack {...props}>
      <NumberInput
        onChange={(valueString) => {
          let value = parseFloat(valueString);
          if (isNaN(value)) return;

          value = Math.floor(value);
          setInput(value.toString());
          if (type === SettingsInputType.ARR) {
            MOVEMENT.ARR = value / 1000;
            localStorage.setItem("arr", (value / 1000).toString());
          } else if (type === SettingsInputType.DAS) {
            MOVEMENT.DAS = value / 1000;
            localStorage.setItem("das", (value / 1000).toString());
          } else if (type === SettingsInputType.SD) {
            MOVEMENT.DAS = value / 1000;
            localStorage.setItem("sd", (value / 1000).toString());
          }
        }}
        backgroundColor="gray.100"
        rounded="full"
        width="100px"
        value={input}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Text color="white" fontWeight="bold">
        ms
      </Text>
    </HStack>
  );
}
export default SettingsInput;
