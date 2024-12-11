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
        // Verificar si los datos son válidos antes de utilizarlos
        if (!data || !data.vector) {
            console.warn('Movimiento del joystick inválido: datos no definidos.');
            return;
        }

        const x = data.vector.x || 0; // Si `x` es indefinido, asignar 0
        const y = data.vector.y || 0; // Si `y` es indefinido, asignar 0

        // Actualizar posición del cubo
        cubo.position.x += x * config.joystick.sensibilidad;
        cubo.position.z += y * config.joystick.sensibilidad;

        // Actualizar posición de la cámara
        camera.position.lerp(
            cubo.position.clone().add(new THREE.Vector3(0, 2, 10)),
            config.camera.velocidadSeguimiento
        );
        camera.lookAt(cubo.position);
    });

    joystick.on('end', function () {
        console.log('Joystick detenido.');
    });
}
