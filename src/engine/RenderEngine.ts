import { WebGLRenderer } from "three";
import { Engine } from "./Engine";
import * as THREE from "three";
import { Entity } from "./Entity";

import {
  BlendFunction,
  BloomEffect,
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";
import { Scene } from "engine";
import { lerp } from "three/src/math/MathUtils.js";

/**
 * The render engine is responsible for rendering the game scene, and
 * handling any post-processing effects.
 */
export class RenderEngine implements Entity {
  private readonly renderer: WebGLRenderer;
  composer: EffectComposer;
  private pass: RenderPass;
  private chromaticOffset: THREE.Vector2 = new THREE.Vector2(0, 0);

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

    this.composer = new EffectComposer(this.renderer, {
      // Allow for HDR colors (selective bloom)
      frameBufferType: THREE.FloatType,
    });
    this.pass = new RenderPass(this.engine.scene, this.engine.camera.instance);
    this.composer.addPass(this.pass);
    this.composer.addPass(
      new EffectPass(
        this.engine.camera.instance,
        new BloomEffect({
          blendFunction: BlendFunction.ADD,
          mipmapBlur: true,
          // Only colors in HDR will be bloomed
          luminanceThreshold: 1.0,
          luminanceSmoothing: 0.2,
          intensity: 2.0,
        })
      )
    );
    this.composer.addPass(
      new EffectPass(
        this.engine.camera.instance,
        new ChromaticAberrationEffect({
          radialModulation: true,
          modulationOffset: 0.15,
          offset: this.chromaticOffset,
        })
      )
    );

    engine.on("sceneChanged", (newScene: Scene) => {
      this.pass.mainScene = newScene;
    });
  }

  update(delta: number) {
    this.composer.render();

    // Slowly move the chromatic offset back to 0
    this.chromaticOffset.set(
      lerp(this.chromaticOffset.x, 0, delta * 3),
      lerp(this.chromaticOffset.y, 0, delta * 3)
    );
  }

  resize() {
    this.renderer.setSize(this.engine.sizes.width, this.engine.sizes.height);
    this.composer.setSize(this.engine.sizes.width, this.engine.sizes.height);
    this.composer.render();
  }

  /**
   * "Punch" the render engine with a chromatic offset. This is used to show
   * emphasis and feedback to the user.
   */
  punch(amount: number) {
    this.chromaticOffset.set(0.005 * amount, 0.005 * amount);
  }
}
