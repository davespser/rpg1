import * as THREE from 'three';
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
        // Configurar la cámara
        camera.position.set(250, 10, 300);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();

        // Iniciar animación
        animate();  // Llamamos a la animación directamente

    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
}

/**
 * Función de animación principal.
 */
function animate() {
    requestAnimationFrame(animate);

    // Renderizar la escena
    controls.update();
    renderer.render(scene, camera);
}

// Ejecutar la función principal
init();
