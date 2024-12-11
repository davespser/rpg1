import { crearEscena } from './escena.js';

// Crear la escena y la cámara
const { scene, camera, renderer, cube } = crearEscena();

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Rotar el cubo
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Renderizar la escena
    renderer.render(scene, camera);
}

animate();
