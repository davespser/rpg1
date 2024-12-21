import * as THREE from 'three';
import { createTerrain } from './terrain.js';
import { initScene } from './scene.js';
import { crearMenuRadial } from './menu.js';
import { createSky } from './sky.js';
import { createCube } from './plano_a.js';
import { createLuces } from './luces.js';
const { scene, camera, renderer, controls } = initScene();
crearMenuRadial();
createSky(scene);

/**
 * Función principal de inicialización
 */
async function init() {
    try {
        // Crear el plano que actuará como terreno con la textura de imagen
        const terrain = createTerrain(1000, 1000, 50, 50, 'https://github.com/davespser/rpg1/blob/main/IMG_20241221_161743.png'); // Ancho, Alto, Segmentos, Ruta de la textura
        scene.add(terrain);

        const cube = createCube(
  { x: 0, y: 5, z: 0 },          // Posición del cubo
  { x: 0, y: Math.PI / 4, z: 0 }, // Rotación del cubo
  { x: 10, y: 10, z: 10 },        // Tamaño del cubo
  { x: 10, y: 10, z: 10 }         // Subdivisiones
);

// Agregar el cubo a la escena
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
