import * as THREE from 'three';

/**
 * Carga una textura desde una URL.
 * @param {string} texturePath - Ruta de la textura.
 * @returns {Promise<THREE.Texture>} Promesa que resuelve con la textura cargada.
 */
export function loadTexture(texturePath) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(
            texturePath,
            (texture) => {
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                resolve(texture);
            },
            undefined,
            (err) => reject(new Error(`Error al cargar la textura: ${texturePath}\n${err.message}`))
        );
    });
}

/**
 * Crea un terreno basado en un heightmap y una textura.
 * @param {ImageData} imageData - Datos del mapa de altura.
 * @param {THREE.Texture} texture - Textura para aplicar al terreno.
 * @returns {THREE.Mesh} El Mesh del terreno.
 */
export function createTerrain(imageData, texture) {
    const width = imageData.width;
    const height = imageData.height;
    const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);

    // Aplicar los datos del mapa de altura a los vértices
    const vertices = geometry.attributes.position.array;
    for (let i = 0, j = 0; i < vertices.length; i += 3, j++) {
        vertices[i + 2] = imageData.data[j * 4] / 255 * 20; // Escalar la altura
    }

    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });

    const terrainMesh = new THREE.Mesh(geometry, material);
    terrainMesh.rotation.x = -Math.PI / 2;

    return terrainMesh;
}

/**
 * Crea un colisionador para el terreno utilizando los vértices e índices de su geometría.
 * @param {THREE.Mesh} terrainMesh - Malla del terreno.
 * @param {RAPIER.World} world - Mundo físico de Rapier.
 */
export function createTerrainRigidBody(terrainMesh, world) {
    if (!terrainMesh.geometry) {
        console.error("El terreno no tiene geometría.");
        return;
    }

    // Obtener los vértices e índices del terreno
    const geometry = terrainMesh.geometry;
    geometry.computeBoundingBox(); // Asegurarse de que las cajas de límites están calculadas

    const vertices = Array.from(geometry.attributes.position.array);
    const indices = Array.from(geometry.index.array);

    // Crear el colisionador como un mesh
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices)
        .setFriction(0.8)        // Fricción para el terreno
        .setRestitution(0.1);    // Restitución (rebote mínimo)

    // Aplicar la posición y rotación del terreno al colisionador
    const terrainPosition = terrainMesh.position;
    const terrainRotation = terrainMesh.quaternion;

    colliderDesc.setTranslation(terrainPosition.x, terrainPosition.y, terrainPosition.z);
    colliderDesc.setRotation({ x: terrainRotation.x, y: terrainRotation.y, z: terrainRotation.z, w: terrainRotation.w });

    // Añadir el colisionador al mundo físico
    world.createCollider(colliderDesc);
    console.log("Colisionador de terreno creado correctamente.");
}
