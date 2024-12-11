// Importar Three.js, Cannon-es y otras dependencias
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Nipple from 'nipple';  // Asegúrate de que la ruta de importación sea correcta
import { crearEscena } from './escena.js';
import { iniciarJoystick } from './joystick.js';

// Crear la escena de Three.js y la física de Cannon
const { scene, camera, renderer, world, cubo } = crearEscena();

// Iniciar el joystick para mover el cubo
iniciarJoystick(cubo, scene, camera, renderer);  // Pasamos solo los parámetros necesarios

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Actualizar la física
    world.step(1 / 60);

    // Renderizar la escena
    renderer.render(scene, camera);
}

animate();  // Iniciar la animación
