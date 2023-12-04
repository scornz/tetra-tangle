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

export class Input {
  // The current keys being held down
  private keysHeld: Map<InputType, number> = new Map<InputType, number>();
  // All listeners on input
  private listeners: Set<(input: InputType) => void> = new Set<() => void>();

  constructor(engine: Engine) {
    // Process keyboard down and up events
    engine.canvas.addEventListener("keydown", this.handleKeyDown.bind(this));
    engine.canvas.addEventListener("keyup", this.handleKeyUp.bind(this));
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
