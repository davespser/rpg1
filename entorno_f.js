import * as THREE from 'three';

/**
 * Añade varios edificios (cubos) consecutivos sobre el terreno y rota el grupo.
 * @param {THREE.Scene} scene - La escena donde se añadirá el grupo de cubos.
 * @param {THREE.Mesh} terrainMesh - El terreno donde se posicionará el grupo.
 */
export function addBuilding(scene, terrain) {
    if (!terrain) {
        console.error("El terreno no está definido. No se pueden agregar los edificios.");
        return;
    }

    // Crear el grupo de cubos
    const buildingGroup = new THREE.Group();

    // Crear la geometría y material del cubo (edificio)
    const geometry = new THREE.BoxGeometry(100, 60, 85); // Anchura, altura, profundidad
    const material = new THREE.MeshStandardMaterial({ color: 0x8B0000 });

    // Posiciones iniciales
    const x = -340; // Coordenada X
    const zStart = -140; // Coordenada Z inicial
    const zOffset = 91; // Distancia entre edificios en Z
    const numBuildings = 6; // Número total de edificios

    for (let i = 0; i < numBuildings; i++) {
        const building = new THREE.Mesh(geometry, material);

        // Habilitar sombras para cada edificio
        building.castShadow = true;
        building.receiveShadow = true;

        // Posicionar cada edificio
        const z = zStart + i * zOffset; // Incrementar Z en cada iteración
        const terrainHeight = terrain.geometry.boundingBox
            ? terrain.geometry.boundingBox.max.y
            : -30; // Altura del terreno

        building.position.set(x, terrainHeight + 50, z);
        buildingGroup.add(building); // Añadir el edificio al grupo
    }

    // Rotar el grupo completo 2 grados en el eje Y
    const rotationY = THREE.MathUtils.degToRad(-3.5); // Convertir grados a radianes
    buildingGroup.rotation.y = rotationY;

    // Añadir el grupo a la escena
    scene.add(buildingGroup);

    console.log(`Grupo de edificios añadido con rotación Y=2°.`);
}
