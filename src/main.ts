import "./style.scss";
import { Engine } from "engine/Engine";
import { MainScene } from "game/scenes/MainScene";

new Engine({
  canvas: document.querySelector("#canvas") as HTMLCanvasElement,
  startScene: MainScene,
});
