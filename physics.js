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

export async function createTerrainRigidBody(terrainMesh) {
    if (!world) await initPhysics();

    // Ajusta la posición y escala del colisionador
    const scale = new THREE.Vector3(1, 1, 1);  // Ajusta la escala del colisionador si es necesario
    terrainMesh.scale.set(scale.x, scale.y, scale.z); // Escala del terreno visual

    // Aquí puedes modificar la posición si el terreno tiene una posición diferente
    const posX = terrainMesh.position.x;
    const posY = terrainMesh.position.y;
    const posZ = terrainMesh.position.z;

    // Obtener los vértices del terreno
    const vertices = terrainMesh.geometry.attributes.position.array;
    const indices = terrainMesh.geometry.index.array;

    // Crear el colisionador tipo 'trimesh'
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);

    // Crear el cuerpo rígido del terreno (fijo)
    const rigidBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(posX, posY, posZ));

    // Crear el colisionador y asociarlo al cuerpo físico
    world.createCollider(colliderDesc, rigidBody);

    console.log("Colisionador de terreno creado con la posición y escala configuradas.");
}

export function stepPhysics() {
    if (world) {
        world.step();
    }
}
