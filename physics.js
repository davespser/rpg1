import RAPIER from '@dimforge/rapier3d-compat';
let world;

export async function initPhysics() {
    await RAPIER.init();
    world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    console.log('world después de creación en initPhysics:', world);
    return world;
}
}

export async function createTerrainRigidBody(terrainMesh) {
    if (!world) await initPhysics();

    const vertices = terrainMesh.geometry.attributes.position.array;
    const indices = terrainMesh.geometry.index.array;

    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
    const rigidBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
    world.createCollider(colliderDesc, rigidBody);
}

export function stepPhysics() {
    if (world) world.step();
}
