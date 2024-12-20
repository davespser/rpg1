import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import Joystick from './joystick.js';

/**
 * Crea un cubo con un colisionador y lo vincula a un joystick.
 * @param {number} posX - Posición X inicial.
 * @param {number} posY - Posición Y inicial.
 * @param {number} posZ - Posición Z inicial.
 * @param {RAPIER.World} world - Mundo físico de Rapier.
 * @param {THREE.Scene} scene - Escena de Three.js.
 * @param {boolean} debug - Habilitar colisionador visual para depuración.
 * @returns {Promise<object>} Promesa que resuelve con el modelo, cuerpo físico y funciones adicionales.
 */
export function cargarCubo(
    posX = 0, 
    posY = 0, 
    posZ = 0, 
    world, 
    scene, 
    debug = true
) {
    if (!scene || !world) {
        console.error("La escena o el mundo físico no están definidos.");
        return;
    }

    return new Promise((resolve, reject) => {
        // Crear el cubo en Three.js
        const geometria = new THREE.BoxGeometry(1, 1, 1); // Un cubo de tamaño 1x1x1
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Color verde
        const cubo = new THREE.Mesh(geometria, material);

        // Posicionar el cubo
        cubo.position.set(posX, posY, posZ);

        // Crear cuerpo físico para el cubo con Rapier
        const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(posX, posY + 0.5, posZ); // Ajustar para que esté en el suelo
        const body = world.createRigidBody(bodyDesc);

        // Crear el colisionador tipo cubo
        const colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5) // La mitad de las dimensiones del cubo
            .setFriction(0.8);
        const collider = world.createCollider(colliderDesc, body);

        // Aplicar el constraint para bloquear rotaciones en los ejes X y Z
        body.lockRotations();  // Bloquea la rotación en los tres ejes (X, Y, Z)

        // Visualización del colisionador para depuración
        if (debug) {
            const boxHelper = new THREE.BoxHelper(cubo, 0xffff00);
            scene.add(boxHelper); // Añadir el helper a la escena
        }

        // Añadir el cubo a la escena
        scene.add(cubo);

        // Configurar joystick
        const joystick = new Joystick({
            container: document.body,
            radius: 80,          // Tamaño estándar del joystick
            innerRadius: 40,
            position: { x: 50, y: 50 }
        });

        // Movimiento y actualización del cubo
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

                cubo.position.set(
                    body.translation().x, 
                    body.translation().y - 0.5,  // Ajuste por el tamaño del cubo
                    body.translation().z
                );
            }
        };
        animate();

        console.log("Posición inicial del cuerpo físico:", body.translation());
        resolve({ modelo: cubo, body, collider });
    });
}
