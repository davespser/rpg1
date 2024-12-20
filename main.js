import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { initScene } from './scene.js';
import { crearMenuRadial } from './menu.js';
import { createSky } from './sky.js';
import { cargarMapaDeAltura, createTerrain } from './terrain.js';
import { initPhysics, stepPhysics } from './physics.js';

let world, characterBody, characterMesh;
const { scene, camera, renderer, controls } = initScene();
crearMenuRadial();
createSky(scene);

const texturePath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa_t.jpg';
const heightMapPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/casa.png'; // Ruta del mapa de altura
/**
 * Función principal de inicialización
 */
async function init() {
    try {
        // Cargar RAPIER
        await RAPIER.init();

        // Inicializar el mundo físico
        world = await initPhysics();

        // Cargar textura y mapa de altura
        const [terrainTexture, imageData] = await Promise.all([
            new THREE.TextureLoader().load(texturePath),
            cargarMapaDeAltura(heightMapPath),
        ]);

        // Crear terreno y añadirlo a la escena
        const terrain = createTerrain(imageData, terrainTexture, world);
        scene.add(terrain);

        // Crear personaje dinámico
        createCharacter();

        // Configurar la cámara
        camera.position.set(250, 100, 250);
        camera.lookAt(0, 0, 0);
        controls.target.set(0, 0, 0);
        controls.update();

        // Iniciar animación
        animate();

    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
}
/**
 * Crea el personaje con un cuerpo físico dinámico.
 */
function createCharacter() {
    // Crear cuerpo físico dinámico
    const characterDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 10, 0); // Posición inicial
    characterBody = world.createRigidBody(characterDesc);

    // Crear colisionador de cápsula
    const colliderDesc = RAPIER.ColliderDesc.capsule(5, 10); // Radio y mitad de altura
    world.createCollider(colliderDesc, characterBody);

    // Crear representación visual del personaje
    characterMesh = new THREE.Mesh(
        new THREE.CapsuleGeometry(50, 200), // Radio y altura total
        new THREE.MeshStandardMaterial({ color: 0xff0000 })
    );
    scene.add(characterMesh);
}

/**
 * Sincroniza la posición del personaje visual con la física.
 */
function syncCharacter() {
    if (characterBody && characterMesh) {
        const translation = characterBody.translation();
        characterMesh.position.set(translation.x, translation.y, translation.z);
    }
}

/**
 * Función de animación principal.
 */
function animate() {
    requestAnimationFrame(animate);

    // Avanzar la simulación de física
    if (world) stepPhysics(world);

    // Sincronizar personaje
    syncCharacter();

    // Renderizar la escena
    controls.update();
    renderer.render(scene, camera);
}

// Ejecutar la función principal
init();
