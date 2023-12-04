import * as THREE from "three";
import { GameEntity } from "engine/GameEntity";
import { Engine } from "engine/Engine";
import { Scene } from "engine/Scene";

export class Cell extends GameEntity {
  constructor(
    scene: Scene,
    color: THREE.ColorRepresentation = 0xffffff,
    opacity = 1
  ) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: color,
        opacity: opacity,
        transparent: true,
      })
    );

    super(scene, box);
  }
}
