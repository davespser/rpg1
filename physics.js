import RAPIER from '@dimforge/rapier3d-compat';

// Initialize Rapier (this step might be crucial)
async function initRapier() {
    await RAPIER.init();
}

function createWorld() {
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    createTerrain(world);
    return world;
}

function createTerrain(world) {
    // Using a smaller grid for simplicity
    const subdivisions = 5;
    const size = 10;

    // Create a simple, flat heightfield
    const heights = new Float32Array((subdivisions + 1) * (subdivisions + 1));
    for (let z = 0; z <= subdivisions; z++) {
        for (let x = 0; x <= subdivisions; x++) {
            heights[z * (subdivisions + 1) + x] = 0; // Flat terrain
        }
    }

    const scale = new RAPIER.Vector3(size, 1, size);
    console.log('Subdivisions:', subdivisions);
    console.log('Heights array:', heights);
    console.log('Terrain scale:', scale);
    console.log('Rapier version:', RAPIER.version()); // Log Rapier version for debugging

    // Create collider for heightfield
    const heightfield = RAPIER.ColliderDesc.heightfield(subdivisions + 1, subdivisions + 1, heights, scale);
    try {
        world.createCollider(heightfield);
    } catch (error) {
        console.error('Error creating heightfield collider:', error);
    }
}

function createDynamicBody(world, position, size) {
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position.x, position.y, position.z);
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
    world.createCollider(colliderDesc, rigidBody);
    return rigidBody;
}

function updatePhysics(world, deltaTime) {
    world.step(deltaTime);
}

// Export functions after initialization
export async function initializeAndCreateWorld() {
    await initRapier();
    return createWorld();
}

export { createDynamicBody, updatePhysics, createTerrain };
