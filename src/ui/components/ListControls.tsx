import { useCallback, useEffect, useState } from "react";
import { Button, HStack, Stack, Text } from "@chakra-ui/react";
import { Engine, INPUT_NAMES, InputType, REVERSE_INPUT_MAP } from "engine";
import { convertCodeToText } from "utils";

function ListControls() {
  return (
    <Stack
      h="100%"
      width="100%"
      spacing={2}
      padding="2rem"
      align="center"
      justify="center"
      direction="column"
      mb="2rem"
    >
      {Object.entries(InputType)
        .filter(([name, _]) => isNaN(Number(name)))
        .map(([_, value]) => (
          <HStack key={value} width="100%" maxWidth="400px" mb="-0.75rem">
            <Text
              fontSize="20px"
              fontWeight="bold"
              fontFamily="heading"
              color="white"
            >
              {INPUT_NAMES[value as InputType]}
            </Text>
            <Text
              fontSize="20px"
              fontWeight="extrabold"
              fontFamily="heading"
              color="white"
              ml="auto"
            >
              {convertCodeToText(REVERSE_INPUT_MAP[value as InputType])}
            </Text>
          </HStack>
        ))}
    </Stack>
  );
}

export default ListControls;
