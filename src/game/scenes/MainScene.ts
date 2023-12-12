import * as THREE from "three";

import { Scene, Resource } from "engine";

import { Game } from "game";

/**
 * The main scene of the game. This is where the game is played.
 */
export class MainScene extends Scene {
  resources: Resource[] = [];

  init() {
    // Create basic geometry of the level
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(12, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    floor.position.y = -1;

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

    // Add all to the scene, including basic lighting
    this.add(floor);
    this.add(leftWall);
    this.add(rightWall);
    this.add(new THREE.AmbientLight(0xffffff, 0.5));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.position.set(2, 2, 2);

    this.add(directionalLight);

    // Create new game attached to this scene
    // This will create a board, preview, and hold, and manage the game completely
    new Game(this);
  }
}
