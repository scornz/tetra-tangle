import * as THREE from "three";
import { GameEntity } from "engine/GameEntity";
import { Scene } from "engine/Scene";
import { lerp } from "three/src/math/MathUtils.js";

/**
 * A bar that represents the current progress to the next level. It is a scale
 * and the height will be changed.
 */
export class LevelBar extends GameEntity {
  progress: number = 0;

  constructor(
    scene: Scene,
    color: THREE.ColorRepresentation = 0xffff00,
    width: number = 1,
    private pos: THREE.Vector3,
    private maxHeight: number = 10
  ) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(width, 1, width),
      new THREE.MeshStandardMaterial({
        color: color,
      })
    );

    box.position.copy(pos);
    box.scale.y = 0.01;

    super(scene, box);
  }

  /**
   * Set the current level progress.
   * @param progress A value between 0 and 1.
   */
  setProgress(progress: number) {
    this.progress = progress;
  }

  update(delta: number): void {
    // Set the scale and position of the bar.
    this.obj.scale.y = lerp(
      this.obj.scale.y,
      this.progress * this.maxHeight + 0.01,
      3 * delta
    );
    this.obj.position.y = this.pos.y + this.obj.scale.y / 2;
  }
}
