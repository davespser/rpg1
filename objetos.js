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
                objeto.scale.set(escala.x, escala.y, escala.z);
                objeto.position.set(posX, posY, posZ);

                // Calcular Bounding Box para obtener el tamaño del modelo
                const boundingBox = new THREE.Box3().setFromObject(objeto);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                // Configurar el colisionador como cápsula
                const alturaCapsula = size.y / 2; // La mitad de la altura de la cápsula
                const radioCapsula = Math.min(size.x, size.z) / 4; // Radio basado en la anchura mínima

                const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased()
                    .setTranslation(posX, posY + alturaCapsula, posZ); // Ajustar altura inicial
                const body = world.createRigidBody(bodyDesc);
                const colliderDesc = RAPIER.ColliderDesc.capsule(alturaCapsula, radioCapsula);
                const collider = world.createCollider(colliderDesc, body);

                // Alinear visualmente el modelo con el colisionador
                objeto.position.set(posX, posY + alturaCapsula, posZ);

                // Opcional: Visualizar el colisionador para depuración
                if (debug) {
                    const colliderGeometry = new THREE.CapsuleGeometry(radioCapsula, alturaCapsula * 2);
                    const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                    const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);
                    colliderMesh.position.set(0, alturaCapsula, 0);
                    objeto.add(colliderMesh);
                }

                // Añadir modelo a la escena
                scene.add(objeto);

                // Configuración del joystick
                const joystick = new Joystick({
                    container: document.body,
                    radius: 100,
                    innerRadius: 50,
                    position: { x: 20, y: 20 }
                });

                // Animación y movimiento del cuerpo físico
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
                        objeto.position.set(body.translation().x, body.translation().y - alturaCapsula, body.translation().z);
                    }
                };
                animate();

                console.log("Posición inicial del cuerpo físico:", body.translation());
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
