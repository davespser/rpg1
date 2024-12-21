import * as THREE from 'three';

/**
 * Crea un plano que actúa como terreno.
 * @param {number} width - Ancho del plano.
 * @param {number} height - Altura del plano.
 * @param {number} segmentsX - Número de segmentos en el eje X.
 * @param {number} segmentsY - Número de segmentos en el eje Y.
 * @returns {THREE.Mesh} El plano que representa el terreno.
 */
export function createTerrain(width, height, segmentsX, segmentsY) {
    // Crear la geometría del plano
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

    // Crear un material básico para el plano
    const material = new THREE.MeshStandardMaterial({
        color: 0x228B22,  // Color verde para simular césped
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
