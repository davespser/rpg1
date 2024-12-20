import * as THREE from 'three';
import { initScene } from './scene.js';
import { crearMenuRadial } from './menu.js';
import { createSky } from './sky.js';
import { cargarMapaDeAltura, createTerrain } from './terrain.js'; // Importamos las funciones del nuevo script de terreno

const { scene, camera, renderer, controls } = initScene();
crearMenuRadial();
createSky(scene);

// Ruta de las texturas y el mapa de altura
const texturePath = 'path_to_texture.jpg';  // Ruta de la textura
const heightMapPath = 'path_to_heightmap.png';  // Ruta del mapa de altura

/**
 * Función principal de inicialización
 */
async function init() {
    try {
        // Cargar la textura y el mapa de altura
        const [terrainTexture, imageData] = await Promise.all([
            new THREE.TextureLoader().load(texturePath),
            cargarMapaDeAltura(heightMapPath),
        ]);

        // Crear terreno y agregarlo a la escena
        const terrain = createTerrain(imageData, terrainTexture);
        scene.add(terrain);

        // Configurar la cámara
        camera.position.set(250, 100, 250);
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
