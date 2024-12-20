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
    // Esta función ahora solo devuelve un mensaje informativo
    console.log("La función 'createTerrainRigidBody' fue llamada, pero no se creó ningún colisionador.");
    return null;
}

export function stepPhysics() {
    if (world) {
        world.step();
    }
}
