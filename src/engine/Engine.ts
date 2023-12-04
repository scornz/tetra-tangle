import { RenderEngine } from "./RenderEngine";
import { RenderLoop } from "./RenderLoop";
import { DebugUI } from "./interface/DebugUI";
import { Sizes } from "./Sizes";
import { Camera } from "./Camera";
import { Resources } from "./Resources";
import { InfoConfig, InfoUI } from "./interface/InfoUI";
import { Loader } from "./interface/Loader";
import { Raycaster } from "./Raycaster";
import { Scene } from "./Scene";

export class Engine {
  public readonly camera!: Camera;
  private scene!: Scene;
  public readonly renderEngine!: RenderEngine;
  public readonly time!: RenderLoop;
  public readonly debug!: DebugUI;
  public readonly raycaster!: Raycaster;
  public readonly infoUI!: InfoUI;
  public readonly sizes!: Sizes;
  public readonly canvas!: HTMLCanvasElement;
  public readonly resources!: Resources;
  private readonly loader!: Loader;

  constructor({
    canvas,
    startScene,
    info,
  }: {
    canvas: HTMLCanvasElement;
    startScene: typeof Scene;
    info?: InfoConfig;
  }) {
    if (!canvas) {
      throw new Error("No canvas provided");
    }

    this.canvas = canvas;
    // Make sure the canvas receives keyboard evnets
    this.canvas.setAttribute("tabindex", "0");

    this.sizes = new Sizes(this);
    this.debug = new DebugUI();
    this.time = new RenderLoop(this);
    this.scene = new startScene(this);
    this.camera = new Camera(this);
    this.raycaster = new Raycaster(this);
    this.infoUI = new InfoUI(info);
    this.renderEngine = new RenderEngine(this);
    this.resources = new Resources(this.scene.resources);
    this.loader = new Loader();

    this.resources.on("loaded", () => {
      this.scene.init();
      this.loader.complete();
    });

    this.resources.on("progress", (progress: number) => {
      this.loader.setProgress(progress);
    });
  }

  /**
   * Change the active scene
   */
  setScene(scene: Scene) {
    this.scene = scene;
  }

  /**
    Returns the active scene.
   */
  activeScene() {
    return this.scene;
  }

  update(delta: number) {
    if (!this.loader.isComplete) return;

    this.camera.update();
    this.renderEngine.update();
    this.scene.update(delta);
    this.debug.update();
  }

  resize() {
    this.camera.resize();
    this.renderEngine.resize();
    this.scene.resize();
  }
}
