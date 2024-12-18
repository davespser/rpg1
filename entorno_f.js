import * as THREE from 'three';

/**
 * Añade varios edificios y grupos de edificios sobre el terreno.
 * @param {THREE.Scene} scene - La escena donde se añadirán los edificios.
 * @param {THREE.Mesh} terrain - El terreno donde se posicionarán los edificios.
 */
export function addBuilding(scene, terrain) {
    if (!terrain) {
        console.error("El terreno no está definido. No se pueden agregar los edificios.");
        return;
    }

    // Crear geometría y material base
    const geometry = new THREE.BoxGeometry(100, 60, 85); // Anchura, altura, profundidad
    const material = new THREE.MeshStandardMaterial({ color: 0x8B0000 });

    // **Primer grupo de 6 edificios consecutivos**
    const group1 = new THREE.Group();
    const x1 = -340; // Coordenada X
    const zStart1 = -140; // Coordenada Z inicial
    const zOffset1 = 91; // Distancia entre edificios en Z

    for (let i = 0; i < 6; i++) {
        const building = new THREE.Mesh(geometry, material);
        building.castShadow = true;
        building.receiveShadow = true;

        const z = zStart1 + i * zOffset1;
        const terrainHeight = terrain.geometry.boundingBox
            ? terrain.geometry.boundingBox.max.y
            : -30;

        building.position.set(x1, terrainHeight + 50, z);
        group1.add(building);
    }

    group1.rotation.y = THREE.MathUtils.degToRad(-3.5);
    scene.add(group1);

    console.log("Primer grupo de edificios añadido.");

    // **Segundo grupo de 2 edificios**
    const group2 = new THREE.Group();
    const x2 = 130; // Coordenada X
    const zStart2 = 340; // Coordenada Z inicial
    const zOffset2 = 120; // Distancia entre edificios en Z

    for (let i = 0; i < 2; i++) {
        const building = new THREE.Mesh(geometry, material);
        building.castShadow = true;
        building.receiveShadow = true;

        const z = zStart2 + i * zOffset2;
        const terrainHeight = terrain.geometry.boundingBox
            ? terrain.geometry.boundingBox.max.y
            : -30;

        building.position.set(x2, terrainHeight + 50, z);
        group2.add(building);
    }

    group2.rotation.y = THREE.MathUtils.degToRad(90); // Rotar el grupo 10 grados en Y
    scene.add(group2);

    console.log("Segundo grupo de edificios añadido.");

    // **Edificio suelto**
    const singleBuilding = new THREE.Mesh(geometry, material);
    singleBuilding.castShadow = true;
    singleBuilding.receiveShadow = true;

    const x3 = 200; // Coordenada X
    const z3 = -300; // Coordenada Z
    const terrainHeight = terrain.geometry.boundingBox
        ? terrain.geometry.boundingBox.max.y
        : -30;

    singleBuilding.position.set(x3, terrainHeight + 50, z3);
    scene.add(singleBuilding);

    console.log("Edificio suelto añadido.");
}
