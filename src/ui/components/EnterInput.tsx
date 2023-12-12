import { useState } from "react";

import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputGroupProps,
  InputRightElement,
} from "@chakra-ui/react";

type Props = {
  onEnter: (input: string) => void;
  initialValue?: string;
  placeholder?: string;
};

/**
 * An input used for inputting a single line of text and sending with either
 * the click of a small button or the press of the enter key. Taken from previous
 * project, img-chat.
 */
function EnterInput({
  onEnter,
  initialValue = "",
  placeholder = "Say something...",
  ...props
}: Props & InputGroupProps) {
  // The contents of the text input
  const [input, setInput] = useState(initialValue);
  const enter = () => {
    // Do not do anything if the input is empty
    if (input === "") return;

    onEnter(input);
    setInput("");
  };

  return (
    <InputGroup variant="filled" {...props}>
      <Input
        borderRadius="full"
        focusBorderColor="gray.200"
        _focus={{ bg: "gray.200" }}
        autoFocus={true}
        autoComplete="off"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            enter();
          }
        }}
      />
      <InputRightElement>
        <Button borderRadius="full" onClick={enter}>
          <Icon as={ArrowRightIcon} color="green.400" />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default EnterInput;
