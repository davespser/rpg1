import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";
import RAPIER from '@dimforge/rapier3d-compat';

export function cargarModelo(posX = 250, posY = 8, posZ = 250, rutaModelo = './negro.glb', world) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            rutaModelo,
            (gltf) => {
                console.log("Modelo cargado:", gltf);
                
                // Modelo visual de Three.js
                const objeto = gltf.scene;
                objeto.scale.set(10, 10, 10);  // Escala ajustada
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
                    const colliderDesc = RAPIER.ColliderDesc.cuboid(22, 22, 22); 
                    world.createCollider(colliderDesc, body);

                    console.log("Modelo y cuerpo físico listos:", { objeto, body });

                    // Visualización del colisionador (cuboide verde)
                    const colliderGeometry = new THREE.BoxGeometry(22, 22, 22);  // Usando dimensiones coherentes
                    const colliderMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: true });
                    const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);
                    colliderMesh.position.set(posX, posY, posZ); // Posición del colisionador
                    objeto.add(colliderMesh); // Añadir visualización del colisionador al objeto

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
    
