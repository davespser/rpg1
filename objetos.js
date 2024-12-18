import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import RAPIER from '@dimforge/rapier3d-compat';
import Joystick from './joystick.js'; // Asegúrate de que la ruta sea correcta

export function cargarModelo(posX = 1, posY = 1, posZ = 1, rutaModelo = './negro.glb', world) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        
        loader.load(
            rutaModelo,
            (gltf) => {
                const objeto = gltf.scene;

                // Escalar y posicionar el modelo
                const escala = { x: 5, y: 5, z: 5 };
                objeto.scale.set(escala.x*2, escala.y*2, escala.z*2);
                objeto.position.set(0, 20, 0); // Inicialmente en el origen

                // Calcular Bounding Box
                const boundingBox = new THREE.Box3().setFromObject(objeto);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                // Crear cuerpo cinemático alineado con la posición exacta
                const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
                    .setTranslation(posX, posY + size.y / 4, posZ);
                const body = world.createRigidBody(bodyDesc);

                const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 4, size.y / 6, size.z / 4);
                const collider = world.createCollider(colliderDesc, body);

                // Alinear visualmente el modelo a la posición del cuerpo cinemático
                objeto.position.set(posX, posY + size.y / 2, posZ);

                // Depurador visual
                const colliderGeometry = new THREE.BoxGeometry(size.x/6, size.y/8, size.z/6);
                const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);
                colliderMesh.position.set(0, 0, 0);
                objeto.add(colliderMesh);

                // Función para actualizar el colisionador visual
                const updateColliderVisual = () => {
                    const translation = body.translation();
                    objeto.position.set(translation.x, translation.y, translation.z);
                    objeto.scale.set(escala.x, escala.y, escala.z);
                };

                // Inicializar joystick personalizado
                const joystick = new Joystick({
                    container: document.body,
                    radius: 100,
                    innerRadius: 50,
                    position: { x: 20, y: 20 }
                });

                const animate = () => {
                    requestAnimationFrame(animate);

                    const { x, y } = joystick.getPosition();

                    if (x !== 0 || y !== 0) {
                        const translation = body.translation();
                        body.setNextKinematicTranslation({
                            x: translation.x + x * 0.1,
                            y: translation.y,
                            z: translation.z + y * 0.1
                        });
                        updateColliderVisual();
                    }
                };
                animate();

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
