import * as THREE from "three";

import { Entity } from "engine/Entity";
import { Engine } from "engine/Engine";

/**
 * An entity that needs a reference to the engine. Instatiating this will
 * automatically add this item to the scene.
 */
export class GameEntity implements Entity {
  protected obj!: THREE.Object3D;

  constructor(protected engine: Engine, obj?: THREE.Object3D) {
    // If no object was provided, simply create an empty object and that to the scene
    if (!obj) {
      this.obj = new THREE.Object3D();
    }
    // Add this object to the scene
    engine.scene.add(this.obj);
  }

  update(_delta: number): void {}
}
