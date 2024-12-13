import RAPIER from '@dimforge/rapier3d-compat';

// Función para crear el mundo físico
function createWorld() {
    const gravity = { x: 0, y: -9.81, z: 0 }; // Gravedad en el eje Y, similar a la Tierra
    return new RAPIER.World(gravity);
}

// Función para agregar un terreno geométrico simple (pendiente descendente)
function addTerrain(world) {
    // Dimensiones del terreno
    const width = 10;
    const depth = 10;

    // Generamos una matriz de alturas simple para una pendiente descendente
    const heights = [];
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < depth; j++) {
            heights.push(-i/width); // Una pendiente descendente en el eje X
        }
    }

    const scale = { x: 1, y: 1, z: 1 }; // Escala del terreno
    const terrainColliderDesc = RAPIER.ColliderDesc.heightfield(
        new Float32Array(heights),
        width,
        depth,
        scale
    );

    world.createCollider(terrainColliderDesc);
}

// Crear un cuerpo dinámico (por ejemplo, una caja)
function createDynamicBody(world, position, size) {
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position.x, position.y, position.z);
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    
    const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
    world.createCollider(colliderDesc, rigidBody);
    
    return rigidBody;
}

// Actualización del mundo físico
function updatePhysics(world, deltaTime = 1 / 60) {
    world.step(deltaTime);
}

export { createWorld, addTerrain, createDynamicBody, updatePhysics };
