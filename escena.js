import * as THREE from './modulos/three.module.js';
import RAPIER from '@dimforge/rapier3d-compat';

// Funciones auxiliares para la escena
export function addDynamicObject(scene, world, position) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    scene.add(mesh);

    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(position.x, position.y, position.z);
    const rigidBody = world.createRigidBody(rigidBodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
    world.createCollider(colliderDesc, rigidBody);

    return { mesh, rigidBody };
}

// Añadir luces dinámicas
export function addLight(scene, position, color, intensity) {
    const light = new THREE.PointLight(color, intensity);
    light.position.set(position.x, position.y, position.z);
    scene.add(light);
    return light;
}

// Otras funciones útiles pueden ir aquí
