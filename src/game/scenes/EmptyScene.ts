import { Scene, Resource } from "engine";

/**
 * An empty scene. Useful for loading screens, etc.
 */
export class EmptyScene extends Scene {
  resources: Resource[] = [];

  init() {}
}
