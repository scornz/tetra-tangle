import { WebGLRenderer } from "three";
import { Engine } from "./Engine";
import * as THREE from "three";
import { Entity } from "./Entity";

// Explicity import from postprocessing stack
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { Scene } from "engine";

export class RenderEngine implements Entity {
  private readonly renderer: WebGLRenderer;
  composer: EffectComposer;
  private pass: RenderPass;

  constructor(private engine: Engine) {
    this.renderer = new WebGLRenderer({
      canvas: this.engine.canvas,
      antialias: true,
    });

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.toneMappingExposure = 1.75;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor("#000000");
    this.renderer.setSize(this.engine.sizes.width, this.engine.sizes.height);
    this.renderer.setPixelRatio(Math.min(this.engine.sizes.pixelRatio, 2));

    this.composer = new EffectComposer(this.renderer);
    this.pass = new RenderPass(this.engine.scene, this.engine.camera.instance);
    this.composer.addPass(this.pass);

    engine.on("sceneChanged", (newScene: Scene) => {
      this.pass.scene = newScene;
    });
  }

  update() {
    this.composer.render();
  }

  resize() {
    this.renderer.setSize(this.engine.sizes.width, this.engine.sizes.height);
    this.composer.setSize(this.engine.sizes.width, this.engine.sizes.height);
    this.composer.render();
  }
}
