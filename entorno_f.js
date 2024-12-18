import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat'; 
export function crearEntornoFisico(scene, world) {
    if (!world) {
        console.error("Error: 'world' is undefined. Please provide a valid physics world.");
        return; 
    } // Crear un cuerpo físico cubo
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
       // Crear un mesh para visualizar el cubo
    const cubeGeometry = new THREE.BoxGeometry(cubeSize.x, cubeSize.y, cubeSize.z);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeMesh.position.copy(cubePosition); 

    // Asociar el mesh al cuerpo rígido
    body.setCollider(cubeMesh);

    // Agregar el mesh a la escena
    scene.add(cubeMesh);
}
