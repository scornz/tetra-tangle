import { Box } from "@chakra-ui/react";

function Backdrop() {
  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      w="100%"
      h="100%"
      bg="black"
      zIndex="-1"
      opacity="0.7"
    />
  );
}

export default Backdrop;
