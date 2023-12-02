import * as THREE from "three";
import { GameEntity } from "engine/GameEntity";
import { Engine } from "engine/Engine";

export class Cell extends GameEntity {
  constructor(engine: Engine, color: THREE.ColorRepresentation = 0xffffff) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: color })
    );

    super(engine, box);
  }
}
