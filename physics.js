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

    // Extraer vértices e índices del terreno
    const vertices = terrainMesh.geometry.attributes.position.array;
    const indices = terrainMesh.geometry.index.array;

    // Crear cuerpo físico fijo
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
        .setTranslation(terrainMesh.position.x, terrainMesh.position.y, terrainMesh.position.z)
        .setRotation({ x: terrainMesh.rotation.x, y: terrainMesh.rotation.y, z: terrainMesh.rotation.z });

    const rigidBody = world.createRigidBody(rigidBodyDesc);

    // Crear colisionador con la malla
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
    world.createCollider(colliderDesc, rigidBody);

    console.log("Terreno configurado como cuerpo físico fijo con rotación.");

    // Helper visual para depuración
    const helperMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    const helperGeometry = terrainMesh.geometry.clone();
    const helperMesh = new THREE.Mesh(helperGeometry, helperMaterial);

    // Asegurar que el helper tenga la misma rotación y posición que el terreno
    helperMesh.position.copy(terrainMesh.position);
    helperMesh.rotation.copy(terrainMesh.rotation);
    helperMesh.scale.copy(terrainMesh.scale);
    terrainMesh.parent.add(helperMesh);

    console.log("Helper visual del colisionador añadido.");
}

export function stepPhysics() {
    if (world) {
        world.step();
    }
}
