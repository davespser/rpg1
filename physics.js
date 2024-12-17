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
    const vertices = terrainMesh.geometry.attributes.position.array;
    const indices = terrainMesh.geometry.index.array;

    // Crear descripción del colisionador
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices)
        .setFriction(0.8)        // Añadir fricción
        .setRestitution(0.1);    // Añadir restitución (rebote)

    // Configurar el cuerpo rígido estático
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
        terrainMesh.position.x, terrainMesh.position.y, terrainMesh.position.z
    );

    // Crear el cuerpo rígido y colisionador
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const collider = world.createCollider(colliderDesc, rigidBody);

    console.log("Terreno físico configurado correctamente:", collider);

    // Opcional: Añadir eventos de contacto
    collider.setSensor(false); // Asegúrate de que no sea un sensor
}

    
export function stepPhysics() {
    if (world) {
        world.step();
    }
}
