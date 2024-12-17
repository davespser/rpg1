import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

let world;

export async function initPhysics() {
    // Inicializar RAPIER
    await RAPIER.init();
    world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    console.log('Mundo de física inicializado:', world);
    return world;
}

export function createTerrainRigidBody(terrainMesh, world) {
    if (!world) {
        console.error('Error: el mundo de física no está inicializado.');
        return;
    }

    // Extraer los vértices e índices del mesh del terreno
    const vertices = terrainMesh.geometry.attributes.position.array;
    const indices = terrainMesh.geometry.index.array;

    // Crear el colisionador trimesh para el terreno
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);

    // Crear el cuerpo rígido para el terreno (fijo)
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
        terrainMesh.position.x, terrainMesh.position.y, terrainMesh.position.z
    );

    const rigidBody = world.createRigidBody(rigidBodyDesc);

    // Asignar el colisionador al cuerpo rígido
    world.createCollider(colliderDesc, rigidBody);

    console.log("Terreno físico configurado correctamente.");
}

export function stepPhysics() {
    if (world) {
        world.step();
    }
}
