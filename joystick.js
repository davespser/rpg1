// joystick.js

let joystick = null;

export function iniciarJoystick(cubo, scene, camera, renderer) {
    // Crear el joystick en pantalla utilizando nipplejs (cargado desde la CDN)
    joystick = nipplejs.create({
        zone: document.body,  // Define el área en la que se puede mover el joystick
        mode: 'static',       // El joystick es estático, no se mueve
        position: { left: '50%', top: '50%' },  // Centrado en la pantalla
        color: 'blue',        // Color del joystick
        size: 150,            // Tamaño del joystick
    });

    // Escuchar el evento "move" del joystick
    joystick.on('move', function (evt, data) {
        // Validar que `data` y `data.vector` existan
        if (data && data.vector) {
            const x = data.vector.x || 0; // Verificar que `x` esté definido
            const y = data.vector.y || 0; // Verificar que `y` esté definido

            // Mover el cubo en la escena según el movimiento del joystick
            cubo.position.x += x * 0.1; // Mover en X
            cubo.position.y -= y * 0.1; // Mover en Y

            // Ajustar la posición de la cámara para seguir al cubo
            camera.position.lerp(
                cubo.position.clone().add(new THREE.Vector3(0, 2, 5)),
                0.1
            );
            camera.lookAt(cubo.position); // Hacer que la cámara mire al cubo
        } else {
            console.warn('Movimiento del joystick inválido: datos no definidos.');
        }
    });

    // Escuchar el evento "end" del joystick
    joystick.on('end', function () {
        console.log('Joystick liberado.'); // Mensaje de depuración
    });
}
