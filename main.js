import { crearEscena } from './escena.js';

// Crear la escena, la cámara, el renderizador, el cubo y el mundo de físicas
const { scene, camera, renderer, cube, world, cubeBody, updatePhysics } = crearEscena();

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Actualizar físicas
    updatePhysics();

    // Renderizar la escena
    renderer.render(scene, camera);
}

animate();
