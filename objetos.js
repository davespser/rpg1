import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";
import RAPIER from '@dimforge/rapier3d-compat';

export function cargarModelo(posX = 1, posY = 3, posZ = 1, rutaModelo = './negro.glb', world) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            rutaModelo,
            (gltf) => {
                console.log("Modelo cargado:", gltf);

                // Modelo visual de Three.js
                const objeto = gltf.scene;
                const escala = { x: 5, y: 5, z: 5 }; // Escala del modelo
                objeto.scale.set(escala.x, escala.y, escala.z);
                objeto.position.set(posX, posY, posZ);
                
                objeto.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                console.log("Posición del objeto en la escena:", objeto.position);

                // Verificar si 'world' está listo
                if (world && typeof world.createRigidBody === 'function') {
                    console.log('Creando cuerpo físico...');

                    // Calcular Bounding Box para ajustar el tamaño del colisionador
                    const boundingBox = new THREE.Box3().setFromObject(objeto);
                    const size = new THREE.Vector3();
                    boundingBox.getSize(size); // Tamaño del modelo escalado
                    const center = new THREE.Vector3();
                    boundingBox.getCenter(center); // Centro del modelo

                    console.log("Tamaño del modelo:", size);
                    console.log("Centro del modelo:", center);

                    // Crear cuerpo físico dinámico en Rapier
                    const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(posX, posY, posZ);
                    const body = world.createRigidBody(bodyDesc);

                    // Crear colisionador con el tamaño del modelo
                    const colliderDesc = RAPIER.ColliderDesc.cuboid(
                        size.x / 2, size.y / 2, size.z / 2
                    ); // Dividimos entre 2 porque Rapier usa la mitad del tamaño
                    world.createCollider(colliderDesc, body);

                    console.log("Modelo y cuerpo físico listos:", { objeto, body });

                    // Visualización del colisionador (wireframe)
                    const colliderGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
                    const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                    const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);

                    // Ajustamos la posición del colisionador visual al centro calculado
                    colliderMesh.position.set(center.x, center.y, center.z);
                    colliderMesh.name = "colliderMesh";

                    // Añadir el colisionador visual y el bounding box helper
                    objeto.add(colliderMesh);
                    const helper = new THREE.Box3Helper(boundingBox, 0xffff00);
                    objeto.add(helper);

                    console.log("Colisionador visual añadido en:", colliderMesh.position);

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
