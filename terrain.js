import * as THREE from 'three';

/**
 * Crea un terreno procedural de 512x512 con desplazamiento de vértices.
 * @returns {THREE.Mesh} El terreno procedural.
 */
export function createProceduralTerrain() {
    const width = 512;
    const height = 512;
    const segments = 128; // Segmentos para detalles del terreno

    // Crear la geometría del plano
    const geometry = new THREE.PlaneGeometry(width, height, segments, segments);

    // Desplazamiento procedural usando ruido simple
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] = Math.random() * 15 - 7.5; // Desplazamiento aleatorio entre -7.5 y 7.5
    }
    geometry.computeVertexNormals(); // Recalcular normales para iluminación correcta

    // Crear el material básico para el terreno
    const material = new THREE.MeshStandardMaterial({
        color: 0x228b22,  // Color verde similar a césped
        wireframe: false,  // Cambia a `true` para ver el wireframe
    });

    // Crear la malla con la geometría y el material
    const terrain = new THREE.Mesh(geometry, material);

    // Asegurar que el plano esté horizontal
    terrain.rotation.x = -Math.PI / 2;
    terrain.receiveShadow = true; // Permitir sombras si hay luces en la escena

    return terrain;
}
