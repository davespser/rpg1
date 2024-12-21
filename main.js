import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { GLTFLoader } from 'GLTFLoader';
import { initScene } from './scene.js';
import { crearMenuRadial } from './menu.js';
import { createSky } from './sky.js';
import { initPhysics, stepPhysics } from './physics.js';

let world, characterBody, characterMesh, terrain;
const { scene, camera, renderer, controls } = initScene();
crearMenuRadial();
createSky(scene);

const modelPath = 'https://raw.githubusercontent.com/davespser/rpg1/main/LAFUENTE.glb'; // Ruta del modelo GLB

/**
 * Función principal de inicialización
 */
async function init() {
    try {
        // Cargar RAPIER
        await RAPIER.init();

        // Inicializar el mundo físico
        world = await initPhysics();

        // Cargar y añadir el terreno (modelo GLB)
        await loadTerrain();

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
 * Carga y añade el terreno a la escena.
 */
async function loadTerrain() {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            modelPath,
            (gltf) => {
                terrain = gltf.scene;
                terrain.position.set(0, 0, 0); // Ajusta la posición del terreno si es necesario
                terrain.traverse((child) => {
                    if (child.isMesh) {
                        child.receiveShadow = true;
                        child.castShadow = true;
                        // Añadir colisionador para cada mesh en el GLB
                        const colliderDesc = RAPIER.ColliderDesc.trimesh(
                            child.geometry.attributes.position.array,
                            child.geometry.index.array
                        );
                        world.createCollider(colliderDesc);
                    }
                });
                scene.add(terrain);
                resolve();
            },
            undefined,
            (error) => {
                console.error(`Error al cargar el modelo GLB desde ${modelPath}:`, error);
                reject(error);
            }
        );
    });
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
        new THREE.CapsuleGeometry(5, 20), // Radio y altura total
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
