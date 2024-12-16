import * as THREE from 'three';
export function setupAnimation(model, mixer) {
  const animations = model.animations;
  if (animations.length > 0) {
    mixer.clipAction(animations[0]).play();
  }

  return mixer;
}
