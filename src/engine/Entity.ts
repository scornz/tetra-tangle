/**
 * An object that exists in the game. Receives update() calls which are called
 * every frame with the time elapsed since last frame.
 */
export interface Entity {
  update(delta: number): void;
  resize?(): void;
  destroy?(): void;
}
