import * as THREE from './modulos/three.module.js';
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.12.0';

export async function crearTerreno(scene, world) {
    // Inicializar RAPIER
    await RAPIER.init();

    // Crear geometría y material para el terreno en Three.js
    const terrenoGeometry = new THREE.PlaneGeometry(50, 50);
    const terrenoMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513, side: THREE.DoubleSide });
    const terrenoMesh = new THREE.Mesh(terrenoGeometry, terrenoMaterial);
    terrenoMesh.rotation.x = -Math.PI / 2; // Girar para que quede horizontal
    scene.add(terrenoMesh);

    // Crear el cuerpo físico para el terreno en RAPIER
    const terrenoColliderDesc = RAPIER.ColliderDesc.cuboid(25, 0.1, 25); // Crear un plano colisionable
    const terrenoBody = world.createCollider(terrenoColliderDesc);

    // El plano es estático, no necesita un cuerpo dinámico
    // Nota: No es necesario ajustar rotaciones porque el plano ya está orientado por defecto en Rapier

    return { terrenoMesh, terrenoBody };
}
