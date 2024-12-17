import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import RAPIER from '@dimforge/rapier3d-compat';

export function cargarModelo(posX = 1, posY = 20, posZ = 1, rutaModelo = './negro.glb', world) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            rutaModelo,
            (gltf) => {
                const objeto = gltf.scene;
                const escala = { x: 10, y: 10, z: 10 }; // Aumentar la escala
                objeto.scale.set(escala.x, escala.y, escala.z);
                objeto.position.set(posX, posY, posZ);

                // Calcular Bounding Box
                const boundingBox = new THREE.Box3().setFromObject(objeto);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                // Crear cuerpo físico alineado con el modelo
                const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
                    .setTranslation(posX, posY + size.y / 2, posZ);
                const body = world.createRigidBody(bodyDesc);

                // Crear colisionador con propiedades de fricción y restitución
                const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2)
                    .setFriction(0.5) // Ajustar la fricción
                    .setRestitution(0.3); // Ajustar la restitución
                const collider = world.createCollider(colliderDesc, body);

                // Sincronizar colisionador visual para depuración
                const colliderGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
                const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);
                colliderMesh.position.set(0, size.y / 2, 0);
                objeto.add(colliderMesh);

                console.log("Modelo y colisionador alineados.");
                resolve({ modelo: objeto, body, collider });
            },
            undefined,
            (error) => {
                console.error('Error al cargar el modelo:', error);
                reject(error);
            }
        );
    });
}
