import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import RAPIER from '@dimforge/rapier3d-compat';
import { DRACOLoader } from 'DRACOLoader';

/**
 * Carga y crea un terreno a partir de un modelo GLB.
 * @param {string} path - Ruta del modelo GLB.
 * @param {RAPIER.World} world - Mundo de física de Rapier.
 * @returns {Promise<THREE.Group>} Promesa con el modelo GLB cargado.
 */
export function createTerrainFromGLB(path, world) {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);

    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (gltf) => {
                const terrain = gltf.scene;
                terrain.traverse((child) => {
                    if (child.isMesh) {
                        child.receiveShadow = true;
                        child.castShadow = true;

                        // Crear un colisionador de tipo caja (box) para cada malla del modelo
                        const boundingBox = new THREE.Box3().setFromObject(child); // Crear un BoundingBox
                        const boxSize = boundingBox.getSize(new THREE.Vector3()); // Obtener el tamaño de la caja

                        // Crear el colisionador box en RAPIER
                        const colliderDesc = RAPIER.ColliderDesc.box(
                            boxSize.x * 0.5, // Mitad del ancho
                            boxSize.y * 0.5, // Mitad de la altura
                            boxSize.z * 0.5  // Mitad de la profundidad
                        );

                        // Posicionar el colisionador en la misma posición que la malla
                        world.createCollider(colliderDesc, child.position);

                        // Opción para ajustar la posición del modelo si es necesario
                        // child.position.set(0, 0, 0); // Ajustar la posición si lo necesitas
                    }
                });

                // Devolver el terreno cargado para agregarlo a la escena
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
