// Importar Three.js, Cannon-es y otras dependencias
import { crearEscena } from './escena.js';
import { iniciarJoystick } from './joystick.js';

// Crear la escena de Three.js y la física de Cannon
const { scene, camera, renderer, world, updatePhysics } = crearEscena();

// Asegurar que 'world' y las demás dependencias existan
if (!world || !updatePhysics) {
    console.error("El objeto 'world' o la función 'updatePhysics' no están definidos correctamente.");
    throw new Error("No se pudo iniciar la aplicación debido a un problema con la escena o el mundo físico.");
}

// Iniciar el joystick para interactuar con la escena
iniciarJoystick(scene, camera, renderer, world);

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Actualizar físicas y renderizar la escena
    updatePhysics();
    renderer.render(scene, camera);
}

// Iniciar el bucle de animación
animate();
