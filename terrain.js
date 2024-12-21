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
    const width = imageData.width;  // Ancho del mapa de altura
    const height = imageData.height;  // Alto del mapa de altura

    // Crear geometría del terreno usando las dimensiones reales
    const geometry = new THREE.PlaneGeometry(width, height, width - 1, height - 1);
    const position = geometry.attributes.position;

    // Ajustar las alturas de los vértices según el mapa de altura
    for (let i = 0; i < position.count; i++) {
        const x = i % width;  // Coordenada X en el mapa de altura
        const y = Math.floor(i / width);  // Coordenada Y en el mapa de altura
        const index = (y * width + x) * 4; // Índice en el mapa de altura (RGBA)
        const heightValue = imageData.data[index] / 10; // Escala de altura (ajustable)
        position.setZ(i, heightValue); // Modificar la posición Z del vértice
    }

    position.needsUpdate = true; // Actualizar la geometría
    geometry.computeVertexNormals(); // Recalcular normales

    // Crear material para el terreno
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const terrain = new THREE.Mesh(geometry, material);

    // Rotar el terreno para alinearlo correctamente
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true;

    // Crear colisionador de Rapier
    const vertices = geometry.attributes.position.array;
    const indices = geometry.index.array;
    const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices);
    world.createCollider(colliderDesc);

    return terrain;
}

/**
 * Carga el mapa de altura desde una imagen.
 * @param {string} path - Ruta del mapa de altura.
 * @returns {Promise<ImageData>} Promesa con los datos de la imagen.
 */
export function cargarMapaDeAltura(path) {
    return new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(
            path,
            (texture) => {
                const canvas = document.createElement('canvas');
                canvas.width = texture.image.width;
                canvas.height = texture.image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(texture.image, 0, 0);
                resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
            },
            undefined,
            (err) => {
                console.error(`Error al cargar el mapa de altura desde ${path}:`, err);
                reject(err);
            }
        );
    });
}
