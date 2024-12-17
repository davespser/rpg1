import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";
import RAPIER from '@dimforge/rapier3d-compat';

export function cargarModelo(posX = 1, posY = 20, posZ = 1, rutaModelo = './negro.glb', world) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            rutaModelo,
            (gltf) => {
                console.log("Modelo cargado:", gltf);

                // Modelo visual de Three.js
                const objeto = gltf.scene;
                const escala = { x: 1, y: 1, z: 1 }; // Escala del modelo
                objeto.scale.set(escala.x, escala.y, escala.z);
                objeto.position.set(posX, posY, posZ); // Corregido: Y ahora usa posY

                // Aplicar sombras
                objeto.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                // Calcular Bounding Box después de escalar
                const boundingBox = new THREE.Box3().setFromObject(objeto);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                console.log("Tamaño del modelo escalado:", size);

                // Verificar si 'world' está listo
                if (world && typeof world.createRigidBody === 'function') {
                    console.log('Creando cuerpo físico...');

                    // Crear cuerpo rígido dinámico
                    const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(posX, posY, posZ);
                    const body = world.createRigidBody(bodyDesc);

                    // Crear colisionador basado en el tamaño
                    const colliderDesc = RAPIER.ColliderDesc.cuboid(
                        (size.x * escala.x) / 2, 
                        (size.y * escala.y) / 2, 
                        (size.z * escala.z) / 2
                    );
                    world.createCollider(colliderDesc, body);

                    console.log("Cuerpo físico creado con colisionador.");

                    // Visualización del colisionador (wireframe)
                    const colliderGeometry = new THREE.BoxGeometry(size.x * escala.x, size.y * escala.y, size.z * escala.z);
                    const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                    const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);

                    // Ajustar posición del colisionador visual al modelo
                    colliderMesh.position.set(0, size.y / 2, 0); // Alineado verticalmente
                    colliderMesh.name = "colliderMesh";

                    objeto.add(colliderMesh);

                    console.log("Colisionador visual añadido correctamente.");

                    // Devolver el modelo visual y el cuerpo físico
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
