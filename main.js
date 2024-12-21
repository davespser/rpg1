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
        // Crear el plano que actuará como terreno
        const terrain = createTerrain(1000, 1000, 50, 50); // Ancho, Alto, Segmentos en X y Y
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
