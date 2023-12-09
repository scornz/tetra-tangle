import * as THREE from "three";
import { Scene, Resource } from "engine";
import { Game } from "game";

export class MainScene extends Scene {
  resources: Resource[] = [];

  init() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );

    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    plane.receiveShadow = true;

    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(1, 20, 1),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    leftWall.position.x = -5.5;
    leftWall.position.y = 9.5;
    leftWall.castShadow = true;

    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(1, 20, 1),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    rightWall.position.x = 5.5;
    rightWall.position.y = 9.5;
    rightWall.castShadow = true;

    this.add(plane);
    this.add(leftWall);
    this.add(rightWall);
    this.add(new THREE.AmbientLight(0xffffff, 0.5));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.position.set(2, 2, 2);

    this.add(directionalLight);

    const game = new Game(this);
  }
}
