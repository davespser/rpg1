import RAPIER from '@dimforge/rapier3d-compat';
import { createNoise2D } from 'simplex-noise';
// Luego usa noise.noise2D(x, y) en lugar de createNoise2D()
function createWorld() {
    const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 }); // Gravedad hacia abajo en el eje Y
    createTerrain(world, 100, 50); // Crear terreno con tamaño 100x100 y 50x50 subdivisiones
    return world;
}

function createTerrain(world, size, subdivisions) {
    const heights = [];
    const noise = createNoise2D();

    for (let z = 0; z <= subdivisions; z++) {
        for (let x = 0; x <= subdivisions; x++) {
            const noiseValue = noise(x / 10, z / 10) * 5;
            heights.push(noiseValue);
            // Puedes descomentar la siguiente línea si necesitas ver cada valor de ruido
            // console.log(`Height at (${x}, ${z}):`, noiseValue);
        }
    }

    const scale = new RAPIER.Vector3(size, 1, size);
    console.log('Terrain scale:', scale);
    
    const heightfield = RAPIER.ColliderDesc.heightfield(subdivisions + 1, subdivisions + 1, heights, scale);
    world.createCollider(heightfield);
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

// Nota: La función `addGround` se ha eliminado ya que ahora usamos `createTerrain` para generar el suelo.

export { createWorld, createDynamicBody, updatePhysics, createTerrain };
