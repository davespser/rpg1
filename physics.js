import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d-compat';

let world;

export async function initPhysics() {
    // Inicializar RAPIER
    await RAPIER.init();
    // Crear el mundo de física con gravedad
    world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    console.log('Mundo de física inicializado:', world);
    return world;
}

export async function createTerrainRigidBody(terrainMesh, world) {
    if (!world) await initPhysics();

    const vertices = terrainMesh.geometry.attributes.position.array;
    const indices = terrainMesh.geometry.index.array;

    // Configurar el terreno como cuerpo fijo
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    world.createCollider(colliderDesc, rigidBody);

    console.log("Terreno configurado como cuerpo fijo.");
};
    

