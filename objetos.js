import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import RAPIER from '@dimforge/rapier3d-compat';

export function cargarModelo(posX = 1, posY = 1, posZ = 1, rutaModelo = './negro.glb', world) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        loader.load(
            rutaModelo,
            (gltf) => {
                const objeto = gltf.scene;

                // Escalar y posicionar el modelo
                const escala = { x: 5, y: 5, z: 5 };
                objeto.scale.set(escala.x, escala.y, escala.z);
                objeto.position.set(0, 0, 0); // Inicialmente en el origen

                // Calcular Bounding Box
                const boundingBox = new THREE.Box3().setFromObject(objeto);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                // Crear cuerpo físico alineado con la posición exacta
                const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
                    .setTranslation(posX, -35 + size.y / 2, posZ);
                const body = world.createRigidBody(bodyDesc);

                const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
                const collider = world.createCollider(colliderDesc, body);

                // Alinear visualmente el modelo a la posición del cuerpo físico
                objeto.position.set(posX, posY + size.y / 2, posZ);

                // Depurador visual
                const colliderGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
                const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);
                colliderMesh.position.set(0, 0, 0);
                objeto.add(colliderMesh);

                // Función para actualizar el colisionador visual
                const updateColliderVisual = () => {
                    const translation = body.translation();
                    objeto.position.set(translation.x, translation.y, translation.z);
                };

                // Llamar a la función de actualización en cada frame
                console.log("Posición inicial del cuerpo físico:", body.translation());
                resolve({ modelo: objeto, body, collider, updateColliderVisual });
            },
            undefined,
            (error) => {
                console.error('Error al cargar el modelo:', error);
                reject(error);
            }
        );
    });
}
