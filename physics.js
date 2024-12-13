import RAPIER from '@dimforge/rapier3d-compat';

// Función para crear el mundo físico
function createWorld() {
    return new RAPIER.World({ x: 0, y: -9.81, z: 0 }); // Gravedad en el eje Y
}

// Función para agregar un terreno geométrico
function addTerrain(world) {
    // Dimensiones del terreno
    const width = 10;
    const depth = 10;

    // Alturas del terreno (puedes generar dinámicamente o usar ruido)
    const heights = [
        0, 0, 0, 1, 1, 0, 0, 0, 1, 0,
        0, 1, 2, 3, 2, 1, 0, 0, 1, 0,
        // ...
        // Asegúrate de definir los valores necesarios para cubrir toda la rejilla.
    ];

    const scale = { x: 1, y: 1, z: 1 }; // Escala del terreno
    const terrainColliderDesc = RAPIER.ColliderDesc.heightfield(
        heights,
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
function updatePhysics(world) {
    world.step();
}

export { createWorld, addTerrain, createDynamicBody, updatePhysics };
