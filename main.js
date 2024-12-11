import { crearEscena } from './escena.js';
import { crearControles } from './controles.js';

const { scene, camera, renderer, updatePhysics } = crearEscena();

function animate() {
    requestAnimationFrame(animate);

    // Actualizar físicas
    updatePhysics();

    // Renderizar la escena
    renderer.render(scene, camera);
}

animate();
