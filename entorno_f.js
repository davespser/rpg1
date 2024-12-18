import * as THREE from 'three';

/**
 * Añade varios edificios (cubos) consecutivos sobre el terreno.
 * @param {THREE.Scene} scene - La escena donde se añadirán los cubos.
 * @param {THREE.Mesh} terrainMesh - El terreno donde se posicionarán los cubos.
 */
export function addBuilding(scene, terrain) {
    if (!terrain) {
        console.error("El terreno no está definido. No se pueden agregar los edificios.");
        return;
    }

    // Crear la geometría y material del cubo (edificio)
    const geometry = new THREE.BoxGeometry(50, 60, 90); // Anchura, altura, profundidad
    const material = new THREE.MeshStandardMaterial({ color: 0x8B0000 });

    // Posiciones iniciales
    const x = -340; // Coordenada X
    const zStart = -140; // Coordenada Z inicial
    const zOffset = 75; // Distancia entre edificios en Z
    const numBuildings = 6; // Número total de edificios

    for (let i = 0; i < numBuildings; i++) {
        const building = new THREE.Mesh(geometry, material);

        // Habilitar sombras para cada edificio
        building.castShadow = true;
        building.receiveShadow = true;

        // Posicionar cada edificio
        const z = zStart + i * zOffset; // Incrementar Z en cada iteración
        const rotationY = THREE.MathUtils.degToRad(4 * i); //
        const terrainHeight = terrain.geometry.boundingBox
            ? terrain.geometry.boundingBox.max.y
            : -30; // Altura del terreno
        building.rotation.y = rotationY;
        building.position.set(x, terrainHeight + 50, z);
        scene.add(building);
       
        console.log(`Edificio ${i + 1} añadido en posición: x=${x}, y=${terrainHeight + 50}, z=${z}`);
    }
}
