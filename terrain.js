import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import { DRACOLoader } from 'DRACOLoader';

/**
 * Carga y crea un terreno a partir de un modelo GLB.
 * @param {string} path - Ruta del modelo GLB.
 * @returns {Promise<THREE.Group>} Promesa con el modelo GLB cargado.
 */
export function createTerrainFromGLB(path) {
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

                        // Aquí puedes almacenar los datos del BoundingBox o hacer alguna lógica adicional si es necesario
                        // Por ejemplo, si más adelante deseas utilizarlo para otras interacciones, 
                        // pero en este caso no se crea un colisionador de física (ya que RAPIER se ha eliminado).
                        console.log('Bounding box de la malla:', boxSize);
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
