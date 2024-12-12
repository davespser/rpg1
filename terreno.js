import * as THREE from './modulos/three.module.js';
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.12.0';
import { config } from './config.js';

export function crearTerreno(scene, world) {
    // Crear el mesh del terreno
    const terrenoGeometry = new THREE.PlaneGeometry(100, 100);
    const terrenoMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const terrenoMesh = new THREE.Mesh(terrenoGeometry, terrenoMaterial);
    terrenoMesh.rotation.x = - Math.PI / 2; // Colocar el terreno en la orientación correcta
    scene.add(terrenoMesh);

    // Crear el cuerpo rígido para el terreno (fijo)
    const terrenoRigidBodyDesc = RAPIER.RigidBodyDesc.fixed()
        .setTranslation(0, -0.5, 0);  // Establecer la posición inicial
    const terrenoRigidBody = world.createRigidBody(terrenoRigidBodyDesc);

    // Crear el colisionador para el terreno
    const colliderDesc = RAPIER.ColliderDesc.trimesh(
        terrenoGeometry.attributes.position.array, // Vértices del terreno
        terrenoGeometry.index.array // Índices para formar las caras
    );
    
    // Asociar el colisionador al cuerpo rígido
    world.createCollider(colliderDesc, terrenoRigidBody);

    return { terrenoMesh };
}
