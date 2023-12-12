import * as THREE from "three";

import { Scene, GameEntity } from "engine";

import { lerp } from "three/src/math/MathUtils.js";

/**
 * A bar that represents the current progress to the next level. It is a scale
 * and the height will be changed.
 */
export class LevelBar extends GameEntity {
  progress: number = 0;
  bar: THREE.Object3D;

  constructor(
    scene: Scene,
    color: THREE.ColorRepresentation = 0xffffed,
    width: number = 1,
    private pos: THREE.Vector3,
    private maxHeight: number = 10
  ) {
    const container = new THREE.Object3D();

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(width, 1, width),
      new THREE.MeshStandardMaterial({
        toneMapped: false,
        color: color,
        emissive: color,
        emissiveIntensity: 0.8,
      })
    );

    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(width, maxHeight, width)),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
      })
    );

    box.position.copy(pos);
    outline.position.copy(pos);
    outline.position.y = pos.y + maxHeight / 2;

    box.scale.y = 0.04;
    container.add(box);
    container.add(outline);

    super(scene, container);

    this.bar = box;
  }

  /**
   * Set the current level progress.
   * @param progress A value between 0 and 1.
   */
  addProgress(progress: number) {
    this.progress += progress;
  }

  update(delta: number): void {
    // Set the scale and position of the bar.
    this.bar.scale.y = lerp(
      this.bar.scale.y,
      this.progress * this.maxHeight + 0.4,
      6 * delta
    );

    // Make it so bar always goes to the top

    if (this.bar.scale.y > this.maxHeight) {
      this.bar.scale.y = 0.4;
      this.progress -= 1;
    }

    // Update position of bar
    this.bar.position.y = this.pos.y + this.bar.scale.y / 2;
  }
}
