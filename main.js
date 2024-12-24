import * as THREE from 'three';
import { createAdvancedTerrain } from './terrain.js'; // Asegúrate de que `terrain.js` exporte la función necesaria
import { initScene } from './scene.js';
import { crearMenuRadial } from './menu.js';
import { createSky } from './sky.js';
import { createCube } from './plano_a.js';
import { crearLuces } from './luces.js';
import { generateTerrain } from './terrainGenerator.js'; // Importar el generador de terrenos

const { scene, camera, renderer, controls } = initScene();
crearMenuRadial();
createSky(scene);

/**
 * Función principal de inicialización.
 */
async function init() {
    try {
        // Configuración de datos para el terreno procedural avanzado
        const terrainData = {
            id: 'terreno_principal',
            size: 1000,
            x: 0,
            z: 0,
            seed: '1234',
            subdivisions: 100,
            lacunarity: 2.0,
            persistence: 0.5,
            iterations: 4,
            baseFrequency: 0.01,
            baseAmplitude: 50,
            power: 2.0,
            elevationOffset: 10,
            iterationsOffsets: [
                [0.1, 0.2],
                [0.5, 0.6],
                [0.3, 0.8],
                [0.7, 0.4]
            ]
        };

        // Generar el terreno y agregarlo a la escena
        const terrainDataResult = generateTerrain(terrainData);
        const terrainGeometry = new THREE.BufferGeometry();
        terrainGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(terrainDataResult.positions, 3)
        );
        terrainGeometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(terrainDataResult.normals, 3)
        );
        terrainGeometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(terrainDataResult.uv, 2)
        );
        terrainGeometry.setIndex(new THREE.BufferAttribute(terrainDataResult.indices, 1));

        const terrainMaterial = new THREE.MeshStandardMaterial({
            color: 0x88cc88,
            wireframe: false,
        });
        const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrain.receiveShadow = true;
        scene.add(terrain);

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
