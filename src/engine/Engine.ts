import {
  Camera,
  Input,
  RenderEngine,
  RenderLoop,
  Resources,
  Scene,
  Sizes,
} from ".";

import { Loader } from "./interface";
import { EventEmitter } from "./utilities";

/**
 * The main engine class. This is the entry point for the game, and is
 * responsible for creating and managing the game loop, as well as the
 * render loop.
 */
export class Engine extends EventEmitter {
  private static _instance: Engine;
  public static get instance() {
    return Engine._instance;
  }

  public readonly camera!: Camera;
  private _scene!: Scene;
  public get scene() {
    return this._scene;
  }

  public readonly renderEngine!: RenderEngine;
  public readonly time!: RenderLoop;
  public readonly sizes!: Sizes;
  public readonly canvas!: HTMLCanvasElement;
  public readonly resources!: Resources;
  private readonly loader!: Loader;
  public readonly input!: Input;

  constructor({
    canvas,
    startScene,
  }: {
    canvas: HTMLCanvasElement;
    startScene: typeof Scene;
  }) {
    super();

    if (!canvas) {
      throw new Error("No canvas provided");
    }

    // There should only be one engine
    if (Engine._instance) {
      throw new Error("Engine already instantiated");
    }

    this.canvas = canvas;
    // Make sure the canvas receives keyboard evnets
    this.canvas.setAttribute("tabindex", "0");

    this.sizes = new Sizes(this);
    this.time = new RenderLoop(this);
    this._scene = new startScene(this);
    this.camera = new Camera(this);
    this.renderEngine = new RenderEngine(this);
    this.resources = new Resources(this.scene.resources);
    this.loader = new Loader();
    this.input = new Input(this);

    // Set the engine atom to this engine
    Engine._instance = this;

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
  setScene(scene: typeof Scene) {
    // Destroy the old scene if it exists
    if (this._scene) {
      this._scene.destroy();
    }

    this._scene = new scene(this);
    this._scene.init();
    this.emit("sceneChanged", this._scene);
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
    this.input.update(delta);
  }

  resize() {
    this.camera.resize();
    this.renderEngine.resize();
    this.scene.resize();
  }
}
