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

export function createTerrainRigidBody(terrainMesh, world, scene) {
    if (!terrainMesh.geometry || !terrainMesh.geometry.attributes.position) {
        console.error("La geometría del terreno no es válida.");
        return;
    }

    // Extraer los límites de la geometría
    const boundingBox = new THREE.Box3().setFromObject(terrainMesh);
    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    // Crear un colisionador tipo cuboid
    const colliderDesc = RAPIER.ColliderDesc.cuboid(
        size.x / 2,
        size.y / 2,
        size.z / 2
    ).setFriction(0.8)        // Fricción para el terreno
     .setRestitution(0.1);    // Restitución (rebote mínimo)

    // Configurar el cuerpo rígido fijo (estático)
    const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
        terrainMesh.position.x,
        terrainMesh.position.y,
        terrainMesh.position.z
    );

    // Crear el cuerpo físico y colisionador
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const collider = world.createCollider(colliderDesc, rigidBody);

    console.log("Colisionador del terreno creado como cuboid:", collider);

    // Visualización del colisionador con BoxHelper de THREE.js
    const boxHelper = new THREE.BoxHelper(terrainMesh, 0xffff00);
    scene.add(boxHelper);

    // Actualizar el helper en cada paso
    boxHelper.update();

    return { rigidBody, collider, boxHelper };
}

export function stepPhysics() {
    if (world) {
        world.step();
    }
}
