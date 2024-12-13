import RAPIER from '@dimforge/rapier3d-compat';
 // Variable para almacenar el módulo RAPIER después de la inicialización

function createWorld() {
    return new RAPIER.World({ x: 0, y: -9.81, z: 0 }); // Gravedad hacia abajo en el eje Y
}

function addGround(world) {
    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10, 0.1, 10);
    world.createCollider(groundColliderDesc);
}

function createDynamicBody(world, position, size) {
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position.x, position.y, position.z);
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
    world.createCollider(colliderDesc, rigidBody);
    return rigidBody;
}

function updatePhysics(world) {
    world.step();
}

export { createWorld, addGround, createDynamicBody, updatePhysics };
