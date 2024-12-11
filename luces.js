import * as THREE from 'three';

export function crearLuces(scene) {
    // Luz ambiental
    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(luzAmbiental);

    // Luz direccional
    const luzDireccional = new THREE.DirectionalLight(0xffffff, 1);
}
