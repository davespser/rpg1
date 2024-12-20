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
    if (!terrainMesh.geometry || !terrainMesh.geometry.attributes.position) {
        console.error("La geometría del terreno no es válida.");
        return;
    }

    // Extraer los vértices e índices de la geometría
    const vertices = terrainMesh.geometry.attributes.position.array;
    const indices = terrainMesh.geometry.index ? terrainMesh.geometry.index.array : null;

    if (!indices) {
        console.error("La geometría del terreno no tiene índices. No se puede crear un colisionador.");
        return;
    }

    // Ajustar la rotación en X (-90°) para coincidir con Three.js
    const rotationQuaternion = { x: Math.sqrt(0.5), y: 0, z: 0, w: Math.sqrt(0.5) };

    // Crear descripción del colisionador como un TriMesh
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices)
        .setFriction(0.8)        // Fricción para el terreno
        .setRestitution(0.1)     // Restitución (rebote mínimo)
        .setRotation(rotationQuaternion);

    // Configurar el cuerpo rígido fijo (estático)
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
        terrainMesh.position.x, terrainMesh.position.y +30, terrainMesh.position.z
    );

    // Crear el cuerpo físico y colisionador
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const collider = world.createCollider(colliderDesc, rigidBody);

    console.log("Colisionador del terreno creado:", collider);
    return { rigidBody, collider };
}

export function stepPhysics() {
    if (world) {
        world.step();
    }
}
