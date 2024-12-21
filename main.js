import * as THREE from 'three';
import { createTerrain } from './terrain.js';
import { initScene } from './scene.js';
import { crearMenuRadial } from './menu.js';
import { createSky } from './sky.js';

const { scene, camera, renderer, controls } = initScene();
crearMenuRadial();
createSky(scene);

/**
 * Función principal de inicialización
 */
async function init() {
    try {
        // Crear el plano que actuará como terreno con la textura de imagen
        const terrain = createTerrain(1000, 1000, 50, 50, 'https://raw.githubusercontent.com/davespser/rpg1/main/IMG_20241221_161743.png
'); // Ancho, Alto, Segmentos, Ruta de la textura
        scene.add(terrain);

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
