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
                objeto.scale.set(1, 1, 1);  // Escala ajustada
                objeto.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                objeto.position.set(posX, posY, posZ);
                console.log("Posición del objeto en la escena:", objeto.position);  // Verificar posición del modelo

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
                    const colliderGeometry = new THREE.BoxGeometry(40, 40, 40);  // Aumentamos el tamaño para asegurar visibilidad
                    const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                    const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);
                    colliderMesh.position.set(posX, posY, posZ); // Posición del colisionador
                    colliderMesh.name = "colliderMesh";  // Nombre para poder acceder fácilmente
                    objeto.add(colliderMesh); // Añadir visualización del colisionador al objeto

                    console.log("Posición del colisionador:", colliderMesh.position);  // Verificar la posición del colisionador

                    // Visualización del Bounding Box
                    const box = new THREE.Box3().setFromObject(objeto);
                    const helper = new THREE.Box3Helper(box, 0xffff00); // Bounding Box en color amarillo
                    objeto.add(helper); // Añade el helper al objeto, o podrías añadirlo directamente a la 'scene' si prefieres

                    // Devolver el modelo y el cuerpo físico
                    resolve({ modelo: objeto, body });
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
