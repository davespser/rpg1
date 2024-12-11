// main.js

// Importar Three.js y Cannon-es
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// Importar las funciones de creación de la escena y de joystick
import { crearEscena } from './escena.js';
import { iniciarJoystick } from './joystick.js';

// Crear la escena de Three.js y la física de Cannon
const { scene, camera, renderer, world, cubo } = crearEscena();

// Iniciar el joystick para mover el cubo
iniciarJoystick(cubo, scene, camera, renderer, world);

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Actualizar la física
    world.step(1 / 60);

    // Renderizar la escena
    renderer.render(scene, camera);
}

animate();  // Iniciar la animación
