// Importar Three.js, Cannon-es y otras dependencias
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Nipple from 'nipplejs';  // Ya lo has importado desde el CDN
import { crearEscena } from './escena.js';
import { iniciarJoystick } from './joystick.js';

// Crear la escena de Three.js y la física de Cannon
const { scene, camera, renderer, world, cubo } = crearEscena();

// Verificar si world está correctamente definido
if (!world) {
    console.error("El objeto 'world' no está definido correctamente.");
}

// Iniciar el joystick para mover el cubo
iniciarJoystick(cubo, scene, camera, renderer, world);

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Asegurarse de que world esté definido antes de llamar a 'step'
    if (world) {
        // Actualizar la física
        world.step(1 / 60);
    } else {
        console.error("world no está definido en la función animate.");
    }

    // Renderizar la escena
    renderer.render(scene, camera);
}

animate();  // Iniciar la animación
