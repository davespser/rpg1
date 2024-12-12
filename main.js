
import * as THREE from 'three';  
import * as CANNON from 'cannon-es';
// Importar Three.js y otras dependencias necesarias
import { crearEscena } from './escena.js';
import { config } from './config.js';

// Crear la escena de Three.js
const escena = crearEscena();

// Verificar que los objetos requeridos estén definidos
if (!escena.cubo) {
    console.error("El objeto 'cubo' no está definido correctamente.");
    throw new Error("Error al inicializar el personaje.");
}

// Extraer los elementos de la escena
const { scene, camera, renderer, updatePhysics, cubo } = escena;

// Variables para el joystick
let joystick = {
    active: false,
    deltaX: 0,
    deltaY: 0,
};

// Elementos del DOM
const joystickContainer = document.getElementById('joystick-container');
const joystickElement = document.getElementById('joystick');
const knob = document.querySelector('#joystick .knob');
let joystickRect;

// Función para manejar el inicio del movimiento del joystick
function handleJoystickStart(event) {
    event.preventDefault();
    joystick.active = true;
    joystickRect = joystickContainer.getBoundingClientRect();

    // Inicializar posición de la perilla
    knob.style.transform = 'translate(0, 0)';
}

// Función para manejar el movimiento del joystick
function handleJoystickMove(event) {
    if (!joystick.active) return;

    // Calcular el desplazamiento relativo al centro del joystick
    const touch = event.touches[0];
    const x = touch.clientX - joystickRect.left - joystickRect.width / 2;
    const y = touch.clientY - joystickRect.top - joystickRect.height / 2;

    const maxDistance = joystickRect.width / 2;
    const distance = Math.min(Math.sqrt(x * x + y * y), maxDistance); // Limitar al radio máximo
    const angle = Math.atan2(y, x);

    // Actualizar posición del joystick
    joystick.deltaX = Math.cos(angle) * distance;
    joystick.deltaY = Math.sin(angle) * distance;

    knob.style.transform = `translate(${joystick.deltaX}px, ${joystick.deltaY}px)`;
}

// Función para manejar el fin del movimiento del joystick
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

// Función para mover al cubo como un personaje
function moverCubo() {
    if (joystick.active) {
        const velocidad = config.joystick.sensibilidad || 0.1; // Sensibilidad del movimiento
        const movimientoX = (joystick.deltaX / joystickRect.width) * velocidad;
        const movimientoZ = -(joystick.deltaY / joystickRect.height) * velocidad;

        // Actualizar posición del cubo
        cubo.position.x += movimientoX;
        cubo.position.z += movimientoZ;

        // Orientar el cubo hacia la dirección del movimiento
        if (joystick.deltaX !== 0 || joystick.deltaY !== 0) {
            const angulo = Math.atan2(movimientoZ, movimientoX);
            cubo.rotation.y = -angulo;
        }
    }
}

// Función de animación
function animate() {
    requestAnimationFrame(animate);

    // Actualizar físicas y mover el cubo
    updatePhysics();
    moverCubo();

    // Renderizar la escena
    renderer.render(scene, camera);
}

// Iniciar el bucle de animación
animate();
