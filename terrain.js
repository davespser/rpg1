import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import RAPIER from '@dimforge/rapier3d-compat';

/**
 * Carga y crea un terreno a partir de un modelo GLB.
 * @param {string} path - Ruta del modelo GLB.
 * @param {RAPIER.World} world - Mundo de física de Rapier.
 * @returns {Promise<THREE.Group>} Promesa con el modelo GLB cargado.
 */
export function createTerrainFromGLB(path, world) {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (gltf) => {
                const terrain = gltf.scene;
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
                resolve(terrain);
            },
            undefined,
            (error) => {
                console.error(`Error al cargar el modelo GLB desde ${path}:`, error);
                reject(error);
            }
        );
    });
}

// Ejemplo de uso en tu escena principal
const scene = new THREE.Scene();
const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });

createTerrainFromGLB('https://raw.githubusercontent.com/davespser/rpg1/main/LAFUENTE.glb', world)
    .then((terrain) => {
        terrain.position.set(0, 0, 0); // Ajustar la posición del terreno si es necesario
        scene.add(terrain);
    })
    .catch((error) => {
        console.error('Error al crear el terreno:', error);
    });

function animate() {
    requestAnimationFrame(animate);
    // Actualizar el mundo de física
    world.step();
    // Renderizar la escena
    renderer.render(scene, camera);
}

// Inicializar tu escena, cámara y renderizador
function init() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera.position.z = 50;

    // Luz
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
}

init();
animate();
