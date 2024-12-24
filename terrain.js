import * as THREE from 'three';

/**
 * Crea un terreno procedural de 512x512 con una malla de segmentos.
 * @returns {THREE.Mesh} El terreno procedural.
 */
export function createProceduralTerrain() {
    const width = 512;
    const height = 512;
    const segmentsX = 256;
    const segmentsY = 256;

    // Crear la geometría del plano
    const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);

    // Modificar la geometría para agregar altura usando ruido
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        // Generar un valor de altura basado en la función de ruido
        const heightValue = Math.sin(x * 0.05) * Math.cos(y * 0.05) * 20;
        positions[i + 2] = heightValue; // Asignar la altura en el eje Z
    }

    // Recalcular las normales para iluminación correcta
    geometry.computeVertexNormals();

    // Crear el material simple para el terreno
    const material = new THREE.MeshStandardMaterial({
        color: 0x88cc88, // Verde claro
        wireframe: false, // Opcional: muestra el wireframe
    });

    // Crear la malla con la geometría y el material
    const terrain = new THREE.Mesh(geometry, material);

    // Asegurarse de que el plano esté horizontal
    terrain.rotation.x = -Math.PI / 2;

    // Habilitar sombras en el terreno
    terrain.receiveShadow = true;

    return terrain;
}
