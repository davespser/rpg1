import * as THREE from 'three';

/**
 * Crea un plano que actúa como terreno con una textura de imagen.
 * @param {number} width - Ancho del plano.
 * @param {number} height - Altura del plano.
 * @param {number} segmentsX - Número de segmentos en el eje X.
 * @param {number} segmentsY - Número de segmentos en el eje Y.
 * @param {string} texturePath - Ruta de la imagen para la textura del plano.
 * @returns {THREE.Mesh} El plano que representa el terreno.
 */
export function createTerrain(width, height, segmentsX, segmentsY, texturePath) {
    // Cargar la textura de la imagen desde la URL proporcionada
    const textureLoader = new THREE.TextureLoader();
    const terrainTexture = textureLoader.load(texturePath);

    // Crear la geometría del plano
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

    // Crear el material con la textura
    const material = new THREE.MeshStandardMaterial({
        map: terrainTexture,  // Aplicar la textura al material
        side: THREE.DoubleSide,  // Asegura que el plano sea visible desde ambos lados
    });

    // Crear la malla con la geometría y el material
    const terrain = new THREE.Mesh(geometry, material);

    // Asegurarse de que el plano esté horizontal
    terrain.rotation.x = - Math.PI / 2;

    // Ajustar la posición del plano (opcional)
    terrain.position.set(0, 0, 0);

    // Habilitar sombras en el terreno
    terrain.receiveShadow = true;

    return terrain;
}
