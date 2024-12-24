import * as THREE from 'three';
import { createProceduralTerrain } from './terrain.js'; // Importa el terreno procedural
import { initScene } from './scene.js';
import { crearMenuRadial } from './menu.js';
import { createSky } from './sky.js';
import { createCube } from './plano_a.js';
import { crearLuces } from './luces.js';

// Inicializar escena, cámara, renderizador y controles
const { scene, camera, renderer, controls } = initScene();
crearMenuRadial();
createSky(scene);

/**
 * Función principal de inicialización.
 */
async function init() {
    try {
        // Crear el terreno procedural y añadirlo a la escena
        const terrain = createProceduralTerrain();
        scene.add(terrain);

        // Añadir luces a la escena
        const { luzAmbiental, luzDireccional, luzPuntual } = crearLuces(scene);

        // Crear y añadir un cubo a la escena
        const cube = createCube(
            { x: 0, y: 5, z: 0 },          // Posición del cubo
            { x: 0, y: Math.PI / 4, z: 0 }, // Rotación del cubo
            { x: 1, y: 50, z: 750 },        // Tamaño del cubo
            { x: 10, y: 50, z: 100 }        // Subdivisiones
        );
        scene.add(cube);

        // Configurar la cámara
        camera.position.set(250, 100, 250);
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
