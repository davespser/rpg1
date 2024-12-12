import * as THREE from './modulos/three.module.js';
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat@0.12.0';
import { crearEscena } from './escena.js';

async function init() {
    // Inicializar Rapier
    await RAPIER.init();
    console.log('Rapier inicializado.');

    // Crear la escena
    const escena = crearEscena();

    // Validar la creación de la escena
    if (!escena.cubo || !escena.cuboFisico) {
        console.error("El objeto 'cubo' o 'cuboFisico' no está definido correctamente.");
        throw new Error("Error al inicializar el personaje.");
    }

    const { scene, camera, renderer, updatePhysics, cubo, cuboFisico } = escena;

    // Variables del joystick
    const joystick = { active: false, deltaX: 0, deltaY: 0 };
    const joystickContainer = document.getElementById('joystick-container');
    const knob = document.querySelector('#joystick .knob');
    let joystickRect;

    // Eventos del joystick
    joystickContainer.addEventListener('touchstart', (event) => {
        joystick.active = true;
        joystickRect = joystickContainer.getBoundingClientRect();
        knob.style.transform = 'translate(0, 0)';
    });

    joystickContainer.addEventListener('touchmove', (event) => {
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
    });

    joystickContainer.addEventListener('touchend', () => {
        joystick.active = false;
        joystick.deltaX = 0;
        joystick.deltaY = 0;
        knob.style.transform = 'translate(0, 0)';
    });

    // Función para mover al cubo usando el joystick
    function moverCubo(deltaTime) {
        if (joystick.active) {
            const velocidadMaxima = 5; // Velocidad máxima
            const velocidadX = (joystick.deltaX / joystickRect.width) * velocidadMaxima;
            const velocidadZ = -(joystick.deltaY / joystickRect.height) * velocidadMaxima;

            // Establecer velocidad al cuerpo físico
            cuboFisico.setLinvel({ x: velocidadX, y: 0, z: velocidadZ }, true);

            // Ajustar la rotación del cubo según el movimiento
            if (joystick.deltaX !== 0 || joystick.deltaY !== 0) {
                const angulo = Math.atan2(velocidadZ, velocidadX);
                cubo.rotation.y = -angulo;
            }
        }
    }

    let lastTime = 0;

    // Animación principal
    function animate(time) {
        requestAnimationFrame(animate);
        const deltaTime = (time - lastTime) / 1000; // Delta time en segundos
        lastTime = time;

        moverCubo(deltaTime); // Mover cubo según joystick
        updatePhysics(); // Actualizar física
        renderer.render(scene, camera); // Renderizar escena
    }

    animate();
}

// Iniciar la aplicación
init().catch((error) => {
    console.error('Error al iniciar la aplicación:', error);
});
