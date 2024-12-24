import * as THREE from 'three';
import SimplexNoise from './modulos/SimplexNoise.js';
import { vec3 } from 'gl-matrix';

let elevationRandom = null;

// Función auxiliar para interpolación lineal
const linearStep = (edgeMin, edgeMax, value) => {
    return Math.max(0.0, Math.min(1.0, (value - edgeMin) / (edgeMax - edgeMin)));
};

// Función para calcular la elevación
const getElevation = (
    x, y, lacunarity, persistence, iterations,
    baseFrequency, baseAmplitude, power, elevationOffset, iterationsOffsets
) => {
    let elevation = 0;
    let frequency = baseFrequency;
    let amplitude = 1;
    let normalisation = 0;

    for (let i = 0; i < iterations; i++) {
        const noise = elevationRandom.noise2D(
            x * frequency + iterationsOffsets[i][0],
            y * frequency + iterationsOffsets[i][1]
        );
        elevation += noise * amplitude;
        normalisation += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    elevation /= normalisation;
    elevation = Math.pow(Math.abs(elevation), power) * Math.sign(elevation);
    elevation *= baseAmplitude;
    elevation += elevationOffset;

    return elevation;
};

// Función principal que genera el terreno
export const generateTerrain = (data) => {
    const {
        id, size, x: baseX, z: baseZ, seed, subdivisions,
        lacunarity, persistence, iterations, baseFrequency,
        baseAmplitude, power, elevationOffset, iterationsOffsets
    } = data;

    const segments = subdivisions + 1;
    elevationRandom = new SimplexNoise(seed);
    const grassRandom = new SimplexNoise(seed);

    // Elevation
    const overflowElevations = new Float32Array((segments + 1) * (segments + 1));
    const elevations = new Float32Array(segments * segments);

    for (let iX = 0; iX < segments + 1; iX++) {
        const x = baseX + (iX / subdivisions - 0.5) * size;

        for (let iZ = 0; iZ < segments + 1; iZ++) {
            const z = baseZ + (iZ / subdivisions - 0.5) * size;
            const elevation = getElevation(
                x, z, lacunarity, persistence, iterations,
                baseFrequency, baseAmplitude, power, elevationOffset, iterationsOffsets
            );

            const i = iZ * (segments + 1) + iX;
            overflowElevations[i] = elevation;

            if (iX < segments && iZ < segments) {
                const i = iZ * segments + iX;
                elevations[i] = elevation;
            }
        }
    }

    // Positions
    const skirtCount = subdivisions * 4 + 4;
    const positions = new Float32Array(segments * segments * 3 + skirtCount * 3);

    for (let iZ = 0; iZ < segments; iZ++) {
        const z = baseZ + (iZ / subdivisions - 0.5) * size;
        for (let iX = 0; iX < segments; iX++) {
            const x = baseX + (iX / subdivisions - 0.5) * size;
            const elevation = elevations[iZ * segments + iX];
            const iStride = (iZ * segments + iX) * 3;

            positions[iStride] = x;
            positions[iStride + 1] = elevation;
            positions[iStride + 2] = z;
        }
    }

    // Normals
    const normals = new Float32Array(segments * segments * 3 + skirtCount * 3);
    const interSegmentX = -size / subdivisions;
    const interSegmentZ = -size / subdivisions;

    for (let iZ = 0; iZ < segments; iZ++) {
        for (let iX = 0; iX < segments; iX++) {
            const iOverflowStride = iZ * (segments + 1) + iX;
            const currentElevation = overflowElevations[iOverflowStride];
            const neighbourXElevation = overflowElevations[iOverflowStride + 1];
            const neighbourZElevation = overflowElevations[iOverflowStride + segments + 1];

            const deltaX = vec3.fromValues(
                interSegmentX,
                currentElevation - neighbourXElevation,
                0
            );

            const deltaZ = vec3.fromValues(
                0,
                currentElevation - neighbourZElevation,
                interSegmentZ
            );

            const normal = vec3.create();
            vec3.cross(normal, deltaZ, deltaX);
            vec3.normalize(normal, normal);

            const iStride = (iZ * segments + iX) * 3;
            normals[iStride] = normal[0];
            normals[iStride + 1] = normal[1];
            normals[iStride + 2] = normal[2];
        }
    }

    // UV Mapping
    const uv = new Float32Array(segments * segments * 2 + skirtCount * 2);

    for (let iZ = 0; iZ < segments; iZ++) {
        for (let iX = 0; iX < segments; iX++) {
            const iStride = (iZ * segments + iX) * 2;
            uv[iStride] = iX / (segments - 1);
            uv[iStride + 1] = iZ / (segments - 1);
        }
    }

    // Índices y Textura
    const indicesCount = subdivisions * subdivisions;
    const indices = new (indicesCount < 65535 ? Uint16Array : Uint32Array)(indicesCount * 6);

    for (let iZ = 0; iZ < subdivisions; iZ++) {
        for (let iX = 0; iX < subdivisions; iX++) {
            const row = subdivisions + 1;
            const a = iZ * row + iX;
            const b = iZ * row + (iX + 1);
            const c = (iZ + 1) * row + iX;
            const d = (iZ + 1) * row + (iX + 1);

            const iStride = (iZ * subdivisions + iX) * 6;
            indices[iStride] = a;
            indices[iStride + 1] = d;
            indices[iStride + 2] = b;

            indices[iStride + 3] = d;
            indices[iStride + 4] = a;
            indices[iStride + 5] = c;
        }
    }

    const texture = new Float32Array(segments * segments * 4);
    for (let iZ = 0; iZ < segments; iZ++) {
        for (let iX = 0; iX < segments; iX++) {
            const iPositionStride = (iZ * segments + iX) * 3;
            const position = vec3.fromValues(
                positions[iPositionStride],
                positions[iPositionStride + 1],
                positions[iPositionStride + 2]
            );

            const iNormalStride = (iZ * segments + iX) * 3;
            const normal = vec3.fromValues(
                normals[iNormalStride],
                normals[iNormalStride + 1],
                normals[iNormalStride + 2]
            );

            const upward = Math.max(0, normal[1]);
            let grass = 0;

            if (position[1] > 0) {
                const grassFrequency = 0.05;
                let grassNoise = grassRandom.noise2D(
                    position[0] * grassFrequency + iterationsOffsets[0][0],
                    position[2] * grassFrequency + iterationsOffsets[0][0]
                );
                grassNoise = linearStep(-0.5, 0, grassNoise);
                const grassUpward = linearStep(0.9, 1, upward);
                grass = grassNoise * grassUpward;
            }

            const iTextureStride = (iZ * segments + iX) * 4;
            texture[iTextureStride] = normals[iNormalStride];
            texture[iTextureStride + 1] = normals[iNormalStride + 1];
            texture[iTextureStride + 2] = normals[iNormalStride + 2];
            texture[iTextureStride + 3] = position[1];
        }
    }

    return {
        id,
        positions,
        normals,
        indices,
        texture,
        uv,
    };
};
