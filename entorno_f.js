import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat'; 
export function crearEntornoFisico(scene, world, terrainHeight) {
    // Crear un cuerpo físico cubo
    const maxTerrainHeight = terrainHeight;

    // Crear un nuevo cuerpo rígido (rigid body)
    const body = physicsWorld.createRigidBody({
        // ... (resto de las propiedades)
        position: { x: Math.random() * 10 - 5, y: maxTerrainHeight + 1, z: Math.random() * 10 - 5 },
        velocity: { x: 0, y: -5, z: 0 } // Velocidad inicial hacia abajo
    });
}
