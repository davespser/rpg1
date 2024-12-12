import * as THREE from 'three';
import * as RAPIER from './modulos/rapier_wasm3d.js'; // Asegúrate de que la ruta es correcta
import { crearEscena } from './escena.js';
import { config } from './config.js';
    // Inicializar Rapier
    await RAPIER.init();

    // Crear la escena de Three.js
    const escena = crearEscena();

    if (!escena.cubo || !escena.cuboFisico) {
        console.error("El objeto 'cubo' o 'cuboFisico' no está definido correctamente.");
        throw new Error("Error al inicializar el personaje.");
    }

    const { scene, camera, renderer, updatePhysics, cubo, cuboFisico } = escena;

    // Crear el mundo físico de Rapier
    const world = new RAPIER.World({ gravity: { x: 0, y: -9.81, z: 0 } });

    // Variables del joystick
    let joystick = { active: false, deltaX: 0, deltaY: 0 };

    // Elementos del DOM para el joystick
    const joystickContainer = document.getElementById('joystick-container');
    const joystickElement = document.getElementById('joystick');
    const knob = document.querySelector('#joystick .knob');
    let joystickRect;

    // Eventos del joystick
    function handleJoystickStart(event) {
        joystick.active = true;
        joystickRect = joystickContainer.getBoundingClientRect();
        knob.style.transform = 'translate(0, 0)';
    }

    function handleJoystickMove(event) {
        if (!joystick.active) return;

        const touch = event.touches[0];
        const x = touch.clientX - joystickRect.left - joystickRect.width / 2;
        const y = touch.clientY - joystickRect.top - joystickRect.height / 2;

        const maxDistance = joystickRect.width / 2;
        const distance = Math.min(Math.sqrt(x * x + y * y), maxDistance);
        const angle = Math.atan2(y, x);

        joystick.deltaX = Math.cos(angle) * distance;
        joystick.deltaY = Math.sin(angle) * distance;

        knob.style.transform = `translate(${joystick.deltaX}px, ${joystick.deltaY}px)`;
    }

    function handleJoystickEnd() {
        joystick.active = false;
        joystick.deltaX = 0;
        joystick.deltaY = 0;
        knob.style.transform = 'translate(0, 0)';
    }

    // Agregar eventos al joystick
    joystickContainer.addEventListener('touchstart', handleJoystickStart);
    joystickContainer.addEventListener('touchmove', handleJoystickMove);
    joystickContainer.addEventListener('touchend', handleJoystickEnd);

    // Función para mover al cubo usando velocidad
    function moverCubo() {
        if (joystick.active) {
            const velocidadMaxima = 5;
            const velocidadX = (joystick.deltaX / joystickRect.width) * velocidadMaxima;
            const velocidadZ = -(joystick.deltaY / joystickRect.height) * velocidadMaxima;

            // Ajustar la velocidad de acuerdo al joystick
            cuboFisico.setLinvel({ x: velocidadX, y: 0, z: velocidadZ }, true);

            // Mantener la rotación del cubo de acuerdo al movimiento
            if (joystick.deltaX !== 0 || joystick.deltaY !== 0) {
                const angulo = Math.atan2(velocidadZ, velocidadX);
                cubo.rotation.y = -angulo;
            }
        }
    }

    let lastTime = 0;

    function animate(time) {
        requestAnimationFrame(animate);

        const deltaTime = (time - lastTime) / 1000;  // Tiempo en segundos
        lastTime = time;

        moverCubo(deltaTime);  // Pasa deltaTime para que el movimiento sea independiente de la tasa de FPS
        
        // Actualizar la simulación física
        world.step();  // Actualiza la simulación física de Rapier

        // Sincronizar la posición y rotación del cubo con el cuerpo físico
        cubo.position.set(cuboFisico.translation().x, cuboFisico.translation().y, cuboFisico.translation().z);
        cubo.rotation.set(cuboFisico.rotation().x, cuboFisico.rotation().y, cuboFisico.rotation().z);

        renderer.render(scene, camera);
    }

    animate();
}

// Iniciar la aplicación
init();
