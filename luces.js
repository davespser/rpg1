import * as THREE from 'three';

export function crearLuces(scene) {
    // Luz ambiental
    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.5); // Luz tenue para iluminar todo
    scene.add(luzAmbiental);

    // Luz direccional
    const luzDireccional = new THREE.DirectionalLight(0xffffff, 1); // Luz fuerte desde una dirección
    luzDireccional.position.set(10, 10, 10); // Posición de la luz
    luzDireccional.castShadow = true; // Permitir sombras
    scene.add(luzDireccional);

    // Opcional: Luz puntual (ilumina desde un punto específico)
    const luzPuntual = new THREE.PointLight(0xff0000, 1, 100); // Luz roja puntual
    luzPuntual.position.set(5, 10, 5);
    scene.add(luzPuntual);

    return { luzAmbiental, luzDireccional, luzPuntual };
}
