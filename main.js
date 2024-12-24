import * as THREE from 'three';
import { generateTerrain } from './terrain.js';
import { initScene } from './scene.js';
import { crearMenuRadial } from './menu.js';
import { createSky } from './sky.js';
import { createCube } from './plano_a.js';
import { crearLuces } from './luces.js';

const { scene, camera, renderer, controls } = initScene();
crearMenuRadial();
createSky(scene);

/**
 * Función principal de inicialización.
 */
async function init() {
    try {
        // Crear el objeto con los datos necesarios para generar el terreno
        const terrainData = {
            id: 'terrain1',
            size: 100,
            x: 0,
            z: 0,
            seed: 1234,
            subdivisions: 10,
            lacunarity: 2,
            persistence: 0.5,
            iterations: 4,
            baseFrequency: 0.1,
            baseAmplitude: 10,
            power: 1,
            elevationOffset: 0,
            iterationsOffsets: [[0, 0], [1, 1], [2, 2], [3, 3]]
        };

        // Generar el terreno usando los datos proporcionados
        const terrain = generateTerrain(terrainData);

        // Depurar el resultado del terreno
        console.log('Terrain generado:', terrain);

        // Crear y agregar el terreno a la escena
        const terrainMesh = new THREE.Mesh(
            new THREE.BufferGeometry(),
            new THREE.MeshStandardMaterial({ color: 0x888888 })
        );

        terrainMesh.geometry.setAttribute('position', new THREE.BufferAttribute(terrain.positions, 3));
        terrainMesh.geometry.setAttribute('normal', new THREE.BufferAttribute(terrain.normals, 3));
        terrainMesh.geometry.setAttribute('uv', new THREE.BufferAttribute(terrain.uv, 2));
        terrainMesh.geometry.setIndex(terrain.indices);

        // Agregar a la escena
        scene.add(terrainMesh);

        // Crear luces
        const { luzAmbiental, luzDireccional, luzPuntual } = crearLuces(scene);

        // Crear y agregar un cubo de prueba
        const cube = createCube(
            { x: 0, y: 5, z: 0 },
            { x: 0, y: Math.PI / 4, z: 0 },
            { x: 1, y: 50, z: 750 },
            { x: 10, y: 50, z: 100 }
        );
        scene.add(cube);

        // Configurar la cámara
        camera.position.set(300, 150, 300);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();

        // Iniciar animación
        animate();

    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
}

/**
 * Función de animación principal.
 */
function animate() {
    requestAnimationFrame(animate);

    // Actualizar controles y renderizar la escena
    controls.update();
    renderer.render(scene, camera);
}

// Ejecutar la función principal
init();
