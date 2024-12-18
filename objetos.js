import * as THREE from 'three';
import { GLTFLoader } from 'GLTFLoader';
import RAPIER from '@dimforge/rapier3d-compat';
import Joystick from './joystick.js';

/**
 * Carga un modelo GLTF, lo configura con físicas y lo vincula a un joystick.
 * @param {number} posX - Posición X inicial.
 * @param {number} posY - Posición Y inicial.
 * @param {number} posZ - Posición Z inicial.
 * @param {string} rutaModelo - Ruta al archivo GLTF.
 * @param {RAPIER.World} world - Mundo físico de Rapier.
 * @param {THREE.Scene} scene - Escena de Three.js.
 * @param {boolean} debug - Habilitar colisionador visual para depuración.
 * @returns {Promise<object>} Promesa que resuelve con el modelo, cuerpo físico y funciones adicionales.
 */
export function cargarModelo(posX = 1, posY = 1, posZ = 1, rutaModelo = './negro.glb', world, scene) {
    if (!scene) {
        console.error("La escena no está definida. Asegúrate de pasar 'scene' como parámetro.");
        return;
    }

    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();

        loader.load(
            rutaModelo,
            (gltf) => {
                const objeto = gltf.scene;

                // Escalar y posicionar el modelo
                const escala = { x: 5, y: 5, z: 5 };
                objeto.scale.set(escala.x * 2, escala.y * 2, escala.z * 2);
                objeto.position.set(0, 20, 0);

                // Calcular Bounding Box
                const boundingBox = new THREE.Box3().setFromObject(objeto);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                // Crear cuerpo cinemático
                const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
                    .setTranslation(posX, posY + size.y / 4, posZ);
                const body = world.createRigidBody(bodyDesc);

                const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
                const collider = world.createCollider(colliderDesc, body);

                // Alinear visualmente el modelo
                objeto.position.set(posX, posY + size.y / 2, posZ);

                // Depurador visual (opcional)
                const colliderGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
                const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);
                colliderMesh.position.set(0, 0, 0);
                objeto.add(colliderMesh);

                // Añadir a la escena
                scene.add(objeto); // Asegúrate de pasar 'scene' desde main.js

                // Actualización de posición según el terreno (opcional)
                const raycaster = new THREE.Raycaster();
                const updateColliderVisual = () => {
                    const translation = body.translation();
                    const currentPosition = new THREE.Vector3(translation.x, translation.y, translation.z);

                    // Ajustar la posición según el terreno
                    raycaster.set(currentPosition, new THREE.Vector3(0, -1, 0));
                    const intersects = raycaster.intersectObjects(scene.children, true);
                    if (intersects.length > 0) {
                        currentPosition.y = intersects[0].point.y + size.y / 2;
                    }

                    objeto.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
                    objeto.scale.set(escala.x, escala.y, escala.z);
                };

                // Configurar animación y joystick
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
