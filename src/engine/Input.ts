import { Engine } from "./Engine";

/**
 * Possible inputs
 */
export enum InputType {
  MOVE_RIGHT,
  MOVE_LEFT,
  ROTATE_RIGHT,
  ROTATE_LEFT,
  ROTATE_180,
  HOLD,
  SOFT_DROP,
  HARD_DROP,
}

/**
 * Names of inputs for display
 */
export const INPUT_NAMES: { [key in InputType]: string } = {
  [InputType.MOVE_RIGHT]: "Move Right",
  [InputType.MOVE_LEFT]: "Move Left",
  [InputType.ROTATE_RIGHT]: "Rotate Right",
  [InputType.ROTATE_LEFT]: "Rotate Left",
  [InputType.ROTATE_180]: "Rotate 180",
  [InputType.HOLD]: "Hold Piece",
  [InputType.SOFT_DROP]: "Soft Drop",
  [InputType.HARD_DROP]: "Hard Drop",
};

/**
 * Default mapping of controls to keys
 */
export const INPUT_MAP: { [key: string]: InputType } = {
  ArrowRight: InputType.MOVE_RIGHT,
  ArrowLeft: InputType.MOVE_LEFT,
  ArrowUp: InputType.ROTATE_RIGHT,
  KeyZ: InputType.ROTATE_LEFT,
  KeyX: InputType.ROTATE_180,
  KeyC: InputType.HOLD,
  ArrowDown: InputType.SOFT_DROP,
  Space: InputType.HARD_DROP,
};

export const REVERSE_INPUT_MAP: { [key in InputType]: string } = {
  [InputType.MOVE_RIGHT]: "ArrowRight",
  [InputType.MOVE_LEFT]: "ArrowLeft",
  [InputType.ROTATE_RIGHT]: "ArrowUp",
  [InputType.ROTATE_LEFT]: "KeyZ",
  [InputType.ROTATE_180]: "KeyX",
  [InputType.HOLD]: "KeyC",
  [InputType.SOFT_DROP]: "ArrowDown",
  [InputType.HARD_DROP]: "Space",
};

/**
 * Handles input from the user and sends out events to nthe necessary listeners
 */
export class Input {
  // The current keys being held down
  private keysHeld: Map<InputType, number> = new Map<InputType, number>();
  // All listeners on input
  private listeners: Set<(input: InputType) => void> = new Set<() => void>();

  constructor(_engine: Engine) {
    // Process keyboard down and up events
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));

    // Load from local storage
    const savedInputMap = localStorage.getItem("inputMap");
    if (savedInputMap) {
      const parsedInputMap = JSON.parse(savedInputMap);
      for (const key in parsedInputMap) {
        const input = parsedInputMap[key];
        if (input in REVERSE_INPUT_MAP) {
          this.setKey(input, key);
        }
      }
    }
  }

  /**
   * Get the key for the given input
   */
  getKey(input: InputType) {
    return REVERSE_INPUT_MAP[input];
  }

  /*
   * Change the key for the given input
   */
  changeKey(input: InputType, key: string) {
    if (key in INPUT_MAP) return false;

    this.setKey(input, key);
    localStorage.setItem("inputMap", JSON.stringify(INPUT_MAP));
    return true;
  }

  setKey(input: InputType, key: string) {
    const currentKey = REVERSE_INPUT_MAP[input];
    // Remove old key from input map
    delete INPUT_MAP[currentKey];

    // Update the input map
    INPUT_MAP[key] = input;
    REVERSE_INPUT_MAP[input] = key;
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.repeat) return;

    const key = event.code;
    const input = INPUT_MAP[key];
    if (input === undefined) return;

    // Call the listeners on this
    for (const listener of this.listeners) {
      listener(input);
    }

    // Add the key to the map if it's not already there
    if (!this.keysHeld.has(input)) {
      this.keysHeld.set(input, 0);
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (event.repeat) return;

    const key = event.code;
    const input = INPUT_MAP[key];
    if (input === undefined) return;

    // Remove the key from the map
    this.keysHeld.delete(input);
  }

  /**
   * Add a listener for the given input
   * @param input Input to listen for upon being pressed
   * @param callback Callback to call when input is pressed
   */
  addListener(callback: (input: InputType) => void) {
    // Add callback to the set
    this.listeners.add(callback);
  }

  /**
   * Remove a listener for the given input
   * @param input Input to remove listener from
   * @param callback Callback to remove
   */
  removeListener(callback: (input: InputType) => void) {
    // Remove callback from the set
    this.listeners.delete(callback);
  }

  getHeldKey(): [InputType | null, number] {
    let longestHeldKey: InputType | null = null;
    let longestHeldTime: number = 0;

    this.keysHeld.forEach((value, key) => {
      if (value > longestHeldTime) {
        longestHeldKey = key;
        longestHeldTime = value;
      }
    });

    return [longestHeldKey, longestHeldTime];
  }

  update(deltaTime: number) {
    // Increase held time if there is a key being held
    this.keysHeld.forEach((value, key) => {
      this.keysHeld.set(key, value + deltaTime);
    });
  }
}
