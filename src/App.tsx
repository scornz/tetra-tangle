import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { ChakraProvider, Stack, Text } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import theme from "theme";
import { Fonts } from "Fonts";

function App() {
  const [count, setCount] = useState(0);

  return (
    <RecoilRoot>
      <RecoilNexus />
      <Fonts />
      <ChakraProvider theme={theme}>
        <Stack
          h="100%"
          spacing={2}
          align="center"
          justify="center"
          direction="column"
        >
          <img src={reactLogo} alt="React Logo" />
          <Text
            fontSize="6xl"
            fontWeight="400"
            fontStyle="italic"
            color="white"
            fontFamily="testing"
          >
            Hello
          </Text>
          <p id="testing">Testing!</p>
        </Stack>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
