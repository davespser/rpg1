import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat'; 
export function crearEntornoFisico(scene, world, terrainHeight) {
    // Crear un cuerpo físico cubo
    const physicsWorld = scene.physicsWorld;

    // Definir las dimensiones del cubo
    const cubeSize = { x: 1, y: 1, z: 1 }; 

    // Calcular la posición inicial del cubo sobre el terreno
    const cubePosition = {
        x: Math.random() * 10 - 5, 
        y: terrainHeight + cubeSize.y / 2, 
        z: Math.random() * 10 - 5 
    };

    // Crear un nuevo cuerpo rígido (rigid body)
    const body = physicsWorld.createRigidBody({
        // Tipo de cuerpo: dinámico (puede ser movido por fuerzas)
        type: 'dynamic',
        // Forma del cuerpo: caja (box)
        shape: 'box',
        // Coordenadas de posición
        position: cubePosition,
        // Escala del cuerpo
        scale: cubeSize,
        // Material del cuerpo (opcional, puedes ajustar la fricción, resaltamiento, etc.)
        material: {
            friction: 0.5,
            restitution: 0.3
        }
    });
