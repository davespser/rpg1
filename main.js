import * as THREE from 'three';
import { initScene } from './scene.js';
import { crearMenuRadial } from './menu.js';
import { Stats } from './stats.js';
import { cargarModelo } from './objetos.js';
import { addBuildings } from './entorno_f.js';
import { createSky } from './sky.js';

let modelo;
const { scene, camera, renderer, controls } = initScene();
const stats = new Stats();
crearMenuRadial();
createSky(scene);

const texturePath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa_t.jpg';
const heightMapPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa.png';

/**
 * Función principal de inicialización
 */
async function init() {
    try {
        // Cargar modelo
        const resultado = await cargarModelo(1, 1, 1, './negro.glb', scene, true);
        modelo = resultado.modelo;
        scene.add(modelo);

        console.log("Modelo añadido a la escena.");

        // Configuración de la cámara
        camera.position.set(250, 10, 300);
        camera.lookAt(modelo.position);
        controls.target.copy(modelo.position);
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

    // Sincronizar modelo con cuerpo físico (aquí ya no es necesario)
    if (modelo) {
        // Actualizar modelo si se necesita animar
    }

    // Renderizar la escena
    controls.update();
    renderer.render(scene, camera);

    stats.update();
}

// Ejecutar la función principal
init();
