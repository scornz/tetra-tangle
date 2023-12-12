import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EventEmitter } from "./utilities/EventEmitter";

export type Resource =
  | {
      name: string;
      type: Exclude<AssetType, "cubeTexture">;
      path: string;
    }
  | {
      name: string;
      type: "cubeTexture";
      path: string[];
    };

type AssetType = "gltf" | "texture" | "cubeTexture";

type Loaders = {
  gltf: GLTFLoader;
  texture: THREE.TextureLoader;
  cubeTexture: THREE.CubeTextureLoader;
};

/**
 * The resources class is responsible for loading all of the assets that
 * the game will need. This includes 3D models, textures, and audio. It is
 * currently unused, but will be used in the future.
 */
export class Resources extends EventEmitter {
  private loadingManager = new THREE.LoadingManager(
    () => {
      this.emit("loaded");
    },
    // @ts-ignore
    (url: string, item: number, total: number) => {
      this.emit("progress", item / total);
    },
    (url: string) => {
      console.error(`Failed to load ${url}`);
    }
  );
  private loaders!: Loaders;
  // @ts-ignore - This is populated by the loaders
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public items: Record<string, any> = {};

  constructor(private readonly resources: Resource[]) {
    super();
    this.initLoaders();
    this.load();
  }

  private initLoaders() {
    this.loaders = {
      gltf: new GLTFLoader(this.loadingManager),
      texture: new THREE.TextureLoader(this.loadingManager),
      cubeTexture: new THREE.CubeTextureLoader(this.loadingManager),
    };
  }

  getItem(name: string) {
    const item = this.items[name];
    if (!item) {
      throw new Error(`Resource ${name} not found`);
    }
    return item;
  }

  load() {
    if (this.resources.length === 0) {
      setTimeout(() => {
        this.emit("loaded");
      });
    }

    for (const resource of this.resources) {
      switch (resource.type) {
        case "gltf":
          this.loaders.gltf.load(
            resource.path,
            (file) => (this.items[resource.name] = file)
          );
          break;
        case "texture":
          this.loaders.texture.load(
            resource.path,
            (file) => (this.items[resource.name] = file)
          );
          break;
        case "cubeTexture":
          this.loaders.cubeTexture.load(
            resource.path,
            (file) => (this.items[resource.name] = file)
          );
          break;
      }
    }
  }
}
