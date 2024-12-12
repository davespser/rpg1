import THREE from './modulos/three.modules.js
import * as RAPIER from '@dimforge/rapier3d-compat';
import { config } from './config.js';

export function crearTerreno(scene, world) {
    // Crear el mesh del terreno (puedes ajustarlo a tus necesidades)
    const terrenoGeometry = new THREE.PlaneGeometry(100, 100);
    const terrenoMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const terrenoMesh = new THREE.Mesh(terrenoGeometry, terrenoMaterial);
    terrenoMesh.rotation.x = - Math.PI / 2; // Colocar el terreno en la orientación correcta
    scene.add(terrenoMesh);

    // Crear el cuerpo físico del terreno (usando RAPIER)
    const terrenoRigidBody = world.createRigidBody(
        RAPIER.RigidBodyDesc.fixed() // Terreno fijo, no se moverá
            .setTranslation(0, -0.5, 0) // Posición
    );

    // Crear el colisionador para el terreno
    const collider = RAPIER.ColliderDesc.trimesh(
        terrenoGeometry.attributes.position.array, // Los vértices del terreno
        terrenoGeometry.index.array // Los índices para formar las caras
    );
    
    // Asociar el colisionador con el cuerpo físico
    world.createCollider(collider, terrenoRigidBody);

    return { terrenoMesh };
}
