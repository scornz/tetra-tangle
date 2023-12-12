import { Box } from "@chakra-ui/react";

/**
 * A fullscreen backdrop that can be used to dim the background.
 */
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
      opacity="0.8"
    />
  );
}

export default Backdrop;
