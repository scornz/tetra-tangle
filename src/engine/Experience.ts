import { Entity } from "./Entity";
import { Engine } from "./Engine";
import { Resource } from "./Resources";

export type ExperienceConstructor = new (engine: Engine) => Experience;
export interface Experience extends Entity {
  init(): void;
  resources: Resource[];
}
