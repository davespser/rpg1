import * as THREE from 'three';
import SimplexNoise from './modulos/SimplexNoise.js';  // Asumiendo que SimplexNoise está bien configurado
import * as GLMatrix from './modulos/gl-matrix.js';

const { vec3 } = GLMatrix;

let elevationRandom = null;

// Función auxiliar para interpolación lineal
const linearStep = (edgeMin, edgeMax, value) => {
    return Math.max(0.0, Math.min(1.0, (value - edgeMin) / (edgeMax - edgeMin)));
};

// Función para calcular la elevación usando SimplexNoise
const getElevation = (x, y, frequency, amplitude) => {
    const noise = elevationRandom.noise2D(x * frequency, y * frequency);
    return noise * amplitude;
};

// Función para generar un terreno procedural
export const generateTerrain = (data) => {
    const { size, subdivisions, seed } = data;
    const segments = subdivisions + 1;
    
    // Inicializar SimplexNoise con la semilla
    elevationRandom = new SimplexNoise(seed);

    // Inicializar los arrays de las posiciones y elevaciones
    const positions = new Float32Array(segments * segments * 3);
    const normals = new Float32Array(segments * segments * 3);
    const uv = new Float32Array(segments * segments * 2);
    const indices = new Uint16Array(subdivisions * subdivisions * 6);

    // Generación de las posiciones del terreno y cálculo de elevaciones
    for (let iZ = 0; iZ < segments; iZ++) {
        for (let iX = 0; iX < segments; iX++) {
            const x = (iX / subdivisions - 0.5) * size;
            const z = (iZ / subdivisions - 0.5) * size;
            
            // Obtener la elevación del terreno con SimplexNoise
            const elevation = getElevation(x, z, 0.1, 10);

            // Almacenar las posiciones (x, y, z)
            const i = (iZ * segments + iX) * 3;
            positions[i] = x;
            positions[i + 1] = elevation;
            positions[i + 2] = z;

            // Almacenar las coordenadas UV
            const uvIndex = (iZ * segments + iX) * 2;
            uv[uvIndex] = iX / (segments - 1);
            uv[uvIndex + 1] = iZ / (segments - 1);
        }
    }

    // Calcular las normales (simple cálculo basado en los vecinos)
    for (let iZ = 0; iZ < segments - 1; iZ++) {
        for (let iX = 0; iX < segments - 1; iX++) {
            const i = (iZ * segments + iX) * 3;
            const p0 = vec3.fromValues(positions[i], positions[i + 1], positions[i + 2]);
            const p1 = vec3.fromValues(positions[i + 3], positions[i + 4], positions[i + 5]);
            const p2 = vec3.fromValues(positions[i + segments * 3], positions[i + segments * 3 + 1], positions[i + segments * 3 + 2]);

            const edge1 = vec3.create();
            const edge2 = vec3.create();

            vec3.sub(edge1, p1, p0);
            vec3.sub(edge2, p2, p0);

            const normal = vec3.create();
            vec3.cross(normal, edge1, edge2);
            vec3.normalize(normal, normal);

            const normalIndex = (iZ * segments + iX) * 3;
            normals[normalIndex] = normal[0];
            normals[normalIndex + 1] = normal[1];
            normals[normalIndex + 2] = normal[2];
        }
    }

    // Generación de los índices para la malla
    let idx = 0;
    for (let iZ = 0; iZ < subdivisions; iZ++) {
        for (let iX = 0; iX < subdivisions; iX++) {
            const a = iZ * (subdivisions + 1) + iX;
            const b = iZ * (subdivisions + 1) + iX + 1;
            const c = (iZ + 1) * (subdivisions + 1) + iX;
            const d = (iZ + 1) * (subdivisions + 1) + iX + 1;

            indices[idx++] = a;
            indices[idx++] = b;
            indices[idx++] = d;
            indices[idx++] = a;
            indices[idx++] = d;
            indices[idx++] = c;
        }
    }

    return {
        positions,
        normals,
        uv,
        indices,
    };
};
