import * as THREE from "three";

import { Entity } from "engine/Entity";
import { Scene } from "./Scene";

/**
 * An entity that needs a reference to the engine. Instatiating this will
 * automatically add this item to the scene.
 */
export class GameEntity implements Entity {
  public obj!: THREE.Object3D;

  constructor(protected scene: Scene, obj?: THREE.Object3D) {
    // If no object was provided, simply create an empty object and that to the scene
    if (!obj) {
      this.obj = new THREE.Object3D();
    } else {
      this.obj = obj;
    }

    // Add this object to the scene
    scene.addEntity(this, this.obj);
  }

  update(_delta: number): void {}
}
