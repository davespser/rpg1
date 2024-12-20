import * as THREE from 'three';
import { initScene } from './scene.js';
import { crearMenuRadial } from './menu.js';
import { createSky } from './sky.js';
import { cargarMapaDeAltura, createTerrain } from './terrain.js';
import { initPhysics, stepPhysics } from './physics.js';

let world;
const { scene, camera, renderer, controls } = initScene();
crearMenuRadial();
createSky(scene);

const texturePath = 'path_to_texture.jpg';
const heightMapPath = 'path_to_heightmap.png';

/**
 * Función principal de inicialización
 */
async function init() {
    try {
        // Inicializar el mundo físico
        world = await initPhysics();

        // Cargar textura y mapa de altura
        const [terrainTexture, imageData] = await Promise.all([
            new THREE.TextureLoader().load(texturePath),
            cargarMapaDeAltura(heightMapPath),
        ]);

        // Crear terreno y añadirlo a la escena
        const terrain = createTerrain(imageData, terrainTexture, world);
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

    // Avanzar la simulación de física
    if (world) stepPhysics(world);

    // Renderizar la escena
    controls.update();
    renderer.render(scene, camera);
}

// Ejecutar la función principal
init();
