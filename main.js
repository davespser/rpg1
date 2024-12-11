import * as THREE from 'three';
import * as CANNON from 'cannon-es'; // Ruta ya resuelta por el importmap

import { crearEscena } from './escena.js';

const { scene, camera, renderer, updatePhysics } = crearEscena();

function animate() {
    requestAnimationFrame(animate);

    // Actualizar físicas
    updatePhysics();

    // Renderizar la escena
    renderer.render(scene, camera);
}

animate();
