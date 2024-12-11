// Importar configuraciones y Three.js
import { config } from './config.js';
import * as THREE from 'three';

let joystick = null;

export function iniciarJoystick(cubo, scene, camera, renderer) {
    // Crear el joystick en pantalla utilizando nipplejs
    joystick = nipplejs.create({
        zone: document.querySelector(config.joystick.zona), // Área donde se muestra el joystick
        mode: config.joystick.modo,                        // Modo del joystick (estático, dinámico, etc.)
        position: config.joystick.posicion,                // Posición inicial del joystick en la pantalla
        color: config.joystick.color,                      // Color del joystick
        size: config.joystick.tamaño,                      // Tamaño del joystick
    });

    joystick.on('move', function (evt, data) {
        // Verificar si los datos están definidos y contienen 'vector'
        if (!data || !data.vector || typeof data.vector.x === 'undefined' || typeof data.vector.y === 'undefined') {
            console.warn('Movimiento del joystick inválido: datos no definidos o incompletos.');
            return; // Salir si los datos no están completos
        }

        // Obtener las coordenadas del joystick
        const x = data.vector.x || 0; // Si 'x' no está definido, usar 0
        const y = data.vector.y || 0; // Si 'y' no está definido, usar 0

        // Mover el cubo en función de las coordenadas del joystick
        cubo.position.x += x * config.joystick.sensibilidad;  // Mover en X
        cubo.position.z += y * config.joystick.sensibilidad;  // Mover en Z

        // Actualizar la posición de la cámara para que siga al cubo
        camera.position.lerp(
            cubo.position.clone().add(new THREE.Vector3(0, 2, 10)),
            config.camera.velocidadSeguimiento // Velocidad de seguimiento de la cámara
        );
        camera.lookAt(cubo.position); // Hacer que la cámara mire al cubo
    });

    joystick.on('end', function () {
        console.log('Joystick detenido.');
    });
}
