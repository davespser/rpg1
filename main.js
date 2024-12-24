import * as THREE from 'three';
import { createAdvancedTerrain } from './terrain.js';
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
        // Crear el terreno procedural avanzado
        const terrain = createAdvancedTerrain();
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
