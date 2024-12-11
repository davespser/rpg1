// Importamos nipple.js
import nipplejs from './modulos/nipple.js';  // Asegúrate de que la ruta sea correcta

let joystick = null;

export function iniciarJoystick(cubo, scene, camera, renderer) {
    // Crear el joystick en pantalla utilizando nipplejs
    joystick = nipplejs.create({
        zone: document.body,  // Define el área en la que se puede mover el joystick
        mode: 'static',        // El joystick es estático, no se mueve
        position: { left: '50%', top: '50%' },  // Centrado en la pantalla
        color: 'blue',         // Color del joystick
        size: 150,             // Tamaño del joystick
    });

    joystick.on('move', function(evt, data) {
        // Obtener las coordenadas de movimiento del joystick
        const x = data.vector.x;
        const y = data.vector.y;

        // Mover el cubo en la escena según el movimiento del joystick
        cubo.position.x += x * 0.1;  // Mover en X
        cubo.position.y -= y * 0.1;  // Mover en Y

        // Ajustar la posición de la cámara para seguir al cubo
        camera.position.x = cubo.position.x;
        camera.position.y = cubo.position.y + 2;  // Para que la cámara esté un poco más arriba
        camera.position.z = cubo.position.z + 5;  // Y un poco más lejos
        camera.lookAt(cubo.position);  // Hacer que la cámara mire al cubo
    });

    joystick.on('end', function(evt, data) {
        // Cuando se deja de mover el joystick, restablecer el cubo a su posición inicial
        cubo.position.x = 0;
        cubo.position.y = 5;
    });
}
