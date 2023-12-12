import * as THREE from "three";
import { GameEntity } from "engine/GameEntity";
import { Scene } from "engine/Scene";

/**
 * A single cell in the game board. This is a simple cube with a color, and
 * some sort of emission. This is used to represent a tetromino that has been
 * dropped, is dropping, or is in the hold or preview sections.
 */
export class Cell extends GameEntity {
  material: THREE.MeshStandardMaterial;

  constructor(
    scene: Scene,
    color: THREE.ColorRepresentation = 0xffffff,
    opacity = 1
  ) {
    const material = new THREE.MeshStandardMaterial({
      toneMapped: false,
      color: color,
      opacity: opacity,
      transparent: true,
      emissive: color,
    });
    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

    super(scene, box);
    this.material = material;
  }
}
