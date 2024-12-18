import * as THREE from 'three';

/**
 * Añade varios edificios y grupos de edificios sobre el terreno.
 * @param {THREE.Scene} scene - La escena donde se añadirán los edificios.
 * @param {THREE.Mesh} terrain - El terreno donde se posicionarán los edificios.
 */
export function addBuildings(scene, terrain) {
    if (!terrain) {
        console.error("El terreno no está definido. No se pueden agregar los edificios.");
        return;
    }

    // Crear geometría y material base
    const geometry = new THREE.BoxGeometry(100, 60, 85); // Anchura, altura, profundidad
    
    // **Primer grupo de 6 edificios consecutivos**
    const group1 = new THREE.Group();
    const x1 = -340; // Coordenada X
    const zStart1 = -40; // Coordenada Z inicial
    const zOffset1 = 91; // Distancia entre edificios en Z

    // Material específico para el primer grupo
    const materialGroup1 = new THREE.MeshStandardMaterial({ color: 0x8B0000 }); // Rojo oscuro

    for (let i = 0; i < 6; i++) {
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(100, 60, 85), // Geometría
            materialGroup1
        );
        building.castShadow = true;
        building.receiveShadow = true;
    // **Segundo grupo de 2 edificios**
    const group2 = new THREE.Group();
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
    const x2 = -350; // Coordenada X
    const zStart2 = 10; // Coordenada Z inicial
    const zOffset2 = 80; // Distancia entre edificios en Z

    // Material específico para el segundo grupo
    const materialGroup2 = new THREE.MeshStandardMaterial({ color: 0x00008B }); // Azul oscuro

    for (let i = 0; i < 2; i++) {
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(100, 60, 85), // Geometría
            materialGroup2
        );
        building.castShadow = true;
        building.receiveShadow = true;

        const z = zStart2 + i * zOffset2;
        const terrainHeight = terrain.geometry.boundingBox
            ? terrain.geometry.boundingBox.max.y
            : -30;

        building.position.set(x2, terrainHeight + 50, z);
        group2.add(building);
    }

    group2.rotation.y = THREE.MathUtils.degToRad(90); // Rotar el grupo 90 grados en Y
    scene.add(group2);

    console.log("Segundo grupo de edificios añadido.");
    // **Edificio suelto con escala personalizada**
    // **Edificio suelto con escala personalizada**
    const singleBuilding = new THREE.Mesh(
        new THREE.BoxGeometry(100, 60, 85), // Geometría
        new THREE.MeshStandardMaterial({ color: 0x228B22 }) // Verde oscuro
    );
    singleBuilding.castShadow = true;
    singleBuilding.receiveShadow = true;

    const x3 = -290; // Coordenada X
    const z3 = 60; // Coordenada Z
    const terrainHeight = terrain.geometry.boundingBox
        ? terrain.geometry.boundingBox.max.y
        : -30;

    singleBuilding.position.set(x3, terrainHeight + 15, z3);

    // Escala personalizada para el edificio suelto
    const customScale = new THREE.Vector3(1, 1, 6); // Escala en X, Y, Z
    singleBuilding.scale.copy(customScale);

    scene.add(singleBuilding);

    console.log(
        `Edificio suelto añadido en posición: x=${x3}, y=${terrainHeight + 15}, z=${z3} con escala: ${customScale.x}, ${customScale.y}, ${customScale.z}.`
    );
}
