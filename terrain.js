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
    const simplex = new SimplexNoise(seed);  // Instancia de SimplexNoise para generar el ruido
    const positions = [];  // Array para las posiciones de los vértices
    const normals = [];    // Array para las normales
    const uvs = [];        // Array para las coordenadas UV
    const indices = [];    // Array para los índices (para formar triángulos)

    // Generar la malla
    for (let iZ = 0; iZ < segments; iZ++) {
        for (let iX = 0; iX < segments; iX++) {
            // Convertir las coordenadas de la malla a valores espaciales
            const x = (iX / subdivisions) * size - size / 2;
            const z = (iZ / subdivisions) * size - size / 2;

            // Generar la elevación usando SimplexNoise
            const y = simplex.noise2D(x * 0.1, z * 0.1) * 10;  // Multiplicamos por 10 para amplificar la altura

            // Guardar las posiciones de los vértices
            positions.push(x, y, z);

            // Generar una normal básica (para este ejemplo solo hacia arriba)
            const normal = vec3.fromValues(0, 1, 0);  // Normal hacia arriba
            normals.push(...normal);

            // Coordenadas UV (normalizadas entre 0 y 1)
            uvs.push(iX / subdivisions, iZ / subdivisions);
        }
    }

    // Generar los índices para los triángulos
    for (let iZ = 0; iZ < subdivisions; iZ++) {
        for (let iX = 0; iX < subdivisions; iX++) {
            const row = segments;
            const a = iZ * row + iX;
            const b = iZ * row + (iX + 1);
            const c = (iZ + 1) * row + iX;
            const d = (iZ + 1) * row + (iX + 1);

            // Generamos dos triángulos para cada cuadrado
            indices.push(a, b, d);
            indices.push(a, d, c);
        }
    }

    // Retornar un objeto con los datos necesarios para Three.js
    return {
        positions: new Float32Array(positions),
        normals: new Float32Array(normals),
        uvs: new Float32Array(uvs),
        indices: new Uint16Array(indices)
    };
}
