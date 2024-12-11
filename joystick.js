
// Importar configuraciones y Three.js
import { config } from './config.js';
import * as THREE from 'three';

// joystick.js

import { Joystick } from 'virtual-joystick.js';

let joystick = null;

export function iniciarJoystick(cubo, scene, camera, renderer) {
    // Crear el joystick en pantalla utilizando virtual-joystick.js
    joystick = new Joystick({
        container: document.body,  // El área donde aparece el joystick
        size: 150,                 // Tamaño del joystick
        mouseSupport: true,        // Soporte para usar el mouse (opcional)
    });

    joystick.onMove((x, y) => {
        // Mover el cubo en función de las coordenadas del joystick
        cubo.position.x += x * 0.1; // Mover en X
        cubo.position.z += y * 0.1; // Mover en Z

        // Actualizar la posición de la cámara para que siga al cubo
        camera.position.lerp(
            cubo.position.clone().add(new THREE.Vector3(0, 2, 10)),
            0.1 // Velocidad de seguimiento
        );
        camera.lookAt(cubo.position); // Hacer que la cámara mire al cubo
    });

    joystick.onEnd(() => {
        console.log('Joystick detenido.');
    });
}
