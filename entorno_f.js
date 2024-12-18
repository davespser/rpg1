import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat'; 
    // Crear un cuerpo físico cubo
    const physicsWorld = scene.physicsWorld;

// Crea un nuevo cuerpo rígido (rigid body)
const body = physicsWorld.createRigidBody({
    // Tipo de cuerpo: dinámico (puede ser movido por fuerzas)
    type: 'dynamic',
    // Forma del cuerpo: caja (box)
    shape: 'box',
    // Coordenadas de posición
    position: { x: 0, y: 1, z: 0 },
    // Escala del cuerpo
    scale: { x: 1, y: 1, z: 1 },
    // Material del cuerpo (opcional, puedes ajustar la fricción, resaltamiento, etc.)
    material: {
        friction: 0.5,
        restitution: 0.3
    }
});
