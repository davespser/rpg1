import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import RAPIER from '@dimforge/rapier3d-compat';
import { initScene } from './scene.js';
import { initPhysics, stepPhysics } from './physics.js';
import { cargarModelo } from './objetos.js';
import { manejarMovimiento } from './movements.js';

// Inicializar la escena, físicas y otros elementos
const { scene, camera, renderer, controls } = initScene();
let world, character; // Variables globales para el mundo físico y el personaje
const clock = new THREE.Clock();
const input = { forward: false, backward: false, left: false, right: false };

// Configurar entrada de usuario
window.addEventListener('keydown', (event) => {
    if (event.key === 'w') input.forward = true;
    if (event.key === 's') input.backward = true;
    if (event.key === 'a') input.left = true;
    if (event.key === 'd') input.right = true;
});
window.addEventListener('keyup', (event) => {
    if (event.key === 'w') input.forward = false;
    if (event.key === 's') input.backward = false;
    if (event.key === 'a') input.left = false;
    if (event.key === 'd') input.right = false;
});

// Inicializar físicas y cargar el modelo
(async function main() {
    // Inicializar RAPIER y el mundo físico
    await initPhysics();
    world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });

    // Cargar el modelo y agregarlo a la escena
    cargarModelo(world, 250, 5, 250, './robotauro_walk.glb', (modelo) => {
        character = modelo; // Asignar el modelo cargado a la variable global
        scene.add(character); // Agregar el modelo a la escena
    });

    animate();
})();

// Bucle principal de animación
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    // Manejar el movimiento solo si el modelo está listo
    if (character) {
        manejarMovimiento(character, deltaTime, input);
    }

    // Actualizar físicas y renderizar
    stepPhysics();
    controls.update();
    renderer.render(scene, camera);
}
