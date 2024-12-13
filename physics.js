import RAPIER from '@dimforge/rapier3d-compat';
import { createNoise2D } from 'simplex-noise';

function createWorld() {
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 }); // Gravity downwards on the Y-axis
    createTerrain(world, 100, 50); // Create terrain with size 100x100 and 50x50 subdivisions
    return world;
}

function createTerrain(world, size, subdivisions) {
    const heights = new Float32Array((subdivisions + 1) * (subdivisions + 1));
    const noise = createNoise2D();

    for (let z = 0; z <= subdivisions; z++) {
        for (let x = 0; x <= subdivisions; x++) {
            const noiseValue = noise(x / 10, z / 10) * 5; // Adjust these parameters for the terrain you want
            heights[z * (subdivisions + 1) + x] = noiseValue;
        }
    }

    const scale = new RAPIER.Vector3(size, 1, size); // Scale the terrain appropriately
    console.log('Subdivisions:', subdivisions);
    console.log('Heights array:', heights);
    console.log('Terrain scale:', scale);

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

export { createWorld, createDynamicBody, updatePhysics, createTerrain };
