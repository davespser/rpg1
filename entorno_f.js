import * as THREE from 'three';

/**
 * Añade un edificio (cubo) sobre el terreno.
 * @param {THREE.Scene} scene - La escena donde se añadirá el cubo.
 * @param {THREE.Mesh} terrainMesh - El terreno donde se posicionará el cubo.
 */
export function addBuilding(scene, terrainMesh) {
    if (!terrainMesh || !terrainMesh.position) {
        console.error("El terreno no está inicializado correctamente.");
        return;
    }

    // Obtener la posición del terreno
    const terrainPosition = terrainMesh.position;

    // Crear un cubo para representar el edificio
    const buildingGeometry = new THREE.BoxGeometry(10, 20, 10);
    const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);

    // Posicionar el cubo sobre el terreno
    building.position.set(
        terrainPosition.x, // Coordenada X del terreno
        terrainPosition.y + 10, // Elevarlo sobre el terreno
        terrainPosition.z  // Coordenada Z del terreno
    );

    building.castShadow = true; // Habilitar sombras
    building.receiveShadow = true;

    // Añadir el cubo a la escena
    scene.add(building);

    console.log("Edificio añadido en la posición:", building.position);
}
