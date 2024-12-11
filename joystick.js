// Importar configuraciones y Three.js
import { config } from './config.js';
import * as THREE from 'three';

export function iniciarJoystick(cubo, world) {
    const joystickArea = document.querySelector('#joystick'); // Contenedor del joystick
    const joystickKnob = document.querySelector('#joystick .knob'); // Botón del joystick
    let isDragging = false;
    let startX = 0, startY = 0;

    // Event listeners para el joystick
    joystickKnob.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        // Calcular desplazamientos
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Aplicar movimientos al cubo y ajustar el cuerpo físico
        const movimientoX = deltaX * config.joystick.sensibilidad;
        const movimientoZ = deltaY * config.joystick.sensibilidad;

        cubo.position.x += movimientoX;
        cubo.position.z += movimientoZ;

        // Si estás usando Cannon-es, actualiza la posición del cuerpo físico
        const cuboBody = world.bodies.find((body) => body.userData === 'cubo');
        if (cuboBody) {
            cuboBody.position.x = cubo.position.x;
            cuboBody.position.z = cubo.position.z;
        }

        startX = e.clientX;
        startY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });
}
