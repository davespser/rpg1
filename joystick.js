import { config } from './config.js';
import * as THREE from 'three';

let joystick = null;

export function iniciarJoystick(cubo, scene, camera, renderer) {
    // Crear el joystick en pantalla utilizando nipplejs
    joystick = nipplejs.create({
        zone: document.querySelector(config.joystick.zona), // Área del joystick
        mode: config.joystick.modo,                        // Modo del joystick
        position: config.joystick.posicion,                // Posición inicial
        color: config.joystick.color,                      // Color
        size: config.joystick.tamaño,                      // Tamaño
    });

    joystick.on('move', function (evt, data) {
        if (!data || !data.vector) {
            console.warn('Movimiento del joystick inválido: datos no definidos.');
            return;
        }

        const x = data.vector.x || 0;
        const y = data.vector.y || 0;

        cubo.position.x += x * config.joystick.sensibilidad; // Mover en X
        cubo.position.z += y * config.joystick.sensibilidad; // Mover en Z

        camera.position.lerp(
            cubo.position.clone().add(new THREE.Vector3(0, 2, 10)),
            config.camera.velocidadSeguimiento
        );
        camera.lookAt(cubo.position);
    });

    joystick.on('end', function () {
        console.log('Movimiento finalizado.');
    });
}
