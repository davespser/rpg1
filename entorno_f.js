import * as THREE from 'three';

/**
 * Añade un edificio (cubo) sobre el terreno.
 * @param {THREE.Scene} scene - La escena donde se añadirá el cubo.
 * @param {THREE.Mesh} terrainMesh - El terreno donde se posicionará el cubo.
 */
export function addBuilding(scene, terrain) {
    if (!terrain) {
        console.error("El terreno no está definido. No se puede agregar el edificio.");
        return;
    }

    // Crear la geometría y material del cubo (edificio)
    const geometry = new THREE.BoxGeometry(70, 60, 50); // Anchura, altura, profundidad
    const material = new THREE.MeshStandardMaterial({ color: 0x8B0000 });
    const building = new THREE.Mesh(geometry, material);

    // Habilitar sombras para el edificio
    building.castShadow = true;
    building.receiveShadow = true;

    // Posicionar el edificio en las coordenadas deseadas
    const x = -330; // Coordenada X
    const z = 100; // Coordenada Z
    const terrainHeight = terrain.geometry.boundingBox
        ? terrain.geometry.boundingBox.max.y
        : -30; // Altura del terreno en esa posición

    building.position.set(x, terrainHeight + 50, z); // Altura +50 para centrar el cubo
    scene.add(building);

    console.log(`Edificio añadido en posición: x=${x}, y=${terrainHeight + 50}, z=${z}`);
}
