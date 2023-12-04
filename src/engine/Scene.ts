import * as THREE from "three";
import { Entity } from "./Entity";
import { Resource } from "./Resources";
import { Engine } from "./Engine";

export class Scene extends THREE.Scene implements Entity {
  /**
   * All entities in the scene that need to be updated.
   */
  protected entities: Entity[] = [];

  resources: Resource[] = [];

  // Keep a reference to the engine
  constructor(public readonly engine: Engine) {
    super();
  }

  /**
   * Initialize the scene. Spawn all entities, etc.
   */
  init(): void {
    throw new Error("Method not implemented.");
  }

  /**
   * Add an entity to the scene, and also add the object to the scene if provided.
   */
  addEntity(entity: Entity, obj?: THREE.Object3D) {
    this.entities.push(entity);
    // If an object was provided, add that to the scene as well
    if (obj) {
      this.add(obj);
    }
  }

  update(delta: number) {
    // Update all entities in the scene
    for (const e of this.entities) {
      e.update(delta);
    }
  }

  resize(): void {}
}
