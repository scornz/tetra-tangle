import * as THREE from "three";
import { Board } from "game/Board";
import { Experience } from "engine/Experience";
import { Resource } from "engine/Resources";
import { Engine } from "engine/Engine";
import { Tetromino, TetrominoType } from "game/objects/Tetromino";

export class MainScene implements Experience {
  resources: Resource[] = [];

  constructor(private engine: Engine) {}

  init() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );

    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;

    this.engine.scene.add(plane);
    this.engine.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.position.set(2, 2, 2);

    this.engine.scene.add(directionalLight);

    // const box = new Box();
    // box.castShadow = true;
    // box.rotation.y = Math.PI / 4;
    // box.position.set(0, 0.5, 0);

    // Add a keydown event listener to the canvas

    const board = new Board(
      this.engine,
      10,
      22,
      new THREE.Vector3(-4.5, 0, 0),
      true
    );
    board.initialize();

    this.engine.canvas.addEventListener(
      "keydown",
      (e) => {
        if (e.key == "j") {
          const tetromino = new Tetromino(this.engine, board, TetrominoType.I);

          // this.board.spawnTetromino();
        }

        if (e.key == "k") {
          const tetromino = new Tetromino(this.engine, board, TetrominoType.Z);

          // this.board.spawnTetromino();
        }
      },
      false
    );

    // this.engine.scene.add(box);
  }

  resize() {}

  update() {}
}
