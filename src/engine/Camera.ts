import { Engine } from "./Engine";
import * as THREE from "three";
import { Entity } from "./Entity";

export class Camera implements Entity {
  public instance!: THREE.PerspectiveCamera;

  constructor(private engine: Engine) {
    this.initCamera();
  }

  private initCamera() {
    this.instance = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.instance.position.z = 15;
    this.instance.position.y = 2;
    //this.instance.rotation.y = Math.PI;
    this.engine.scene.add(this.instance);
  }

  resize() {
    this.instance.aspect = this.engine.sizes.aspectRatio;
    this.instance.updateProjectionMatrix();
  }

  update() {}
}
