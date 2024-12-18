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
export function cargarModelo(posX = 1, posY = 1, posZ = 1, rutaModelo = './negro.glb', world, scene, debug = false) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();

        loader.load(
            rutaModelo,
            (gltf) => {
                const objeto = gltf.scene;

                // Escalar y posicionar el modelo
                const escala = { x: 5, y: 5, z: 5 };
                objeto.scale.set(escala.x, escala.y, escala.z);
                objeto.position.set(posX, posY, posZ);

                // Calcular Bounding Box
                const boundingBox = new THREE.Box3().setFromObject(objeto);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                // Crear cuerpo físico cinemático
                const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
                    .setTranslation(posX, posY + size.y / 2, posZ);
                const body = world.createRigidBody(bodyDesc);

                const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
                const collider = world.createCollider(colliderDesc, body);

                // Depurador visual
                if (debug) {
                    const colliderGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);
                    const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                    const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);
                    colliderMesh.position.set(0, 0, 0);
                    objeto.add(colliderMesh);
                }

                // Añadir el modelo a la escena
                scene.add(objeto);

                // Función para actualizar la posición del modelo según el terreno
                const raycaster = new THREE.Raycaster();
                const updateColliderVisual = () => {
                    const translation = body.translation();
                    const currentPosition = new THREE.Vector3(translation.x, translation.y, translation.z);

                    // Raycast hacia el terreno
                    raycaster.set(currentPosition, new THREE.Vector3(0, -1, 0));
                    const intersects = raycaster.intersectObjects(
                        scene.children.filter((child) => child.name === 'terrain'), // Filtrar solo el terreno
                        true
                    );

                    if (intersects.length > 0) {
                        currentPosition.y = intersects[0].point.y + size.y / 2;
                    }

                    objeto.position.copy(currentPosition);
                };

                // Configurar joystick
                const joystick = new Joystick({
                    container: document.body,
                    radius: 100,
                    innerRadius: 50,
                    position: { x: 20, y: 20 },
                });

                const animate = () => {
                    requestAnimationFrame(animate);

                    const { x, y } = joystick.getPosition();

                    if (x !== 0 || y !== 0) {
                        const translation = body.translation();
                        body.setNextKinematicTranslation({
                            x: translation.x + x * 0.1,
                            y: translation.y,
                            z: translation.z + y * 0.1,
                        });
                        updateColliderVisual();
                    }
                };
                animate();

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
