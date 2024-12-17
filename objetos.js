import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";
import RAPIER from '@dimforge/rapier3d-compat';

export function cargarModelo(posX = 250, posY = 5, posZ = 250, rutaModelo = './negro.glb', world) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            rutaModelo,
            (gltf) => {
                console.log("Modelo cargado:", gltf);
                
                // Modelo visual de Three.js
                const objeto = gltf.scene;
                objeto.scale.set(3, 3, 3);
                objeto.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                objeto.position.set(posX, posY, posZ);

                // Verificar si 'world' está listo
                if (world && typeof world.createRigidBody === 'function') {
                    console.log('Creando cuerpo físico...');
                    
                    // Crear cuerpo físico dinámico
                    const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(posX, posY, posZ);
                    const body = world.createRigidBody(bodyDesc);

                    // Colisionador (caja simple como ejemplo)
                    const colliderDesc = RAPIER.ColliderDesc.cuboid(1.5, 1.5, 1.5); 
                    world.createCollider(colliderDesc, body);

                    console.log("Modelo y cuerpo físico listos:", { objeto, body });
                    resolve({ modelo: objeto, body }); // Devolver modelo y cuerpo físico
                } else {
                    console.error('Error: el mundo físico no está inicializado.');
                    reject('El mundo físico no está inicializado.');
                }
            },
            undefined,
            (error) => {
                console.error('Error al cargar el modelo:', error);
                reject(error);
            }
        );
    });
}
