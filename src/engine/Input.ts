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
  // The current key being held down
  private _keyHeld: InputType | null = null;
  get keyHeld() {
    return this._keyHeld;
  }
  // The amount of time the current key has been held down
  private _keyHeldTime: number = 0;
  get keyHeldTime() {
    return this._keyHeldTime;
  }
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

    // Update the held down key if there isn't anything right now
    if (this.keyHeld == null) {
      this._keyHeldTime = 0;
      this._keyHeld = input;
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (event.repeat) return;

    const key = event.code;
    const input = INPUT_MAP[key];
    if (input === undefined) return;

    // If we released the held key, change it
    if (this.keyHeld == input) {
      this._keyHeld = null;
      this._keyHeldTime = 0;
    }
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

  update(deltaTime: number) {
    // Increase held time if there is a key being held
    if (this.keyHeld != null) {
      this._keyHeldTime += deltaTime;
    } else {
      this._keyHeldTime = 0;
    }
  }
}
