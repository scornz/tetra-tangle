import { Camera, Engine } from "engine";
import * as THREE from "three";

/**
 * All sound effects that we want to load into the game. This is a map of
 * sound name to path.
 */
export const ALL_SOUND_EFFECTS = {
  btb_1: "audio/btb_1.mp3",
  btb_2: "audio/btb_2.mp3",
  btb_3: "audio/btb_3.mp3",
  btb_break: "audio/btb_break.mp3",
  clearline: "audio/clearline.mp3",
  clearquad: "audio/clearquad.mp3",
  combo_1: "audio/combo_1.mp3",
  combo_2: "audio/combo_2.mp3",
  combo_3: "audio/combo_3.mp3",
  combo_4: "audio/combo_4.mp3",
  combo_5: "audio/combo_5.mp3",
  combo_6: "audio/combo_6.mp3",
  combo_7: "audio/combo_7.mp3",
  combo_8: "audio/combo_8.mp3",
  combo_9: "audio/combo_9.mp3",
  combo_10: "audio/combo_10.mp3",
  combo_11: "audio/combo_11.mp3",
  combo_12: "audio/combo_12.mp3",
  combo_13: "audio/combo_13.mp3",
  combo_14: "audio/combo_14.mp3",
  combo_15: "audio/combo_15.mp3",
  combo_16: "audio/combo_16.mp3",
  harddrop: "audio/harddrop.mp3",
  hold: "audio/hold.mp3",
  move: "audio/move.mp3",
  rotate: "audio/rotate.mp3",
  topout: "audio/topout.mp3",
};

/**
 * Audio manager that will load and play sound effects upon request.
 */
export class Audio extends THREE.AudioListener {
  buffers: Map<string, AudioBuffer> = new Map();

  constructor(_engine: Engine, camera: Camera) {
    super();
    camera.instance.add(this);

    for (const [title, path] of Object.entries(ALL_SOUND_EFFECTS)) {
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load(path, (buffer: AudioBuffer) => {
        this.buffers.set(title, buffer);
      });
    }
  }

  play(name: string, volume: number = 0.5) {
    const sound = new THREE.Audio(this);
    const buffer = this.buffers.get(name);
    if (!buffer) {
      // Throw an error if we can't find this sound
      throw new Error(`No sound loaded for sound ${name}.`);
    }

    // Play the new sound
    sound.setBuffer(buffer);
    sound.setVolume(volume);
    sound.play();
  }
}
