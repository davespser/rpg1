// joystick.js

let joystick = null;

export function iniciarJoystick(cubo, scene, camera, renderer) {
    // Crear el joystick en pantalla utilizando nipplejs (que ya está cargado desde la CDN)
    joystick = nipplejs.create({
        zone: document.querySelector(config.joystick.zona), // Área del joystick (desde config)
        mode: config.joystick.modo,                        // Modo del joystick
        position: config.joystick.posicion,                // Posición inicial
        color: config.joystick.color,                      // Color
        size: config.joystick.tamaño,                      // Tamaño
    });

    joystick.on('move', function (evt, data) {
        // Validar si los datos son válidos antes de proceder
        if (!data || !data.vector) {
            console.warn('Movimiento del joystick inválido: datos no definidos.');
            return;
        }

        // Obtener las coordenadas de movimiento del joystick
        const x = data.vector.x || 0;
        const y = data.vector.y || 0;

        // Mover el cubo en la escena según el movimiento del joystick
        cubo.position.x += x * config.joystick.sensibilidad; // Mover en X
        cubo.position.z += y * config.joystick.sensibilidad; // Mover en Z (ajustado para eje Z)

        // Ajustar la posición de la cámara para seguir al cubo
        camera.position.lerp(
            cubo.position.clone().add(new THREE.Vector3(0, 2, 10)),
            config.camera.velocidadSeguimiento
        );
        camera.lookAt(cubo.position);
    });

    joystick.on('end', function () {
        // Opción: Al finalizar el movimiento, detener el cubo o realizar otra acción.
        console.log('Movimiento finalizado.');
    });
}
