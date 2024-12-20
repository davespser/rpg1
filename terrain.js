import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

/**
 * Crea un terreno basado en un mapa de altura y una textura.
 * @param {ImageData} imageData - Datos del mapa de altura.
 * @param {THREE.Texture} texture - Textura para el terreno.
 * @param {RAPIER.World} world - Mundo de física de Rapier.
 * @returns {THREE.Mesh} Terreno como un objeto 3D.
 */
export function createTerrain(imageData, texture, world) {
    const width = imageData.width;
    const height = imageData.height;

    // Crear geometría del terreno
    const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
        const x = i % width;
        const y = Math.floor(i / width);
        const index = (y * width + x) * 4; // Índice en el mapa de altura
        const heightValue = imageData.data[index] / 10; // Escala de altura
        position.setZ(i, heightValue);
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({ map: texture });
    const terrain = new THREE.Mesh(geometry, material);
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;

    // Crear colisionador de Rapier
    const vertices = geometry.attributes.position.array;
    const indices = geometry.index.array;
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
    world.createCollider(colliderDesc);

    return terrain;
}
