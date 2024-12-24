import * as THREE from 'three';
    import SimplexNoise from './modulos/SimplexNoise.js';
import * as GLMatrix from './modulos/gl-matrix.js';

const { vec3 } = GLMatrix;
/**
 * Genera un terreno sencillo utilizando SimplexNoise para las elevaciones.
 * @param {number} size Tamaño del terreno (tamaño total de la cuadrícula).
 * @param {number} subdivisions Número de subdivisiones del terreno (cuadrícula).
 * @param {number} seed Semilla para la generación del ruido.
 * @returns {Object} Objeto con los datos del terreno (posiciones, normales, índices, UV).
 */
export function generateTerrain(size, subdivisions, seed) {
    const segments = subdivisions + 1;  // Número de puntos en la malla
    const simplex = new SimplexNoise(seed);
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    // Generar la malla
    for (let iZ = 0; iZ < segments; iZ++) {
        for (let iX = 0; iX < segments; iX++) {
            const x = (iX / subdivisions) * size - size / 2;
            const z = (iZ / subdivisions) * size - size / 2;
            const y = simplex.noise2D(x * 0.1, z * 0.1) * 10;  // Elevación con SimplexNoise

            // Guardar las posiciones de los vértices
            positions.push(x, y, z);

            // Calculamos una normal simple (solo hacia arriba)
            const normal = vec3.fromValues(0, 1, 0);
            normals.push(...normal);

            // Coordenadas UV
            uvs.push(iX / subdivisions, iZ / subdivisions);
        }
    }

    // Generar los índices para los triángulos (cuadrícula de triángulos)
    for (let iZ = 0; iZ < subdivisions; iZ++) {
        for (let iX = 0; iX < subdivisions; iX++) {
            const row = segments;
            const a = iZ * row + iX;
            const b = iZ * row + (iX + 1);
            const c = (iZ + 1) * row + iX;
            const d = (iZ + 1) * row + (iX + 1);

            indices.push(a, b, d);
            indices.push(a, d, c);
        }
    }

    return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        uvs: new Float32Array(uvs),
        indices: new Uint16Array(indices)
    };
}
