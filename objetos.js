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
export function cargarModelo(
    posX = 0, 
    posY = 2, 
    posZ = 0, 
    rutaModelo = './negro.glb', 
    world, 
    scene, 
    debug = false
) {
    if (!scene || !world) {
        console.error("La escena o el mundo físico no están definidos.");
        return;
    }

    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();

        loader.load(
            rutaModelo,
            (gltf) => {
                const objeto = gltf.scene;

                // Escalar y posicionar el modelo con valores estándar
                const escala = 1; // Escala estándar uniforme
                objeto.scale.set(escala, escala, escala);
                objeto.position.set(posX, posY, posZ);

                // Configuración del colisionador como cápsula estándar
                const alturaCapsula = 1.5; // Altura de la cápsula
                const radioCapsula = 2.0;  // Radio de la cápsula

                // Crear cuerpo físico con Rapier
                const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
                    .setTranslation(posX, posY + alturaCapsula, posZ); // Altura inicial
                const body = world.createRigidBody(bodyDesc);
                const colliderDesc = RAPIER.ColliderDesc.capsule(alturaCapsula, radioCapsula);
                const collider = world.createCollider(colliderDesc, body);

                // Aplicar el constraint para bloquear rotaciones en los ejes X y Z
                body.lockRotations();  // Bloquea la rotación en los tres ejes (X, Y, Z)

                // Ajustar modelo para alinearlo con el colisionador
                objeto.position.set(posX, posY + alturaCapsula, posZ);

                // Visualización del colisionador para depuración
                if (debug) {
                    const colliderGeometry = new THREE.CapsuleGeometry(radioCapsula, alturaCapsula * 2);
                    const colliderMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
                    const colliderMesh = new THREE.Mesh(colliderGeometry, colliderMaterial);
                    colliderMesh.position.set(0, alturaCapsula, 0);
                    objeto.add(colliderMesh);
                }

                // Añadir modelo a la escena
                scene.add(objeto);

                // Configurar joystick
                const joystick = new Joystick({
                    container: document.body,
                    radius: 80,          // Tamaño estándar del joystick
                    innerRadius: 40,
                    position: { x: 50, y: 50 }
                });

                // Movimiento y actualización del modelo
                const velocidad = 0.05; // Velocidad estándar del movimiento

                const animate = () => {
                    requestAnimationFrame(animate);

                    const { x, y } = joystick.getPosition();
                    if (x !== 0 || y !== 0) {
                        const translation = body.translation();
                        body.setNextKinematicTranslation({
                            x: translation.x + x * velocidad,
                            y: translation.y,
                            z: translation.z + y * velocidad
                        });

                        objeto.position.set(
                            body.translation().x, 
                            body.translation().y - alturaCapsula, 
                            body.translation().z
                        );
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
