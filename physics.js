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

export function createTerrainRigidBody(terrainMesh, world) {
    if (!world) {
        console.error('Error: el mundo de física no está inicializado.');
        return;
    }

    // Extraer vértices e índices del terreno
    const vertices = terrainMesh.geometry.attributes.position.array;
    const indices = terrainMesh.geometry.index.array;

    // Configuración del colisionador como un mesh fijo
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed();
    const rigidBody = world.createRigidBody(rigidBodyDesc);

    // Crear colisionador
    world.createCollider(colliderDesc, rigidBody);

    console.log("Terreno configurado como cuerpo físico fijo.");
}

export function stepPhysics() {
    if (world) {
        world.step();
    }
}
