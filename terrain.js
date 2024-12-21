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
