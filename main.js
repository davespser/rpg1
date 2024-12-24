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
            x: 0, // Coordenada X del terreno
            z: 0, // Coordenada Z del terreno
            seed: 1234, // Semilla para la generación de ruido
            subdivisions: 10, // Número de subdivisiones
            lacunarity: 2, // Parámetro de lacunaridad
            persistence: 0.5, // Parámetro de persistencia
            iterations: 4, // Número de iteraciones para el ruido
            baseFrequency: 0.1, // Frecuencia base del ruido
            baseAmplitude: 10, // Amplitud base del ruido
            power: 1, // Potencia de la elevación
            elevationOffset: 0, // Desplazamiento de elevación
            iterationsOffsets: [[0, 0], [1, 1], [2, 2], [3, 3]] // Desplazamientos para las iteraciones
        };

        // Generar el terreno usando los datos proporcionados
        const terrain = generateTerrain(terrainData);

        // Crear y agregar el terreno a la escena
        const terrainMesh = new THREE.Mesh(
            new THREE.BufferGeometry(),
            new THREE.MeshStandardMaterial({ color: 0x888888 })
        );

        terrainMesh.geometry.setAttribute('position', new THREE.BufferAttribute(terrain.positions, 3));
        terrainMesh.geometry.setAttribute('normal', new THREE.BufferAttribute(terrain.normals, 3));
        terrainMesh.geometry.setAttribute('uv', new THREE.BufferAttribute(terrain.uv, 2));
        terrainMesh.geometry.setIndex(terrain.indices);

        scene.add(terrainMesh);

        // Crear luces
        const { luzAmbiental, luzDireccional, luzPuntual } = crearLuces(scene);

        // Crear y agregar un cubo de prueba
        const cube = createCube(
            { x: 0, y: 5, z: 0 },           // Posición
            { x: 0, y: Math.PI / 4, z: 0 }, // Rotación
            { x: 1, y: 50, z: 750 },        // Tamaño
            { x: 10, y: 50, z: 100 }        // Subdivisiones
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
