import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import RAPIER from '@dimforge/rapier3d-compat';
import { initScene } from './scene.js';
import { crearMenuEstadisticas } from './menu.js';
import { Stats } from './stats.js';
import { initPhysics, createTerrainRigidBody, stepPhysics } from './physics.js';
import { loadTexture, createTerrain } from './createTerrain.js';
import { createSky } from './sky.js';
import { cargarModelo } from './objetos.js'; 
import { handleMovement } from './movement';
import { setupAnimation } from './animation';

const { scene, camera, renderer, controls } = initScene();
const stats = new Stats();
crearMenuEstadisticas();
createSky(scene);

const texturePath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa_t.jpg';
const heightMapPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa.png';

// Inicializar física
const world = initPhysics();  // Asegúrate de que esto devuelva el objeto world

// Cargar el modelo
const modeloNegro = cargarModelo(250, 24, 250, './robotauro_walk.glb');
scene.add(modeloNegro);

// Crear el personaje con las físicas
const character = createCharacter(world, modeloNegro);

// Configurar animaciones (si las tiene)
const mixer = new THREE.AnimationMixer(modeloNegro);
setupAnimation(modeloNegro, mixer);

// Entrada del jugador
const input = { forward: false, backward: false, left: false, right: false, attack: false };
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

// Cargar terreno y texturas
Promise.all([
    loadTexture(texturePath),
    new Promise((resolve, reject) => {
        new THREE.TextureLoader().load(
            heightMapPath,
            (texture) => {
                const canvas = document.createElement('canvas');
                canvas.width = texture.image.width;
                canvas.height = texture.image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(texture.image, 0, 0);
                resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
            },
            undefined,
            (err) => reject(err)
        );
    }),
]).then(([terrainTexture, imageData]) => {
    const terrainMesh = createTerrain(imageData, terrainTexture);
    scene.add(terrainMesh);
    createTerrainRigidBody(terrainMesh);
}).catch((error) => console.error('Error al cargar recursos:', error));

// Bucle de animación principal
const clock = new THREE.Clock();
function animate() {
    const deltaTime = clock.getDelta();

    // Manejar el movimiento del personaje
    handleMovement(character, deltaTime, input);

    // Actualizar las animaciones
    mixer.update(deltaTime);

    // Actualizar físicas y renderizar
    stepPhysics();
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(animate);
}

animate();
